
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
       <div class="card" @click="navigateTo('/app/role')">
          <h6>TOTAL ROLES</h6>
          <p><b>{{ rolesCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/user')">
          <h6>TOTAL USERS</h6>
          <p>  <b>{{ userCount }}</b></p> 
        </div>

        <div class="card" @click="navigateTo('/app/module-profile')">
          <h6>TOTAL MODULE PROFILE</h6>
          <p ><b>{{ moduleProfileCount }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/role-profile')">
          <h6>TOTAL ROLE PROFILE</h6>
          <p > <b>{{ roleProfileCount }}</b></p>
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
      rolesCount: 0, 
      userCount: 0,   
      moduleProfileCount: 0,
      mostUsedModuleProfile: ""  ,
      roleProfileCount:0,
      usersWithRoleProfile: 0 ,
      modules: [
        { name: "User", url: "/app/user" },
        { name: "Role", url: "/app/role" },
        { name: "Role Profile", url: "/app/role-profile" },
        { name: "Module Profile", url: "/app/module-profile" },
        { name: "Permission Manager", url: "/app/permission-manager" },
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



// ----------- Count of Roles -------------

  fetch("/api/resource/Role?fields=['name']")
  .then(res => res.json())
  .then(data => {
    this.rolesCount = data.data.length; // still 20 if paginated
  });

// Better: use count API
    fetch("/api/resource/Role?limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.rolesCount = data.data.length; 
      });
//----------------------count of User-----------------------

  fetch("/api/resource/User?fields=['name']")
  .then(res => res.json())
  .then(data => {
    this.userCount = data.data.length; // still 20 if paginated
  });

// Better: use count API
    fetch("/api/resource/User?limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.userCount = data.data.length; 
      });
     // Fetch total Module Profiles
      fetch("/api/resource/Module Profile?limit_page_length=0")
        .then(res => res.json())
        .then(data => {
          this.moduleProfileCount = data.data.length;

          // Now find the most used module profile
          let profileUsagePromises = data.data.map(profile => {
            // Count number of users assigned to this module profile
            return fetch(`/api/resource/User?fields=['name']&filters=[["module_profile","=","${profile.name}"]]`)
              .then(res => res.json())
              .then(usersData => ({ 
                profileName: profile.name, 
                count: usersData.data.length 
              }));
          });

          // Wait for all counts
          Promise.all(profileUsagePromises).then(results => {
            // Sort by count descending
            results.sort((a, b) => b.count - a.count);
            if(results.length > 0) {
              this.mostUsedModuleProfile = results[0].profileName;
            }
          });
        })
        .catch(err => console.error(err));



    // -----------Fetch  total and used role profile------------------------
  
  fetch("/api/resource/Role Profile?fields=['name']")
  .then(res => res.json())
  .then(data => {
    this.roleProfileCount = data.data.length; // still 20 if paginated
  });

// Better: use count API
    fetch("/api/resource/Role Profile?limit_page_length=0")
      .then(res => res.json())
      .then(data => {
        this.roleProfileCount = data.data.length; 
      });
      
// // Count users that have a role profile assigned
//       fetch("/api/resource/User?fields=['name','role_profile']")
//         .then(res => res.json())
//         .then(data => {
//           // Filter users with a role_profile assigned
//           this.usersWithRoleProfile = data.data.filter(u => u.role_profile).length;
//         })
//         .catch(err => console.error(err));

// fetch('/api/resource/User?fields=["name","role-profile"]')
//   .then(res => res.json())
//   .then(data => {
//     console.log(data); // Check actual response
//     this.usersWithRoleProfile = data.data.filter(u => u.role_profile).length;
//   })
//   .catch(err => console.error(err));




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
  margin-top:250px;
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

.graph-section { animation-delay: 0.2s; }
.calendar-card { animation-delay: 0.3s; }
.realtime-card { animation-delay: 0.3s; }

</style>
