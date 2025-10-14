<template>
  <div class="dashboard-container">

    <!-- Sidebar -->
    <div class="sidebar">
  <div class="user-info">
        <img src="/profile.png" alt="User Photo" class="user-photo" />
        <div class="user-name">{{ user.name || "Guest" }}</div>
      </div>

      <div class="sidebar-heading">Masters & Reports</div>
      <div
        v-for="module in filteredModules"
        :key="module.name"
        class="sidebar-item"
        @click="navigateTo(module.url)"
      >
        {{ module.name }}
      </div>

      <div class="return-home">
        <button @click="navigateHome" class="home-btn">Back to Home</button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="main-content">

      <!-- Cards Row -->
      <div class="cards-row-a">
        <div class="card" @click="navigateTo('/app/item')">
          <h6>TOTAL ACTIVE ITEMS</h6>
          <p><b>{{ totalActiveItems }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/bin')">
          <h6>TOTAL STOCK VALUE</h6>
          <p>
            <b>{{ totalStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</b>
          </p>
          <p
            v-if="stockChangePercent !== null"
            :class="stockChangePercent >= 0 ? 'up' : 'down'"
            class="change-text"
            style="font-size: 14px;"
          >
            <span v-if="stockChangePercent >= 0">▲</span>
            <span v-else>▼</span>
            {{ Math.abs(stockChangePercent).toFixed(2) }}% since yesterday
          </p>
        </div>

        <div class="card" @click="navigateTo('/app/warehouse')">
          <h4>TOTAL WAREHOUSES</h4>
          <p><b>{{ totalWarehouses }}</b></p>
        </div>
      </div>

      <!-- Charts -->
      <div class="graph-row">
        <div class="graph-section full-width">
          <h4>Stock Inflow vs Outflow</h4>
          <canvas id="stockFlowChart"></canvas>
        </div>
      </div>

      <div class="graph-row bottom-charts">
        <div class="graph-section">
          <h4>Purchase Receipt Trend</h4>
          <canvas id="purchaseReceiptTrendChart"></canvas>
        </div>
        <div class="graph-section">
          <h4>Delivery Trend</h4>
          <canvas id="deliveryTrendChart"></canvas>
        </div>
      </div>

    </div>
  </div>
</template>

<script>


export default {
  name: "DashboardPage",
  data() {
    return {
      user: { name: "", photo: "" },
      defaultPhoto: "https://i.pravatar.cc/100",
      search: "",
      modules: [
        { name: "Item", url: "/app/item" },
        { name: "Item Group", url: "/app/item-group" },
        { name: "Product Bundle", url: "/app/product-bundle" },
        { name: "Material Request", url: "/app/material-request" },
        { name: "Stock Entry", url: "/app/stock-entry" },
        { name: "Delivery Note", url: "/app/delivery-note" },
        { name: "Purchase Receipt", url: "/app/purchase-receipt" },
        { name: "Pick List", url: "/app/pick-list" },
        { name: "Delivery Trip", url: "/app/delivery-trip" },
        { name: "Stock Ledger", url: "/app/query-report/Stock%20Ledger" },
        { name: "Stock Balance", url: "/app/query-report/Stock%20Balance" },
        { name: "Warehouse Wise Stock Balance", url: "/app/report/Warehouse%20Wise%20Stock%20Balance" },
      ],
      totalActiveItems: 0,
      totalStockValue: 0,
      yesterdayStockValue: 0,
      stockChangePercent: null,
      totalWarehouses: 0,
    };
  },
  computed: {
    filteredModules() {
      if (!this.search) return this.modules;
      const searchLower = this.search.toLowerCase();
      return this.modules.filter(m => m.name.toLowerCase().includes(searchLower));
    },
  },
  methods: {
    navigateTo(url) { if (url) window.location.href = url; },
    navigateHome() { window.location.href = "/home"; },

    async getCurrentUser() {
      try {
        const res = await fetch("/api/method/frappe.auth.get_logged_user");
        const data = await res.json();
        const userEmail = data.message;

        const userRes = await fetch(`/api/resource/User/${userEmail}`);
        const userData = await userRes.json();

        this.user.name = userData.data.full_name;
        this.user.photo = userData.data.user_image;
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    },

    async fetchTotalStockValue() {
      try {
        const todayRes = await fetch('/api/resource/Bin?fields=["actual_qty","valuation_rate"]&limit_page_length=0');
        const todayData = await todayRes.json();
        this.totalStockValue = todayData.data.reduce((sum, b) => sum + (parseFloat(b.actual_qty || 0) * parseFloat(b.valuation_rate || 0)), 0);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isoDate = yesterday.toISOString().split("T")[0];

        const yesterdayRes = await fetch(`/api/resource/Bin?filters=[["modified","<","${isoDate}"]]&fields=["actual_qty","valuation_rate"]&limit_page_length=0`);
        const yesterdayData = await yesterdayRes.json();
        const totalYesterday = yesterdayData.data.reduce((sum, b) => sum + (parseFloat(b.actual_qty || 0) * parseFloat(b.valuation_rate || 0)), 0);

        this.stockChangePercent = totalYesterday > 0 ? ((this.totalStockValue - totalYesterday) / totalYesterday) * 100 : 0;
      } catch (err) { console.error("Error fetching stock value:", err); }
    },

    async fetchTotalActiveItems() {
      try {
        const res = await fetch('/api/resource/Item?filters=[["disabled","=",0]]&fields=["name"]&limit_page_length=0');
        const data = await res.json();
        this.totalActiveItems = data.data.length;
      } catch (err) { console.error(err); }
    },

    async fetchTotalWarehouses() {
      try {
        const res = await fetch('/api/resource/Warehouse?fields=["name"]&limit_page_length=0');
        const data = await res.json();
        this.totalWarehouses = data.data.length;
      } catch (err) { console.error(err); }
    },

    async renderStockFlowChart() {
      const ctx = document.getElementById("stockFlowChart").getContext("2d");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const inflowData = Array(12).fill(0);
      const outflowData = Array(12).fill(0);

      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            { label: "Stock In", data: inflowData, backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 },
            { label: "Stock Out", data: outflowData, backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Stock Inflow vs Outflow" } },
          scales: { y: { beginAtZero: true, title: { display: true, text: "Quantity" } }, x: { title: { display: true, text: "Month" } } }
        }
      });

      // Fetch data from ERPNext
      try {
        const prRes = await fetch('/api/resource/Purchase Receipt?fields=["name","posting_date"]&limit_page_length=1000');
        const prData = await prRes.json();
        for (let pr of prData.data) {
          if (!pr.posting_date) continue;
          const month = new Date(pr.posting_date).getMonth();
          const prDetail = await fetch(`/api/resource/Purchase Receipt/${pr.name}?fields=["items"]`).then(r => r.json());
          const items = prDetail.data?.items || [];
          inflowData[month] += items.reduce((sum, i) => sum + (i.qty || 0), 0);
        }

        const dnRes = await fetch('/api/resource/Delivery Note?fields=["name","posting_date"]&limit_page_length=1000');
        const dnData = await dnRes.json();
        for (let dn of dnData.data) {
          if (!dn.posting_date) continue;
          const month = new Date(dn.posting_date).getMonth();
          const dnDetail = await fetch(`/api/resource/Delivery Note/${dn.name}?fields=["items"]`).then(r => r.json());
          const items = dnDetail.data?.items || [];
          outflowData[month] += items.reduce((sum, i) => sum + (i.qty || 0), 0);
        }

        chart.data.datasets[0].data = inflowData;
        chart.data.datasets[1].data = outflowData;
        chart.update();

      } catch (err) { console.error("Error fetching stock flow data:", err); }
    },

async renderTrendChart(endpoint, canvasId, label, color) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  try {
    const res = await fetch(`/api/resource/${endpoint}?fields=["posting_date","base_grand_total"]&limit_page_length=1000`);
    const data = await res.json();

    const monthlyTotals = Array(12).fill(0);
    data.data.forEach(d => {
      if (d.posting_date && d.base_grand_total) {
        const month = new Date(d.posting_date).getMonth();
        monthlyTotals[month] += parseFloat(d.base_grand_total);
      }
    });

    new Chart(ctx, {
      type: "bar", // changed from 'line' to 'bar'
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{
          label,
          data: monthlyTotals,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Amount" } },
          x: { title: { display: true, text: "Month" } }
        }
      }
    });

  } catch (err) {
    console.error(`Error fetching ${endpoint} data:`, err);
  }
}

  },

  mounted() {
    this.getCurrentUser();
    this.fetchTotalStockValue();
    this.fetchTotalActiveItems();
    this.fetchTotalWarehouses();

    this.renderStockFlowChart();
    this.renderTrendChart("Purchase Receipt", "purchaseReceiptTrendChart", "Purchase Receipt Amount", "#36A2EB");
    this.renderTrendChart("Delivery Note", "deliveryTrendChart", "Delivery Amount", "#ff6384");
  }
};
</script>

<style scoped>
/* Layout */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  font-family: Arial, sans-serif;
   background: #dde1e9;
  /* background: #f3f4f6; */
}


/* Sidebar */
.sidebar {
  width: 250px;
  background: #4a5d75;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;

}


.sidebar-heading {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
/* .sidebar-item {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.sidebar-item:hover {
  background: #374151;
} */
 /* Sidebar item hover/click animation */
.sidebar-item {
  font-size: 18px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.sidebar-item:hover {
  background: #374151;
  transform: translateX(5px); /* small movement */
}

.sidebar-item:active {
  transform: translateX(8px) scale(0.98); /* pressed effect */
}

.return-home {
  /* margin-top: auto; */
  text-align: center;
  padding: 15px ;
   margin-top:1px;
  
}

.home-btn {
  background: #8cc3fe;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.home-btn:hover {
  background: #0056b3;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-color: #fff;
  border-radius: 8px;
}

.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
}


/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

/* Cards */
.cards-row-a {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px); /* slight lift on hover */
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.card:active {
  transform: translateY(2px); /* simulate pressing down */
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.cards-row-b {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.card h6 {
  margin-bottom: 10px;
   font-size:16px;
}
.card p {
  font-size: 28px;
  margin-bottom: 5px;
  font-weight:500;
}
.card .up {
  color: #16a34a;
}
.card .down {
  color: #dc2626;
}

/* ---------- Overall Layout ---------- */
.graph-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* spacing between charts */
  margin-top: 30px;
}

/* ---------- Full-Width Chart ---------- */
.graph-section.full-width {
  flex: 1 1 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 500px;
}
#stockFlowChart {
  width: 100% !important;
  height: 400px !important;
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ---------- Two-Column Layout ---------- */
.bottom-charts .graph-section {
  flex: 1; /* equal width for both charts */
  min-width: 400px; /* ensures readability on smaller screens */
}

/* ---------- Chart Card Style ---------- */
.graph-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* ---------- Chart Title ---------- */
.graph-section h4 {
  text-align: start;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* ---------- Chart Canvas ---------- */
.graph-section canvas {
  width: 100% !important;
  height: 350px !important;
}

/* ---------- Responsive Design ---------- */
@media (max-width: 992px) {
  .bottom-charts {
    flex-direction: column;
  }

  .bottom-charts .graph-section {
    width: 100%;
  }
}

</style>