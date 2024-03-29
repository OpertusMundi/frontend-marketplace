<template>
  <div class="dashboard__inner order_preview">
    <!-- MODALS -->
    <modal :modalId="'modalRejectOrder'" :show="modalToShow === 'rejectOrder'" @dismiss="modalToShow = ''" @submit="rejectOrder" :title="'Reject order?'" :inputs="[{id: 'reason', name: 'reason', type: 'text'}]"></modal>

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
    <!-- END OF MODALS -->

    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/orders"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>
      <div class="dashboard__head__helpers dashboard__head__helpers--full-width dashboard__head__helpers--no-flex-wrap mt-xs-30 mb-xs-50 d-flex space-between">
        <h1>{{ order.referenceNumber ? `Order #${order.referenceNumber} - preview` : '' }}</h1>
        <div>
          <span>Is there an issue?</span>
          <button class="btn btn--std btn--text" @click="modalToShow = 'modalFormDispute'">contact us</button>
        </div>
      </div>
    </div>

    <div v-if="!$store.getters.isLoading">
      <step-progress-bar :steps="getSteps()"></step-progress-bar>

      <div v-if="order.status === 'PENDING_PROVIDER_APPROVAL'">
        <h4 class="mb-xs-20">You received a new pucrhase request</h4>
        <button @click="onAcceptOrRejectOrder(true)" class="btn btn--std btn--blue">accept</button>
        <button @click="modalToShow = 'rejectOrder'" class="btn btn--std btn--blue ml-xs-20">reject</button>
      </div>
      <div v-else-if="order.status === 'PENDING_PROVIDER_SEND_CONFIRMATION'" class="mt-xs-50">
        <h4 class="mb-xs-20">Update order status?</h4>
        <button @click="onOrderShippedConfirmation" class="btn btn--std btn--blue">Order is Shipped</button>
      </div>
      <h3 v-else>{{ getStatusDescription(order.status) }}</h3>

      <hr>

      <div class="info-table">
        <span class="info-table__field info-table__field--large">Asset</span><span class="info-table__value info-table__value--large">{{ order.items[0].description }}</span>
        <span class="info-table__field">Date Executed</span><span class="info-table__value">{{ formatDate(order.createdOn) }}</span>
        <span class="info-table__field">Payment method</span><span class="info-table__value">{{ order.paymentMethod ? $labelize(order.paymentMethod) : '' }}</span>
        <span class="info-table__field">Purchase cost</span><span class="info-table__value">{{ `${order.totalPrice}€` }}</span>

        <span class="info-table__field">Contract</span>
        <span v-if="order.items[0].contractSignedOn" class="info-table__value"><button :disabled="!order" class="btn btn--std btn--blue" @click="onDownloadContract">download</button></span>
        <span v-else class="info-table__value">Contract is not ready</span>

        <span class="info-table__field">Data user</span><span class="info-table__value">{{ `${order.consumer ? order.consumer.name : ''}` }}</span>
        <span class="info-table__field">Shipping details</span><span class="info-table__value">{{ `${order.deliveryMethod ? $labelize(order.deliveryMethod) : ''}` }}</span>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
import moment from 'moment';
import ProviderOrderApi from '@/service/provider-order';
import ProviderContractApi from '@/service/provider-contract';
import ProviderTicketApi from '@/service/provider-ticket';
import { EnumOrderStatus, ProviderOrder as Order } from '@/model/order';
import { EnumProviderTicketType, ProviderTicketCommand } from '@/model/provider-ticket';
import StepProgressBar from '@/components/StepProgressBar.vue';
import Modal from '@/components/Modal.vue';
import { getOrderSteps, getOrderStatusDescription } from '@/helper/order-purchase';

@Component({
  components: {
    StepProgressBar,
    Modal,
  },
})
export default class DashboardPurchases extends Vue {
  providerOrderApi: ProviderOrderApi;

  providerContractApi: ProviderContractApi;

  providerTicketApi: ProviderTicketApi;

  order: Order;

  ticketData: ProviderTicketCommand;

  isErrorEmptyTextShown = false;

  modalToShow: string;

  constructor() {
    super();

    this.providerOrderApi = new ProviderOrderApi();
    this.providerContractApi = new ProviderContractApi();
    this.providerTicketApi = new ProviderTicketApi();

    this.order = {} as Order;

    this.modalToShow = '';
    this.ticketData = { resourceKey: '', text: '', type: EnumProviderTicketType.ORDER };
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

    this.providerOrderApi.getOrder(key).then((orderResponse) => {
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
    this.providerContractApi.downloadContract(this.order.key, 1, true)
      .finally(() => store.commit('setLoading', false));
  }

  onOrderShippedConfirmation(): void {
    store.commit('setLoading', true);

    this.providerOrderApi.confirmShipping(this.order.key).then((response) => {
      if (response.success) {
        this.order = response.result;
      } else {
        console.log('error updating order status to shipped', response);
      }
    }).catch((err) => {
      console.log('error', err);
    }).finally(() => {
      store.commit('setLoading', false);
    });
  }

  onAcceptOrRejectOrder(accepted: boolean, reason?: string): void {
    store.commit('setLoading', true);
    this.providerOrderApi.acceptOrRejectOrder(this.order.key, accepted, reason).then((response) => {
      if (response.success) {
        this.order = response.result;
      } else {
        console.log('error', response);
      }
    }).catch((err) => {
      console.log('error', err);
    }).finally(() => {
      store.commit('setLoading', false);
    });
  }

  // eslint-disable-next-line
  rejectOrder(data: any): void {
    const reason = data.inputValues[0].value;
    this.onAcceptOrRejectOrder(false, reason);
  }

  disputeOrder(): void {
    if (!this.ticketData.text) {
      this.isErrorEmptyTextShown = true;
      return;
    }

    store.commit('setLoading', true);
    this.providerTicketApi.openTicket(this.ticketData)
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
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/dashboard/_order-purchase-preview.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
