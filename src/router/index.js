// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import PasswordReset from '../components/PasswordReset.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/password-reset', component: PasswordReset }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
