import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';

import store from '@/store';

import Home from '@/views/Home.vue';
import Callback from '@/views/Callback.vue';
import Error401 from '@/views/Error401.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/callback',
    name: 'callback',
    component: Callback,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/error/401',
    name: 'Error401',
    component: Error401,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
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
];

// Inject route only for development
if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: '/login/helix',
    redirect: (to: Route) => {
      // the function receives the target route as the argument
      // return redirect path/location here.
      const url = `${process.env.VUE_APP_API_GATEWAY_URL}${to.fullPath}`;
      window.location.href = url;
      return '/';
    },
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const role = to.meta?.requiresRole;

  if (role && !store.getters.hasRole(role)) {
    next('/error/401');
  } else {
    next();
  }
});

export default router;
