import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/user';

import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import FaqView from '@/views/FaqView.vue'
import UsersView from '@/views/UsersView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import MapView from '@/views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/faqs',
      name: 'faqs',
      component: FaqView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: ScheduleView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
  ],
})

// UNCOMMENT BEFORE DEPLOYING: Redirects the user to the login page if not already logged in.

// router.beforeEach((to, from, next) => {
//   const authStore = userStore();
  
//   if (!authStore.isLoggedIn && to.name !== 'login') {
//     // Redirect to login if the user is not logged in
//     next({ name: 'login' });
//   } else {
//     next();
//   }
// });

export default router
