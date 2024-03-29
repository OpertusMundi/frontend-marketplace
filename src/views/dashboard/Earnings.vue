<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Earnings</h1>
      </div>
    </div>
    <div>
      <div class="stats-cards">
        <div class="stats-cards__cont">
          <div class="stats-card">
            <router-link to="/dashboard/analytics" class="stats-card__more">MORE ANALYTICS</router-link>
            <div class="stats-card__upper">
              <h3 class="stats-card__title">Total earnings</h3>
            </div>
            <div class="stats-card__totals">
              <div class="stats-card__totals__head">
                <ul>
                  <li>
                    Total
                  </li>
                  <li>
                    APIs
                  </li>
                  <li>
                    Assets
                  </li>
                </ul>
              </div>
              <div class="stats-card__totals__amounts">
                <ul> <li v-for="{value, asset} in allAssetTypes" :key="asset"><span>€</span>{{ value }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="stats-cards__cont">
          <div class="stats-card">
            <div class="stats-card__upper">
              <h3 class="stats-card__title">Earnings</h3>
              <router-link :to="{ name: 'Analytics' }">MORE ANALYTICS <img src="@/assets/images/icons/right_arrow.svg" alt=""/></router-link>
            </div>
            <div class="stats-card__chart">
              <sales-line-chart :cardHeading="'Earnings'" :salesQueryMetricType="'SUM_SALES'" :symbol="'Sale in €'" :symbolTitle="'Earnings'"></sales-line-chart>
            </div>
          </div>
        </div>
        <div class="stats-cards__cont"></div>
      </div>

      <hr class="mt-xs-50 mb-xs-50 seperator-transaction-history" />
      <div class="d-flex space-between">
        <h2 class="mb-xs-30">Transaction history</h2>
        <div>
          <div class="asset_search asset_search--sm asset_search--grey-border">
            <div class="asset_search__upper asset_search__upper--no-functional-search-button">
              <input type="text" name="" id="" placeholder="Search by reference number" class="asset_search__upper__input" @input="onReferenceNumberSearchChange($event.target.value)">
              <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt=""></div>
            </div>
          </div>
        </div>
      </div>
      <div class="filters">
        <div class="filters__block">
          <p class="filters__title">
            <template v-if="!$store.getters.isLoading"> {{ totalOrders }} TRANSACTIONS </template>
          </p>
        </div>
        <div class="filters__block">
          <div class="filters__block__select">
            <label for="filter">&uarr;&darr;</label>
            <select v-model="selectedOrderOption" name="filter" id="filter">
              <option v-for="orderOption in ['CREATED ASCENDING', 'CREATED DESCENDING', 'MODIFIED ASCENDING', 'MODIFIED DESCENDING', 'TOTAL PRICE ASCENDING', 'TOTAL PRICE DESCENDING']" :key="orderOption">{{ orderOption }}</option>
            </select>
          </div>
        </div>
      </div>

      <order-card v-for="(order, i) in orders" :key="order.key" :order="order" :index="currentPage * itemsPerPage + i + 1"></order-card>

      <pagination :currentPage="currentPage" :itemsPerPage="itemsPerPage" :itemsTotal="totalOrders" @pageSelection="getSucceededOrders($event, true)"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import ProviderOrderApi from '@/service/provider-order';
import { EnumOrderSortField, EnumOrderStatus, ProviderOrder } from '@/model/order';
import OrderCard from '@/components/Orders/OrderCard.vue';
import Pagination from '@/components/Pagination.vue';
import { Order } from '@/model/request';
import store from '@/store';
import SalesLineChart from '@/components/Aanalytics/SalesLineChart.vue';
import AnalyticsApi from '@/service/analytics';
import {
  DataPoint,
  EarningsAssetTypeQuery,
  EnumAssetTypeDimension,
  EnumSalesQueryMetric,
} from '@/model/analytics';

@Component({
  components: {
    OrderCard,
    Pagination,
    SalesLineChart,
  },
})
export default class Earnings extends Vue {
  providerOrderApi: ProviderOrderApi;

  currentPage: number;

  itemsPerPage: number;

  totalOrders: number | null;

  orders: ProviderOrder[];

  selectedOrderOption: string;

  referenceNumberSearch = '';

  analyticsApi: AnalyticsApi;

  allAssetTypes: DataPoint[];

  constructor() {
    super();

    this.providerOrderApi = new ProviderOrderApi();

    this.currentPage = 0;
    this.itemsPerPage = 5;
    this.totalOrders = null;

    this.orders = [];

    this.selectedOrderOption = 'MODIFIED DESCENDING';

    this.analyticsApi = new AnalyticsApi();

    this.allAssetTypes = [];
  }

  @Debounce(500)
  onReferenceNumberSearchChange(search: string): void {
    this.referenceNumberSearch = search.startsWith('#') ? search.slice(1) : search;
  }

  created(): void {
    this.getSucceededOrders(0);
  }

  mounted(): void {
    this.getTotalEarningsAssetTypes();
  }

  @Watch('selectedOrderOption')
  onSelectedOrderOption(): void {
    this.getSucceededOrders(0);
  }

  @Watch('referenceNumberSearch')
  onDebouncedSearch(): void {
    this.getSucceededOrders(0);
  }

  /**
   * Earnings API Calls
   */
  getTotalEarningsAssetTypes(): void {
    const query: EarningsAssetTypeQuery = {
      dimension: EnumAssetTypeDimension.ALL_ASSET_TYPES,
      metric: EnumSalesQueryMetric.SUM_SALES,
    };
    this.analyticsApi.executeEarningsAssetTypeQuery(query).then((response) => {
      this.allAssetTypes = response.result.points;
    });
  }

  getSucceededOrders(page: number, scrollBehavior = false): void {
    store.commit('setLoading', true);

    const referenceNumber = this.referenceNumberSearch || null;
    const size = this.itemsPerPage;

    const orderOptions = [
      { option: 'CREATED ASCENDING', orderBy: EnumOrderSortField.CREATED_ON, order: 'ASC' },
      { option: 'CREATED DESCENDING', orderBy: EnumOrderSortField.CREATED_ON, order: 'DESC' },
      { option: 'MODIFIED ASCENDING', orderBy: EnumOrderSortField.MODIFIED_ON, order: 'ASC' },
      { option: 'MODIFIED DESCENDING', orderBy: EnumOrderSortField.MODIFIED_ON, order: 'DESC' },
      { option: 'TOTAL PRICE ASCENDING', orderBy: EnumOrderSortField.TOTAL_PRICE, order: 'ASC' },
      { option: 'TOTAL PRICE DESCENDING', orderBy: EnumOrderSortField.TOTAL_PRICE, order: 'DESC' },
    ];

    const order = {
      // eslint-disable-next-line
      id: orderOptions.find((x) => x.option === this.selectedOrderOption)!.orderBy,
      // eslint-disable-next-line
      order: orderOptions.find((x) => x.option === this.selectedOrderOption)!.order as Order,
    };

    this.providerOrderApi.findOrders([EnumOrderStatus.SUCCEEDED], referenceNumber, page, size, order).then((ordersResponse) => {
      const { data } = ordersResponse;

      if (data.success) {
        store.commit('setLoading', false);
        this.orders = data.result.items;
        this.totalOrders = data.result.count;
        this.currentPage = data.result.pageRequest.page;
        if (scrollBehavior) {
          window.scrollTo({
            top: (document.querySelector('.seperator-transaction-history') as HTMLElement).offsetTop - (document.querySelector('.header') as HTMLElement).clientHeight,
            behavior: 'smooth',
          });
        }
      } else {
        // todo
        console.log('error fetching orders', data);
      }
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '@/assets/styles/_dashboard.scss';
@import '@/assets/styles/_filters.scss';
@import '@/assets/styles/_stats.scss';
</style>
