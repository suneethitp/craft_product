<template>
  <div class="box">
        <h1 class="title-a">ITEM FORM</h1>

    <button @click="showForm = true" class="open-btn">
      Create Item Form
    </button>
     <button @click="goHome" class="cancel-home">Go Home</button>
     <button @click="viewitemlist">view</button>
    

  
    <div v-if="showForm" class="popup-overlay">
      <div class="popup-content">
        <h2 class="title-b"><u>Item Form</u></h2>

       
        <form @submit.prevent="submitForm">
          <label>Item Name:</label>
          <input v-model="itemName" type="text" required />

          <label>Item Code:</label>
          <input v-model="itemCode" type="text" required />
          <label>Unit of measure:</label>
          <input v-model="UOM" type="text" required />

          <div class="actions">
             <button class="cancel" type="button" @click="showForm = false">Cancel</button>
            <button  class="save" type="submit" >Save</button>
            
           
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- <script>
export default {
  name: "Item",
  data() {
    return {
      showForm: false,
      itemName: "",
      itemCode: "",
      UOM:""
    };
  },
  methods: {
    // submitForm() {
    //   alert(`Item Saved!\nName: ${this.itemName}\nCode: ${this.itemCode}\nUOM:${this.UOM}`);
    //   this.showForm = false; 
    // },
   

    
  goHome() {
    this.$router.push("/"); 

  },
  viewitemlist(){
    console.log('11111111')
    window.location.href='/app/item'
 
},
    submitForm() {
      console.log('2222222222')
      frappe.call({
        method: "frappe.client.insert",
        args: {
          doc: {
            doctype: "Item",
            item_name: this.itemName,
            item_code: this.itemCode,
            stock_uom: this.UOM,
          },
        },
        callback: (r) => {
          console.log('3333333333')
          if (r.message) {
            frappe.msgprint("Item created successfully!")
            this.showForm = false
            this.itemName = ""
            this.itemCode = ""
            this.UOM = ""
          }
        },
        error: (err) => {
          frappe.msgprint("Error creating item: " + err.message)
        },
      })
    },


  
  }


}
</script> -->




<script>
export default {
  name: "Item",
  data() {
    return {
      showForm: false,
      itemName: "",
      itemCode: "",
      UOM: "",
      loading: false,
    };
  },
  methods: {
    closeForm() {
      this.showForm = false;
    },

    goHome() {
      this.$router ? this.$router.push("/") : (window.location.href = "/");
    },

    viewitemlist() {
      console.log('aaaaaaaa')
      window.location.href = "/app/item" 
    },

    async submitForm() {
      if (!this.itemName || !this.itemCode || !this.UOM) {
        alert("Please fill all fields.");
        return;
      }

      this.loading = true;

      try {
        const res = await fetch("/api/resource/Item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Frappe-CSRF-Token": window.csrf_token || "",
          },
          credentials: "include",
          body: JSON.stringify({
            doctype: "Item",
            item_name: this.itemName,
            item_code: this.itemCode,
            stock_uom: this.UOM,
            item_group: "All Item Groups", 
            is_stock_item: 1,              
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Server error:", data);
          alert("Error creating item: " + (data.message || JSON.stringify(data)));
        } else {
          alert("Item created successfully!");
          this.resetForm();
        }
      } catch (err) {
        console.error("submitForm error:", err);
        alert("Failed: " + err.message);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.showForm = false;
      this.itemName = "";
      this.itemCode = "";
      this.UOM = "";
    },
  },
};
</script>



<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #cbd5e1;
  flex-direction: column;
}
.title-a{
    color:#1f2937; 
    text-align:center;
    font-size: xx-large;
    font-weight:600;
}
.title-b{
    color:#1f2937; 
    text-align:center;
    font-size:x-large;
    font-weight:600;
}
.open-btn {
 padding: 10px 20px;
  background-color: #6b7280; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top:10px;
}

.open-btn:hover {
  background-color: #9ca3af; 
}
.cancel-home {
  padding: 10px 20px;
  background-color: #a2abc4; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-left: 10px;
}

.cancel-home:hover {
  background-color: #b5bfdb;
}

.popup-overlay {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.popup-content {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label{
    color:#1f2937;
    font-size:16px;
    font-weight: 400;
}
label::after {
  content: " *";
  color: red;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
}
.save {
    font-size: 14px;
  background-color: #3c475c; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}

.save:hover {
  background-color:#546380; 
; 
}

.cancel{
  font-size: 14px;
  background-color: #a2abc4; 
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  
}
.cancel:hover { 
    background-color:#b5bfdb;
 }

</style>




