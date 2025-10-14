
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
      <br><br>

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
        <div class="card" @click="navigateTo('/app/lead')">
          <h6>NEW LEAD (LAST 1 MONTH)</h6>
          <p><b>{{ newLeadsLastMonth }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/opportunity')">
          <h6>NEW OPPORTUNITY (LAST 1 MONTH)</h6>
          <p><b>{{ newOpportunitiesLastMonth }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/opportunity')">
          <h6>WON OPPORTUNITY (LAST 1 MONTH)</h6>
          <p><b>{{ wonOpportunitiesLastMonth }}</b></p>
        </div>

        <div class="card" @click="navigateTo('/app/opportunity')">
          <h6>OPEN OPPORTUNITY</h6>
          <p><b>{{ openOpportunities }}</b></p>
        </div>
      </div>

      <!--Incoming Leads Chart -->
      <div class="chart-section">
        <h4><b>Incoming Leads </b></h4>
        <canvas id="incomingLeadsChart"></canvas>
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
      modules: [
        { name: "Lead", url: "/app/lead" },
        { name: "Customer", url: "/app/customer" },
        { name: "Opportunity", url: "/app/opportunity" },
        { name: "Communication", url: "/app/communication" },
        { name: "Contract", url: "/app/contract" },
        { name: "Newsletter", url: "/app/newsletter" },
        { name: "Sales Person", url: "/app/sales-person" },
        { name: "Sales Stage", url: "/app/sales-stage" },
        { name: "Appointment", url: "/app/appointment" },
      ],
      newLeadsLastMonth: 0,
      newOpportunitiesLastMonth: 0,
      wonOpportunitiesLastMonth: 0,
      openOpportunities: 0,
    };
  },
  computed: {
    filteredModules() {
      if (!this.search) return this.modules;
      const searchLower = this.search.toLowerCase();
      return this.modules.filter((m) => m.name.toLowerCase().includes(searchLower));
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

//----------------------------------incoming leads chart-----------------------------------------------------------
    async renderIncomingLeadsChart() {
  const ctx = document.getElementById("incomingLeadsChart").getContext("2d");

  try {
    const res = await fetch(`/api/resource/Lead?fields=["creation"]&limit_page_length=0`);
    const data = await res.json();

    // Prepare the last 12 weeks (labels and counts)
    const labels = [];
    const counts = [];
    const today = new Date();

    // Generate week start dates for past 12 weeks
    for (let i = 11; i >= 0; i--) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - i * 7);
      const formatted = startOfWeek.toISOString().split("T")[0]; 
      labels.push(formatted);
      counts.push(0);
    }

    // Count leads per week
    data.data.forEach((lead) => {
      const leadDate = new Date(lead.creation);
      for (let i = 0; i < labels.length; i++) {
        const weekStart = new Date(labels[i]);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        if (leadDate >= weekStart && leadDate < weekEnd) {
          counts[i]++;
          break;
        }
      }
    });

    // Destroy old chart if it exists
    if (this.incomingLeadsChartInstance) {
      this.incomingLeadsChartInstance.destroy();
    }

    // Create chart
    this.incomingLeadsChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Incoming Leads",
            data: counts,
            borderColor: "#FFB5C0",
            backgroundColor: "rgba(250,80,83, 0.15)",
            borderWidth: 2.5,
            tension: 0.4,
            pointBackgroundColor: "#FFB5C0",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
          maintainAspectRatio: false, 
         devicePixelRatio: 2, 
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              boxWidth: 12,
              usePointStyle: true,
            },
          },
          tooltip: {
            enabled: true,
            mode: "nearest",
            intersect: false,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} Incoming Leads`,
            },
          },
        },
        scales: {
          x: {
            title: { display: false },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
              callback: function (val, index) {
                // Format date label (DD-MM-YYYY)
                const d = new Date(labels[index]);
                return `${String(d.getDate()).padStart(2, "0")}-${String(
                  d.getMonth() + 1
                ).padStart(2, "0")}-${d.getFullYear()}`;
              },
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: "#eee" },
          },
        },
      },
    });
  } catch (err) {
    console.error("Error rendering incoming leads chart:", err);
  }
}

  },

  mounted() {
    this.getCurrentUser();
    this.renderIncomingLeadsChart();//  Render the chart

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

 .chart-section {
  margin: 30px 0;
  padding: 40px;
  background: #f8f9ff;
  border-radius: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  height: 600px;
  width: 100%;              
  display: flex;            
  flex-direction: column;
}

.chart-section {
  margin: 30px 0;
  padding: 60px;
  background: #f8f9ff;
  border-radius: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  height: 600px;
  width: 100%;               
  display: flex;            
  flex-direction: column;
}

.chart-section canvas {
  flex: 1;                    
  width: 100% !important;     

}

.chart-section h4 {
  margin-bottom: 15px;
  font-weight: 600;
  text-align: left;
}

.chart-section h4 {
  margin-bottom: 15px;
  font-weight: 600;
  text-align: left;
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
.card, .graph-section, .chart-section{
  animation: fadeUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* Optional: stagger cards */
.cards-row-a .card:nth-child(1) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(2) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(3) { animation-delay: 0.1s; }
.cards-row-a .card:nth-child(4) { animation-delay: 0.1s; }

.chart-section { animation-delay: 0.2s; }


</style>
