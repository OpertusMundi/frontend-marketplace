import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import User from './modules/user.module';
import Config from './modules/config.module';
import Shop from './modules/shop.module';
import Router from './modules/router.module';
import CatalogueFilters from './modules/catalogue-filters.module';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    user: User,
    config: Config,
    shop: Shop,
    router: Router,
    catalogueFilters: CatalogueFilters,
  },
  plugins: [createPersistedState({
    // paths: ['user'],
  })],
  strict: debug,
});

export default store;
