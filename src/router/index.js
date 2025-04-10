import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import Cart from '../views/Cart.vue';
import ServerStatus from '@/components/ServerStatus.vue'
import Login from '../components/Login.vue';
import Profile from '../components/Profile.vue'; 
import Cart from '@/components/Cart.vue';
import ProductListView from '../views/ProductListView.vue';

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
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue'),
    },
    {
      path: '/status',
      name: 'ServerStatus',
      component: ServerStatus
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
    {
      path: '/product',
      name: 'Product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/products',
      name: 'ProductListView',
      component: ProductListView,
      props: route => ({ initialProducts: route.query.data ? JSON.parse(route.query.data) : [], title: route.query.title || '' })
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
  ],
})

export default router;
