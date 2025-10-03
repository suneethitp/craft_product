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
      <br>
      <br>

            <!-- Return Home Button -->
          <div class="return-home">
            <button @click="navigateHome" class="home-btn">Back to Home</button>
          </div>
 
    </div>

    <!-- Main Dashboard -->
    <div class="main-content">
      <br>
      <!-- Cards Row -->
      <div class="cards-row-a">
        <div class="card" @click="navigateTo('/app/account')">
          <h4><b>Total Accounts</b></h4>
          <p><b>{{ accountsCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/sales-invoice')">
          <h4><b>Sales Invoices</b></h4>
          <p>Total: {{ salesInvoiceCount }}</p>
          <span class="down">Overdue: {{ overdueSalesInvoiceCount }}</span>
        </div>

        <div class="card" @click="navigateTo('/app/payment-entry')">
          <h4><b>Payment Received</b></h4>
          <p class="up">Total: {{ paymentReceivedTotal | formatCurrency }}</p>
          <p class="down">Due Total: {{ formatCurrency(paymentReceiveDueTotal) }}</p>
        </div>

        <div class="card" @click="navigateTo('/app/payment-entry')">
          <h4><b>Payment Made</b></h4>
          <p class="up">Total: {{ formatCurrency(paymentPaidTotal) }}</p>
          <p class="down">Due Total: {{ formatCurrency(paymentPayDueTotal) }}</p>
        </div>
      </div>
       <div class="cards-row-b">
           <div class="card" @click="navigateTo('/app/company')">
              <h4><b>Companies</b></h4>
              <p><b>{{ companyCount }}</b></p>
              <p>&nbsp;</p>
            </div>
             <div class="card" @click="navigateTo('/app/purchase-invoice')">
              <h4><b>Purchase Invoices</b></h4>
              <p> {{ purchaseInvoiceCount }}</p>
              <p>&nbsp;</p>
            </div>
              <div class="card" @click="navigateTo('/app/journal-entry')">
                <h4><b>Journal Entries</b></h4>
                <p> {{ journalEntryCount }}</p>
                <p>&nbsp;</p>
              </div>

              <div class="card" @click="navigateTo('/app/query-report/Accounts%20Receivable')">
                <h4><b>Accounts Receivable</b></h4>
                <p> {{ accountsReceivableCount }}</p>
                <p>&nbsp;</p>
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
      accountsCount: 0,
      salesInvoiceCount: 0,      
      overdueSalesInvoiceCount: 0,
      paymentReceivedTotal: 0,
      paymentReceiveDueTotal: 0,
      paymentPaidTotal: 0,
      paymentPayDueTotal: 0, 
      companyCount: 0,
      purchaseInvoiceCount: 0,
      journalEntryCount: 0,
      accountsReceivableCount: 0,
      modules: [
        { name: "Chart of Accounts", url: "/app/account" },
        { name: "Company", url: "/app/company" },
        { name: "Sales Invoice", url: "/app/sales-invoice" },
        { name: "Journal Entry", url: "/app/journal-entry" },
        { name: "Payment Entry", url: "/app/payment-entry" },
        { name: "Trial Balance", url: "/app/query-report/Trial%20Balance" },
        { name: "General Ledger", url: "/app/query-report/General%20Ledger" },
        { name: "Purchase Invoice", url: "/app/purchase-invoice" },
        {
          name: "Accounts Receivable",
          url: "/app/query-report/Accounts%20Receivable",
        },
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



// -----------count of Accounts-------------
  fetch("/api/resource/Account?fields=['name']")
  .then(res => res.json())
  .then(data => {
    this.accountsCount = data.data.length; // still 20 if paginated
  });

// Better: use count API
    fetch("/api/resource/Account?limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.accountsCount = data.data.length; 
      });
      // -----------------Fetch total Sales Invoices----------------------
    fetch("/api/resource/Sales%20Invoice?fields=['name']&limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.salesInvoiceCount = data.data.length;
      })
      .catch(err => console.error("Error fetching Sales Invoices:", err));

    // -----------Fetch overdue Sales Invoices------------------------
  
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    fetch(`/api/resource/Sales%20Invoice?filters=[["due_date","<","${today}"],["outstanding_amount",">",0]]&fields=["name"]&limit_page_length=0`)
      .then(res => res.json())
      .then(data => {
        this.overdueSalesInvoiceCount = data.data.length;
  })
  .catch(err => console.error("Error fetching overdue Sales Invoices:", err));

  // ---------Fetch total Payment Entry amount for type 'Receive'---------------------
   fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Receive"]]`)
  .then(res => res.json())
  .then(data => {
    // Sum all 'paid_amount' fields
    const total = data.data.reduce((sum, entry) => sum + (entry.paid_amount || 0), 0);
    this.paymentReceivedTotal = total;
  })
  .catch(err => console.error("Error fetching Payment Entries:", err));
  //-------- Fetch total Payment Entry due amount for type 'Receive'-----------

   fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Receive"],["outstanding_amount",">",0]]&fields=["outstanding_amount"]&limit_page_length=0`)
  .then(res => res.json())
  .then(data => {
    const totalDue = data.data.reduce((sum, entry) => sum + (entry.outstanding_amount || 0), 0);
    this.paymentReceiveDueTotal = totalDue;
  })
  .catch(err => console.error("Error fetching Payment Entries due (Receive):", err));


  // -----------------Fetch total Payment Entry amount for type 'Pay'------------------
   fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Pay"]]`)
  .then(res => res.json())
  .then(data => {
    const total = data.data.reduce((sum, entry) => sum + (entry.paid_amount || 0), 0);
    this.paymentPaidTotal = total;
  })
  .catch(err => console.error("Error fetching Payment Entries (Pay):", err));
  // ------Fetch total Payment Entry due amount for type 'Pay'------
fetch(`/api/resource/Payment%20Entry?filters=[["payment_type","=","Pay"],["outstanding_amount",">",0]]&fields=["outstanding_amount"]&limit_page_length=0`)
  .then(res => res.json())
  .then(data => {
    const totalDue = data.data.reduce((sum, entry) => sum + (entry.outstanding_amount || 0), 0);
    this.paymentPayDueTotal = totalDue;
  })
  .catch(err => console.error("Error fetching Payment Entries due (Pay):", err));


  //------------ Companies-----------------------
fetch("/api/resource/Company?limit_page_length=0")
  .then(res => res.json())
  .then(data => {
    this.companyCount = data.data.length;
  });
  // Purchase Invoices
fetch("/api/resource/Purchase%20Invoice?limit_page_length=0")
  .then(res => res.json())
  .then(data => {
    this.purchaseInvoiceCount = data.data.length;
  });

// Journal Entries
fetch("/api/resource/Journal%20Entry?limit_page_length=0")
  .then(res => res.json())
  .then(data => {
    this.journalEntryCount = data.data.length;
  });

// Accounts Receivable (report rows count)
fetch("/api/method/frappe.desk.query_report.run?report_name=Accounts%20Receivable")
  .then(res => res.json())
  .then(data => {
    this.accountsReceivableCount = data.message.result ? data.message.result.length : 0;
  });


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
.graph-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
#glGraph {
  width: 100%;
  height: 250px;
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
