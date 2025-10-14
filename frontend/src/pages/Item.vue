<template>
  <div class="box">
        <h1 class="title-a">ITEM FORM</h1>

    <button @click="showForm = true" class="open-btn">
      Create Item Form
    </button>
     <button @click="goHome" class="cancel-home">Go Home</button>
     <button @click="viewitemlist">view</button>
    

  
    <div v-if="showForm" class="popup-overlay">
      <div class="popup-content">
        <h2 class="title-b"><u>Item Form</u></h2>

       
        <form @submit.prevent="submitForm">
          <label>Item Name:</label>
          <input v-model="itemName" type="text" required />

          <label>Item Code:</label>
          <input v-model="itemCode" type="text" required />
          <label>Unit of measure:</label>
          <input v-model="UOM" type="text" required />

          <div class="actions">
             <button class="cancel" type="button" @click="showForm = false">Cancel</button>
            <button  class="save" type="submit" >Save</button>
            
           
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- <script>
export default {
  name: "Item",
  data() {
    return {
      showForm: false,
      itemName: "",
      itemCode: "",
      UOM:""
    };
  },
  methods: {
    // submitForm() {
    //   alert(`Item Saved!\nName: ${this.itemName}\nCode: ${this.itemCode}\nUOM:${this.UOM}`);
    //   this.showForm = false; 
    // },
   

    
  goHome() {
    this.$router.push("/"); 

  },
  viewitemlist(){
    console.log('11111111')
    window.location.href='/app/item'
 
},
    submitForm() {
      console.log('2222222222')
      frappe.call({
        method: "frappe.client.insert",
        args: {
          doc: {
            doctype: "Item",
            item_name: this.itemName,
            item_code: this.itemCode,
            stock_uom: this.UOM,
          },
        },
        callback: (r) => {
          console.log('3333333333')
          if (r.message) {
            frappe.msgprint("Item created successfully!")
            this.showForm = false
            this.itemName = ""
            this.itemCode = ""
            this.UOM = ""
          }
        },
        error: (err) => {
          frappe.msgprint("Error creating item: " + err.message)
        },
      })
    },


  
  }


}
</script> -->




<script>
export default {
  name: "Item",
  data() {
    return {
      showForm: false,
      itemName: "",
      itemCode: "",
      UOM: "",
      loading: false,
    };
  },
  methods: {
    closeForm() {
      this.showForm = false;
    },

    goHome() {
      this.$router ? this.$router.push("/") : (window.location.href = "/");
    },

    viewitemlist() {
      console.log('aaaaaaaa')
      window.location.href = "/app/item" 
    },

    async submitForm() {
      if (!this.itemName || !this.itemCode || !this.UOM) {
        alert("Please fill all fields.");
        return;
      }

      this.loading = true;

      try {
        const res = await fetch("/api/resource/Item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Frappe-CSRF-Token": window.csrf_token || "",
          },
          credentials: "include",
          body: JSON.stringify({
            doctype: "Item",
            item_name: this.itemName,
            item_code: this.itemCode,
            stock_uom: this.UOM,
            item_group: "All Item Groups", 
            is_stock_item: 1,              
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Server error:", data);
          alert("Error creating item: " + (data.message || JSON.stringify(data)));
        } else {
          alert("Item created successfully!");
          this.resetForm();
        }
      } catch (err) {
        console.error("submitForm error:", err);
        alert("Failed: " + err.message);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.showForm = false;
      this.itemName = "";
      this.itemCode = "";
      this.UOM = "";
    },
  },
};
</script>



<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #cbd5e1;
  flex-direction: column;
}
.title-a{
    color:#1f2937; 
    text-align:center;
    font-size: xx-large;
    font-weight:600;
}
.title-b{
    color:#1f2937; 
    text-align:center;
    font-size:x-large;
    font-weight:600;
}
.open-btn {
 padding: 10px 20px;
  background-color: #6b7280; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top:10px;
}

.open-btn:hover {
  background-color: #9ca3af; 
}
.cancel-home {
  padding: 10px 20px;
  background-color: #a2abc4; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-left: 10px;
}

.cancel-home:hover {
  background-color: #b5bfdb;
}

.popup-overlay {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.popup-content {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label{
    color:#1f2937;
    font-size:16px;
    font-weight: 400;
}
label::after {
  content: " *";
  color: red;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
}
.save {
    font-size: 14px;
  background-color: #3c475c; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}

.save:hover {
  background-color:#546380; 
; 
}

.cancel{
  font-size: 14px;
  background-color: #a2abc4; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  
}
.cancel:hover { 
    background-color:#b5bfdb;
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
      <p> <b>{{ totalActiveItems }}</b></p>
    </div>

      <div class="card" @click="navigateTo('/app/bin')">
        <h6>TOTAL STOCK VALUE</h6>
        <p><b>{{ totalStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</b></p>
        <br>
          <!-- % change vs yesterday -->
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
       
       <div class="graph">
        <div class="graph-section" style="width:50%;height: 300px;">
          <h4><b>Stock Inflow vs Outflow</b></h4>
          <canvas id="stockFlowChart"></canvas>
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
      totalActiveItems: 0,
      totalStockValue: 0,
      yesterdayStockValue: 0,
      stockChangePercent: null,
      totalWarehouses: 0,
      dnNotBilled: 0,
      prPending: 0,
      prApproved: 0,
      modules: [
        { name: "Item",url: "/app/item" },
        { name: "Item Group", url: "/app/item-group" },
        { name: "Product Bundle",  url: "/app/product-bundle" },
        { name: "Material Request" , url: "/app/material-request" },
        { name: "Stock Entry", url: "/app/stock-entry" },
        { name: "Delivery Note",url: "/app/delivery-note" },
        { name: "Purchase Receipt",url: "/app/purchase-receipt"},
        { name: "Pick List",url: "/app/pick-list" },
        { name: "Delivery Trip", url: "/app/delivery-trip" },
        { name: "Stock Ledger", url: "/app/query-report/Stock%20Ledger" },
        { name: "Stock Balance", url: "/app/query-report/Stock%20Balance "},
        { name: "Warehouse Wise Stock Balance",url: "/app/report/Warehouse%20Wise%20Stock%20Balance" },
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
    async fetchTotalStockValue() {
  try {
    // Fetch all bins with their quantities and valuation rates
    const response = await fetch(
      '/api/resource/Bin?fields=["actual_qty","valuation_rate"]&limit_page_length=0'
    );
    const data = await response.json();

    // Calculate total = Σ (actual_qty × valuation_rate)
    let total = 0;
    data.data.forEach(bin => {
      const qty = parseFloat(bin.actual_qty || 0);
      const rate = parseFloat(bin.valuation_rate || 0);
      total += qty * rate;
    });

    this.totalStockValue = total;
  } catch (err) {
    console.error("Error fetching total stock value:", err);
  }
},
async fetchTotalStockValue() {
  try {
    // Fetch all current bins (today)
    const response = await fetch(
      '/api/resource/Bin?fields=["actual_qty","valuation_rate","modified"]&limit_page_length=0'
    );
    const data = await response.json();

    let totalToday = 0;
    data.data.forEach(bin => {
      const qty = parseFloat(bin.actual_qty || 0);
      const rate = parseFloat(bin.valuation_rate || 0);
      totalToday += qty * rate;
    });

    this.totalStockValue = totalToday;

    // Estimate yesterday's stock value
    // (You can refine this if you store daily snapshots)
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const isoDate = yesterdayDate.toISOString().split("T")[0];

    // Fetch all bins modified before yesterday (approximate yesterday snapshot)
    const responseYesterday = await fetch(
      `/api/resource/Bin?filters=[["modified","<","${isoDate}"]]&fields=["actual_qty","valuation_rate"]&limit_page_length=0`
    );
    const dataYesterday = await responseYesterday.json();

    let totalYesterday = 0;
    dataYesterday.data.forEach(bin => {
      const qty = parseFloat(bin.actual_qty || 0);
      const rate = parseFloat(bin.valuation_rate || 0);
      totalYesterday += qty * rate;
    });

    this.yesterdayStockValue = totalYesterday;

    // Calculate % change
    if (totalYesterday > 0) {
      this.stockChangePercent = ((totalToday - totalYesterday) / totalYesterday) * 100;
    } else {
      this.stockChangePercent = 0;
    }
  } catch (err) {
    console.error("Error fetching total stock value:", err);
  }
},



  },
  mounted() {
    this.getCurrentUser();
    this.fetchTotalStockValue();



async function renderStockFlowChart() {
  const ctx = document.getElementById("stockFlowChart").getContext("2d");

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const inflowData = Array(12).fill(0); 
  const outflowData = Array(12).fill(0); 

  const stockChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Stock In",
          data: inflowData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 0.8
        },
        {
          label: "Stock Out",
          data: outflowData,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Stock Inflow vs Outflow" }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Quantity" } },
        x: { title: { display: true, text: "Month" } }
      }
    }
  });

  try {
    // Fetch Purchase Receipts (Stock In)
    const prResponse = await fetch('/api/resource/Purchase Receipt?fields=["name","posting_date"]&limit_page_length=1000');
    const prResult = await prResponse.json();

    for (let pr of prResult.data) {
      // Fetch child table (items) for each Purchase Receipt
      const prDetail = await fetch(`/api/resource/Purchase Receipt/${pr.name}?fields=["items"]`).then(r => r.json());
      const month = new Date(pr.posting_date).getMonth();
      if (prDetail.data && prDetail.data.items) {
        inflowData[month] += prDetail.data.items.reduce((sum, item) => sum + (item.qty || 0), 0);
      }
    }

    // Fetch Delivery Notes (Stock Out)
    const dnResponse = await fetch('/api/resource/Delivery Note?fields=["name","posting_date"]&limit_page_length=1000');
    const dnResult = await dnResponse.json();

    for (let dn of dnResult.data) {
      // Fetch child table (items) for each Delivery Note
      const dnDetail = await fetch(`/api/resource/Delivery Note/${dn.name}?fields=["items"]`).then(r => r.json());
      const month = new Date(dn.posting_date).getMonth();
      if (dnDetail.data && dnDetail.data.items) {
        outflowData[month] += dnDetail.data.items.reduce((sum, item) => sum + (item.qty || 0), 0);
      }
    }

    stockChart.data.datasets[0].data = inflowData;
    stockChart.data.datasets[1].data = outflowData;
    stockChart.update();

  } catch (err) {
    console.error("Error fetching ERPNext stock data:", err);
  }
}

// Run the function
renderStockFlowChart();




 // Fetch Total Active Items
fetch('/api/resource/Item?filters=[["disabled","=",0]]&fields=["name"]&limit_page_length=0')
  .then(res => res.json())
  .then(data => {
    this.totalActiveItems = data.data.length;
  })
  .catch(err => console.error("Error fetching active items:", err));
    // Fetch total warehouses directly in mounted
    fetch('/api/resource/Warehouse?fields=["name"]&limit_page_length=0')
      .then(res => res.json())
      .then(data => {
        this.totalWarehouses = data.data.length;
      })
      .catch(err => {
        console.error("Error fetching total warehouses:", err);
      });



  
  },
};
</script>




