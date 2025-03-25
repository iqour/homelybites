import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import ReviewPage from "@/views/ReviewPage.vue";
import WrittenReviews from "@/views/WrittenReviews.vue";

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
    },
    {
        path: '/writtenReview',
        name: 'Witten Review',
        component: WrittenReviews
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router