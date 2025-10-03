<!-- <template>
  <div class="buying-page">
    <h2 class="buying-heading">
      <img src="/check-out.png" alt="buying Icon" class="heading-icon" />
       Buying
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
export default {
  name: "Accounting",
  data() {
    return {
   
      shortcuts: [
        { name: "Material Request",route: "/app/material-request" },
        { name: "Purchase Order",  route: "/app/purchase-order" },
        { name: "Purchase Invoice",  route: "/app/purchase-invoice" },
        { name: "Request for Quotation" , route: "/app/request-for-quotation" },
        { name: "Supplier Quotation", route: "/app/supplier-quotation" },
        
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
},
  

};
</script>


<style>
.buying-page { 
    display: flex; 
    flex-direction:
    column; align-items: center;
     justify-content: flex-start;
      min-height: 100vh; 
      background-color: #cbd5e1; 
      padding-top: 30px; 
    } 
.buying-page h2 { 
        font-size: 36px; 
        color: #1c283a;
        font-weight: 600; 
        margin-bottom: 30px; 
        text-align: center;
        max-width: 1400px; 
        width: 100%;
        text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8); 

     }


.buying-heading {
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
  width: 550px;          
  height: 550px;          
  overflow-y: auto;      
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


</style> -->
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
          <div class="card"  @click="navigateTo('/app/material-request')">
          <h4><b>Material Requests</b></h4>
          <p class="down">Pending: <b>{{ materialRequestPending }}</b></p>
          <p>Ready for Transfer: <b>{{ materialRequestReady }}</b></p>
        </div>

        <div class="card"  @click="navigateTo('/app/purchase-order')">
          <h4><b>Purchase Orders</b></h4>
          <p>Total: <b>{{ purchaseOrderCount }}</b></p>
          <p class="up">Received: <b>{{ purchaseOrderReceived }}</b></p>
        </div>

      <div class="card"  @click="navigateTo('/app/purchase-invoice')">
          <h4><b>Purchase Invoices</b></h4>
          <p>Total: <b>{{ purchaseInvoiceCount }}</b></p>
          <p class="down">Overdue: <b>{{ purchaseInvoiceOverdue }}</b></p>
        </div>

       <div class="card"  @click="navigateTo('/app/request-for-quotation')">
        <h4><b>Request for Quotation</b></h4>
        <p class="up">Approved: <b>{{ rfqApprovedCount }}</b></p>
      </div>
      </div>
     <div class="graph">
        <div class="graph-section">
          <h4><b>Purchase Order Trend</b></h4>
          <canvas id="poTrendChart"></canvas>
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
      materialRequestPending: 0,
      materialRequestReady: 0,     
      purchaseOrderCount: 0,
      purchaseOrderReceived: 0,
      purchaseInvoiceCount: 0,
      purchaseInvoiceOverdue: 0,
      rfqApprovedCount: 0,
      modules: [
        { name: "Material Request", url: "/app/material-request"  },
        { name:  "Purchase Order", url:  "/app/purchase-order" },
        { name: "Purchase Invoice", url: "/app/purchase-order" },
        { name: "Request for Quotation" , url: "/app/request-for-quotation" },
        { name:  "Supplier Quotation", url:"/app/supplier-quotation"},
        
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
    // ---------- Purchase Order Trend -------------
const ctx = document.getElementById("poTrendChart").getContext("2d");

// Example future POs per month
const futurePOData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [{
    label: " Purchase Orders Trend",
    data: [5, 8, 10, 7, 12, 9, 6, 11, 14, 8, 10, 7], // Dummy values
    // backgroundColor: "rgba(54, 162, 235, 0.5)",
    borderColor: "rgba(54, 162, 235, 1)",
    borderWidth: 1,
    fill: true,
    tension: 0.4
  }]
};

new Chart(ctx, {
  type: "line",
  data: futurePOData,
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Future Purchase Order Trend" }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of POs" } },
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



  // ---------- Fetch Pending Material Requests -------------
  fetch(`/api/resource/Material%20Request?filters=[["status","=","Pending"]]&fields=["name"]&limit_page_length=0`)
    .then(res => res.json())
    .then(data => {
      this.materialRequestPending = data.data.length;
    })
    .catch(err => console.error("Error fetching pending Material Requests:", err));

  // ---------- Fetch Ready for Transfer Material Requests -------------
  fetch(`/api/resource/Material%20Request?filters=[["status","=","Ready for Transfer"]]&fields=["name"]&limit_page_length=0`)
    .then(res => res.json())
    .then(data => {
      this.materialRequestReady = data.data.length;
    })
    .catch(err => console.error("Error fetching ready Material Requests:", err));
// ----------- Fetch Total Purchase Orders -----------
    fetch("/api/resource/Purchase%20Order?limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.purchaseOrderCount = data.data.length;
      })
      .catch(err => console.error("Error fetching Purchase Orders:", err));

    // ----------- Fetch Received Purchase Orders -----------
    fetch(`/api/resource/Purchase%20Order?filters=[["status","=","Completed"]]&fields=["name"]&limit_page_length=0`)
      .then(res => res.json())
      .then(data => {
        this.purchaseOrderReceived = data.data.length;
      })
      .catch(err => console.error("Error fetching Received Purchase Orders:", err));

// ----------- Fetch Total Purchase Invoices -----------
      fetch("/api/resource/Purchase%20Invoice?limit_page_length=0")
        .then(res => res.json())
        .then(data => {
          this.purchaseInvoiceCount = data.data.length;
        })
        .catch(err => console.error("Error fetching Purchase Invoices:", err));

      // ----------- Fetch Overdue Purchase Invoices -----------
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      fetch(`/api/resource/Purchase%20Invoice?filters=[["due_date","<","${today}"],["outstanding_amount",">",0]]&fields=["name"]&limit_page_length=0`)
        .then(res => res.json())
        .then(data => {
          this.purchaseInvoiceOverdue = data.data.length;
        })
        .catch(err => console.error("Error fetching overdue Purchase Invoices:", err));
// ----------- Fetch Approved RFQs -----------
      fetch(`/api/resource/Request%20for%20Quotation?filters=[["status","=","Approved"]]&fields=["name"]&limit_page_length=0`)
        .then(res => res.json())
        .then(data => {
          this.rfqApprovedCount = data.data.length;
        })
        .catch(err => console.error("Error fetching Approved RFQs:", err));
        
 


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
