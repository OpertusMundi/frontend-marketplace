<template>
  <div class="dashboard__inner order_preview">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/orders"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>
      <div class="dashboard__head__helpers mt-xs-30 mb-xs-50">
        <h1>Order preview</h1>
      </div>
    </div>

    <div v-if="!$store.getters.isLoading">
      <step-progress-bar :currentStep="getCurrentStep(order.status)"></step-progress-bar>

      <h3>{{ getStatusDescription(order.status) }}</h3>

      <!--
        TODO: if step 1, ask provider to accept/reject request (implemented in wireframe, not yet in API)
        also, we should consider having 1 view for order/purchase preview instead of 2 if template differences are few/minor
      -->

      <hr>

      <div class="info-table">
        <span class="info-table__field info-table__field--large">Asset</span><span class="info-table__value info-table__value--large">{{ order.items[0].description }}</span>
        <span class="info-table__field">Date Executed</span><span class="info-table__value">{{ formatDate(order.createdOn) }}</span>
        <!-- <span class="info-table__field">Provider</span><span class="info-table__value">provider (dummy)</span> -->
        <span class="info-table__field">Payment method</span><span class="info-table__value">{{ order.paymentMethod }}</span>
        <span class="info-table__field">Purchase cost</span><span class="info-table__value">{{ `${order.totalPrice}€` }}</span>
        <!-- <span class="info-table__field">Contract</span><span class="info-table__value">download link (dummy)</span> -->
        <span class="info-table__field">Contract</span><span class="info-table__value"><button class="btn btn--std btn--blue">download</button></span>
        <!-- <span class="info-table__field">Order confirmation</span><span class="info-table__value">download link (dummy)</span> -->
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import moment from 'moment';
import ProviderOrderApi from '@/service/provider-order';
import { EnumOrderStatus, ProviderOrder as Order } from '@/model/order';
import StepProgressBar from '@/components/StepProgressBar.vue';

@Component({
  components: {
    StepProgressBar,
  },
})
export default class DashboardPurchases extends Vue {
  providerOrderApi: ProviderOrderApi;

  order: Order;

  constructor() {
    super();

    this.providerOrderApi = new ProviderOrderApi();

    this.order = {} as Order;
  }

  mounted(): void {
    this.getOrder();
  }

  getOrder(): void {
    const { key } = this.$route.params;
    console.log('order key', key);

    this.providerOrderApi.getOrder(key).then((orderResponse) => {
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

  getCurrentStep(status: EnumOrderStatus): number {
    const steps = {
      CREATED: 1,
      CHARGED: 2,
      PENDING: 3,
      SUCCEEDED: 4,
    };
    return steps[status] ? steps[status] : 0;
  }

  getStatusDescription(status: EnumOrderStatus): string {
    // todo: check descriptions
    const descriptions = {
      CREATED: 'Order created. Awaiting vendor\'s approval.',
      CHARGED: 'PayIn created. Awaiting payment receival.',
      PENDING: 'Order payment has been received, asset delivery/subscription registration is pending.',
      CANCELLED: 'Order has been cancelled.',
      REFUNDED: 'Order has been cancelled and PayIn has been refunded.',
      SUCCEEDED: 'Order has been completed.',
    };
    return descriptions[status];
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_dashboard.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/dashboard/_order-purchase-preview.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
