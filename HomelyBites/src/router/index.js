import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import ReviewPage from "@/views/ReviewPage.vue";
import WrittenReviews from "@/views/WrittenReviews.vue";
import Cart from "@/views/Cart.vue";
import OrderHistory from "@/views/OrderHistory.vue";
import Chat from "@/views/Chat.vue";
import PurchaseAnalytics from "@/views/PurchaseAnalytics.vue";
import RatingsReview from "@/views/RatingsReview.vue";
import FavoriteChefs from "@/views/FavoriteChefs.vue";
import Kitchen from "@/views/Kitchen.vue";


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
        path: '/ratings-review',
        name: 'Witten Review',
        component: WrittenReviews
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart
    },
    {
        path: '/order-history',
        name: 'OrderHistory',
        component: OrderHistory
    },
    {
        path: '/manage-kitchen',
        name: 'ManageKitchen',
        component: Kitchen
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat
    },
    {
        path: '/purchase-analytics',
        name: 'PurchaseAnalytics',
        component: PurchaseAnalytics
    },
    {
        path: '/ratings-review',
        name: 'RatingsReview',
        component: RatingsReview
    },
    {
        path: '/favorite-chefs',
        name: 'FavoriteChefs',
        component: FavoriteChefs
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes

});

export default router