// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Auth components (relative to this file)
import Login         from '../components/Login.vue'
import Register      from '../components/Register.vue'
import PasswordReset from '../components/PasswordReset.vue'

// Main views
import Home             from '../views/Home.vue'
import SearchResults    from '../views/SearchResults.vue'
import ReviewPage       from '../views/ReviewPage.vue'
import WrittenReviews   from '../views/WrittenReviews.vue'
import Cart             from '../views/Cart.vue'
import OrderHistory     from '../views/OrderHistory.vue'
import Kitchen          from '../views/Kitchen.vue'
import Chat             from '../views/Chat.vue'
import PurchaseAnalytics from '../views/PurchaseAnalytics.vue'
import RatingsReview    from '../views/RatingsReview.vue'
import FavoriteChefs    from '../views/FavoriteChefs.vue'

const routes = [
  // 1) root → login
  { path: '/', redirect: '/login' },

  // 2) auth pages
  { path: '/login',          name: 'Login',         component: Login },
  { path: '/register',       name: 'Register',      component: Register },
  { path: '/password-reset', name: 'PasswordReset', component: PasswordReset },

  // 3) main app pages
  { path: '/home',               name: 'Home',              component: Home },
  { path: '/search',             name: 'SearchResults',     component: SearchResults },
  { path: '/review',             name: 'Review',            component: ReviewPage },
  { path: '/ratings-review',     name: 'RatingsReview',     component: WrittenReviews },
  { path: '/cart',               name: 'Cart',              component: Cart },
  { path: '/order-history',      name: 'OrderHistory',      component: OrderHistory },
  { path: '/manage-kitchen',     name: 'Kitchen',           component: Kitchen },
  { path: '/chat',               name: 'Chat',              component: Chat },
  { path: '/purchase-analytics', name: 'PurchaseAnalytics', component: PurchaseAnalytics },
  { path: '/favorite-chefs',     name: 'FavoriteChefs',     component: FavoriteChefs },

  // 4) catch‑all → back to login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
