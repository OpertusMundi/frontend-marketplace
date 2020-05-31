<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      {{ "|" }}
      <router-link to="/about">About</router-link>
      {{ "|" }}
      <router-link to="/order">Order</router-link>
      <template v-if="$store.getters.hasRole('ROLE_USER')">
        {{ "|" }}
        <router-link to="/user">User</router-link>
      </template>
      <template v-if="$store.getters.hasRole('ROLE_ADMIN')">
        {{ "|" }}
        <router-link to="/admin">Admin</router-link>
      </template>
      {{ "|" }}
      <a v-bind:href="apiUrl" target="_blank">
        <img class="logo-image" src="./assets/oas.svg" alt="OPERTUS MUNDI API documentation" />
      </a>
      <template v-if="$store.getters.isAuthenticated">
        {{ "|" }}
        <a v-on:click.prevent="logout()">Logout</a>
      </template>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';
import ConfigurationApi from '@/service/config';

import {
  Configuration, Account, ServerResponse, LogoutResult,
} from '@/model';

@Component
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/index.html`;

  accountApi: AccountApi;

  configApi: ConfigurationApi;

  constructor() {
    super();

    this.accountApi = new AccountApi();

    this.configApi = new ConfigurationApi();
  }

  mounted(): void {
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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
img.logo-image {
  height: 19px;
  position: relative;
  top: 4px;
}
</style>
