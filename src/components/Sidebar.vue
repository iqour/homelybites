<template>
  <div class="white-sidebar">
    <img src="@/assets/home_icon.svg"      alt="Home"        @click="$router.push('/home')" />
    <img src="@/assets/cart_icon.svg"      alt="Cart"        @click="$router.push('/cart')" />
    <img src="@/assets/stack_icon.svg"     alt="Categories"  @click="$router.push('/search')" />
    <img src="@/assets/food_icon.svg"      alt="Review"      @click="$router.push('/review')" />
    <img src="@/assets/comment_icon.svg"   alt="Ratings"     @click="$router.push('/ratings-review')" />
    <img src="@/assets/all_icon.svg"       alt="History"     @click="$router.push('/order-history')" />
    <img src="@/assets/book_icon.svg"      alt="Favorites"   @click="$router.push('/favorite-chefs')" />
    <img src="@/assets/heart_icon.svg"     alt="Analytics"   @click="$router.push('/purchase-analytics')" />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.white-sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 60px;
  height: calc(100vh - 40px);
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.white-sidebar img {
  width: 24px;
  height: auto;
  cursor: pointer;
}
</style>
