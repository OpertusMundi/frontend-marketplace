<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Subscriptions</h1>
      </div>
    </div>

    <div class="filters" v-if="!$store.getters.isLoading">
      <div class="filters__block">
        <p class="filters__title">9 SUBSCRIPTIONS</p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">STATUS: </label>
        </div>
      </div>
    </div>
    <horizontal-card title="TEST TITLE" price="500€/mo" subtitle="contractTemplate.title" link="/dashboard/contracts/${contractTemplate.key}" linkText="VIEW CONTRACT" infoText="`<strong>Last updated</strong>: ${formatDate(contractTemplate.modifiedAt)} • <strong>Version</strong>: ${contractTemplate.version}`" topRight="PUBLISHED" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HorizontalCard from '@/components/HorizontalCard.vue';
import Pagination from '@/components/Pagination.vue';
import store from '@/store';
import moment from 'moment';

@Component({
  components: {
    HorizontalCard,
    Pagination,
  },
})
export default class Subscriptions extends Vue {
  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
</style>
