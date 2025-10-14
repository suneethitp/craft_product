<template>
  <div class="outer-box">
    <img
      src="/Craft Logo PNG (3) 1.png"
      alt=""
      aria-hidden="true"
      class="bg-logo"
    />

    <div class="search-wrapper">
      <img src="/search.png" alt="Search" class="search-icon" />
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search modules..."
        class="search-box"
      />
    </div>

    <div class="modules-container">
      <div
        v-for="(module, index) in filteredModules"
        :key="index"
        class="module-wrapper"
      >
        <router-link :to="module.route" class="module-link">
          <div class="module-card">
            <img :src="module.icon" :alt="module.name" class="module-icon" />
          </div>
          <span class="module-name">{{ module.name }}</span>
        </router-link>
      </div>
    </div>
         <!-- Return  Button -->
          <div class="return-fp">
            <button @click="navigateFp" class="fp-btn">Back </button>
          </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      searchQuery: "",
      modules: [
        { name: "Accounting", icon: "/accounting.png", route: "/accounting" },
        { name: "Buying", icon: "/check-out.png", route: "/buying" },
        { name: "Selling", icon: "/selling.png", route: "/selling" },
        { name: "Stock", icon: "/in-stock.png", route: "/stock" },
        { name: "CRM", icon: "/management.png",route:"/crm" },
        { name: "Users", icon: "/team.png", route: "/users" },
      ],
    };
  },
  computed: {
    filteredModules() {
      return this.modules.filter((module) =>
        module.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    navigateFp() {
      this.$router.push("/");
    },
  },
};
</script>


<style scoped>
/* Container and background */
.outer-box {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
  overflow: hidden;

  /* keep only the page background here (not the logo) */
  background-image: url('/bk6.webp');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

/* subtle gradient + inner shadow applied to the background (behind content) */
.outer-box::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to right,
    rgba(183, 186, 249, 0.35),
    rgba(0, 0, 0, 0.05)
  );
  box-shadow: inset 0 60px 120px rgba(0, 0, 0, 0.45);
}

.bg-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: min(400px, 40vw);
  height: auto;
  object-fit: contain;
  z-index: 1;
  pointer-events: none;
  opacity: 0.95;

  /* drop shadow around the logo */
  filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.5));
}


/* If you prefer the logo centered behind content, uncomment these lines and adjust */
/*
.bg-logo {
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
*/

/* ensure content sits above the overlay and logo */
.search-wrapper,
.modules-container {
  position: relative;
  z-index: 3;
}

/* Search styles (unchanged except z-index handled above) */
.search-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
  margin-bottom: 30px;
}
.search-box {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px  #8dd8fb;
  background-color: rgba(226, 232, 240, 0.85);
  border-radius: 10px;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}
.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
  object-fit: contain;
}

/* Modules container — removed box-shadow per your request */
.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 25px;
  padding: clamp(20px, 5vw, 40px);
  background-color: rgba(226, 232, 240, 0.85);
  border-radius: 15px;
  width: 95%;
  max-width: 1200px;
  justify-items: center;

  /* NO box-shadow here (removed) */
}

/* Module card styles (unchanged) */
.module-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.module-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 100%;
  max-width: 140px;
}
.module-card {
  width: 100px;
  height: 100px;
  background: #fafafa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* subtle elevated feel for the small card itself */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
}
.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
.module-icon {
  width: 55px;
  height: 55px;
  object-fit: contain;
}
.module-name {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1c283a;
  text-align: center;
  line-height: 1.2;
  max-width: 100px;
  overflow-wrap: anywhere;
}
.return-fp {
  position: fixed;   /* always at bottom */
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;        /* ensure it stays on top */
}

.fp-btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-color: rgb(64, 9, 246);
  border: none;
  border-radius: 8px;
  z-index: 2;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  color: white;
}
.fp-btn:hover {
  background-color: rgb(87, 131, 250);
  transform: translateY(-2px);
}

</style>
