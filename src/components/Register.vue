<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" v-model="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth } from "../firebase";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  
  export default {
    name: "Register",
    setup() {
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const errorMessage = ref("");
  
      const register = async () => {
        errorMessage.value = "";
        if (password.value !== confirmPassword.value) {
          errorMessage.value = "Passwords do not match";
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          console.log("User registered:", userCredential.user);
          // Optionally, redirect or show a success message
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      return { email, password, confirmPassword, errorMessage, register };
    }
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  