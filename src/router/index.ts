import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';

import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/catalogue/',
    name: 'Catalogue',
    component: () => import(/* webpackChunkName: "cataloguesingle" */ '../views/Catalogue.vue'),
  },
  {
    path: '/catalogue/:id',
    name: 'CatalogueSingle',
    component: () => import(/* webpackChunkName: "cataloguesingle" */ '../views/CatalogueSingle.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import(/* webpackChunkName: "terms" */ '../views/Terms.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import(/* webpackChunkName: "privacy" */ '../views/Privacy.vue'),
  },
  {
    path: '/faq',
    name: 'Faq',
    component: () => import(/* webpackChunkName: "faq" */ '../views/faq/Faq.vue'),
  },
  {
    path: '/faq/:category',
    name: 'faq-category',
    component: () => import(/* webpackChunkName: "faqcategory" */ '../views/faq/FaqCategory.vue'),
  },
  {
    path: '/faq/:category/:slug',
    name: 'single-faq',
    component: () => import(/* webpackChunkName: "singlefaq" */ '../views/faq/SingleFaq.vue'),
  },
  {
    path: '/vas',
    name: 'vas',
    component: () => import(/* webpackChunkName: "vas" */ '../views/documentation/VAS.vue'),
  },
  {
    path: '/vas/:slug',
    name: 'single-vas',
    component: () => import(/* webpackChunkName: "vassingke" */ '../views/documentation/SingleVAS.vue'),
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: () => import(/* webpackChunkName: "documentation" */ '../views/documentation/Documentation.vue'),
  },
  {
    path: '/documentation/:slug',
    name: 'single-documentation',
    component: () => import(/* webpackChunkName: "documentationsingle" */ '../views/documentation/SingleDocumentation.vue'),
  },
  // TEMPORARILY DISABLE ROUTE GUARDS (requiresRole: 'ROLE_USER')
  // FOR DEVELOPMENT PURPOSE (server is down)
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboardmain" */ '../views/dashboard/Main.vue'),
    meta: { requiresRole: '', layout: 'dashboard' },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import(/* webpackChunkName: "dashboardhome" */ '../views/dashboard/Home.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'assets',
        name: 'Assets',
        component: () => import(/* webpackChunkName: "dashboardassets" */ '../views/dashboard/Assets.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'assets/preview/:id',
        name: 'AssetPreview',
        component: () => import(/* webpackChunkName: "dashboardassetpreview" */ '../views/dashboard/AssetPreview.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'storage',
        name: 'Storage',
        component: () => import(/* webpackChunkName: "dashboardstorage" */ '../views/dashboard/Storage.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'notebooks',
        name: 'Notebooks',
        component: () => import(/* webpackChunkName: "dashboardnotebooks" */ '../views/dashboard/Notebooks.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'assets/create',
        name: 'CreateAsset',
        component: () => import(/* webpackChunkName: "dashboardcreateasset" */ '../views/dashboard/CreateAsset.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "dashboardprofile" */ '../views/dashboard/Profile.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import(/* webpackChunkName: "dashboardfavorites" */ '../views/dashboard/Favorites.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import(/* webpackChunkName: "dashboardmesssages" */ '../views/dashboard/Messages.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "dashboardsettings" */ '../views/dashboard/Settings.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "dashboardstorage" */ '../views/dashboard/Users.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'messages/create',
        name: 'MessageNew',
        component: () => import(/* webpackChunkName: "dashboardmesssagenew" */ '../views/dashboard/MessageNew.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
      {
        path: 'messages/:id',
        name: 'MessagesThread',
        component: () => import(/* webpackChunkName: "dashboardmesssagesthread" */ '../views/dashboard/MessagesThread.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
    ],
  },
  {
    path: '/order-thankyou',
    name: 'OrderThankYou',
    component: () => import(/* webpackChunkName: "thankyou" */ '../views/orders/Thankyou.vue'),
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
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      hideForAuth: true,
    },
  },
  {
    path: '/confirmemail',
    name: 'ConfirmEmail',
    component: () => import(/* webpackChunkName: "confirmemail" */ '../views/ConfirmEmail.vue'),
  },
  {
    path: '/account/registration/success',
    name: 'RegistrationSuccess',
    component: () => import(/* webpackChunkName: "registrationsuccess" */ '../views/RegistrationSuccess.vue'),
  },
  {
    path: '/account/registration/failure',
    name: 'RegistrationFailure',
    component: () => import(/* webpackChunkName: "registrationfailure" */ '../views/RegistrationFailure.vue'),
  },
  {
    path: '/become-vendor',
    name: 'BocomeVendor',
    component: () => import(/* webpackChunkName: "becomevendor" */ '../views/BecomeVendor.vue'),
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
  scrollBehavior(to, from, savedPosition) {
    if (to.name === 'ConfirmEmail' && from.name === 'Register') {
      return { x: 0, y: 0 };
    }
    return savedPosition;
  },
});

router.beforeEach((to, from, next) => {
  const role = to.meta?.requiresRole;
  const auth = to.meta?.hideForAuth;
  if (auth && store.getters.isAuthenticated) {
    next({ name: 'User' });
  }

  if (to.name === 'ConfirmEmail' && from.name !== 'Register') {
    next('/error/401');
  } else {
    next();
  }

  if (role && !store.getters.hasRole(role)) {
    next('/error/401');
  } else {
    next();
  }
});

export default router;
