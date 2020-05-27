<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <p v-if="!$store.getters.isAuthenticated">
      <a v-bind:href="loginUrl" rel="noopener">Login Opertus Mundi</a>
    </p>

    <form>
      <p>
        <input v-model="username" placeholder="User" />
      </p>
      <p>
        <input v-model="password" type="password" placeholder="Password" />
      </p>
      <p>
        <button type="submit" v-on:click="login($event)">Login</button>
      </p>
    </form>

    <p
      v-if="$store.getters.isAuthenticated"
    >{{ $store.state.account.username }} - {{ $store.state.account.roles }}</p>

    <p>{{ $store.state.auth }}</p>
    <p>{{ $store.state.csrf }}</p>
    <p>{{ $store.state.configuration }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import store from '@/store';

import axios, { AxiosResponse } from 'axios';

import { ServerResponse, LoginSuccessResult } from '@/model';
import { Profile } from '@/model/account';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  credentials: { username: string; password: string } = {
    username: '',
    password: '',
  };

  set username(value: string) {
    this.credentials.username = value;
  }

  set password(value: string) {
    this.credentials.password = value;
  }

  loginUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/login/opertus-mundi`;

  login = (e: MouseEvent) => {
    e.preventDefault();

    store
      .dispatch('login', {
        username: this.credentials.username,
        password: this.credentials.password,
      })
      .then((loginResponse: ServerResponse<LoginSuccessResult>) => {
        // Load profile
        if (loginResponse.success) {
          axios
            .get('/action/profile')
            .then((profileResponse: AxiosResponse<ServerResponse<Profile>>) => {
              if (profileResponse.data.success) {
                store.commit('setProfile', profileResponse.data.result);
              }
            });
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
