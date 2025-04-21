<!-- src/App.vue -->
<template>
  <div class="container">
    <!-- Sidebar only on non‑auth paths -->
    <Sidebar
      v-if="showSidebar"
      @reset-home="resetHomePage"
    />

    <div
      class="main-content"
      :class="{ 'with-sidebar': showSidebar }"
    >
      <router-view ref="routerView" />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "App",
  components: { Sidebar },

  computed: {
    // Hide sidebar on these auth routes:
    showSidebar() {
      const noSidebarPaths = ["/login", "/register", "/password-reset"];
      return !noSidebarPaths.includes(this.$route.path);
    },
  },

  methods: {
    resetHomePage() {
      const home = this.$refs.routerView?.$children?.find(
        (c) => c.$options.name === "Home"
      );
      if (home && typeof home.resetPage === "function") {
        home.resetPage();
      }
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #f8f0e5;
}

/* Base styles for both auth & main pages */
.main-content {
  flex: 1;
  padding: 20px;
  background: #f8f0e5;
  min-height: 100vh;
  transition: margin-left 0.2s;
}

/* Only when sidebar is shown do we push it over */
.main-content.with-sidebar {
  margin-left: 100px; /* 60px sidebar + 2×20px gutters */
}
</style>
