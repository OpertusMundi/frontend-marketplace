<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Subscriptions</h1>
      </div>
    </div>

    <div class="filters">
      <div class="filters__block">
        <p class="filters__title" v-if="totalSubscriptions">{{ totalSubscriptions }} SUBSCRIPTION<span v-if="totalSubscriptions > 1">s</span></p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">SORT BY: </label>
          <select @change="setSortOrder($event)" v-model="selectedOrder" name="filter" id="filter">
            <option v-for="order in sortOrders" :key="order" :value="order">{{ order }}</option>
          </select>
        </div>
      </div>
    </div>
    <template v-if="subscriptions">
      <horizontal-card v-for="subscription in subscriptions" v-bind:key="subscription.serviceId" :title="subscription.item.title" price="500€/mo" subtitle="" link="#" linkText="VIEW SUBSCRIPTION" :infoText="`<strong>Start date</strong>: ${formatDate(subscription.addedOn)} <a href='#'>@${subscription.provider.name}</a>`" topRight="ACTIVE" />
      <pagination :currentPage="currentPage" :itemsPerPage="itemsPerPage" :itemsTotal="totalSubscriptions" @pageSelection="getSubscriptions($event)"></pagination>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HorizontalCard from '@/components/HorizontalCard.vue';
import Pagination from '@/components/Pagination.vue';
import { EnumConsumerSubSortField, ConsumerAccountSubscription } from '@/model/account-asset';
import { EnumSpatialDataServiceType } from '@/model/enum';

import { Sorting } from '@/model/request';
import ConsumerAPI from '@/service/consumer';
import store from '@/store';
import moment from 'moment';

@Component({
  components: {
    HorizontalCard,
    Pagination,
  },
})
export default class Subscriptions extends Vue {
  consumerApi: ConsumerAPI;

  itemsPerPage: number;

  totalSubscriptions: number | null;

  currentPage: number;

  selectedOrder: string;

  sortOrder: Sorting<EnumConsumerSubSortField>;

  sortOrders: EnumConsumerSubSortField[];

  subscriptions: ConsumerAccountSubscription[] | null;

  constructor() {
    super();
    this.consumerApi = new ConsumerAPI();
    this.itemsPerPage = 10;
    this.currentPage = 0;
    this.totalSubscriptions = null;
    this.subscriptions = null;
    this.sortOrder = {
      id: EnumConsumerSubSortField.ADDED_ON,
      order: 'DESC',
    };
    this.selectedOrder = EnumConsumerSubSortField.ADDED_ON;
    this.sortOrders = [EnumConsumerSubSortField.ADDED_ON, EnumConsumerSubSortField.UPDATED_ON, EnumConsumerSubSortField.TITLE, EnumConsumerSubSortField.PUBLISHER];
  }

  mounted(): void {
    this.getSubscriptions(0);
  }

  getSubscriptions(page: number): void {
    store.commit('setLoading', true);
    this.consumerApi
      .findAllSubscriptions(null, page, this.itemsPerPage, this.sortOrder)
      .then((response) => {
        store.commit('setLoading', false);
        console.log(response);
        this.totalSubscriptions = response.data.result.count;
        this.subscriptions = response.data.result.items;
      })
      .catch((e) => {
        store.commit('setLoading', false);
      });
  }

  setSortOrder(event): void {
    this.sortOrder.id = event.target.value;
    this.currentPage = 0;
    this.getSubscriptions(0);
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
</style>
