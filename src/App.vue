<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      {{ "|" }}
      <router-link to="/about">About</router-link>
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

import axios, { AxiosResponse } from 'axios';

import store from '@/store';

import { Configuration, ServerResponse } from '@/model';

@Component
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/api-docs.html`;

  mounted() {
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
    axios
      .get('/action/configuration/el')
      .then((response: AxiosResponse<ServerResponse<Configuration>>) => {
        store.commit('setConfiguration', {
          configuration: response.data.result,
        });
      });
  }

  logout() {
    const router = this.$router;

    store.dispatch('logout').then(() => {
      router.push({ name: 'Home' });
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
