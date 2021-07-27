<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <app-header v-if="showHeader" :headerClass="headerClass" :showMenuMobile="showMenuMobile" @toggleMobileMenu="toggleMobileMenu"></app-header>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view :showMenuMobile="showMenuMobile" @showHideMobileMenu="toggleMobileMenu" />
    </transition>
    <transition name="fade" mode="out-in">
      <app-footer v-if="!$store.getters.isLoading && showFooter"></app-footer>
    </transition>
    <!-- <transition name="fade" mode="out-in">
      <div class="loader" v-if="$store.getters.isLoading"></div>
    </transition> -->
    <transition name="fade" mode="out-in">
      <loader v-if="$store.getters.isLoading && !noLoaderRoutes.includes($route.name)"></loader>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';
import ConfigurationApi from '@/service/config';
import CartApi from '@/service/cart';
import ProfileApi from '@/service/profile';

import {
  Configuration, Account, ServerResponse, LogoutResult, Cart,
} from '@/model';
import { AxiosError } from 'axios';

import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';
import Loader from '@/components/Loader.vue';

@Component({
  components: { AppHeader, AppFooter, Loader },
})
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/index.html?configUrl=/api-docs/swagger-config`;

  accountApi: AccountApi;

  configApi: ConfigurationApi;

  profileApi: ProfileApi;

  cartApi: CartApi;

  showHeader = true;

  showFooter = true;

  showMenuMobile = false;

  headerClass = 'bg';

  noHeaderBgArray: Array<string | null | undefined>;

  noHeader: Array<string | null | undefined>;

  noLoaderRoutes: Array<string>;

  constructor() {
    super();

    // store.commit('setLoading', true);

    this.showHeader = true;
    this.showFooter = true;
    this.showMenuMobile = false;

    this.accountApi = new AccountApi();
    this.configApi = new ConfigurationApi();
    this.cartApi = new CartApi();
    this.profileApi = new ProfileApi();

    this.noHeader = ['Login', 'Register'];
    this.noHeaderBgArray = ['Home', 'CatalogueSingle', 'OrderThankYou'];
    this.noLoaderRoutes = ['Home', 'CatalogueSingle'];
  }

  @Watch('$route', { immediate: true, deep: true })
  showHideHeader(): void {
    if (this.$route.meta.layout === 'dashboard') {
      this.showHeader = true;
      this.headerClass = 'header--dashboard';
      this.showFooter = false;
      return;
    }
    if (this.noHeader.includes(this.routeName)) {
      this.showHeader = false;
      this.showFooter = false;
    } else if (this.routeName === 'DashboardHome') {
      this.showFooter = false;
      this.headerClass = 'header--dark';
    } else if (this.noHeaderBgArray.includes(this.routeName)) {
      this.headerClass = 'header--nobg';
      this.showHeader = true;
      this.showFooter = true;
    } else {
      this.headerClass = 'bg';
      // todo: next 2 lines to be tested
      this.showHeader = true;
      this.showFooter = true;
    }
  }

  get routeName(): string | null | undefined {
    return this.$route.name;
  }

  mounted(): void {
    // Initialize CSRF token
    const token = document.querySelector('meta[name=_csrf]')?.getAttribute('content');
    const header = document.querySelector('meta[name=_csrf_header]')?.getAttribute('content');

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
        this.profileApi
          .getProfile()
          .then((profileResponse: ServerResponse<Account>) => {
            if (profileResponse.success) {
              store.commit('setUserData', profileResponse.result);
            }
            // store.commit('setLoading', false);
          })
          .catch((error: AxiosError) => {
            // TODO: Handle error
            console.log(error);
            // store.commit('setLoading', false);
          });
      })
      .catch((err) => {
        console.log('getConfiguration error', err);
        // store.commit('setLoading', false);
      });

    this.getCartItems();
  }

  toggleMobileMenu(status: boolean): void {
    this.showMenuMobile = status;
  }

  getCartItems(): void {
    this.cartApi
      .getCart()
      .then((cartResponse: ServerResponse<Cart>) => {
        if (cartResponse.success) {
          store.commit('setCartItems', cartResponse.result);
        } else {
          // TODO: Handle error
          console.error('cannot add item to cart!');
        }
      })
      .catch((err) => {
        console.log('getCartItems error: ', err);
      });
  }

  logout(): void {
    const router = this.$router;

    const name = 'Home';

    // Logout
    this.accountApi.logout().then((logoutResponse: ServerResponse<LogoutResult>) => {
      if (logoutResponse.success) {
        // Set CSRF Token
        const { csrfToken: token, csrfHeader: header } = logoutResponse.result;

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
