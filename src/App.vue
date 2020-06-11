<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <app-header v-if="showHeader"></app-header>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <transition name="fade" mode="out-in">
    <app-footer v-if="showFooter"></app-footer>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';
import ConfigurationApi from '@/service/config';

import {
  Configuration, Account, ServerResponse, LogoutResult,
} from '@/model';

import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';

@Component({
  components: { AppHeader, AppFooter },
})
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/index.html?configUrl=/api-docs/swagger-config`;

  accountApi: AccountApi;

  configApi: ConfigurationApi;

  showHeader= true;

  showFooter= true;

  constructor() {
    super();

    this.accountApi = new AccountApi();

    this.configApi = new ConfigurationApi();
  }

  @Watch('$route', { immediate: true, deep: true })
  showHideHeader():void {
    if (this.routeName === 'Login') {
      this.showHeader = false;
      this.showFooter = false;
    } else {
      this.showHeader = true;
      this.showFooter = true;
    }
  }

  get routeName(): string | null | undefined {
    return this.$route.name;
  }

  beforeMount(): void {
    // Initialize CSRF token
    const token = document
      .querySelector('meta[name=_csrf]')
      ?.getAttribute('content');
    const header = document
      .querySelector('meta[name=_csrf_header]')
      ?.getAttribute('content');

    if (token && header) {
      store.commit('setCsrfToken', { token, header });
    }

    // Get initial configuration
    this.configApi
      .getConfiguration()
      .then((configResponse: ServerResponse<Configuration>) => {
        store.commit('setConfiguration', {
          configuration: configResponse.result,
        });
        // Check if user is authenticated
        this.accountApi
          .getUserData()
          .then((profileResponse: ServerResponse<Account>) => {
            if (profileResponse.success) {
              store.commit('setUserData', profileResponse.result);
            }
          });
      });
  }

  logout(): void {
    const router = this.$router;

    const name = 'Home';

    // Logout
    this.accountApi
      .logout()
      .then((logoutResponse: ServerResponse<LogoutResult>) => {
        if (logoutResponse.success) {
          // Set CSRF Token
          const {
            csrfToken: token,
            csrfHeader: header,
          } = logoutResponse.result;

          store.commit('setCsrfToken', { token, header });

          // Update user data
          store.commit('logout');

          if (router.currentRoute.name !== name) {
            router.push({ name });
          }
        }
      });
  }
}
</script>
