import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';

import Home from '@/views/Home.vue';
import Callback from '@/views/Callback.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/catalogue/:id',
    name: 'CatalogueSingle',
    component: () => import(/* webpackChunkName: "cataloguesingle" */ '../views/CatalogueSingle.vue'),
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboardmain" */ '../views/dashboard/Main.vue'),
    meta: {
      requiresRole: 'ROLE_USER',
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import(/* webpackChunkName: "dashboardhome" */ '../views/dashboard/Home.vue'),
      },
      {
        path: 'assets',
        name: 'Assets',
        component: () => import(/* webpackChunkName: "dashboardassets" */ '../views/dashboard/Assets.vue'),
      },
      {
        path: 'assets/create',
        name: 'CreateAsset',
        component: () => import(/* webpackChunkName: "dashboardcreateasset" */ '../views/dashboard/CreateAsset.vue'),
      },
    ],
  },
  {
    path: '/order-thankyou',
    name: 'OrderThankYou',
    component: () => import(/* webpackChunkName: "thankyou" */ '../views/orders/Thankyou.vue'),
  },
  {
    path: '/callback',
    name: 'callback',
    component: Callback,
  },
  {
    path: '/signin',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      hideForAuth: true,
    },
  },
  {
    path: '/error/:error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/ErrorPage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/vendor-benefits',
    name: 'VendorBenefits',
    component: () => import(/* webpackChunkName: "vendorbenefits" */ '../views/VendorBenefits.vue'),
  },
  {
    path: '/user-benefits',
    name: 'UserBenefits',
    component: () => import(/* webpackChunkName: "userbenefits" */ '../views/UserBenefits.vue'),
  },
  {
    path: '/user',
    name: 'User',
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    meta: {
      requiresRole: 'ROLE_USER',
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    meta: {
      requiresRole: 'ROLE_ADMIN',
    },
  },
  {
    path: '*',
    redirect: '/error/404',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const role = to.meta?.requiresRole;
  const auth = to.meta?.hideForAuth;
  if (auth && store.getters.isAuthenticated) {
    next({ name: 'User' });
  }

  if (role && !store.getters.hasRole(role)) {
    next('/error/401');
  } else {
    next();
  }
});

export default router;
