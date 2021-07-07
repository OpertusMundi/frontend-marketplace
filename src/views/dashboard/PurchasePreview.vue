<template>
  <div class="dashboard__inner">
    <div class="dashboard__head dashboard__head--column">
      <a href="/dashboard/purchases" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a>
      <div class="dashboard__head__helpers mt-xs-30 mb-xs-50">
        <h1>Purchase preview</h1>
      </div>
    </div>

    <div class="stepper" v-if="currentStep">
      <div class="stepper__labels">
        <div class="stepper__labels__label"><span>Purchase requested</span></div>
        <div class="stepper__labels__label"><span>PayIn created</span></div>
        <div class="stepper__labels__label"><span>Payment has been received<br>delivery/subscription is pending</span></div>
        <div class="stepper__labels__label"><span>Order complete</span></div>
      </div>
      <div class="stepper__items">
        <div v-for="i in 4" :key="i" class="stepper__items__item" :class="{'stepper__items__item--completed': currentStep > i, 'stepper__items__item--active': currentStep === i}">
          <div class="stepper__items__item__counter"></div>
        </div>
      </div>
    </div>

    <h3 v-if="!isLoading">{{ getStatusDescription(order.status) }}</h3>

    <hr>

    <div class="info-table" v-if="!isLoading">
      <span class="info-table__field info-table__field--large">Asset</span><span class="info-table__value info-table__value--large">{{ order.items[0].description }}</span>
      <span class="info-table__field">Date Executed</span><span class="info-table__value">{{ formatDate(order.createdOn) }}</span>
      <span class="info-table__field">Provider</span><span class="info-table__value">provider (dummy)</span>
      <span class="info-table__field">Payment method</span><span class="info-table__value">{{ order.paymentMethod }}</span>
      <span class="info-table__field">Purchase cost</span><span class="info-table__value">{{ order.totalPrice }}</span>
      <span class="info-table__field">Contract</span><span class="info-table__value">download link (dummy)</span>
      <span class="info-table__field">Order confirmation</span><span class="info-table__value">download link (dummy)</span>
    </div>

    <div v-if="isLoading" class="dummy-loader" style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; z-index: 9999;"><h1>LOADER</h1></div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';
import ConsumerOrderApi from '@/service/consumer-order';
import { EnumOrderStatus, Order } from '@/model/order';

@Component
export default class DashboardPurchases extends Vue {
  consumerOrderApi: ConsumerOrderApi;

  order: Order;

  currentStep: number;

  // statusDescription: string;

  isLoading: boolean;

  constructor() {
    super();

    this.consumerOrderApi = new ConsumerOrderApi();

    this.order = {} as Order;
    this.currentStep = 0;
    this.isLoading = true;
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
        this.isLoading = false;
        console.log(this.order);
        this.setCurrentStep(this.order.status);
      } else {
        // todo: handle
        console.log('error fetching order', orderResponse);
      }
    });
  }

  setCurrentStep(status: EnumOrderStatus): void {
    const steps = {
      CREATED: 1,
      CHARGED: 2,
      PENDING: 3,
      SUCCEEDED: 4,
    };
    this.currentStep = steps[status] ? steps[status] : 0;
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
@import "@/assets/styles/dashboard/_purchase-preview.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
