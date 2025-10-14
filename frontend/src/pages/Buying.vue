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

      <div class="sidebar-heading">Masters & Reports</div>
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
        <div class="card" @click="navigateTo('/app/purchase-order')">
          <h6>ANNUAL PURCHASE</h6>
          <p><b>{{ currencySymbol }} {{ formattedPurchaseAmount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/purchase-order/view/list?status=To Receive')">
          <h6>PURCHASE ORDER TO RECEIVE</h6>
          <p><b>{{ totalPurchaseOrderToReceiveCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/purchase-order/view/list?status=To Bill')">
          <h6>PURCHASE ORDER TO BILL</h6>
          <p><b>{{ totalPurchaseOrderToBillCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/supplier')">
          <h6>ACTIVE SUPPLIER</h6>
          <p><b>{{ activeSupplierCount }}</b></p>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="graph">
        <div class="graph-section">
          <h4><b>Purchase Order Trend</b></h4>
          <canvas id="poTrendChart"></canvas>
        </div>
      </div>

      <div class="bottom-row">
        <!-- Material Request Analysis -->
        <div class="doughnut-card">
          <h4><b>Material Request Analysis</b></h4>
          <small style="color: gray;">Last synced just now</small>
          <canvas id="materialRequestChart"></canvas>
        </div>

        <!-- Purchase Order Analysis -->
        <div class="doughnut-card">
          <h4><b>Purchase Order Analysis</b></h4>
          <canvas id="purchaseOrderChart"></canvas>
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
      searchQuery: "",
      user: { name: "", photo: "" },
      defaultPhoto: "https://i.pravatar.cc/100",
      modules: [
        { name: "Material Request", url: "/app/material-request" },
        { name: "Purchase Order", url: "/app/purchase-order" },
        { name: "Purchase Invoice", url: "/app/purchase-order" },
        { name: "Request for Quotation", url: "/app/request-for-quotation" },
        { name: "Supplier Quotation", url: "/app/supplier-quotation" },
      ],
      annualPurchaseAmount: 0,
      currencySymbol: "₹",
      totalPurchaseOrderToReceiveCount: 0,
      totalPurchaseOrderToBillCount: 0,
      activeSupplierCount: 0,

      materialRequest: {
        pending: 0,
        received: 0,
      },
    };
  },
  computed: {
    filteredModules() {
      if (!this.searchQuery) return this.modules;
      const searchLower = this.searchQuery.toLowerCase();
      return this.modules.filter((m) =>
        m.name.toLowerCase().includes(searchLower)
      );
    },
    formattedPurchaseAmount() {
      let amount = this.annualPurchaseAmount;
      let suffix = "";

      if (amount >= 1_00_00_000) {
        amount = amount / 1_00_00_000;
        suffix = " Cr";
      } else if (amount >= 1_00_000) {
        amount = amount / 1_00_000;
        suffix = " L";
      }

      return (
        amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + suffix
      );
    },
  },
  methods: {
    navigateTo(url) {
      if (url) window.location.href = url;
    },
    navigateHome() {
      window.location.href = "/home";
    },

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

    async fetchAnnualPurchase() {
      try {
        const currentYear = new Date().getFullYear();
        const res = await fetch(
          `/api/resource/Purchase%20Order?filters=[["docstatus","=",1],["transaction_date",">=","${currentYear}-01-01"],["transaction_date","<=","${currentYear}-12-31"]]&fields=["grand_total"]&limit_page_length=0`
        );
        const data = await res.json();
        let total = 0;
        data.data.forEach((order) => (total += parseFloat(order.grand_total || 0)));
        this.annualPurchaseAmount = total;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchPOCounts() {
      try {
        const res1 = await fetch(
          '/api/resource/Purchase%20Order?filters=[["docstatus","=",1],["status","in",["To Receive","To Receive and Bill"]]]&fields=["name"]&limit_page_length=0'
        );
        const data1 = await res1.json();
        this.totalPurchaseOrderToReceiveCount = data1.data.length;

        const res2 = await fetch(
          '/api/resource/Purchase%20Order?filters=[["docstatus","=",1],["status","in",["To Bill","To Receive and Bill"]]]&fields=["name"]&limit_page_length=0'
        );
        const data2 = await res2.json();
        this.totalPurchaseOrderToBillCount = data2.data.length;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchActiveSuppliers() {
      try {
        const res = await fetch(
          '/api/resource/Supplier?fields=["name","disabled"]&limit_page_length=0'
        );
        const data = await res.json();
        const activeSuppliers = data.data.filter(
          (s) => s.disabled === 0 || s.disabled === false
        );
        this.activeSupplierCount = activeSuppliers.length;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchCompanyCurrency() {
      try {
        const res = await fetch(
          '/api/resource/Company?fields=["default_currency"]&limit_page_length=1'
        );
        const data = await res.json();
        const symbols = {
          INR: "₹",USD: "$",EUR: "€", GBP: "£",QAR: "﷼",AED: "د.إ",SAR: "﷼",KWD: "د.ك", OMR: "﷼",AFN: "؋",
        };
        if (data.data && data.data.length > 0) {
          const code = data.data[0].default_currency;
          this.currencySymbol = symbols[code] || code;
        }
      } catch (err) {
        console.error("Error fetching currency:", err);
      }
    },

 
    async renderPOChart() {
      const ctx = document.getElementById("poTrendChart").getContext("2d");
      const futurePOData = {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",  "Sep", "Oct", "Nov","Dec",],
        datasets: [
          {
            label: "Purchase Orders",
            data: Array(12).fill(0),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 0.8,
            fill: true,
            tension: 0.3,
          },
        ],
      };
      const poChart = new Chart(ctx, {
        type: "line",
        data: futurePOData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Purchase Order Trend" },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Number of POs" },
            },
            x: { title: { display: true, text: "Month" } },
          },
        },
      });

      try {
        const response = await fetch(
          "/api/resource/Purchase Order?fields=[\"name\",\"transaction_date\"]&limit_page_length=1000"
        );
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const monthlyCount = Array(12).fill(0);
          result.data.forEach((po) => {
            if (po.transaction_date) {
              const monthIndex = new Date(po.transaction_date).getMonth();
              monthlyCount[monthIndex]++;
            }
          });
          poChart.data.datasets[0].data = monthlyCount;
          poChart.update();
        }
      } catch (err) {
        console.error(err);
      }
    },

//----------------------------------------material request chart------------------------
    async renderMaterialRequestChart() {
  try {
    const res = await fetch(
      `/api/resource/Material%20Request?fields=["status"]&limit_page_length=0`
    );
    const data = await res.json();
    const records = data.data || [];

    this.materialRequest = {
      pending: records.filter((r) => r.status === "Pending").length,
      received: records.filter((r) => r.status === "Received").length,
    };

    const ctx = document
      .getElementById("materialRequestChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Received"],
        datasets: [
          {
            data: [
              this.materialRequest.pending,
              this.materialRequest.received,
            ],
            backgroundColor: ["#20a1f7", "#22c946"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutout: "70%",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom", 
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              font: { size: 16 },
              generateLabels: function (chart) {
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;
                const bgColors = chart.data.datasets[0].backgroundColor;
                return labels.map((label, i) => ({
                  text: `${label}: ${data[i]}`,
                  fillStyle: bgColors[i],
                  strokeStyle: bgColors[i],
                  index: i,
                }));
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                // return `${context.label}: ${value}`;
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching Material Request Data:", err);
  }
},



    


async renderPurchaseOrderChart() {
  const ctx = document.getElementById("purchaseOrderChart").getContext("2d");
  try {
    const res = await fetch(
      `/api/resource/Purchase%20Order?filters=[["docstatus","=",1]]&fields=["base_grand_total","per_billed"]&limit_page_length=0`
    );
    const data = await res.json();
    let billed = 0, toBill = 0;

    if (data.data && data.data.length > 0) {
      data.data.forEach((po) => {
        const total = parseFloat(po.base_grand_total) || 0;
        const billedPart = total * ((parseFloat(po.per_billed) || 0) / 100);
        billed += billedPart;
        toBill += total - billedPart;
      });
    }

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Billed Amount", "Amount to Bill"],
        datasets: [
          {
            data: [billed, toBill],
            backgroundColor: ["#20a1f7", "#ffd46e"],
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "70%",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 16, 
                weight: "500",
              },
              padding: 20,
              generateLabels: function (chart) {
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;
                return labels.map((label, i) => ({
                  text: `${label}: ₹${data[i].toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  fillStyle: chart.data.datasets[0].backgroundColor[i],
                  strokeStyle: chart.data.datasets[0].backgroundColor[i],
                  index: i,
                }));
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                return (
                  context.label +
                  ": ₹" +
                  value.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
},

  },

  async mounted() {
    this.getCurrentUser();
    this.fetchAnnualPurchase();
    this.fetchPOCounts();
    this.fetchActiveSuppliers();
    this.fetchCompanyCurrency();
    this.renderPOChart();
    this.renderPurchaseOrderChart();
    this.renderMaterialRequestChart();
  },
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
  margin-top: 300px;
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
  transform: translateY(-5px); 
  box-shadow: 0 8px 20px rgba(0,0,0,0.30);
}

.card:active {
  transform: translateY(2px); 
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
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  min-width:100%;
  
}

#poTrendChart {
  height: 500px !important; /* adjust height */
  width: 100% !important;
}

.bottom-row {
  display: flex;
  gap: 20px;
  flex: 1;
}



.card-title {
  margin: 0 0 10px 0;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
}

.chart-wrapper {
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: center;   
}

#purchaseOrderChart {
  width: 80%;
  height: 80%; 
}
#materialRequestChart{
   width: 80%;
  height: 80%;  
}

.doughnut-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  height: 400px;
  position: relative;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  text-align: left;      
  margin-bottom: 8px;
}

.doughnut-card canvas {
  display: block;
  margin: 0 auto;         
  width: 100% !important;
  height: 330px !important;
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
.card, .graph-section, .doughnut-card {
  animation: fadeUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* Optional: stagger cards */
.cards-row-a .card:nth-child(1) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(2) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(3) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(4) { animation-delay: 0.1s; }

.graph-section { animation-delay: 0.2s; }
.doughnut-card { animation-delay: 0.2s; }



</style>
