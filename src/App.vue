<!-- src/App.vue -->
<template>
  <!-- This is where Vue Router will render
       either /login, /register, /password-reset,
       or any of your other view components -->
  <router-view/>
</template>

<script>
export default {
  name: "App",
  // No need to import AuthPage here—router will handle it
};
</script>

<style>
/* Global page styles stay the same */
body {
  background-color: #fab289; /* overall background */
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>
