<template>
  <div class="page">
    <div class="registration-form">
      <h1 class="heading">Registration Form</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="form.name" placeholder="Enter your name" required/>
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required/>
        </div>
       
        <div class="form-group">
          <label for="dob">Date of Birth:</label>
          <input type="date" id="dob" v-model="form.dob" required />
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="form.password" placeholder="Enter your password" required/>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="Confirm your password" required />
        </div>
        <div class="button">
        <button class="btn-a" @click="cancel">Cancel</button>
        <button  class="btn-b" type="submit">Register</button>
</div>
      </form>

    </div>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
    
      form: {
        name: "",
        email: "",
        dob: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    submitForm() {
      if (this.form.password !== this.form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      alert(`Registration Successful!\nName: ${this.form.name}\nEmail: ${this.form.email}\nDOB: ${this.form.dob}`);
      this.form.name = "";
      this.form.email = "";
      this.form.dob = "";
      this.form.password = "";
      this.form.confirmPassword = "";
    
      
    },
    
    cancel() {
      this.$router.push("/"); 
    }
  },
};

</script>

<style scoped>
.page {
  background-color: #d1d5db; 
  min-height: 100vh;           
  margin: 0;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.registration-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.heading {
  text-align: center;
  color:#1f2937;
  text-decoration: underline;
  font-size: 28px;
  font-weight: bold;
}
.body{
    text-align: justify;
}
.form-group {
  margin-bottom: 15px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
.button{
  display: flex;
  justify-content: space-between; 
  margin-top: 15px;
}

.btn-a{
  width: 25%;
  padding: 10px;
  background-color: #a2abc4;
  color: white;
  font-weight: 400;
  font-size: larger;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}
.btn-a:hover {
  background-color: #b1bbd7;
}
.btn-b{
  width: 25%;
  padding: 10px;
  background-color:#3c475c;
  color:white;
  font-weight: 400;
  font-size: larger;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}
.btn-b:hover {
  background-color: #6583d5;
}
</style>

