<!-- src/App.vue -->
<template>
  <AuthPage />
</template>

<script>
import AuthPage from "./components/AuthPage.vue";

export default {
  name: "App",
  components: { AuthPage },
};
</script>

<style>
body {
  background-color: #fab289; /* overall background */
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>
