<template>
    <div class="sidebar">
      <ul>
        <li 
          v-for="item in menuItems"
          :key="item.page"
          @click="goToPage(item.page)"
          :class="{ active: isActive(item.page) }">
          <i :class="item.icon"></i> {{  item.label }}
        </li>
      </ul>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        menuItems: [
          { page: 'home', label: 'Home', icon: 'icon-home' },
          { page: 'cart', label: 'Cart', icon: 'icon-cart' },
          { page: 'order-history', label: 'History', icon: 'icon-history' },
          { page: 'manage-kitchen', label: 'My Kitchen', icon: 'icon-kitchen' },
          { page: 'chat', label: 'Chat', icon: 'icon-chat' },
          { page: 'purchase-analytics', label: 'Analytics', icon: 'icon-analytics' },
          { page: 'ratings-review', label: 'Reviews', icon: 'icon-reviews' },
          { page: 'favorite-chefs', label: 'My Favorite', icon: 'icon-favorite' },
        ]
      };
    },
    methods: {
      goToPage(page) {
        if (page == 'home') {
          if (this.$route.path == '/') {
            this.$emit('reset-home');
          } else {
            this.$router.push('/');
          }
        } else {
          this.$router.push(`/${page}`);
        }
      },
      isActive(page) {
        return (page == 'home' && this.$route.path == '/') || this.$route.path == `/${page}`;
      }
    }
  };
</script>
  
<style scoped>
.sidebar {
  position: fixed;
  left: 20px;
  margin-top: 80px;
  width: 120px;
  background: white;
  color: black;
  padding: 15px;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.sidebar li:hover {
  background: lightgray;
  border-radius: 5px;
}

.sidebar li.active {
  color: rgb(249, 123, 74);
  font-weight: bold;
}
</style>
  