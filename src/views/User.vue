<template>
  <div class="user">
    <h1>This is an user page</h1>

    <button v-on:click="updateProfile()">Update profile</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios from 'axios';

@Component
export default class User extends Vue {
  updateProfile = () => {
    axios
      .post('/action/profile', { name: 'Yannis', location: 'Athens' })
      .catch((err) => {
        // TODO : Handle error ...
        console.error(err);
      });
  };
}
</script>
