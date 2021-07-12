<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Purchases</h1>
      </div>
    </div>

    <div class="filters" v-if="!isLoading">
      <div class="filters__block">
        <p class="filters__title">{{ totalPurchases }} PURCHASES</p>
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

    <purchase-card v-for="purchase in purchases" :key="purchase.key" :purchase="purchase"></purchase-card>

    <pagination :currentPage="currentPage" :itemsPerPage="5" :itemsTotal="totalPurchases" @pageSelection="getOrders(null, $event, true)"></pagination>

    <div v-if="isLoading" class="dummy-loader" style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; z-index: 9999;"><h1>LOADER</h1></div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ConsumerOrderApi from '@/service/consumer-order';
import { EnumOrderSortField, EnumOrderStatus, ConsumerOrder as Order } from '@/model/order';
import { Sorting } from '@/model/request';
import PurchaseCard from '@/components/Purchases/PurchaseCard.vue';
import Pagination from '@/components/Pagination.vue';

@Component({
  components: {
    PurchaseCard,
    Pagination,
  },
})
export default class DashboardPurchases extends Vue {
  consumerOrderApi: ConsumerOrderApi;

  isLoading: boolean;

  purchases: Order[];

  totalPurchases: number | null;

  currentPage: number;

  statusFilterOptions: Array<EnumOrderStatus | string>;

  selectedStatus: EnumOrderStatus | string;

  constructor() {
    super();

    this.consumerOrderApi = new ConsumerOrderApi();

    this.isLoading = true;
    this.purchases = [];
    this.totalPurchases = null;
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
    this.isLoading = true;
    const referenceNumber = null;
    const size = 5;
    const order: Sorting<EnumOrderSortField> = {
      id: EnumOrderSortField.MODIFIED_ON,
      order: 'DESC',
    };
    this.consumerOrderApi.findOrders(status, referenceNumber, page, size, order).then((ordersResponse) => {
      const { data } = ordersResponse;

      if (data.success) {
        this.isLoading = false;
        this.purchases = data.result.items;
        this.totalPurchases = data.result.count;
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
