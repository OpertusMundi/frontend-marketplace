<template>
  <div class="dashboard__inner order_preview">
    <modal :withSlots="true" :show="modalToShow == 'modalFormDispute'" @dismiss="modalToShow = ''" :modalId="'modalFormDispute'">
      <template v-slot:body>
        <h1>Dispute order?</h1>

        <div class="form-group">
          <label for="modal_input_msg" class="mt-xs-20">Message</label>
          <textarea v-model="ticketData.text" class="form-group__text" type="text" rows="4" id="modal_input_msg"></textarea>
          <div class="errors" v-if="isErrorEmptyTextShown">Fill in text</div>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn--std btn--blue ml-xs-20" @click="disputeOrder">dispute</button>
      </template>
    </modal>

    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/purchases"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>
      <div class="dashboard__head__helpers dashboard__head__helpers--full-width dashboard__head__helpers--no-flex-wrap mt-xs-30 mb-xs-50 d-flex space-between">
        <h1>{{ order.referenceNumber ? `Purchase #${order.referenceNumber} - preview` : '' }}</h1>
        <div>
          <span>Is there an issue?</span>
          <button class="btn btn--std btn--text" @click="modalToShow = 'modalFormDispute'">contact us</button>
        </div>
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
        <span class="info-table__field info-table__field--large">Asset</span>
        <span v-if="['SUCCEEDED', 'PENDING_CONSUMER_RECEIVE_CONFIRMATION'].includes(order.status)">
          <span v-if="order.deliveryMethod !== 'DIGITAL_PLATFORM'">{{ order.items[0].description }}</span>
          <span v-else @click="order.items[0].type === 'SUBSCRIPTION' ? onNavigateToSubscription() : onDownloadResource()" class="info-table__value info-table__value--large btn-download-asset">{{ order.items[0].description }}
            <svg v-if="order.items[0].type !== 'SUBSCRIPTION'" class="ml-xs-10" data-name="Group 2117" xmlns="http://www.w3.org/2000/svg" width="14.727" height="15.708" viewBox="0 0 14.727 15.708"><g data-name="Group 753"><g data-name="Group 752"><path data-name="Path 2224" d="M11.246 7.16a.49.49 0 0 0-.447-.288H8.838V.491A.491.491 0 0 0 8.345 0H6.381a.491.491 0 0 0-.491.491v6.381H3.926a.491.491 0 0 0-.369.814l3.436 3.927a.49.49 0 0 0 .738 0l3.436-3.927a.489.489 0 0 0 .079-.526Z" fill="#190aff"/></g></g><g data-name="Group 755"><g data-name="Group 754"><path data-name="Path 2225" d="M12.763 10.8v2.945h-10.8V10.8H0v3.927a.981.981 0 0 0 .982.982h12.763a.981.981 0 0 0 .982-.982V10.8Z" fill="#190aff"/></g></g></svg>
          </span>
        </span>
        <span v-else class="info-table__value info-table__value--large">{{ order.items[0].description }}</span>

        <span class="info-table__field">Date Executed</span><span class="info-table__value">{{ formatDate(order.createdOn) }}</span>
        <span class="info-table__field">Provider</span><span class="info-table__value">{{ order.items[0].provider ? order.items[0].provider.name : '' }}</span> <!-- TODO: we currently have only 1 item -->
        <span class="info-table__field">Payment method</span><span class="info-table__value">{{ order.paymentMethod ? $labelize(order.paymentMethod) : '' }}</span>
        <span class="info-table__field">Shipping details</span><span class="info-table__value">{{ `${order.deliveryMethod ? $labelize(order.deliveryMethod) : ''}` }}</span>
        <span class="info-table__field">Purchase cost</span><span class="info-table__value">{{ `${order.totalPrice}€` }}</span>

        <span class="info-table__field">Contract</span>
        <span v-if="order.items[0].contractSignedOn" class="info-table__value"><button :disabled="!order" class="btn btn--std btn--blue" @click="onDownloadContract">download</button></span>
        <span v-else class="info-table__value">Contract is not ready</span>

        <span class="info-table__field">Invoice</span>
        <span v-if="order && order.invoicePrinted" class="info-table__value"><button class="btn btn--std btn--blue" @click="onDownloadInvoice">download</button></span>
        <span v-else class="info-table__value">Invoice is not ready</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
import moment from 'moment';
import ConsumerApi from '@/service/consumer';
import ConsumerOrderApi from '@/service/consumer-order';
import ConsumerContractsApi from '@/service/consumer-contracts';
import CatalogueApi from '@/service/catalogue';
import ConsumerAssetsApi from '@/service/consumer-assets';
import ConsumerTicketApi from '@/service/consumer-ticket';
import { EnumOrderStatus, ConsumerOrder as Order } from '@/model/order';
import StepProgressBar from '@/components/StepProgressBar.vue';
import Modal from '@/components/Modal.vue';
import { getOrderSteps, getOrderStatusDescription } from '@/helper/order-purchase';
import { CatalogueItemDetails } from '@/model/catalogue';
import { EnumConsumerTicketType, ConsumerTicketCommand } from '@/model/consumer-ticket';

@Component({
  components: {
    Modal,
    StepProgressBar,
  },
})
export default class DashboardPurchases extends Vue {
  consumerApi: ConsumerApi;

  consumerOrderApi: ConsumerOrderApi;

  consumerContractsApi: ConsumerContractsApi;

  catalogueApi: CatalogueApi;

  consumerAssetsApi: ConsumerAssetsApi;

  consumerTicketApi: ConsumerTicketApi;

  order: Order;

  ticketData: ConsumerTicketCommand;

  isErrorEmptyTextShown = false;

  modalToShow = '';

  constructor() {
    super();

    this.consumerApi = new ConsumerApi();
    this.consumerOrderApi = new ConsumerOrderApi();
    this.consumerContractsApi = new ConsumerContractsApi();
    this.catalogueApi = new CatalogueApi();
    this.consumerAssetsApi = new ConsumerAssetsApi();
    this.consumerTicketApi = new ConsumerTicketApi();

    this.order = {} as Order;
    this.ticketData = { resourceKey: '', text: '', type: EnumConsumerTicketType.ORDER };
  }

  @Watch('ticketData', { deep: true })
  onTicketDataChange(): void {
    this.isErrorEmptyTextShown = false;
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

        this.ticketData = { ...this.ticketData, resourceKey: this.order.key };
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
    store.commit('setLoading', true);
    this.consumerContractsApi.downloadContract(this.order.key, 1, true)
      .catch((err) => {
        console.log('err', err);
      }).finally(() => {
        store.commit('setLoading', false);
      });
  }

  onDownloadInvoice(): void {
    store.commit('setLoading', true);
    this.consumerOrderApi.downloadInvoice(this.order.key, true)
      .finally(() => store.commit('setLoading', false));
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

  onDownloadResource(): void {
    const { assetId } = this.order.items[0];

    if (!assetId) {
      console.log('no asset id');
      return;
    }

    store.commit('setLoading', true);
    this.catalogueApi.findOne(assetId)
      .then((response) => (response.result as CatalogueItemDetails).resources[0].id)
      .then((response) => (this.consumerAssetsApi.downloadResource(assetId, response)))
      .then(() => {
        store.commit('setLoading', false);
      });
  }

  onNavigateToSubscription(): void {
    store.commit('setLoading', true);

    this.consumerApi.orderKeyToSubscription(this.order.key).then((response) => {
      store.commit('setLoading', true);

      const { key: subscriptionKey } = response.result;
      this.$router.push(`/dashboard/subscriptions/${subscriptionKey}`);
    });
  }

  disputeOrder(): void {
    if (!this.ticketData.text) {
      this.isErrorEmptyTextShown = true;
      return;
    }

    store.commit('setLoading', true);
    this.consumerTicketApi.openTicket(this.ticketData)
      .then((response) => {
        if (response.success) this.$router.push('/dashboard/messages');
      })
      .finally(() => {
        store.commit('setLoading', false);
      });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_dashboard.scss";
@import "@/assets/styles/dashboard/_order-purchase-preview.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
