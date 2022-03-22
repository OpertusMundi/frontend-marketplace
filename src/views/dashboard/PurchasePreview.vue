<template>
  <div class="dashboard__inner order_preview">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/purchases"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>
      <div class="dashboard__head__helpers mt-xs-30 mb-xs-50">
        <h1>Purchase preview</h1>
      </div>
    </div>

    <div v-if="!$store.getters.isLoading">
      <!-- <step-progress-bar :currentStep="getCurrentStep(order.status)"></step-progress-bar> -->
      <step-progress-bar :steps="getSteps()"></step-progress-bar>

      <div v-if="order.status === 'PENDING_CONSUMER_RECEIVE_CONFIRMATION'" class="mt-xs-50">
        <h4 class="mb-xs-20">Update order status?</h4>
        <button @click="onOrderDeliveredConfirmation" class="btn btn--std btn--blue">Order is Delivered</button>
      </div>
      <div v-else-if="order.status === 'PROVIDER_ACCEPTED'" class="mt-xs-50">
        <router-link :to="`/checkout/${order.key}`" class="btn btn--std btn--blue">Proceed to Checkout</router-link>
      </div>
      <h3 v-else>{{ getStatusDescription(order.status) }}</h3>

      <hr>

      <div class="info-table">
        <span class="info-table__field info-table__field--large">Asset</span><span class="info-table__value info-table__value--large">{{ order.items[0].description }}</span>
        <span class="info-table__field">Date Executed</span><span class="info-table__value">{{ formatDate(order.createdOn) }}</span>
        <!-- <span class="info-table__field">Provider</span><span class="info-table__value">provider (dummy)</span> -->
        <span class="info-table__field">Payment method</span><span class="info-table__value">{{ order.paymentMethod }}</span>
        <span class="info-table__field">Purchase cost</span><span class="info-table__value">{{ `${order.totalPrice}€` }}</span>
        <!-- <span class="info-table__field">Contract</span><span class="info-table__value">download link (dummy)</span> -->

        <span class="info-table__field">Contract</span>
        <span v-if="order.items[0].contractSignedOn" class="info-table__value"><button class="btn btn--std btn--blue" @click="onDownloadContract">download</button></span>
        <span v-else class="info-table__value">Contract is not ready</span>
        <!-- <span class="info-table__field">Order confirmation</span><span class="info-table__value">download link (dummy)</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import moment from 'moment';
import ConsumerOrderApi from '@/service/consumer-order';
import ConsumerContractsApi from '@/service/consumer-contracts';
import CatalogueApi from '@/service/catalogue';
import { EnumOrderStatus, ConsumerOrder as Order } from '@/model/order';
import StepProgressBar from '@/components/StepProgressBar.vue';
import { CatalogueItemDetails } from '@/model/catalogue';
import { getOrderSteps, getOrderStatusDescription } from '@/helper/order-purchase';
import { saveAs } from 'file-saver';

@Component({
  components: {
    StepProgressBar,
  },
})
export default class DashboardPurchases extends Vue {
  consumerOrderApi: ConsumerOrderApi;

  consumerContractsApi: ConsumerContractsApi;

  catalogueApi: CatalogueApi;

  order: Order;

  constructor() {
    super();

    this.consumerOrderApi = new ConsumerOrderApi();
    this.consumerContractsApi = new ConsumerContractsApi();
    this.catalogueApi = new CatalogueApi();

    this.order = {} as Order;
  }

  mounted(): void {
    this.getOrder();
  }

  getOrder(): void {
    const { key } = this.$route.params;
    console.log('order key', key);

    this.consumerOrderApi.getOrder(key).then((orderResponse) => {
      if (orderResponse.success) {
        this.order = orderResponse.result;
        console.log(this.order);
        store.commit('setLoading', false);
      } else {
        // todo: handle
        console.log('error fetching order', orderResponse);
      }
    });
  }

  getSteps(): { status: EnumOrderStatus, label: string, completed: boolean, active: boolean }[] {
    return getOrderSteps(this.order);
  }

  getStatusDescription(status: EnumOrderStatus): string {
    return getOrderStatusDescription(status);
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YY');
  }

  // TODO: ATTENTION: currently works for only one asset item (index: 1);
  onDownloadContract(): void {
    console.log('d');
    store.commit('setLoading', true);
    this.consumerContractsApi.downloadContract(this.order.key, 1, true).then((response) => {
      console.log('pdf', response.data);
      const blob = new Blob([(response as any).data], { type: 'application/pdf' });

      const assetId = this.order.items[0].assetId ? this.order.items[0].assetId : '';
      console.log('asset id', assetId, this.order);
      this.catalogueApi.findOne(assetId).then((assetResponse) => {
        const title = (assetResponse.result as CatalogueItemDetails).contract.title.replaceAll(' ', '_');
        saveAs(blob, title);
        store.commit('setLoading', false);
      }).catch((err) => {
        console.log('err', err);
        store.commit('setLoading', false);
      });
    }).then((err) => {
      console.log('err', err);
    });
  }

  onOrderDeliveredConfirmation(): void {
    store.commit('setLoading', true);

    this.consumerOrderApi.confirmDelivery(this.order.key).then((response) => {
      if (response.success) {
        this.order = response.result;
      } else {
        console.log('err', response);
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally(() => {
      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_dashboard.scss";
@import "@/assets/styles/dashboard/_order-purchase-preview.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
