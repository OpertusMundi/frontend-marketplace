<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Earnings</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Earnings extends Vue {
}
</script>
<style lang="scss">
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_dashboard.scss";
</style>
