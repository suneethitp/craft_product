<template>
  <div class="quality-page">
     <h2 class="quality-heading">
      <img src="/control-system.png" alt="quality Icon" class="heading-icon" />
   Quality
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
  name: "Quality",
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
.quality-page { 
    display: flex; 
    flex-direction:
    column; align-items: center;
     justify-content: flex-start;
      min-height: 100vh; 
      background-color: #cbd5e1; 
      padding-top: 30px; 
    } 
.quality-page h2 { 
        font-size: 36px; 
        color: #1c283a;
        font-weight: 600; 
        margin-bottom: 30px; 
        text-align: center;
        max-width: 1400px; 
        width: 100%;
        text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8); 

     }

.quality-heading {
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