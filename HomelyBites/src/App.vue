<template>
  <div class="container">
    <Sidebar @reset-home="resetHomePage"/>

    <div class="main-content">
      <router-view ref="routerView"/>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
  export default{
    name: 'App',
    components : {
      Sidebar,
    },
    methods: {
      resetHomePage() {
        const homeComponent = this.$refs.routerView?.$children?.find(
          (child) => child.$options.name == "Home",
        );
        if (homeComponent) {
          homeComponent.resetPage();
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

.main-content {
  flex: 1;
  margin-left: 170px;
  padding: 20px;
  background: #f8f0e5;
  min-height: 100vh;
}
</style>