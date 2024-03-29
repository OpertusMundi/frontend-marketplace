import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import User from './modules/user.module';
import Config from './modules/config.module';
import Loading from './modules/loading.module';
import Shop from './modules/shop.module';
import Router from './modules/router.module';
import CatalogueFilters from './modules/catalogue-filters.module';
import Notifications from './modules/notifications.module';
import Messages from './modules/messages.module';
import GlobalModals from './modules/global-modals.module';
import ApiErrors from './modules/api-errors.module';
import Announcement from './modules/announcement';
import Dashboard from './modules/dashboard.module';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    user: User,
    config: Config,
    loading: Loading,
    shop: Shop,
    router: Router,
    catalogueFilters: CatalogueFilters,
    notifications: Notifications,
    messages: Messages,
    globalModals: GlobalModals,
    apiErrors: ApiErrors,
    announcement: Announcement,
    dashboard: Dashboard,
  },
  plugins: [createPersistedState({
    paths: ['user', 'config', 'shop', 'router', 'catalogueFilters', 'notifications'],
  })],
  strict: debug,
});

export default store;
