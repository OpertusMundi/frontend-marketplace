<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <p v-if="!$store.getters.isAuthenticated">
      <a v-bind:href="loginOpertusMundi" rel="noopener">Login Opertus Mundi</a>
    </p>

    <p v-if="!$store.getters.isAuthenticated">
      <a v-bind:href="loginGoogle" rel="noopener">Login Google</a>
    </p>

    <p v-if="!$store.getters.isAuthenticated">
      <a v-bind:href="loginGithub" rel="noopener">Login GitHub</a>
    </p>

    <form v-if="!$store.getters.isAuthenticated">
      <p>
        <input v-model="model.username" placeholder="User" />
      </p>
      <p>
        <input v-model="model.password" type="password" placeholder="Password" />
      </p>
      <p>
        <button type="submit" v-on:click="login($event)">Login</button>
      </p>
    </form>

    <p
      v-if="$store.getters.isAuthenticated"
    >{{ $store.state.user.account.username }} - {{ $store.state.user.account.roles }}</p>

    <p>{{ $store.state.user.auth }}</p>
    <p>{{ $store.state.user.csrf }}</p>
    <p>{{ $store.state.user.configuration }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';

import { ServerResponse, LoginResult } from '@/model';

import { Account } from '@/model/account';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  accountApi: AccountApi;

  loginOpertusMundi: string;

  loginGoogle: string;

  loginGithub: string;

  model: { username: string; password: string };

  mounted() {
    console.log(store.getters.getConfig);
  }

  constructor() {
    super();

    this.accountApi = new AccountApi();

    this.loginOpertusMundi = `${process.env.VUE_APP_API_GATEWAY_URL}/login/opertus-mundi`;
    this.loginGoogle = `${process.env.VUE_APP_API_GATEWAY_URL}/login/google`;
    this.loginGithub = `${process.env.VUE_APP_API_GATEWAY_URL}/login/github`;
    this.model = { username: '', password: '' };
  }

  login = (e: MouseEvent): void => {
    e.preventDefault();

    const { username, password } = this.model;

    // Login
    this.accountApi
      .login(username, password)
      .then((loginResponse: ServerResponse<LoginResult>) => {
        if (loginResponse.success) {
          // Set CSRF Token
          const { csrfToken: token, csrfHeader: header } = loginResponse.result;

          store.commit('setCsrfToken', { token, header });

          // Load user data
          this.accountApi
            .getUserData()
            .then((accountResponse: ServerResponse<Account>) => {
              if (accountResponse.success) {
                store.commit('setUserData', accountResponse.result);
              } else {
                // TODO: Handle error
              }
            });
        } else {
          // TODO: Hanlde error
        }
      });
  };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
