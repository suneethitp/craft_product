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
        <div class="card" @click="navigateTo('/app/quotation')">
          <h4><b>Quotations</b></h4>
          <p class="down">Pending: <b>{{ quotationPending }}</b></p>
          <p class="up">Approved: <b>{{ quotationApproved }}</b></p>
        </div>

    
          <div class="card" @click="navigateTo('/app/customer')">
            <h4><b>Customers</b></h4>
            <p> <b>{{ customerCount }}</b></p>
          </div>
        

        <div class="card" @click="navigateTo('/app/sales-partner')">
          <h4><b>Top Sales Person</b></h4>
          <p>Name: <b>{{ topSalesPerson.name }}</b></p>
          <p>Sales: <b>{{ topSalesPerson.sales }}</b></p>
          <p class="up">Target: <b>{{ topSalesPerson.target }}</b></p>
        </div>


      <div class="card" @click="navigateTo('/app/sales-person')">
        <h4><b>Sales person</b></h4>
        <p>Total Members: <b>{{ teamMemberCount }}</b></p>
        <p  >Total Sales: <b>{{ teamSales }}</b></p>
        <p>Conversion Rate: <b>{{ conversionRate }}%</b></p>
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
      quotationPending: 0,
      quotationApproved: 0,
      customerCount: 0,
      topSalesPerson: {
        name: "Loading...",
        sales: 0,
        target: 0
      },
      teamMemberCount: 0,
      teamSales: 0,
      conversionRate: 0,
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
// // ---------- Sales Order Trend -------------

const ctx = document.getElementById("soTrendChart").getContext("2d");

const futureSOData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [{
    label: "Sales Orders Trend",
    data: [10, 15, 12, 18, 20, 17, 14, 19, 22, 16, 18, 20], // Dummy values
    // backgroundColor: "rgba(54, 162, 235, 0.5)",
    borderColor: "rgba(54, 162, 235, 1)",
    borderWidth: 1,
    fill: true,
    tension: 0.4
  }]
};

new Chart(ctx, {
  type: "line",
  data:  futureSOData,
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Sales Order Trend" }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of SOs" } },
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



  fetch(
      `/api/resource/Quotation?filters=[["status","=","Draft"]]&fields=["name"]&limit_page_length=0`
    )
      .then((res) => res.json())
      .then((data) => {
        this.quotationPending = data.data.length;
      })
      .catch((err) =>
        console.error("Error fetching pending Quotations:", err)
      );

    // ---------- Fetch Approved Quotations -------------
    fetch(
      `/api/resource/Quotation?filters=[["status","=","Approved"]]&fields=["name"]&limit_page_length=0`
    )
      .then((res) => res.json())
      .then((data) => {
        this.quotationApproved = data.data.length;
      })
      .catch((err) =>
        console.error("Error fetching approved Quotations:", err)
      );

          // ---------- Fetch Total Customers -------------
    fetch(`/api/resource/Customer?fields=["name"]&limit_page_length=0`)
      .then((res) => res.json())
      .then((data) => {
        this.customerCount = data.data.length;
      })
      .catch((err) => console.error("Error fetching Customers:", err));
    

    // Example: fetch total sales per salesperson from Sales Invoice
    fetch('/api/resource/Sales%20Invoice?fields=["owner","grand_total"]&limit_page_length=100')
      .then(res => res.json())
      .then(data => {
        const salesData = {};

        // Sum sales per owner
        data.data.forEach(invoice => {
          const owner = invoice.owner;
          const total = parseFloat(invoice.grand_total) || 0;
          if (!salesData[owner]) salesData[owner] = 0;
          salesData[owner] += total;
        });

        // Find top salesperson
        let topPerson = { name: "", sales: 0 };
        for (let [owner, total] of Object.entries(salesData)) {
          if (total > topPerson.sales) {
            topPerson.name = owner;
            topPerson.sales = total;
          }
        }

        // Example: assume target is 100,000
        topPerson.target = 100000;

        this.topSalesPerson = topPerson;
      })
      .catch(err => console.error("Error fetching Sales Invoices:", err));

       // ---------- Fetch Team Members ----------
    fetch('/api/resource/Sales%20Person?fields=["name"]&limit_page_length=0')
      .then(res => res.json())
      .then(data => {
        this.teamMemberCount = data.data.length;
      })
      .catch(err => console.error("Error fetching Sales Team members:", err));

    // ---------- Fetch Total Team Sales ----------
    fetch('/api/resource/Sales%20Invoice?fields=["owner","grand_total"]&limit_page_length=100')
      .then(res => res.json())
      .then(data => {
        let totalSales = 0;
        data.data.forEach(invoice => {
          totalSales += parseFloat(invoice.grand_total) || 0;
        });
        this.teamSales = totalSales;
      })
      .catch(err => console.error("Error fetching Sales Invoices:", err));

    // ---------- Fetch Conversion Rate ----------
    // Conversion Rate = Quotations Converted / Total Quotations * 100
    fetch('/api/resource/Quotation?fields=["status"]&limit_page_length=0')
      .then(res => res.json())
      .then(data => {
        const totalQuotations = data.data.length;
        const converted = data.data.filter(q => q.status === "Ordered").length; // ERPNext sets status "Ordered" after converted to sales order
        this.conversionRate = totalQuotations > 0 ? ((converted / totalQuotations) * 100).toFixed(1) : 0;
      })
      .catch(err => console.error("Error fetching Quotations:", err));

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
  background-color:white;
  border-radius: 8px;
  padding: 20px;
  min-width:100%;
  
}

#soTrendChart {
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
