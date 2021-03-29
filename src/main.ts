import Vue from 'vue';
import VueToastify from 'vue-toastify';

/* font awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faAngleUp,
  faTimes,
  faVectorSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';
import store from './store';

library.add(faAngleDown, faAngleUp, faTimes, faVectorSquare);
Vue.component('font-awesome-icon', FontAwesomeIcon);

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
