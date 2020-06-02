<template>
  <div class="user">
    <h1>This is an user page</h1>

    <button v-on:click="updateUserData()">Update profile</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AccountApi from '@/service/account';

import { ProfileCommand } from '@/model/account';

@Component
export default class User extends Vue {
  accountApi: AccountApi;

  constructor() {
    super();

    this.accountApi = new AccountApi();
  }

  updateUserData = (): void => {
    const command: ProfileCommand = {
      email: 'user@example.com',
    };

    this.accountApi.setProfile(command);
  };
}
</script>
