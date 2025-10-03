<!-- <template>
  <div class="page">
    <div class="logo-wrapper">
       <img src="/Craft Logo PNG (3) 1.png" alt="Logo" class="logo" />
      <h1 class="heading">Craft Interactive</h1>
      <button  class="home-btn" @click="goHomepage">Home-></button>
    </div>
  </div>
</template>


<script>
export default {
  name: "Frontpage",
  methods: {
    goHomepage() {
        console.log('3333333')
     
      this.$router.push({name:'Home'});
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #cbd5e1;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 400px; 
  height: auto;
}

.heading {
  position: absolute;
  top: 50%;            
  left: 50%;          
  transform: translate(-50%, -50%);
  font-size: 60px;     
  color:#1c283a;
  font-weight: bold;
  text-align: center;
  white-space: nowrap; 
  pointer-events: none;
  /* text-shadow: 2px 2px 6px rgba(0, 0, 0.2, 0.8); */
   text-shadow: 2px 2px 6px rgba(250, 249, 249, 0.8); 
 
}
.home-btn {

  margin-top: 250px;    
  padding: 10px 25px;
  font-size: 16px;
  font-weight:bold;
  color: #fff;
  background-color: #445165;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.home-btn:hover {
  background-color: #5e708a;
  transform: translateY(-5px);
}
</style>  


 -->
<template>
  <div class="front-page">
    <!-- Header / Navigation -->
    <header class="header">
      <div class="logo-text"></div>
      <nav class="nav-links">
        <button @click="goAbout" class="nav-button"><u>About</u></button>
      </nav>
    </header>

    <!-- Left side heading with two lines and subtitle -->
    <div class="left-heading-wrapper">
      <h1 class="left-heading">
        <span> Craft Interactive</span>
        <span>Technologies</span>
      </h1>
      <p class="left-subtitle"><u>BEST CONSULTANTS IN INDIA</u></p>
    </div>

    <!-- Right side logo -->
    <img src="/Craft Logo PNG (3) 1.png" alt="Logo" class="right-logo" />

    <!-- Bottom button -->
    <button @click="goHomepage" class="home-button">Go to Home-></button>
  </div>
</template>

<script>
export default {
  name: "Frontpage",
  methods: {
    goHomepage() {
      console.log('Navigating to Home');
      this.$router.push({ name: 'Home' });
    },
    goAbout() {
      window.open("https://www.craftinteractive.in", "_blank"); 
    }
  }
};
</script>

<style>
/* Existing styles kept as-is */

.front-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  background-image: url('/bk6.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  color: white;
  position: relative;
  padding: 40px;
  overflow: hidden;
}

/* Left-to-right shadow overlay */
.front-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(125, 129, 195, 0.7), rgba(0, 0, 0, 0));
  pointer-events: none;
  z-index: 1;
}

/* Header */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 100px;
  z-index: 3;
  background: rgba(97, 97, 98, 0.4); /* semi-transparent */
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-button {
 
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 18px;
  font-weight:400;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  transform: translateY(-2px);
}

/* Left side heading wrapper */
.left-heading-wrapper {
  position: absolute;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

/* Left side heading */
.left-heading {
  font-size: 100px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
  line-height: 1.0;
}

.left-heading span {
  display: block;
}

/* Subtitle under heading */
.left-subtitle {
  font-size: 20px;
  margin-top: 10px;
  margin-left: 20px;
  color: #ddd;
  text-shadow: 1px 1px 6px rgba(0,0,0,0.6);
}

/* Right logo */
.right-logo {
  position: absolute;
  right: 200px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 400px;
  z-index: 2;
}

/* Bottom button */
.home-button {
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
}

.home-button:hover {
  background-color: rgb(87, 131, 250);
  transform: translateY(-2px);
}
</style>