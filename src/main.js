import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // if you're using Vue Router

const app = createApp(App)
app.use(router)  // if using Vue Router
app.mount('#app')
