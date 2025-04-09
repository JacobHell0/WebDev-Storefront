import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import Cart from '../views/Cart.vue';
import HelloFromServer from '@/components/HelloFromServer.vue'
import Login from '../components/Login.vue';
import Profile from '../components/Profile.vue'; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/hello-from-server',
      name: 'HelloFromServer',
      component: HelloFromServer
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
  ],
})

export default router;
