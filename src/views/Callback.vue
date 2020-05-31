<template>
  <div class="callback"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import store from '@/store';

import AccountApi from '@/service/account';

import { ServerResponse, Account } from '@/model';

@Component
export default class Callback extends Vue {
  accountApi: AccountApi;

  constructor() {
    super();

    this.accountApi = new AccountApi();
  }

  mounted(): void {
    const location = { name: 'Home' };
    const token = this.$route?.hash?.substring(1);

    if (token) {
      console.log(token);
      store.commit('setAccessToken', token);

      this.accountApi.getUserData().then((response: ServerResponse<Account>) => {
        if (response.success) {
          store.commit('setUserData', response.result);
        }

        this.$router.push(location);
      });
    } else {
      this.$router.push(location);
    }
  }
}
</script>
