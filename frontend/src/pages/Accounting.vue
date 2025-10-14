<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
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

      <br><br>

      <div class="return-home">
        <button @click="navigateHome" class="home-btn">Back to Home</button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="main-content">
      <br>

      <!-- Cards -->
      <div class="cards-row-a">
        <div class="card" @click="navigateTo('/app/sales-invoice')">
          <h6>TOTAL OUTGOING BILLS</h6>
          <p><b>{{ currencySymbol }} {{ formatAmount(totalSalesAmount) }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/purchase-invoice')">
          <h6>TOTAL INCOMING BILLS</h6>
          <p><b>{{ currencySymbol }} {{ formatAmount(totalPurchaseAmount) }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/payment-entry/view/list?payment_type=Receive')">
          <h6>TOTAL INCOMING PAYMENT</h6>
          <p><b>{{ currencySymbol }} {{ formatAmount(paymentReceivedTotal) }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/payment-entry/view/list?payment_type=Pay')">
          <h6>TOTAL OUTGOING PAYMENT</h6>
          <p><b>{{ currencySymbol }} {{ formatAmount(paymentPaidTotal) }}</b></p>
        </div>
      </div>

      <!-- Sales vs Purchase Invoice Graph -->
      <div class="graph">
        <div class="graph-section">
          <h4><b>Purchase Invoice vs Sales Invoice</b></h4>
          <canvas id="invoiceTrendChart"></canvas>
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
      modules: [
        { name: "Sales Invoice", url: "/app/sales-invoice" },
        { name: "Purchase Invoice", url: "/app/purchase-invoice" },
        { name: "Payment Entry", url: "/app/payment-entry" },
        { name: "Trial Balance", url: "/app/query-report/Trial%20Balance" },
        { name: "General Ledger", url: "/app/query-report/General%20Ledger" },
        { name: "Accounts Receivable", url: "/app/query-report/Accounts%20Receivable" },
        { name: "Journal Entry", url: "/app/journal-entry" },
        { name: "Chart of Accounts", url: "/app/account" },
        { name: "Company", url: "/app/company" }
      ],
      totalPurchaseAmount: 0,
      totalSalesAmount: 0,
      paymentReceivedTotal: 0,
      paymentPaidTotal: 0,
      currencySymbol: "",
    };
  },

  computed: {
    filteredModules() {
      return this.modules;
    },
  },

  methods: {
    navigateTo(url) {
      if (url) window.location.href = url;
    },
    navigateHome() {
      window.location.href = "/home";
    },
    formatAmount(value) {
      return (value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    async getCurrentUser() {
      try {
        const res = await fetch("/api/method/frappe.auth.get_logged_user");
        const { message: email } = await res.json();
        const userRes = await fetch(`/api/resource/User/${email}`);
        const userData = await userRes.json();
        this.user.name = userData.data.full_name;
        this.user.photo = userData.data.user_image;
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    },

    async getCurrencySymbol() {
      try {
        const res = await fetch('/api/resource/Company?fields=["default_currency"]&limit_page_length=1');
        const data = await res.json();
        const code = data?.data?.[0]?.default_currency || "USD";
        const symbols = {
          INR: "₹", USD: "$", EUR: "€", GBP: "£", QAR: "﷼", AED: "د.إ",
          SAR: "﷼", KWD: "د.ك", OMR: "﷼", AFN: "؋"
        };
        this.currencySymbol = symbols[code] || code;
      } catch (err) {
        console.error("Error fetching currency:", err);
      }
    },

    // ---------- Fetch Totals ----------
    async fetchTotals() {
      try {
        // Purchase Invoice total
        const piRes = await fetch('/api/resource/Purchase%20Invoice?filters=[["docstatus","=",1]]&fields=["grand_total"]&limit_page_length=0');
        const piData = await piRes.json();
        this.totalPurchaseAmount = piData.data.reduce((sum, i) => sum + parseFloat(i.grand_total || 0), 0);

        // Sales Invoice total
        const siRes = await fetch('/api/resource/Sales%20Invoice?filters=[["docstatus","=",1]]&fields=["grand_total","outstanding_amount"]&limit_page_length=0');
        const siData = await siRes.json();
        this.totalSalesAmount = siData.data.reduce((sum, i) => {
          return sum + (parseFloat(i.grand_total || 0) - parseFloat(i.outstanding_amount || 0));
        }, 0);

        // Payment Received
        const payRecv = await fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Receive"],["docstatus","=","1"]]&fields=["paid_amount"]&limit_page_length=0`);
        const payRecvData = await payRecv.json();
        this.paymentReceivedTotal = payRecvData.data.reduce((sum, e) => sum + parseFloat(e.paid_amount || 0), 0);

        // Payment Paid
        const payPay = await fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Pay"],["docstatus","=","1"]]&fields=["paid_amount"]&limit_page_length=0`);
        const payPayData = await payPay.json();
        this.paymentPaidTotal = payPayData.data.reduce((sum, e) => sum + parseFloat(e.paid_amount || 0), 0);
      } catch (err) {
        console.error("Error fetching totals:", err);
      }
    },

    // ---------- Charts ----------
    async renderInvoiceChart() {
      const ctx = document.getElementById("invoiceTrendChart").getContext("2d");
      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [
            { label: "Purchase Invoice", data: Array(12).fill(0), backgroundColor: "rgba(54,162,235,0.5)",  borderColor: "rgba(54, 162, 235, 1)",borderWidth: 0.8},
            { label: "Sales Invoice", data: Array(12).fill(0), backgroundColor: "rgba(255,99,132,0.5)" ,borderColor: "rgba(255, 99, 132, 1)",borderWidth: 0.8}
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } },
        },
      });

      try {
        const siRes = await fetch('/api/resource/Sales%20Invoice?fields=["posting_date"]&limit_page_length=1000');
        const siData = await siRes.json();
        const siMonthly = Array(12).fill(0);
        siData.data.forEach(i => siMonthly[new Date(i.posting_date).getMonth()]++);
        chart.data.datasets[1].data = siMonthly;

        const piRes = await fetch('/api/resource/Purchase%20Invoice?fields=["posting_date"]&limit_page_length=1000');
        const piData = await piRes.json();
        const piMonthly = Array(12).fill(0);
        piData.data.forEach(i => piMonthly[new Date(i.posting_date).getMonth()]++);
        chart.data.datasets[0].data = piMonthly;

        chart.update();
      } catch (err) {
        console.error("Error rendering Invoice chart:", err);
      }
    },

    
  },

  async mounted() {
    await this.getCurrentUser();
    await this.getCurrencySymbol();
    await this.fetchTotals();
    this.renderInvoiceChart();
    this.renderAgingCharts();
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
  margin-top: auto;
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
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  min-width:100%;
  
}

#invoiceTrendChart {
  height: 650px !important; /* adjust height */
  width: 100% !important;
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
.card, .graph-section, .calendar-card, .realtime-card {
  animation: fadeUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* Optional: stagger cards */
.cards-row-a .card:nth-child(1) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(2) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(3) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(4) { animation-delay: 0.1s; }
.cards-row-b .card:nth-child(5) { animation-delay: 0.2s; }
.cards-row-b .card:nth-child(6) { animation-delay: 0.2s; }
.cards-row-b .card:nth-child(7) { animation-delay: 0.2s; }
.cards-row-b .card:nth-child(8) { animation-delay: 0.2s; }

.graph-section { animation-delay: 0.3s; }
.calendar-card { animation-delay: 0.4s; }
.realtime-card { animation-delay: 0.4s; }

</style>
