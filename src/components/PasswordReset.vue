<!-- src/components/PasswordReset.vue -->
<template>
  <div class="password-reset-form">
    <h2>Reset Password</h2>
    <form @submit.prevent="sendResetEmail">
      <div class="form-group">
        <label>Email:</label>
        <input
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <button type="submit" class="submit-button">Send Reset Email</button>
      <!-- Always show the generic success message if set -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
    <p class="switch-link">
      Remember your password?
      <router-link to="/login">Log In</router-link>
    </p>
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

    const sendResetEmail = async () => {
      // Clear any previous message.
      successMessage.value = "";
      // Normalize the email.
      const trimmedEmail = email.value.trim().toLowerCase();

      try {
        // Try to send the password reset email.
        await sendPasswordResetEmail(auth, trimmedEmail);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        // We don't show the error to the user.
      }
      // Always display the generic message.
      successMessage.value =
        "If this email is registered, a password reset email has been sent. Please check your inbox.";
    };

    return { email, successMessage, sendResetEmail };
  },
};
</script>

<style scoped>
.password-reset-form {
  width: 100%;
  text-align: center;
}

.form-group {
  margin: 0 auto 15px;
  width: 70%;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 50%;
  background-color: #ff5c28;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #e14a16;
}

.switch-link {
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>
