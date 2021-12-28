<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <h1>Hello, {{ fullName }}!</h1>
    </div>

    <!-- USER / CONSUMER -->
    <div v-if="!isProvider">
      <!-- <div> -->
      <div class="row mb-md-100">
        <div class="col-md-6">
          <h3 class="mb-xs-20">Latest purchases</h3>
          <router-link
            v-if="!isConsumer"
            :to="$store.getters.isAccountActivated ? '/become-consumer' : ''"
            @click.native="$store.getters.isAccountActivated ? () => {} : $store.commit('setShownGlobalModal', 'modalPendingAccountActivation')"
            class="btn btn--std btn--outlineblue">
            become a consumer
          </router-link>
          <div v-else>
            <purchase-card v-for="(purchase, i) in latestPurchases" :key="purchase.key" :purchase="purchase" :index="i + 1"></purchase-card>
            <div v-if="latestPurchases && latestPurchases.length === 0">
              <p>No purchases yet <button class="btn btn--std btn--outlineblue" @click="$router.push('/catalogue')">BECOME A VENDOR</button></p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h3 class="mb-xs-20">Latest active subscriptions</h3>
          <p v-if="latestActiveSubscriptions && latestActiveSubscriptions.length === 0">No active subscriptions</p>
          <horizontal-card v-for="subscription in latestActiveSubscriptions" v-bind:key="subscription.assetId" :title="subscription.item.title" price="" subtitle="" link="#" linkText="VIEW SUBSCRIPTION" :infoText="`<strong>Start date</strong>: ${formatDate(subscription.addedOn)} <a href='#'>@${subscription.provider.name}</a>`" topRight="ACTIVE" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3 class="mb-xs-20">Latest messages</h3>
          <p>No messages</p>
        </div>
        <div class="col-md-6">
          <h3 class="mb-xs-20">Recently favourited assets</h3>
          <p>No favourited assets</p>
        </div>
      </div>
    </div>

    <!-- PROVIDER -->
    <div v-else>
      <div class="stats-cards">
        <!-- <div class="stats-cards"> -->
        <div class="stats-cards__cont stats-cards__cont--double">
          <div class="stats-card">
            <div class="stats-card__upper">
              <h3 class="stats-card__title">Total earnings</h3>
              <div class="stats-card__filter">
                <div class="ds_select">
                  <select name="version">
                    <option value="" default selected>ALL TIME</option>
                    <option value="">LAST 3 MONTHS</option>
                    <option value="">LAST 6 MONTHS</option>
                    <option value="">LAST YEAR</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="stats-card__value">€0</div>
          </div>
          <div class="stats-card">
            <div class="stats-card__upper">
              <h3 class="stats-card__title">Total assets</h3>
              <div class="stats-card__filter">
                <div class="ds_select">
                  <select name="version">
                    <option value="" default selected>ALL TIME</option>
                    <option value="">LAST 3 MONTHS</option>
                    <option value="">LAST 6 MONTHS</option>
                    <option value="">LAST YEAR</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="stats-card__value">{{ itemsNum }}</div>
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
        <div class="stats-cards__cont">
          <div class="stats-card">
            <div class="stats-card__upper">
              <h3 class="stats-card__title">Viewer market segments</h3>
              <router-link :to="{ name: 'Analytics' }">MORE ANALYTICS <img src="@/assets/images/icons/right_arrow.svg" alt=""/></router-link>
              <!-- <div class="stats-card__filter">
                <div class="ds_select">
                  <select name="version">
                    <option value="" default selected>ALL TIME</option>
                    <option value="">LAST 3 MONTHS</option>
                    <option value="">LAST 6 MONTHS</option>
                    <option value="">LAST YEAR</option>
                  </select>
                </div>
              </div> -->
            </div>
            <div class="stats-card__chart">
              <sales-bar-chart :cardHeading="'Market Segment Sales'" :salesQueryMetricType="'SUM_SALES'" :symbol="'€'" :symbolTitle="'Sale in €'"></sales-bar-chart>
            </div>
          </div>
        </div>
      </div>
      <h3 class="mt-xs-60 mb-xs-20">Latest orders</h3>
      <order-card v-for="(order, i) in latestOrders" :key="order.key" :order="order" :index="i + 1"></order-card>
      <p v-if="latestOrders && latestOrders.length === 0">No orders</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BarChart from '@/components/Charts/BarChart.vue';
import LineChart from '@/components/Charts/LineChart.vue';
import OrderCard from '@/components/Orders/OrderCard.vue';
import PurchaseCard from '@/components/Purchases/PurchaseCard.vue';
import HorizontalCard from '@/components/HorizontalCard.vue';
import ProviderAssetsApi from '@/service/provider-assets';
import ProviderOrderApi from '@/service/provider-order';
import ConsumerOrderApi from '@/service/consumer-order';
import ConsumerApi from '@/service/consumer';
import store from '@/store';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import { EnumRole } from '@/model/role';
import { Sorting } from '@/model/request';
import { ConsumerOrder, EnumOrderSortField, ProviderOrder } from '@/model/order';
import SalesLineChart from '@/components/Aanalytics/SalesLineChart.vue';
import SalesBarChart from '@/components/Aanalytics/SalesBarChart.vue';
import { ConsumerAccountSubscription, EnumConsumerSubSortField } from '@/model/account-asset';
import moment from 'moment';

@Component({
  components: {
    BarChart,
    LineChart,
    OrderCard,
    PurchaseCard,
    HorizontalCard,
    SalesLineChart,
    SalesBarChart,
  },
})
export default class DashboardHome extends Vue {
  fullName: string;

  providerAssetsApi: ProviderAssetsApi;

  providerOrderApi: ProviderOrderApi;

  consumerOrderApi: ConsumerOrderApi;

  consumerApi: ConsumerApi;

  isProvider: boolean;

  isConsumer: boolean;

  itemsNum: number | null;

  latestOrders: ProviderOrder[] | null;

  latestPurchases: ConsumerOrder[] | null;

  latestActiveSubscriptions: ConsumerAccountSubscription[] | null;

  latestMessages: any[];

  latestFavourites: any[];

  isLoadingItemsNum: boolean;

  isLoadingLatestOrders: boolean;

  isLoadingLatestPurchases: boolean;

  isLoadingLatestActiveSubscriptions: boolean;

  constructor() {
    super();

    this.providerAssetsApi = new ProviderAssetsApi();
    this.providerOrderApi = new ProviderOrderApi();
    this.consumerOrderApi = new ConsumerOrderApi();
    this.consumerApi = new ConsumerApi();

    this.fullName = '';

    this.isProvider = store.getters.hasRole([EnumRole.ROLE_PROVIDER]);
    this.isConsumer = store.getters.hasRole([EnumRole.ROLE_CONSUMER]);

    this.itemsNum = null;
    this.latestOrders = null;
    this.latestPurchases = null;
    this.latestActiveSubscriptions = null;
    this.latestMessages = [];
    this.latestFavourites = [];

    this.isLoadingItemsNum = false;
    this.isLoadingLatestOrders = false;
    this.isLoadingLatestPurchases = false;
    this.isLoadingLatestActiveSubscriptions = false;
  }

  created(): void {
    const profile = store.getters.getProfile;
    this.fullName = `${profile.firstName} ${profile.lastName}`;

    if (this.isProvider) {
      this.setNumberOfItems();
      this.setLatestOrders();
    }
    if (this.isConsumer) {
      this.setLatestPurchases();
      this.setLatestActiveSubscriptions();
    }
  }

  get isLoading(): boolean {
    if (this.isLoadingItemsNum || this.isLoadingLatestOrders || this.isLoadingLatestPurchases || this.isLoadingLatestActiveSubscriptions) {
      return true;
    }
    return false;
  }

  @Watch('isLoading', { immediate: true })
  onLoadingChange(): void {
    store.commit('setLoading', this.isLoading);
  }

  setNumberOfItems(): void {
    this.isLoadingItemsNum = true;

    // todo: currently, providerAssetsApi does not work correctly (ignores parameters). Also, I can not ask api for multiple types.
    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.VECTOR,
      pageRequest: {
        page: 0,
        size: 100000,
      },
      sorting: {
        id: EnumProviderAssetSortField.TITLE,
        order: 'ASC',
      },
    };

    this.providerAssetsApi.find(query).then((response) => {
      this.itemsNum = response.result.count;
      this.isLoadingItemsNum = false;
    });
  }

  setLatestOrders(): void {
    this.isLoadingLatestOrders = true;

    const order: Sorting<EnumOrderSortField> = {
      id: EnumOrderSortField.CREATED_ON,
      order: 'DESC',
    };

    this.providerOrderApi.findOrders(null, null, 0, 3, order).then((ordersResponse) => {
      const { data } = ordersResponse;
      if (data.success) {
        this.latestOrders = data.result.items;
      }
      this.isLoadingLatestOrders = false;
    });
  }

  setLatestPurchases(): void {
    this.isLoadingLatestPurchases = true;

    const order: Sorting<EnumOrderSortField> = {
      id: EnumOrderSortField.CREATED_ON,
      order: 'DESC',
    };

    this.consumerOrderApi.findOrders(null, null, 0, 3, order).then((response) => {
      const { data } = response;
      if (data.success) {
        this.latestPurchases = data.result.items;
      }
      this.isLoadingLatestPurchases = false;
    });
  }

  setLatestActiveSubscriptions(): void {
    this.isLoadingLatestActiveSubscriptions = true;

    const order: Sorting<EnumConsumerSubSortField> = {
      id: EnumConsumerSubSortField.ADDED_ON,
      order: 'DESC',
    };

    this.consumerApi.findAllSubscriptions(null, 0, 3, order).then((response) => {
      const { data } = response;

      if (data.success) {
        this.latestActiveSubscriptions = data.result.items;
        console.log('latest active', this.latestActiveSubscriptions);
      }
      this.isLoadingLatestActiveSubscriptions = false;
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_stats.scss';
@import '@/assets/styles/_btns.scss';
@import '@/assets/styles/_select.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';
</style>
