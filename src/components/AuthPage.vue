<!-- src/components/AuthPage.vue -->
<template>
  <div class="auth-page">
    <!-- Form Wrapper for centering -->
    <div class="form-wrapper">
      <!-- Centered Form Container -->
      <div class="form-container">
        <h2>Welcome to Homely Bites</h2>
        <!-- This router-view will load your Login/Register/PasswordReset pages -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthPage",
};
</script>

<style scoped>
/* Center the entire content in the viewport */
.auth-page {
  display: flex;
  height: 100vh;
  background-color: #fab289; /* Overall background */
  padding: 20px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}

/* Wrapper to help center the form container */
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Form container retains its dimensions (80% width with a max-width, 90% height) */
.form-container {
  width: 80%;
  max-width: 800px;
  height: 90%;
  background-color: #ffe0b3;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  margin-bottom: 20px;
}
</style>