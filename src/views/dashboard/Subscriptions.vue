<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Subscriptions</h1>
      </div>
    </div>

    <div class="filters">
      <div class="filters__block">
        <p class="filters__title" v-if="totalSubscriptions">{{ totalSubscriptions }} SUBSCRIPTION<template v-if="totalSubscriptions > 1">S</template></p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">SORT BY:</label>
          <select @change="setSortOrder($event)" v-model="selectedOrderOption" name="filter" id="filter">
            <option v-for="order in orderOptions" :key="order.label" :value="order.label" :selected="order.label === selectedOrderOption.label">{{ order.label }}</option>
          </select>
        </div>
      </div>
    </div>
    <template v-if="subscriptions">
      <horizontal-card v-for="subscription in subscriptions" v-bind:key="subscription.assetId" :title="subscription.item.title" :price="getSubscriptionPrice(subscription.pricingModel)" subtitle="" :link="`/dashboard/subscriptions/${subscription.key}`" linkText="VIEW SUBSCRIPTION" :infoText="`<strong>Start date</strong>: ${formatDate(subscription.addedOn)} <a href='#'>${subscription.provider.name}</a>`" :topRight="subscription.status === 'INACTIVE' ? `<span style='color: #6c6c6c'>INACTIVE</span>` : subscription.status" />
      <pagination :currentPage="currentPage" :itemsPerPage="itemsPerPage" :itemsTotal="totalSubscriptions" @pageSelection="getSubscriptions($event)"></pagination>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HorizontalCard from '@/components/HorizontalCard.vue';
import Pagination from '@/components/Pagination.vue';
import { EnumConsumerSubSortField, ConsumerAccountSubscription } from '@/model/account-asset';
import {
  BasePricingModelCommand,
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedRowPricingModelCommand,
  PerCallPricingModelCommand,
  PerRowPricingModelCommand,
  SHSubscriptionPricingModelCommand,
} from '@/model/pricing-model';

// import { Sorting } from '@/model/request';
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

  orderOptions: { label: string, field: EnumConsumerSubSortField, order: 'ASC' | 'DESC' }[];

  selectedOrderOption: string;

  subscriptions: ConsumerAccountSubscription[] | null;

  constructor() {
    super();

    this.consumerApi = new ConsumerAPI();

    this.itemsPerPage = 10;
    this.currentPage = 0;
    this.totalSubscriptions = null;

    this.subscriptions = null;

    this.orderOptions = [
      { label: 'SUBMISSION DATE ASCENDING', field: EnumConsumerSubSortField.ADDED_ON, order: 'ASC' },
      { label: 'SUBMISSION DATE DESCENDING', field: EnumConsumerSubSortField.ADDED_ON, order: 'DESC' },
      { label: 'STATUS UPDATE ASCENDING', field: EnumConsumerSubSortField.UPDATED_ON, order: 'ASC' },
      { label: 'STATUS UPDATE DESCENDING', field: EnumConsumerSubSortField.UPDATED_ON, order: 'DESC' },
      { label: 'TITLE ASCENDING', field: EnumConsumerSubSortField.TITLE, order: 'ASC' },
      { label: 'TITLE DESCENDING', field: EnumConsumerSubSortField.TITLE, order: 'DESC' },
      { label: 'PUBLISHER ASCENDING', field: EnumConsumerSubSortField.PUBLISHER, order: 'ASC' },
      { label: 'PUBLISHER DESCENDING', field: EnumConsumerSubSortField.PUBLISHER, order: 'DESC' },
    ];
    this.selectedOrderOption = this.orderOptions[3].label;
  }

  mounted(): void {
    this.getSubscriptions(0);
  }

  getSubscriptions(page: number): void {
    store.commit('setLoading', true);

    const sorting = {
      id: this.orderOptions.find((x) => x.label === this.selectedOrderOption)?.field || '' as EnumConsumerSubSortField,
      order: this.orderOptions.find((x) => x.label === this.selectedOrderOption)?.order as 'ASC' | 'DESC',
    };

    this.consumerApi
      .findAllSubscriptions(null, page, this.itemsPerPage, sorting)
      .then((response) => {
        store.commit('setLoading', false);
        console.log(response);
        this.totalSubscriptions = response.data.result.count;
        this.subscriptions = response.data.result.items;
      })
      .catch(() => {
        store.commit('setLoading', false);
      });
  }

  getSubscriptionPrice(pricingModel: BasePricingModelCommand): string {
    const { type } = pricingModel;

    let text = '';

    switch (type) {
      case EnumPricingModel.FIXED_PER_ROWS: {
        text = `${(pricingModel as FixedRowPricingModelCommand).price} / 1,000 rows`;
        break;
      }
      case EnumPricingModel.FIXED_FOR_POPULATION: {
        text = `${(pricingModel as FixedPopulationPricingModelCommand).price} / 10,000 people`;
        break;
      }
      case EnumPricingModel.PER_CALL: {
        text = `${(pricingModel as PerCallPricingModelCommand).price} / call`;
        break;
      }
      case EnumPricingModel.PER_ROW: {
        text = `${(pricingModel as PerRowPricingModelCommand).price} / row`;
        break;
      }
      case EnumPricingModel.SENTINEL_HUB_SUBSCRIPTION: {
        text = `${(pricingModel as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax} / month`;
        break;
      }
      default:
    }

    return text;
  }

  // eslint-disable-next-line
  setSortOrder(event: any): void {
    // this.sortOrder.id = event.target.value;
    this.selectedOrderOption = event.target.value;
    console.log(typeof event.target.value, 'ASD');
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
