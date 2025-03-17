<template>
  <div id = "container">
    <div id ="nav">
    <router-link to = "/">Home</router-link> |
    <router-link to = "/test"> Test</router-link>
    <router-link to = "/kitchen"> Kitchen</router-link>
    </div> 
    <router-view></router-view>
  </div>
  

</template>

<script>
  export default{
    name: 'App'
  }
</script>

<style>
#container {
  display: flex;
  flex-direction: column;
  text-align: center;
}
  #nav{
    padding : 10px
  }
  #nav a {
    font-weight : bold;
    color: black;
  }
  #nav a.router-link-exact-active{
    color: red;
  }
</style>