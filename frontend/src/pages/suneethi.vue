<template>
  <div class="outer-box">
    <h1 style="color: #1f2937;">{{ msg }}</h1>
    <div class="btn-container">
      <h2 style="color: #1f2937; font-size: larger;font-weight:500; letter-spacing:0.025em;">
        {{ message }}
      </h2>
      <button  class="btn-a" @click="changeMsg" >Click Me</button>
      <p >Go To Items</p>
      <button class="btn-d" @click="goItem">Click</button>
    </div>

   
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <p>{{ popupMessage }}</p>
         <button class="btn-c" @click="goHome">No</button>
        <button class="btn-b" @click="closePopup" >yes</button>
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const msg = ref("Hello,Friends...")
const message = ref("Fill this Form")
const showPopup = ref(false)
const popupMessage = ref("")

function changeMsg() {
  msg.value = "Welcome !"
  message.value = "Thank You <3..."
  popupMessage.value = "Are You sure?!"
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
  router.push({ name: 'Form' })
}
function goHome() {
  showPopup.value = false
  router.push('/')       
}
function goItem() {
  router.push({ name: 'Item' });
}

</script>

<style scoped>
.outer-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #cbd5e1;
  flex-direction: column;

} 
.outer-box h1{
  text-align: center;
  font-size: xx-large;
  font-weight: bolder;
  padding: 10px 20px;
}

.btn-container {
  text-align: center;

}
.btn-container p {
  padding: 10px 20px;
  color:#1f2937;
  font-size: larger;
  margin-top: 20px;
  font-weight: 500;
  letter-spacing:0.025em;
}
.btn-a {
  padding: 10px 20px;
  background-color: #6b7280; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.btn-a:hover {
  background-color: #9ca3af; 
}
.btn-a:active {
  background-color: #fef2f2; 
}


.btn-b {
  background-color: #1cbd57; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-b:hover {
  background-color: #2df975; 
}


.btn-c {
  background-color: #ef4444; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  margin: 0 10px;
}
.btn-c:hover { background-color: #f87171; }

.btn-d {
  padding: 10px 20px;
  background-color: #6b7280; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top:10px;
}
.btn-d:hover {
  background-color: #9ca3af; 
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-box {
  background: #f3f4f6;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.2);
}

.popup-box p {
  font-size: 18px;
  margin-bottom: 20px;
 
}

</style> 
