import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import TestPage from "@/views/TestPage.vue";
import Kitchen from "@/views/Kitchen.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, 
    {
        path: '/test',
        name: 'Test',
        component: TestPage
    },
    {
        path: '/kitchen',
        name: 'Kitchen',
        component: Kitchen
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router