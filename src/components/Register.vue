<!-- src/components/Register.vue -->
<template>
  <div class="register-form">
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <input type="password" v-model="confirmPassword" placeholder="Confirm your password" required />
      </div>
      <button type="submit" class="submit-button">Register</button>
      <!-- Show success or error messages -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <p class="switch-link">
      Already have an account?
      <router-link to="/login">Log In</router-link>
    </p>
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
    const successMessage = ref("");

    const register = async () => {
      errorMessage.value = "";
      successMessage.value = "";
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match";
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        console.log("User registered:", userCredential.user);
        successMessage.value = "You have successfully registered!";
        // Optionally, you can redirect to login after a delay:
        // setTimeout(() => { router.push('/login') }, 2000);
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return { email, password, confirmPassword, errorMessage, successMessage, register };
  },
};
</script>

<style scoped>
.register-form {
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

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
