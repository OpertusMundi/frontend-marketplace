<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <announcement-bar v-if="$route.name === 'Home' && $store.getters.getAnnouncement && !isAnnouncementBarClosed"></announcement-bar>
    </transition>
    <transition name="fade" mode="out-in">
      <app-header v-if="showHeader" :headerClass="headerClass" :showMenuMobile="showMenuMobile" @toggleMobileMenu="toggleMobileMenu"></app-header>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view :showMenuMobile="showMenuMobile" @showHideMobileMenu="toggleMobileMenu" :key="$route.path"/>
    </transition>
    <transition name="fade" mode="out-in">
      <app-footer v-if="!$store.getters.isLoading && showFooter"></app-footer>
    </transition>
    <transition name="fade" mode="out-in">
      <loader v-if="$store.getters.isLoading && !noLoaderRoutes.includes($route.name)"></loader>
    </transition>
    <transition name="fade" mode="out-in">
      <global-modals v-if="$store.getters.getShownGlobalModal"></global-modals>
    </transition>
    <!-- TEMP DISABLE COOKIE BOX -->
    <!-- <transition name="fade" mode="out-in">
      <cookie-box v-if="!isCookiesOptionSet && !isCookiesBoxClosed" @close="isCookiesBoxClosed = true"></cookie-box>
    </transition> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';
import ConfigurationApi from '@/service/config';
import CartApi from '@/service/cart';

import { fetchUserProfileAndCart } from '@/helper/user';

import {
  Configuration, ServerResponse, LogoutResult,
} from '@/model';
// import { AxiosError } from 'axios';
import { Announcement } from '@/model/announcement';

import AnnouncementBar from '@/components/AnnouncementBar.vue';
import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';
import Loader from '@/components/Loader.vue';
import GlobalModals from '@/components/GlobalModals.vue';
import CookieBox from '@/components/CookieBox.vue';

@Component({
  components: {
    AnnouncementBar,
    AppHeader,
    AppFooter,
    Loader,
    GlobalModals,
    CookieBox,
  },
})
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/index.html?configUrl=/api-docs/swagger-config`;

  accountApi: AccountApi;

  configApi: ConfigurationApi;

  cartApi: CartApi;

  showHeader = true;

  showFooter = true;

  showMenuMobile = false;

  headerClass = 'bg';

  noHeaderBgArray: Array<string | null | undefined>;

  noHeader: Array<string | null | undefined>;

  noLoaderRoutes: Array<string>;

  isCookiesBoxClosed = false;

  constructor() {
    super();

    this.showHeader = true;
    this.showFooter = true;
    this.showMenuMobile = false;

    this.accountApi = new AccountApi();
    this.configApi = new ConfigurationApi();
    this.cartApi = new CartApi();

    this.noHeader = ['Login', 'Register', 'OrganisationalAccountJoin'];
    this.noHeaderBgArray = ['Home', 'CatalogueSingle', 'OrderThankYou'];
    // this.noLoaderRoutes = ['Home', 'CatalogueSingle'];
    this.noLoaderRoutes = ['Home'];
  }

  // todo: refactoring
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
    } else if (this.routeName === 'DashboardHome' || this.routeName === 'EOExplorer') {
      this.showFooter = false;
      this.headerClass = 'header--dark';
    // } else if (this.routeName === 'Cart') {
    //   this.showHeader = true;
    //   this.showFooter = false;
    } else if (this.$route.name === 'RegisterVendor') {
      this.headerClass = 'header--dark';
      this.showFooter = false;
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

    if (this.$route.name === 'Home') {
      this.setAnnouncementBarHeight();
    }
  }

  @Watch('$store.getters.isAuthenticated', { immediate: false })
  handleAuthenticationChanges(isNowAuthenticated: boolean, wasPreviouslyAuthenticated: boolean): void {
    if (wasPreviouslyAuthenticated && !isNowAuthenticated) {
      const name = 'Home';

      // todo
      const excludeRedirectionToHome = [
        'RegistrationSuccess',
        'RegistrationFailure',
        'PayInRedirection',
      ];

      console.log('handle auth change', this.$route.name);

      store.commit('setCartItems', null);

      if (excludeRedirectionToHome.includes(this.$route.name as string)) return;

      if (this.$route.name !== name) this.$router.push({ name });
    }
  }

  get routeName(): string | null | undefined {
    return this.$route.name;
  }

  get isAnnouncementBarClosed(): boolean {
    return sessionStorage.getItem('isAnnouncementBarClosed') === 'y';
  }

  get isCookiesOptionSet(): boolean {
    return !!localStorage.getItem('is_user_accepted_cookies');
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

        if (configResponse.result.announcement) this.showAnnouncementBar(configResponse.result.announcement);

        fetchUserProfileAndCart().then((res) => {
          if (res.success) {
            console.log('fetched user profile and cart');
            return;
          }
          console.log('could not fetch user profile and cart');
        });
      })
      .catch((err) => {
        console.log('getConfiguration error', err);
        // store.commit('setLoading', false);
      });
  }

  toggleMobileMenu(status: boolean): void {
    this.showMenuMobile = status;
  }

  showAnnouncementBar(announcement: Announcement): void {
    store.commit('setAnnouncement', announcement);
    this.setAnnouncementBarHeight();
  }

  setAnnouncementBarHeight(): void {
    this.$nextTick(() => {
      if (!document.getElementById('t-announcement-bar')) return;
      // eslint-disable-next-line
      store.commit('setAnnouncementBarHeight', document.getElementById('t-announcement-bar')!.clientHeight);
    });
  }

  // getCartItems(): void {
  //   this.cartApi
  //     .getCart()
  //     .then((cartResponse: ServerResponse<Cart>) => {
  //       if (cartResponse.success) {
  //         store.commit('setCartItems', cartResponse.result);
  //       } else {
  //         // TODO: Handle error
  //         console.error('cannot add item to cart!');
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('getCartItems error: ', err);
  //     });
  // }

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
