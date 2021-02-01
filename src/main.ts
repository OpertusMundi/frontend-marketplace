import Vue from 'vue';
import VueToastify from 'vue-toastify';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueToastify, {
  theme: 'light',
});
declare module 'vue/types/vue' {
  interface Vue {
    $vToastify: VueToastify;
  }
}
// Vue configuration
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
