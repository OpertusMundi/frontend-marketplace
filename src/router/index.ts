import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';

import Home from '@/views/Home.vue';
import { EnumRole } from '@/model/role';

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
    component: (): Promise<any> => import(/* webpackChunkName: "cataloguesingle" */ '../views/Catalogue.vue'),
  },
  {
    path: '/catalogue/:id',
    name: 'CatalogueSingle',
    component: (): Promise<any> => import(/* webpackChunkName: "cataloguesingle" */ '../views/CatalogueSingle.vue'),
  },
  {
    path: '/helpdesk-review/:key',
    name: 'HelpdeskReview',
    component: (): Promise<any> => import(/* webpackChunkName: "helpdeskreview" */ '../views/CatalogueSingle.vue'),
    meta: { requiresRole: [EnumRole.ROLE_HELPDESK] },
  },
  {
    path: '/review/:key',
    name: 'ReviewAsset',
    component: (): Promise<any> => import(/* webpackChunkName: "reviewasset" */ '../views/CatalogueSingle.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: (): Promise<any> => import(/* webpackChunkName: "terms" */ '../views/Terms.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: (): Promise<any> => import(/* webpackChunkName: "privacy" */ '../views/Privacy.vue'),
  },
  {
    path: '/faq',
    name: 'Faq',
    component: (): Promise<any> => import(/* webpackChunkName: "faq" */ '../views/faq/Faq.vue'),
  },
  {
    path: '/faq/:category',
    name: 'faq-category',
    component: (): Promise<any> => import(/* webpackChunkName: "faqcategory" */ '../views/faq/FaqCategory.vue'),
  },
  {
    path: '/faq/:category/:slug',
    name: 'single-faq',
    component: (): Promise<any> => import(/* webpackChunkName: "singlefaq" */ '../views/faq/SingleFaq.vue'),
  },
  {
    path: '/vas',
    name: 'vas',
    component: (): Promise<any> => import(/* webpackChunkName: "vas" */ '../views/documentation/VAS.vue'),
  },
  {
    path: '/vas/:slug',
    name: 'single-vas',
    component: (): Promise<any> => import(/* webpackChunkName: "vassingke" */ '../views/documentation/SingleVAS.vue'),
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: (): Promise<any> => import(/* webpackChunkName: "documentation" */ '../views/documentation/Documentation.vue'),
  },
  {
    path: '/documentation/:slug',
    name: 'single-documentation',
    component: (): Promise<any> => import(/* webpackChunkName: "documentationsingle" */ '../views/documentation/SingleDocumentation.vue'),
  },
  {
    path: '/dashboard',
    component: (): Promise<any> => import(/* webpackChunkName: "dashboardmain" */ '../views/dashboard/Main.vue'),
    meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardhome" */ '../views/dashboard/Home.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'assets',
        name: 'Assets',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardassets" */ '../views/dashboard/Assets.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      // TODO: delete assets/preview/:id and AssetPreview.vue if not in use
      {
        path: 'assets/preview/:id',
        name: 'AssetPreview',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardassetpreview" */ '../views/dashboard/AssetPreview.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'storage',
        name: 'Storage',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardstorage" */ '../views/dashboard/Storage.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'notebooks',
        name: 'Notebooks',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardnotebooks" */ '../views/dashboard/Notebooks.vue'),
        // TODO: correct role?
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'assets/create/:id?',
        name: 'CreateAsset',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardcreateasset" */ '../views/dashboard/CreateAsset.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardprofile" */ '../views/dashboard/Profile.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardfavorites" */ '../views/dashboard/Favorites.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'messages',
        name: 'Messages',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardmesssages" */ '../views/dashboard/Messages.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'topiomaps',
        name: 'TopioMaps',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardtopiomaps" */ '../views/dashboard/TopioMaps.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardorders" */ '../views/dashboard/Orders.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'order/:key',
        name: 'OrderPreview',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardorderpreview" */ '../views/dashboard/OrderPreview.vue'),
        meta: { requiresRole: [EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'purchases',
        name: 'Purchases',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardpurchases" */ '../views/dashboard/Purchases.vue'),
        meta: { requiresRole: [EnumRole.ROLE_CONSUMER], layout: 'dashboard' },
      },
      {
        path: 'purchase/:key',
        name: 'PurchasePreview',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardpurchasepreview" */ '../views/dashboard/PurchasePreview.vue'),
        meta: { requiresRole: [EnumRole.ROLE_CONSUMER], layout: 'dashboard' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardsettings" */ '../views/dashboard/Settings.vue'),
        meta: { requiresRole: [EnumRole.ROLE_CONSUMER, EnumRole.ROLE_PROVIDER], layout: 'dashboard' },
      },
      {
        path: 'users',
        name: 'Users',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardusers" */ '../views/dashboard/Users.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'messages/create',
        name: 'MessageNew',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardmesssagenew" */ '../views/dashboard/MessageNew.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'messages/:id',
        name: 'MessagesThread',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardmesssagesthread" */ '../views/dashboard/MessagesThread.vue'),
        meta: { requiresRole: [EnumRole.ROLE_USER], layout: 'dashboard' },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: (): Promise<any> => import(/* webpackChunkName: "dashboardfanalytics" */ '../views/dashboard/Analytics/Analytics.vue'),
        meta: { requiresRole: '', layout: 'dashboard' },
      },
    ],
  },
  {
    path: '/cart',
    name: 'Cart',
    component: (): Promise<any> => import(/* webpackChunkName: "cart" */ '../views/orders/Cart.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: (): Promise<any> => import(/* webpackChunkName: "checkout" */ '../views/orders/Checkout.vue'),
  },
  {
    path: '/order-thankyou',
    name: 'OrderThankYou',
    component: (): Promise<any> => import(/* webpackChunkName: "thankyou" */ '../views/orders/Thankyou.vue'),
  },
  {
    path: '/signin',
    name: 'Login',
    component: (): Promise<any> => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      hideForAuth: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: (): Promise<any> => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      hideForAuth: true,
    },
  },
  {
    path: '/confirmemail',
    name: 'ConfirmEmail',
    component: (): Promise<any> => import(/* webpackChunkName: "confirmemail" */ '../views/ConfirmEmail.vue'),
  },
  {
    path: '/account/registration/success',
    name: 'RegistrationSuccess',
    component: (): Promise<any> => import(/* webpackChunkName: "registrationsuccess" */ '../views/RegistrationSuccess.vue'),
  },
  {
    path: '/account/registration/failure',
    name: 'RegistrationFailure',
    component: (): Promise<any> => import(/* webpackChunkName: "registrationfailure" */ '../views/RegistrationFailure.vue'),
  },
  {
    path: '/become-vendor',
    name: 'BocomeVendor',
    component: (): Promise<any> => import(/* webpackChunkName: "becomevendor" */ '../views/BecomeVendor.vue'),
  },
  {
    path: '/error/:error',
    name: 'Error',
    component: (): Promise<any> => import(/* webpackChunkName: "error" */ '../views/ErrorPage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: (): Promise<any> => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/vendor-benefits',
    name: 'VendorBenefits',
    component: (): Promise<any> => import(/* webpackChunkName: "vendorbenefits" */ '../views/VendorBenefits.vue'),
  },
  {
    path: '/user-benefits',
    name: 'UserBenefits',
    component: (): Promise<any> => import(/* webpackChunkName: "userbenefits" */ '../views/UserBenefits.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: (): Promise<any> => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    meta: {
      requiresRole: [EnumRole.ROLE_ADMIN],
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
  // Set loading to TRUE before visiting these routes. Loading must be set to FALSE from inside the component, after content loaded
  const routesWithInitialLoading = ['Home', 'Catalogue', 'CatalogueSingle', 'Assets', 'Settings', 'Orders', 'OrderPreview', 'Purchases', 'PurchasePreview'];
  if (to.name && routesWithInitialLoading.includes(to.name)) {
    console.log('init loader', to.name);
    store.commit('setLoading', true);
  }

  const role = to.meta?.requiresRole;
  const auth = to.meta?.hideForAuth;
  if (auth && store.getters.isAuthenticated) {
    next({ name: 'User' });
  }

  if (to.name === 'ConfirmEmail' && from.name !== 'Register') {
    next('/error/401');
  } else if (role && !store.getters.hasRole(role)) {
    next('/error/401');
  } else {
    next();
  }
});

export { routes };
export default router;
