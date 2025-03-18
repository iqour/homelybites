<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <label>Email:</label>
        <input v-model="email" type="email" required />
  
        <label>Password:</label>
        <input v-model="password" type="password" required />
  
        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
  
      <!-- Navigation links -->
      <p>
        Forgot your password? <router-link to="/password-reset">Reset here</router-link>
      </p>
      <p>
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth } from "../firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
    name: "Login",
    setup() {
      const email = ref("");
      const password = ref("");
      const errorMessage = ref("");
  
      const loginUser = async () => {
        errorMessage.value = "";
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );
          console.log("User logged in:", userCredential.user);
          // Optionally navigate to another page or show success message
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      return { email, password, errorMessage, loginUser };
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  