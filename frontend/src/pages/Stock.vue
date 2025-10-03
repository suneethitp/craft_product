
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
        <h4><b>Items Available</b></h4>
        <p>Total items :{{ itemCount }}</p>
        <p class="down">Outstock items <b>{{ outOfStockItems }}</b></p>
      </div>

        <div class="card" @click="navigateTo('/app/stock-entry')">
          <h4><b>Stock Entries</b></h4> 
          <p class="up">Approved: <b>{{ stockApproved }}</b></p>
          <p class="down">Pending: <b>{{ stockPending }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/delivery-note')">
          <h4><b>Delivery Notes</b></h4>
          <p class="up">Billed: <b>{{ dnBilled }}</b></p>
           <p class="down">Not Billed: <b>{{ dnNotBilled }}</b></p>
        </div>

       <div class="card" @click="navigateTo('/app/purchase-receipt')">
          <h4><b>Purchase Receipts</b></h4>
          <p class="down">Pending: <b>{{ prPending }}</b></p>
          <p class="up">Approved: <b>{{ prApproved }}</b></p>
        </div>
      </div>
       
       <div class="graph">
        <div class="graph-section" style="width:50%;height: 300px;">
          <h4><b>Stock Inflow vs Outflow</b></h4>
          <canvas id="stockFlowChart"></canvas>
        </div>
      </div>
      <!-- Bottom Section (Calendar + Map) -->
      <div class="bottom-row">
        <!-- Calendar -->
        <div class="calendar-card">
          <h4><b>Calendar</b></h4>
          <div id="calendar"></div>
        </div>

        <!-- Real-Time Map -->
        <div class="realtime-card">
          <h4>Real-Time Map</h4>
          <div id="map"></div>
          <div class="world-clocks">
            <div>USA (NY): <span id="usa-time"></span></div>
            <div>UK: <span id="uk-time"></span></div>
            <div>UAE: <span id="uae-time"></span></div>
            <div>India: <span id="india-time"></span></div>
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
       itemCount: 0,
       outOfStockItems: 0,
       stockPending: 0,
       stockApproved: 0,
      dnBilled: 0,
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

  },
  mounted() {
    this.getCurrentUser();
    const ctx = document.getElementById("stockFlowChart").getContext("2d");

  // Example dummy data (replace with ERP fetch)
  const inflowData = [120, 150, 100, 180, 200, 170];  // Purchase Receipts or Stock In
  const outflowData = [90, 130, 80, 160, 190, 150];   // Delivery Notes or Stock Out
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Inflow",
          data: inflowData,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        },
        {
          label: "Outflow",
          data: outflowData,
          backgroundColor: "rgba(255, 99, 132, 0.6)", // Red
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1
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

    // // FullCalendar init
    const calendarEl = document.getElementById("calendar");
    const calendar = new window.FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "100",
      events: [
        // { title: "", date: "2025-10-05" },
        // { title: "", date: "2025-10-12" },
        // { title: "", date: "2025-10-18" },

      ],
    });
    calendar.render();



    // ---------------Initialize map------------------------------
const map = L.map("map", { zoomControl: true }).setView([20, 20], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Live User marker (random movement)
const liveMarker = L.marker([20, 77]).addTo(map).bindPopup("Live User");

setInterval(() => {
  const lat = 20 + Math.random() * 5;
  const lng = 77 + Math.random() * 5;
  liveMarker.setLatLng([lat, lng]);
}, 3000);

// World Clock Data
const countries = [
  
  { name: "USA (New York)", coords: [40.7128, -74.0060], tz: "America/New_York", elId: "usa-time" },
  { name: "UK", coords: [51.5074, -0.1278], tz: "Europe/London", elId: "uk-time" },
  { name: "UAE", coords: [24.4539, 54.3773], tz: "Asia/Dubai", elId: "uae-time" },
  { name: "India", coords: [20.5937, 78.9629], tz: "Asia/Kolkata", elId: "india-time" }
];

// Add markers
const countryMarkers = countries.map(c => {
  const time = new Date().toLocaleTimeString("en-US", { timeZone: c.tz });
  // Set initial clock
  const el = document.getElementById(c.elId);
  if (el) el.innerText = time;

  return L.marker(c.coords)
    .addTo(map)
    .bindPopup(`${c.name}: ${time}`);
});

// Update clocks and marker popups every second
setInterval(() => {
  countryMarkers.forEach((marker, i) => {
    const c = countries[i];
    const time = new Date().toLocaleTimeString("en-US", { timeZone: c.tz });
    marker.setPopupContent(`${c.name}: ${time}`);
    const el = document.getElementById(c.elId);
    if (el) el.innerText = time;
  });
}, 1000);




  // / Fetch all Item records
    fetch('/api/resource/Item?fields=["name"]&limit_page_length=100')
      .then(res => res.json())
      .then(data => {
        // Count of items
        this.itemCount = data.data.length;
      })
      .catch(err => console.error("Error fetching Items:", err));
  // Fetch all Out of Stock Items
      fetch('/api/resource/Item?filters=[["stock_quantity","<=",0]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          // Count of out-of-stock items
          this.outOfStockItems = data.data.length;
        })
        .catch(err => console.error("Error fetching Out of Stock Items:", err));

  // Fetch Pending Stock Entries
      fetch('/api/resource/Stock%20Entry?filters=[["docstatus","=",0]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          this.stockPending = data.data.length;
        })
        .catch(err => console.error("Error fetching pending Stock Entries:", err));

  // Fetch Approved Stock Entries
      fetch('/api/resource/Stock%20Entry?filters=[["docstatus","=",1]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          this.stockApproved = data.data.length;
        })
        .catch(err => console.error("Error fetching approved Stock Entries:", err));
  // Fetch Not Billed Delivery Notes
      fetch('/api/resource/Delivery%20Note?filters=[["per_billed","<",100]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          this.dnNotBilled = data.data.length;
        })
        .catch(err => console.error("Error fetching not billed Delivery Notes:", err));

  // Fetch Fully Billed Delivery Notes
      fetch('/api/resource/Delivery%20Note?filters=[["per_billed","=",100]]&fields=["name"]&limit_page_length=0')
        .then(res => res.json())
        .then(data => {
          this.dnBilled = data.data.length;
        })
        .catch(err => console.error("Error fetching billed Delivery Notes:", err));
// Fetch Pending Purchase Receipts (Draft)
  fetch('/api/resource/Purchase%20Receipt?filters=[["docstatus","=",0]]&fields=["name"]&limit_page_length=0')
    .then(res => res.json())
    .then(data => {
      this.prPending = data.data.length;
    })
    .catch(err => console.error("Error fetching pending Purchase Receipts:", err));

  // Fetch Approved Purchase Receipts (Submitted)
  fetch('/api/resource/Purchase%20Receipt?filters=[["docstatus","=",1]]&fields=["name"]&limit_page_length=0')
    .then(res => res.json())
    .then(data => {
      this.prApproved = data.data.length;
    })
    .catch(err => console.error("Error fetching approved Purchase Receipts:", err));

  
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

.card h4 {
  margin-bottom: 10px;
   font-size: large;
}
.card p {
  font-size: 18px;
  margin-bottom: 5px;
}
.card .up {
  color: #16a34a;
}
.card .down {
  color: #dc2626;
}

/* Graph Section */
.graph-section {
  width: 100% !important;
    height:500px !important; 
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
#stockFlowChart{
  width: 100% !important;

}

/* Bottom Row (Calendar + Map side by side) */
.bottom-row {
  display: flex;
  gap: 20px;
  flex: 1;
}

.calendar-card,
.realtime-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

#calendar {
  flex: 1;
  height: 100%;
  min-height: 300px; 
}

/* World clocks styling */
.world-clocks {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  font-weight: bold;
  font-size: 12px;
}
.world-clocks div {
  padding: 5px 10px;
  border-radius: 6px;
}

#map {
  flex: 1;
  border-radius: 8px;
  height: 300px;
  min-height: 250px;
}
</style>
