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
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  apiUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/swagger-ui/api-docs.html`;
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
