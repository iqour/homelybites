<template>
    <div>
      <h2>Reset Password</h2>
      <form @submit.prevent="sendResetEmail">
        <label>Email:</label>
        <input v-model="email" type="email" required />
  
        <button type="submit">Send Reset Email</button>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth } from "../firebase";
  import { sendPasswordResetEmail } from "firebase/auth";
  
  export default {
    name: "PasswordReset",
    setup() {
      const email = ref("");
      const successMessage = ref("");
      const errorMessage = ref("");
  
      const sendResetEmail = async () => {
        successMessage.value = "";
        errorMessage.value = "";
  
        try {
          await sendPasswordResetEmail(auth, email.value);
          successMessage.value = "Password reset email sent. Check your inbox.";
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      return { email, successMessage, errorMessage, sendResetEmail };
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  