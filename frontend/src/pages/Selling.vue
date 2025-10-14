<template>
  <div class="dashboard-container">

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- User Info -->
       <div class="user-info">
        <img src="/profile.png" alt="User Photo" class="user-photo" />
        <div class="user-name">{{ user.name || "Guest" }}</div>
      </div>
      <br><br>

      <div
        v-for="module in filteredModules"
        :key="module.name"
        class="sidebar-item"
        @click="navigateTo(module.url)"
      >
        {{ module.name }}
      </div>

      <!-- Return Home Button -->
      <div class="return-home">
        <button @click="navigateHome" class="home-btn">Back to Home</button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="main-content">
      <!-- Cards Row -->
      <div class="cards-row-a">
        <div class="card" @click="navigateTo('/app/sales-order')">
          <h6>ANNUAL SALES</h6>
          <p><b>{{ currencySymbol }}{{ formattedSalesAmount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/sales-order/view/list?status=To Deliver')">
          <h6>SALES ORDERS TO DELIVER</h6>
          <p><b>{{ totalSalesOrderToDeliverCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/sales-order/view/list?status=To Bill')">
          <h6>SALES ORDERS TO BILL</h6>
          <p><b>{{ totalSalesOrderToBillCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/customer')">
          <h6>ACTIVE CUSTOMERS</h6>
          <p><b>{{ activeCustomerCount }}</b></p>
        </div>
      </div>

      <!-- Sales Order Trend -->
      <div class="graph">
        <div class="graph-section">
          <h4><b>Sales Order Trend</b></h4>
          <canvas id="soTrendChart"></canvas>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-row">
        <!-- Top Customers -->
          <div class="chart-card">
    <h3 class="card-title"><b>Top Customers</b></h3>
    <div class="chart-wrapper top-customers-wrapper">
      <canvas id="topCustomersChart"></canvas>
    </div>
  </div>

        <!-- Sales Order Analysis -->
  <!-- Doughnut Chart -->
  <div class="chart-card">
    <h3 class="card-title"><b>Sales Order Analysis</b></h3>
    <div class="chart-wrapper doughnut-wrapper">
      <canvas id="salesOrderChart"></canvas>
    </div>
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
        { name: "Customer", url: "/app/customer" },
        { name: "Quotation", url: "/app/quotation" },
        { name: "Sales Order", url: "/app/sales-order" },
        { name: "Sales Invoice", url: "/app/sales-invoice" },
        { name: "Blanket Order", url:"/app/blanket-order" },
        { name: "Sales Partner", url: "/app/sales-partner" },
        { name: "Sales Person", url: "/app/sales-person" },
      ],
      annualSalesAmount: 0,
      currencySymbol: "₹",
      totalSalesOrderToDeliverCount: 0,
      totalSalesOrderToBillCount: 0,
      activeCustomerCount: 0,
    };
  },
  computed: {
    filteredModules() {
      if (!this.search) return this.modules;
      const searchLower = this.search.toLowerCase();
      return this.modules.filter(m => m.name.toLowerCase().includes(searchLower));
    },
    formattedSalesAmount() {
      let amount = this.annualSalesAmount;
      let suffix = "";
      if (amount >= 1_00_00_000) { amount = amount / 1_00_00_000; suffix = " Cr"; }
      else if (amount >= 1_00_000) { amount = amount / 1_00_000; suffix = " L"; }
      return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
    }
  },
  methods: {
    navigateTo(url) {
      if (url) window.location.href = url;
    },
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
      } catch (err) { console.error("Error fetching user info:", err); }
    },
//--------------------------------------Top Customer-----------------------------------
    async fetchTopCustomers() {
      try {
        const res = await fetch('/api/resource/Sales%20Invoice?filters=[["docstatus","=",1]]&fields=["customer","base_grand_total"]&limit_page_length=1000');
        const data = await res.json();
        if (!data.data || data.data.length === 0) return { labels: [], totals: [] };

        const customerTotals = {};
        data.data.forEach(inv => {
          if (!inv.customer || !inv.base_grand_total) return;
          customerTotals[inv.customer] = (customerTotals[inv.customer] || 0) + parseFloat(inv.base_grand_total);
        });

        const sorted = Object.entries(customerTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        return { labels: sorted.map(item => item[0]), totals: sorted.map(item => item[1]) };
      } catch(err) { console.error("Error fetching top customers:", err); return { labels: [], totals: [] }; }
    },


    async renderTopCustomersChart() {
      const { labels, totals } = await this.fetchTopCustomers();
      if (labels.length === 0) return;

      const ctx = document.getElementById('topCustomersChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Total Sales', data: totals, backgroundColor: 'rgba(211,211,211,0.7)', borderColor: 'rgba(211,211,211,1)', borderWidth: 1, borderRadius: 5 }] },
        options: { responsive: true, plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Sales Amount (₹)' } }, x: { title: { display: true, text: 'Customer' }, ticks: { maxRotation: 45, minRotation: 0 } } } }
      });
    },
//----------------------------------sales order trend-------------------------------------------------
    async renderSalesOrderTrendChart() {
      const ctx = document.getElementById("soTrendChart").getContext("2d");
      const soChart = new Chart(ctx, {
        type: "line",
        data: { labels: Array.from({length:12}, (_,i)=> new Date(0, i).toLocaleString('default', {month:'short'})), datasets: [{ label: "Sales Orders", data: Array(12).fill(0), borderColor: "rgba(255, 99, 132, 1)", backgroundColor: "rgba(255, 99, 132, 0.2)", fill: true, tension: 0.3 ,borderWidth: 0.8,}] },
        options: { responsive: true, plugins: { legend: { display: true, position: "top" }, title: { display: true, text: "Sales Order Trend" } }, scales: { y: { beginAtZero: true, title: { display: true, text: "Number of Sales Orders" } }, x: { title: { display: true, text: "Month" } } } }
      });

      try {
        const response = await fetch("/api/resource/Sales Order?fields=[\"transaction_date\"]&limit_page_length=1000");
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const monthlyCount = Array(12).fill(0);
          result.data.forEach(so => { if(so.transaction_date) monthlyCount[new Date(so.transaction_date).getMonth()]++; });
          soChart.data.datasets[0].data = monthlyCount;
          soChart.update();
        }
      } catch(err) { console.error("Error fetching Sales Orders:", err); }
    },
    //-----------------------------sales order analysis------------------------------------------------------------

    async renderSalesOrderAnalysisChart() {
      const ctx = document.getElementById('salesOrderChart').getContext('2d');
      try {
        const res = await fetch(`/api/resource/Sales%20Order?filters=[["docstatus","=",1]]&fields=["base_grand_total","per_billed"]&limit_page_length=0`);
        const data = await res.json();
        let billed = 0, toBill = 0;
        if(data.data) data.data.forEach(so => { const total = parseFloat(so.base_grand_total)||0; const billedPart = total*(parseFloat(so.per_billed)||0)/100; billed+=billedPart; toBill+=total-billedPart; });
        new Chart(ctx, { type:'doughnut', data:{ labels:['Billed','To Bill'], datasets:[{ data:[billed,toBill], backgroundColor:['#fc869f','#D3D3D3'], hoverOffset:6 }] }, options:{ cutout:'70%', responsive:true, plugins:{ legend:{ position:'bottom', labels:{ generateLabels:chart=>{ const data=chart.data.datasets[0].data; const labels=chart.data.labels; return labels.map((label,i)=>({ text:`${label}: ₹${data[i].toLocaleString('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2})}`, fillStyle:chart.data.datasets[0].backgroundColor[i], strokeStyle:chart.data.datasets[0].backgroundColor[i], index:i })); } } }, tooltip:{ callbacks:{ label:ctx=>`${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2})}` } } } } });
      } catch(err){ console.error("Error rendering Sales Order Analysis:", err);}
    },

    

    async fetchDashboardCounts() {
      // Annual Sales
      const currentYear = new Date().getFullYear();
      try {
        const res = await fetch(`/api/resource/Sales%20Order?filters=[["docstatus","=",1],["transaction_date",">=","${currentYear}-01-01"],["transaction_date","<=","${currentYear}-12-31"]]&fields=["grand_total"]&limit_page_length=0`);
        const data = await res.json();
        this.annualSalesAmount = data.data.reduce((sum, o)=>sum+(parseFloat(o.grand_total)||0),0);
      } catch(err){ console.error(err); }

      // To Deliver
      try {
        const res = await fetch('/api/resource/Sales%20Order?filters=[["docstatus","=",1],["status","in",["To Deliver","To Deliver and Bill"]]]&fields=["name"]&limit_page_length=0');
        const data = await res.json();
        this.totalSalesOrderToDeliverCount = data.data.length;
      } catch(err){ console.error(err); }

      // To Bill
      try {
        const res = await fetch('/api/resource/Sales%20Order?filters=[["docstatus","=",1],["status","in",["To Bill","To Deliver and Bill"]]]&fields=["name"]&limit_page_length=0');
        const data = await res.json();
        this.totalSalesOrderToBillCount = data.data.length;
      } catch(err){ console.error(err); }

      // Active Customers
      try {
        const res = await fetch('/api/resource/Customer?fields=["name","disabled"]&limit_page_length=0');
        const data = await res.json();
        this.activeCustomerCount = data.data.filter(c=>c.disabled===0||c.disabled===false).length;
      } catch(err){ console.error(err); }
    },

    async fetchCompanyCurrency() {
      try {
        const res = await fetch('/api/resource/Company?fields=["default_currency"]&limit_page_length=1');
        const data = await res.json();
        const symbols = { INR:"₹", USD:"$", EUR:"€", GBP:"£" };
        if(data.data && data.data.length>0) this.currencySymbol = symbols[data.data[0].default_currency]||data.data[0].default_currency;
      } catch(err){ console.error(err); }
    }
  },

  async mounted() {
    await this.getCurrentUser();
    await this.fetchDashboardCounts();
    await this.fetchCompanyCurrency();
    this.renderTopCustomersChart();
    this.renderSalesOrderTrendChart();
    this.renderSalesOrderAnalysisChart();
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
  padding: 12px;
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
  margin-top: 200px;
  text-align: center;
  padding: 15px 0;
  
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
  padding: 12px;
  background-color: #566c88;
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
  box-shadow: 0 8px 20px rgba(0,0,0,0.30);
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



/* Graph Section */
.graph-section {
 

  margin: auto;     
  background-color:white;
  border-radius: 8px;
  padding: 20px;
  min-width:100%;
  
}

#soTrendChart {
  height: 500px !important; /* adjust height */
  width: 100% !important;
}
/* Bottom Row - Two Charts in One Row */
.bottom-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;        /* keep it responsive on smaller screens */
  justify-content: space-between; /* distribute space equally */
}

.chart-card, .doughnut-card {
  flex: 1 1 48%;           /* take equal width, allow shrinking if needed */
  min-width: 300px;        /* prevent too small on mobile */
  max-width: 48%;           /* prevent stretching too much */
  height: 450px;           /* fixed height */
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

/* General chart wrapper */
.chart-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;  /* center horizontally */
  align-items: center;      /* default vertical center */
}

/* Top Customers chart - push slightly down */
.top-customers-wrapper {
  align-items: flex-start;   /* start from top */
  padding-top: 40px;         /* push down from top */
}

/* Doughnut chart - fully centered */
.doughnut-wrapper {
  align-items: center;       /* perfectly centered vertically */
}



.chart-wrapper canvas {
  max-width: 100%;
  max-height: 300px; /* adjust as needed */
}


/* Fade-up animation on page load */

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply to cards, graph, calendar, map */
.card, .graph-section, .chart-card{
  animation: fadeUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* Optional: stagger cards */
.cards-row-a .card:nth-child(1) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(2) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(3) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(4) { animation-delay: 0.1s; }

.graph-section { animation-delay: 0.2s; }
.chart-card{ animation-delay: 0.2s; }

</style>
