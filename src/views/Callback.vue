<template>
  <div class="callback"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios, { AxiosResponse } from 'axios';

import store from '../store';
import { Profile, ServerResponse } from '../model';

@Component
export default class Callback extends Vue {
  mounted() {
    const token = this.$route?.hash?.substring(1);

    if (token) {
      store.commit('setAccessToken', token);

      axios
        .get('/action/profile')
        .then((response: AxiosResponse<ServerResponse<Profile>>) => {
          if (response.data.success) {
            store.commit('setProfile', response.data.result);
          }

          this.$router.push({ name: 'Home' });
        });
    } else {
      this.$router.push({ name: 'Home' });
    }
  }
}
</script>
