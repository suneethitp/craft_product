<template>
  <div class="hr-page">
    <h2 class="hr-heading">
      <img src="/in-stock.png" alt="hr Icon" class="heading-icon" />
     HR
    </h2>

    <div class="masters-container">
      <h3 class="inner-title"><u>Masters & Reports</u></h3>

      <div 
        v-for="(shortcut, index) in shortcuts" 
        :key="index"  
        @click="goToMasters(shortcut.route)"
        class="master-link"
      >
        <span class="masters-name">
          {{ shortcut.name }}
          <img src="/arrow-up-right.svg" alt="arrow" class="arrow-icon" />
        </span>
      </div>
    </div>
    <button class="back-home-btn" @click="goHome">Back to Home</button>
  </div>
</template>



<script>
console.log("HR page is working");
export default {
  name: "HR",
  data() {
    return {
   
      shortcuts: [
        { name: "Item",route: "/app/item" },
        { name: "Item Group",  route: "/app/item-group" },
        { name: "Product Bundle",  route: "/app/product-bundle" },
        { name: "Material Request" , route: "/app/material-request" },
        { name: "Stock Entry", route: "/app/stock-entry" },
        { name: "Delivery Note", route: "/app/delivery-note" },
        { name: "Purchase Receipt", route: "/app/purchase-receipt"},
        { name: "Pick List", route: "/app/pick-list" },
        { name: "Delivery Trip", route: "/app/delivery-trip" },
        { name: "Stock Ledger", route: "/app/query-report/Stock%20Ledger" },
        { name: "Stock Balance", route: "/app/query-report/Stock%20Balance "},
        { name: "Warehouse Wise Stock Balance", route: "/app/report/Warehouse%20Wise%20Stock%20Balance" },
        
        
      ],
    };
  },
  methods: {
  goToMasters(route) {
    console.log("Redirecting to:", route);
    window.location.href = route;
  },
    goHome() {
      window.location.href = "/home"
    },
}

};
</script>


<style>
.hr-page { 
    display: flex; 
    flex-direction:
    column; align-items: center;
     justify-content: flex-start;
      min-height: 100vh; 
      background-color: #cbd5e1; 
      padding-top: 30px; 
    } 
.hr-page h2 { 
        font-size: 36px; 
        color: #1c283a;
        font-weight: 600; 
        margin-bottom: 30px; 
        text-align: center;
        max-width: 1400px; 
        width: 100%;
        text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8); 

     }

.hr-heading {
  display: flex;
  align-items: center;
  justify-content: center; 
  gap: 12px; 
  font-size: 36px;
  color: #1c283a;
  font-weight: 600;
  margin-bottom: 30px;
  text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8);
}

.heading-icon {
  width: 40px;   
  height: 40px;
}


  .masters-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 50px;
  background-color: #e0e7ef;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 98%;
  max-width: 600px;
  min-height: auto;
  align-items: flex-start;
}


.inner-title {
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1c283a;
  margin-bottom: 20px;
  text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8);
} 



.master-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.masters-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.master-link:hover .arrow-icon {
  transform: translateX(4px);
}
.back-home-btn {
  margin-top: 40px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  background-color: #e0e7ef;
  color: #1c283a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-home-btn:hover {
  background-color: #dae7f7;
}


</style>


<template>
  <div class="dashboard-container">

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- User Info -->
      <div class="user-info">
        <img src="/profile.png" alt="User Photo" class="user-photo" />
        <div class="user-name">{{ user.name || "Guest" }}</div>
      </div>
      <br>
      <br>
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
        <div class="card" @click="navigateTo('/app/sales-order')">
          <h6>ANNUAL SALES</h6>
          <p >{{ currencySymbol }}{{ formattedSalesAmount }}</p>
        </div>

    
          <div class="card" @click="navigateTo('/app/sales-order/view/list?status=To Deliver')">
            <h6>SALES ORDERS TO DELIVER</h6>
           <p>{{ totalSalesOrderToDeliverCount }}</p>
          </div>
        

        <div class="card" @click="navigateTo('/app/sales-order/view/list?status=To Bill')">
          <h6>SALES ORDERS TO BILL</h6>
            <p>{{ totalSalesOrderToBillCount }}</p>  
        </div>


      <div class="card" @click="navigateTo('/app/customer')">
      <h6>ACTIVE CUSTOMERS</h6>
        <p>{{ activeCustomerCount }}</p>
      </div>

      </div>
     <div class="graph">
        <div class="graph-section">
          <h4><b>Sales Order Trend</b></h4>
          <canvas id="soTrendChart"></canvas>
        </div>
      </div>


      <!-- Bottom Section (Calendar + Map) -->
      <div class="bottom-row">
        <!-- Calendar -->
        <div class="doughnut-card">
          <h4><b>Top Customers</b></h4>
          <div id="topCustomersChart"></div>
        </div>

     <!-- Doughnut Chart -->
        <div class="doughnut-card">
          <h4><b>Sales Order Analysis</b></h4>
          <canvas id="salesOrderChart"></canvas>
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
      user: {
        name: "",
        photo: "",
      },
      defaultPhoto: "https://i.pravatar.cc/100",
      filteredModules: [
        { name: "Module 1", url: "/module1" },
        { name: "Module 2", url: "/module2" },
      ],
      search: "",
      annualSalesAmount: 0,
      currencySymbol: "₹",
      totalSalesOrderToDeliverCount: 0,
       totalSalesOrderToBillCount: 0,
      activeCustomerCount:0,
      modules: [
        { name: "Customer", url: "/app/customer"  },
        { name:  "Quotation", url: "/app/quotation" },
        { name: "Sales Order", url: "/app/sales-order" },
        { name:  "Sales Invoice" , url: "/app/sales-invoice"},
        { name:  "Blanket Order", url:"/app/blanket-order"},
        { name: "Sales Partner" , url: "/app/sales-partner" },
        { name: "Sales Person" , url: "/app/sales-person" },
      ],

    };
  },
  computed: {
    filteredModules() {
      
      if (!this.search) return this.modules;
      const searchLower = this.search.toLowerCase();
      return this.modules.filter((m) =>
        m.name.toLowerCase().includes(searchLower)
      );
    },
      // Format annual sales like 1.23 L or 1.23 Cr
    formattedSalesAmount() {
      let amount = this.annualSalesAmount;
      let suffix = "";

      if (amount >= 1_00_00_000) { // 1 Crore
        amount = amount / 1_00_00_000;
        suffix = " Cr";
      } else if (amount >= 1_00_000) { // 1 Lakh
        amount = amount / 1_00_000;
        suffix = " L";
      }

      return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
    }
  },
  methods: {
    navigateTo(url) {
      if (url) window.location.href = url;
    },
       navigateHome() {
      window.location.href = "/home" 
  },
    formatCurrency(value) {
    if (!value) return "0";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  },
    formatCurrency(value) {
    if (!value) return "0";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  },
  async getCurrentUser() {
      try {
        // ERPNext: Get current user
        const res = await fetch("/api/method/frappe.auth.get_logged_user");
        const data = await res.json();
        const userEmail = data.message;

        // Fetch full user info
        const userRes = await fetch(`/api/resource/User/${userEmail}`);
        const userData = await userRes.json();

        this.user.name = userData.data.full_name;
        this.user.photo = userData.data.user_image; // should be URL or base64
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    },

  },
  mounted() {

    this.getCurrentUser();


async function renderSOChart() {
  const ctx = document.getElementById("soTrendChart").getContext("2d");

  // Initialize chart with empty data
  const futureSOData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [{
      label: "Sales Orders",
      data: Array(12).fill(0),
      borderColor: "rgba(255, 99, 132, 1)", // red line
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 0.8,
      fill: true,
      tension: 0.3
    }]
  };

  // Create chart instance
  const soChart = new Chart(ctx, {
    type: "line",
    data: futureSOData,
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: true, text: "Sales Order Trend" }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Number of Sales Orders" } },
        x: { title: { display: true, text: "Month" } }
      }
    }
  });

  // Fetch Sales Orders from ERPNext
  try {
    const response = await fetch("/api/resource/Sales Order?fields=[\"name\",\"transaction_date\"]&limit_page_length=1000");
    const result = await response.json();
    console.log("API Result:", result); // Check what API returns

    if (result.data && result.data.length > 0) {
      const monthlyCount = Array(12).fill(0);

      result.data.forEach(so => {
        if (so.transaction_date) {
          const monthIndex = new Date(so.transaction_date).getMonth();
          monthlyCount[monthIndex]++;
        }
      });

      // Update chart with real API data
      soChart.data.datasets[0].data = monthlyCount;
      soChart.update();
    } else {
      console.warn("No Sales Orders found in ERPNext API");
    }
  } catch (err) {
    console.error("Error fetching Sales Orders:", err);
  }
}

// Run the function
renderSOChart();


async function renderSalesOrderChart() {
  const ctx = document.getElementById('salesOrderChart').getContext('2d');

  try {
    // Fetch Sales Orders with docstatus = 1
    const res = await fetch(`/api/resource/Sales%20Order?filters=[["docstatus","=",1]]&fields=["base_grand_total","per_billed"]&limit_page_length=0`);
    const data = await res.json();

    let billed = 0, toBill = 0;

    if (data.data && data.data.length > 0) {
      data.data.forEach(so => {
        const total = parseFloat(so.base_grand_total) || 0;
        const billedPart = total * (parseFloat(so.per_billed) || 0) / 100;
        billed += billedPart;
        toBill += total - billedPart;
      });
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Billed Amount', 'Amount to Bill'],
        datasets: [{
          data: [billed, toBill],
          backgroundColor: ['#36a2eb', '#ffcd56'],
           backgroundColor: ['#f50c80', '#cacafa'], //dupli
              

       
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '70%',
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: function(chart) {
                const data = chart.data.datasets[0].data;
                const labels = chart.data.labels;
                return labels.map((label, i) => ({
                  text: `${label}: ₹${data[i].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  fillStyle: chart.data.datasets[0].backgroundColor[i],
                  strokeStyle: chart.data.datasets[0].backgroundColor[i],
                  index: i
                }));
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return context.label + ': ₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              }
            }
          }
        }
      }
    });

  } catch(err) {
    console.error("Error rendering Sales Order chart:", err);
  }
}

// Call the function
renderSalesOrderChart();

async function fetchTopCustomers() {
  try {
    // Fetch submitted Sales Invoices from ERPNext
    const res = await fetch('/api/resource/Sales%20Invoice?filters=[["docstatus","=",1]]&fields=["customer","base_grand_total"]&limit_page_length=1000');
    const data = await res.json();
    
    if (!data.data || data.data.length === 0) {
      console.warn("No Sales Invoice data found");
      return { labels: [], totals: [] };
    }

    // Aggregate totals per customer
    const customerTotals = {};
    data.data.forEach(inv => {
      if (!inv.customer || !inv.base_grand_total) return; // skip invalid entries
      if (!customerTotals[inv.customer]) customerTotals[inv.customer] = 0;
      customerTotals[inv.customer] += inv.base_grand_total;
    });

    // Convert object to array, sort by total descending, take top 10
    const sorted = Object.entries(customerTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels = sorted.map(item => item[0]);
    const totals = sorted.map(item => item[1]);

    return { labels, totals };

  } catch (err) {
    console.error("Error fetching top customers:", err);
    return { labels: [], totals: [] };
  }
}

async function renderTopCustomersChart() {
  const { labels, totals } = await fetchTopCustomers();

  if (labels.length === 0) {
    document.getElementById('topCustomersChart').insertAdjacentHTML('afterend', '<p style="text-align:center; color:red;">No data available</p>');
    return;
  }

  const ctx = document.getElementById('topCustomersChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar', // You can change to 'doughnut' if preferred
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Sales',
        data: totals,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { 
          beginAtZero: true,
          title: { display: true, text: 'Sales Amount' }
        },
        x: { 
          title: { display: true, text: 'Customer' },
          ticks: { maxRotation: 45, minRotation: 0 }
        }
      }
    }
  });
}

// Call the function to render the chart
renderTopCustomersChart();

    // Fetch company currency
    fetch('/api/resource/Company?fields=["default_currency"]&limit_page_length=1')
      .then(res => res.json())
      .then(data => {
        const symbols = {
          INR: "₹", USD: "$", EUR: "€", GBP: "£",
          QAR: "﷼", AED: "د.إ", SAR: "﷼", KWD: "د.ك", OMR: "﷼", AFN: "؋"
        };
        if (data.data && data.data.length > 0) {
          const code = data.data[0].default_currency;
          this.currencySymbol = symbols[code] || code;
        }
      })
      .catch(err => console.error("Error fetching company currency:", err));

    const currentYear = new Date().getFullYear();
fetch(
  `/api/resource/Sales%20Order?filters=[["docstatus","=",1],["transaction_date",">=","${currentYear}-01-01"],["transaction_date","<=","${currentYear}-12-31"]]&fields=["grand_total"]&limit_page_length=0`
)
  .then(res => res.json())
  .then(data => {
    let total = 0;
    data.data.forEach(order => {
      total += parseFloat(order.grand_total || 0);
    });
    this.annualSalesAmount = total;
  })
  .catch(err => console.error("Error fetching annual Sales Order amount:", err));


    // Fetch Sales Orders with status "To Deliver"
    fetch('/api/resource/Sales%20Order?filters=[["docstatus","=",1],["status","in",["To Deliver","To Deliver and Bill"]]]&fields=["name"]&limit_page_length=0')
      .then(res => res.json())
      .then(data => {
        // Count the number of sales orders
        this.totalSalesOrderToDeliverCount = data.data.length;
      })
      .catch(err => console.error("Error fetching 'To Deliver' Sales Order count:", err));


      // Fetch Sales Orders with status "To Bill"
      fetch('/api/resource/Sales%20Order?filters=[["docstatus","=",1],["status","in",["To Bill","To Deliver and Bill"]]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          // Count the number of sales orders
          this.totalSalesOrderToBillCount = data.data.length;
        })
        .catch(err => console.error("Error fetching 'To Bill' Sales Order count:", err));

       //---------------- Fetch all Customers and filter active ones in JS---------------------------------
    fetch('/api/resource/Customer?fields=["name","disabled"]&limit_page_length=0')
      .then(res => res.json())
      .then(data => {
        // Count only customers that are active (disabled = 0 or false)
        const activeCustomers = data.data.filter(customer=> customer.disabled === 0 || customer.disabled === false);
        this.activeCustomerCount = activeCustomers.length;
      })
      .catch(err => console.error("Error fetching active customer:", err));






  },
};
</script>

* Bottom Row (Calendar + Map side by side) */
/* .bottom-row {
  display: flex;
  gap: 20px;
  flex: 1;
}


.doughnut-card {
  width: 50%;
  height: 450px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column; 
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

#salesOrderChart {
  width: 80%;  
  height: 80%; 
}  */
/* Bottom Row */
.bottom-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* responsive stacking on smaller screens */
}


.doughnut-card {
  width: 50%;
  height: 450px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column; 
}
/* Chart Cards */
.chart-card {
  flex: 1;                  /* take equal width */
  min-width: 300px;         /* minimum size for small screens */
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;   /* stack heading + chart */
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
/* .card-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
} */

.chart-wrapper {
  flex: 1;                   /* occupy remaining space */
  display: flex;
  justify-content: center;    /* center chart horizontally */
  align-items: center;        /* center chart vertically */
}

.chart-wrapper canvas {
  max-width: 100%;
  max-height: 300px;          /* fixed max height for neatness */
}
#salesOrderChart {
  width: 80%;  
  height: 80%; 
}




<template>
  <div class="dashboard-container">

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- User Info -->
      <div class="user-info">
        <img :src="user.photo || defaultPhoto" alt="User Photo" class="user-photo" />
        <div class="user-name">{{ user.name || "Guest" }}</div>
      </div>
      <br>

      <div class="sidebar-heading">Masters & Reports</div>
      <div
        v-for="module in filteredModules"
        :key="module.name"
        class="sidebar-item"
        @click="navigateTo(module.url)"
      >
        {{ module.name }}
      </div>
      <br>

      <!-- Return Home Button -->
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
          <p><b>{{ totalStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</b></p>
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
      <!-- <div class="graph-row">
        <div class="graph-section">
          <h4>Stock Inflow vs Outflow</h4>
          <canvas id="stockFlowChart"></canvas>
        </div>

        <div class="graph-section">
          <h4>Purchase Receipt Trend</h4>
          <canvas id="purchaseReceiptTrendChart"></canvas>
        </div>

        <div class="graph-section">
          <h4>Delivery Trend</h4>
          <canvas id="deliveryTrendChart"></canvas>
        </div>
      </div> -->
      <!-- Charts -->
<!-- <div class="graph-row">
  
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
</div> -->

<!-- Charts -->
<div class="graph-row">
  <!-- Stock Inflow vs Outflow (Full width) -->
  <div class="graph-section full-width">
    <h4>Stock Inflow vs Outflow</h4>
    <canvas id="stockFlowChart"></canvas>
  </div>
</div>

<!-- Bottom row: Purchase Receipt Trend + Delivery Trend -->
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
        let totalToday = 0;
        todayData.data.forEach(bin => totalToday += (parseFloat(bin.actual_qty || 0) * parseFloat(bin.valuation_rate || 0)));
        this.totalStockValue = totalToday;

        // Yesterday approx
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isoDate = yesterday.toISOString().split("T")[0];

        const yesterdayRes = await fetch(`/api/resource/Bin?filters=[["modified","<","${isoDate}"]]&fields=["actual_qty","valuation_rate"]&limit_page_length=0`);
        const yesterdayData = await yesterdayRes.json();
        let totalYesterday = 0;
        yesterdayData.data.forEach(bin => totalYesterday += (parseFloat(bin.actual_qty || 0) * parseFloat(bin.valuation_rate || 0)));
        this.yesterdayStockValue = totalYesterday;

        this.stockChangePercent = totalYesterday > 0 ? ((totalToday - totalYesterday) / totalYesterday) * 100 : 0;
      } catch (err) {
        console.error("Error fetching stock value:", err);
      }
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
            { label: "Stock In", data: inflowData, backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 0.8 },
            { label: "Stock Out", data: outflowData, backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 0.8 }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Stock Inflow vs Outflow" } },
          scales: { y: { beginAtZero: true, title: { display: true, text: "Quantity" } }, x: { title: { display: true, text: "Month" } } }
        }
      });

      // try {
      //   // Purchase Receipts
      //   const prRes = await fetch('/api/resource/Purchase Receipt?fields=["name","posting_date"]&limit_page_length=1000');
      //   const prData = await prRes.json();
      //   for (let pr of prData.data) {
      //     const prDetail = await fetch(`/api/resource/Purchase Receipt/${pr.name}?fields=["items"]`).then(r => r.json());
      //     const month = new Date(pr.posting_date).getMonth();
      //     if (prDetail.data && prDetail.data.items) {
      //       inflowData[month] += prDetail.data.items.reduce((sum, i) => sum + (i.qty || 0), 0);
      //     }
      //   }

      //   // Delivery Notes
      //   const dnRes = await fetch('/api/resource/Delivery Note?fields=["name","posting_date"]&limit_page_length=1000');
      //   const dnData = await dnRes.json();
      //   for (let dn of dnData.data) {
      //     const dnDetail = await fetch(`/api/resource/Delivery Note/${dn.name}?fields=["items"]`).then(r => r.json());
      //     const month = new Date(dn.posting_date).getMonth();
      //     if (dnDetail.data && dnDetail.data.items) {
      //       outflowData[month] += dnDetail.data.items.reduce((sum, i) => sum + (i.qty || 0), 0);
      //     }
      //   }

      //   chart.data.datasets[0].data = inflowData;
      //   chart.data.datasets[1].data = outflowData;
      //   chart.update();

      // } catch (err) {
      //   console.error("Error fetching stock flow data:", err);
      // }

      async function fetchStockFlow(chart) {
  try {
    const inflowData = Array(12).fill(0);
    const outflowData = Array(12).fill(0);

    // Purchase Receipts (Inflow)
    const prRes = await fetch('/api/resource/Purchase Receipt?fields=["name","posting_date"]&limit_page_length=1000');
    const prData = await prRes.json();

    for (let pr of prData.data) {
      if (!pr.posting_date) continue;
      const month = new Date(pr.posting_date).getMonth();

      const prDetailRes = await fetch(`/api/resource/Purchase Receipt/${pr.name}?fields=["items"]`);
      const prDetail = await prDetailRes.json();
      const items = prDetail.data?.items || [];
      inflowData[month] += items.reduce((sum, i) => sum + (i.qty || 0), 0);
    }

    // Delivery Notes (Outflow)
    const dnRes = await fetch('/api/resource/Delivery Note?fields=["name","posting_date"]&limit_page_length=1000');
    const dnData = await dnRes.json();

    for (let dn of dnData.data) {
      if (!dn.posting_date) continue;
      const month = new Date(dn.posting_date).getMonth();

      const dnDetailRes = await fetch(`/api/resource/Delivery Note/${dn.name}?fields=["items"]`);
      const dnDetail = await dnDetailRes.json();
      const items = dnDetail.data?.items || [];
      outflowData[month] += items.reduce((sum, i) => sum + (i.qty || 0), 0);
    }

    // Update Chart
    chart.data.datasets[0].data = inflowData;
    chart.data.datasets[1].data = outflowData;
    chart.update();

  } catch (err) {
    console.error("Error fetching stock flow data:", err);
  }
}

    },

    async renderTrendChart(endpoint, canvasId, label, color) {
      const ctx = document.getElementById(canvasId).getContext("2d");
      const res = await fetch(`/api/resource/${endpoint}?fields=["posting_date","base_grand_total"]&limit_page_length=1000`);
      const data = await res.json();
      const labels = data.data.map(d => d.posting_date);
      const totals = data.data.map(d => d.base_grand_total);

      new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{ label, data: totals, borderColor: color, backgroundColor: `${color}33`, fill: true, tension: 0.3 }]
        },
        options: { responsive: true, plugins: { legend: { display: true } } }
      });
    },
  },

  mounted() {
    this.getCurrentUser();
    this.fetchTotalStockValue();
    this.fetchTotalActiveItems();
    this.fetchTotalWarehouses();

    this.renderStockFlowChart();
    this.renderTrendChart("Purchase Receipt", "purchaseReceiptTrendChart", "Purchase Receipt Amount", "blue");
    this.renderTrendChart("Delivery Note", "deliveryTrendChart", "Delivery Amount", "green");
  }
};
</script>