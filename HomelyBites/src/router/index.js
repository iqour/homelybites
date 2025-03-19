import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import ReviewPage from "@/views/ReviewPage.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, 
    {
        path: '/review',
        name: 'Review',
        component: ReviewPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router