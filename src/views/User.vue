<template>
  <div class="user">
    <h1>This is an user page</h1>

    <button v-on:click="updateProfile()">Update profile</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios from 'axios';

import { ProfileCommand } from '@/model/account';

@Component
export default class User extends Vue {
  updateProfile = () => {
    const data: ProfileCommand = {
      email: 'user@example.com',
    };

    axios.post('/action/profile', data).catch((err) => {
      // TODO : Handle error ...
      console.error(err);
    });
  };
}
</script>
