<template>
  <div class="login-page">
    <!-- gradient overlay -->
    <div class="overlay"></div>

    <!-- fade‑in the form card -->
    <transition name="fade">
      <div class="login-card">
        <h2>Welcome Back</h2>
        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="••••••••" required />
          </div>

          <p v-if="message" class="login-message">{{ message }}</p>

          <button type="submit" class="submit-button">Log In</button>
        </form>

        <div class="links">
          <router-link to="/password-reset">Forgot password?</router-link>
          <router-link to="/register">Create account</router-link>
        </div>
      </div>
    </transition>
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
        await signInWithEmailAndPassword(auth, email.value, password.value);
        message.value = "Success! Redirecting…";
        setTimeout(() => router.push("/home"), 1500);
      } catch (err) {
        message.value = err.code === "auth/user-not-found"
          ? "No account found."
          : err.message;
      }
    };

    return { email, password, message, loginUser };
  },
};
</script>

<style scoped>
/* Entire page with bg image + overlay */
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("@/assets/login-bg.jpg") center/cover no-repeat;
  overflow: hidden;
}
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgba(255, 92, 40, 0.6),
    rgba(250, 178, 137, 0.6)
  );
}

/* Fade‑in animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Card container */
.login-card {
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

/* Headline */
.login-card h2 {
  margin-bottom: 1.5rem;
  color: #ff5c28;
}

/* Form fields */
.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
}
.form-group input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
}
.form-group input:focus {
  border-color: #ff5c28;
  outline: none;
}

/* Message text */
.login-message {
  margin: 1rem 0;
  color: #333;
  font-size: 0.9rem;
}

/* Button */
.submit-button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  background-color: #ff5c28;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #e14a16;
}

/* Bottom links */
.links {
  margin-top: 1.2rem;
  display: flex;
  justify-content: space-between;
}
.links a {
  font-size: 0.85rem;
  color: #555;
  text-decoration: underline;
}
.links a:hover {
  color: #ff5c28;
}
</style>
