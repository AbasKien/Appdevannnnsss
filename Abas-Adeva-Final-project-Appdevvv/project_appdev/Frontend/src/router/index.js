import { createRouter, createWebHistory } from 'vue-router';
import loginview from '../views/loginview.vue';
import register from '../views/register.vue';
import home from '../views/home.vue';
import admin from '../views/admin.vue';
import product from '../views/product.vue';
import cart from '../views/cart.vue';
import checkout from '../views/checkout.vue';
import landingpage from '../views/landingpage.vue';
import profile from '../views/profile.vue';
import adminprod from '../views/adminprod.vue';
import productlogs from "../views/product-logs.vue";
import AdminOrder from "../views/AdminOrder.vue";
import orderchart from "../views/orderchart.vue";

import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'landingpage',
    component: landingpage,
  },
  {
    path: '/login',
    name: 'login',
    component: loginview,
  },
  {
    path: '/signup',
    name: 'signup',
    component: register,
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: { requiresRole: 'client' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta: { requiresRole: 'client' },
  },
  {
    path: '/admin/dashboard',
    name: 'admin',
    component: admin,
    meta: { requiresRole: 'admin' },
  },
  {
    path: '/admin/products',
    name: 'adminprod',
    component: adminprod,
    meta: { requiresRole: 'admin' },
  },
  {
    path: "/admin/product-logs",
    name: "productlogs",
    component: productlogs,
    meta: { requiresRole: "admin" },
  },
  {
    path: "/admin/orders",
    name: "adminOrders",
    component: AdminOrder,
    meta: { requiresRole: "admin" },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: cart,
    meta: { requiresRole: 'client' },
  },
  {
    path: '/product',
    name: 'Product',
    component: product,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: checkout,
    meta: { requiresRole: 'client' },
  },
  {
    path: '/thank-you/:orderId',
    name: 'ThankYou',
    component: () => import('../views/ThankYou.vue'),
    meta: { requiresRole: 'client' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  const isLoggedIn = token && userRole;

  // Public routes that don't require authentication
  const publicRoutes = ['landingpage', 'login', 'signup'];
  
  // If route is public, allow access
  if (publicRoutes.includes(to.name)) {
    // If user is logged in and trying to access login/signup, redirect to appropriate dashboard
    if (isLoggedIn && (to.name === 'login' || to.name === 'signup')) {
      return next(userRole === 'admin' ? '/admin/dashboard' : '/home');
    }
    return next();
  }

  // For protected routes, check if user is logged in
  if (!isLoggedIn) {
    return next('/login');
  }

  // For role-protected routes, verify role
  if (to.meta.requiresRole) {
    // If role doesn't match, redirect to appropriate dashboard
    if (to.meta.requiresRole !== userRole) {
      return next(userRole === 'admin' ? '/admin/dashboard' : '/home');
    }
  }

  // If all checks pass, proceed
  next();
});

export default router;
