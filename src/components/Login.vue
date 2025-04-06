<!-- src/components/Login.vue -->
<template>
  <div class="login-form">
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" placeholder="Enter your password" />
      </div>
      <!-- Display message for login status -->
      <p v-if="message" class="login-message">{{ message }}</p>
      <!-- Forgot Password Link -->
      <p class="forgot-link">
        <router-link to="/password-reset">Forgot Password?</router-link>
      </p>
      <!-- Submit Button -->
      <button type="submit" class="submit-button">Log In</button>
    </form>
    <p class="switch-link">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const message = ref("");
    const router = useRouter();

    const loginUser = async () => {
  message.value = "";
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Logged in user:", userCredential.user);
    message.value = "Redirecting to Home Page...";
    setTimeout(() => {
      router.push("/home"); // update to your actual home route if necessary
    }, 2000);
  } catch (error) {
    // Check for invalid credential error and other known error codes
    if (error.code === "auth/invalid-credential") {
      message.value = "Your credentials are invalid. Please check your email and password.";
    } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      message.value = "Invalid email or password";
    } else {
      message.value = error.message;
    }
  }
};


    return { email, password, loginUser, message };
  },
};
</script>

<style scoped>
.login-form {
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

.forgot-link {
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}

.login-message {
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;
  text-align: center;
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
</style>
