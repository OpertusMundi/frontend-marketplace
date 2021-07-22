<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Received orders</h1>
      </div>
    </div>

    <div class="filters" v-if="!$store.getters.isLoading">
      <div class="filters__block">
        <p class="filters__title">{{ totalOrders }} ORDERS</p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">STATUS: </label>
          <select v-model="selectedStatus" name="filter" id="filter">
            <option v-for="status in statusFilterOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- <purchase-card v-for="order in orders" :key="order.key" :purchase="order"></purchase-card> -->
    <order-card v-for="order in orders" :key="order.key" :order="order"></order-card>

    <pagination :currentPage="currentPage" :itemsPerPage="5" :itemsTotal="totalOrders" @pageSelection="getOrders(null, $event, true)"></pagination>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
// import ConsumerOrderApi from '@/service/consumer-order';
import ProviderOrderApi from '@/service/provider-order';
import { EnumOrderSortField, EnumOrderStatus, ProviderOrder as Order } from '@/model/order';
import { Sorting } from '@/model/request';
// import PurchaseCard from '@/components/Purchases/PurchaseCard.vue';
import OrderCard from '@/components/Orders/OrderCard.vue';
import Pagination from '@/components/Pagination.vue';

@Component({
  components: {
    OrderCard,
    Pagination,
  },
})
export default class DashboardOrders extends Vue {
  providerOrderApi: ProviderOrderApi;

  orders: Order[];

  totalOrders: number | null;

  currentPage: number;

  statusFilterOptions: Array<EnumOrderStatus | string>;

  selectedStatus: EnumOrderStatus | string;

  constructor() {
    super();

    this.providerOrderApi = new ProviderOrderApi();

    this.orders = [];
    this.totalOrders = null;
    this.currentPage = 0;
    this.statusFilterOptions = [
      'ALL',
      EnumOrderStatus.CREATED,
      EnumOrderStatus.CHARGED,
      EnumOrderStatus.PENDING,
      EnumOrderStatus.CANCELLED,
      EnumOrderStatus.REFUNDED,
      EnumOrderStatus.SUCCEEDED,
    ];
    const [selectedStatus] = this.statusFilterOptions;
    this.selectedStatus = selectedStatus;
  }

  mounted(): void {
    this.getOrders(null, 0);
  }

  @Watch('selectedStatus')
  onSelectedStatusChange(selectedStatus: string): void {
    const status = selectedStatus === 'ALL' ? null : [selectedStatus as EnumOrderStatus];
    this.getOrders(status, 0, true);
  }

  getOrders(status: EnumOrderStatus[] | null, page: number, scrollBehavior = false): void {
    store.commit('setLoading', true);
    const referenceNumber = null;
    const size = 5;
    const order: Sorting<EnumOrderSortField> = {
      id: EnumOrderSortField.MODIFIED_ON,
      order: 'DESC',
    };
    this.providerOrderApi.findOrders(status, referenceNumber, page, size, order).then((ordersResponse) => {
      const { data } = ordersResponse;

      if (data.success) {
        store.commit('setLoading', false);
        this.orders = data.result.items;
        this.totalOrders = data.result.count;
        this.currentPage = data.result.pageRequest.page;
        if (scrollBehavior) {
          window.scrollTo({
            top: 0,
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
@import "@/assets/styles/_filters.scss";
</style>
