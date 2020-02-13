<template>
  <div class="callback"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios from 'axios';

import store from '../store';

@Component
export default class Callback extends Vue {
  mounted() {
    const token = this.$route?.hash?.substring(1);

    if (token) {
      store.commit('setToken', token);

      axios.get('/action/profile').then((response) => {
        store.commit('setProfile', response.data);

        this.$router.push({ name: 'Home' });
      });
    } else {
      this.$router.push({ name: 'Home' });
    }
  }
}
</script>
