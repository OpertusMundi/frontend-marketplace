<template>
  <info-page
    :title="infoPage.title"
    text=""
    :btnText="infoPage.btnText"
    :btnLink="infoPage.btnLink">
  </info-page>
  <!-- <info-page
    title="Thank you for your order!"
    text="We are processing your payment. An order confirmation has been generated and is available in your Purchases."
    btnText="VIEW ORDER"
    btnLink="/">
  </info-page> -->
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoPage from '@/components/InfoPage.vue';
import ConsumerPayInApi from '@/service/consumer-payin';
import store from '@/store';
import { EnumTransactionStatus } from '@/model/payin';

@Component({
  components: { InfoPage },
})
export default class PayInRedirection extends Vue {
  consumerPayInApi: ConsumerPayInApi;

  infoPage: { title: string, btnText: string, btnLink: string };

  constructor() {
    super();

    this.consumerPayInApi = new ConsumerPayInApi();

    this.infoPage = { title: '', btnText: 'VIEW ORDER', btnLink: '' };
  }

  mounted():void {
    console.log('payInKey', this.$route.params.payInKey);

    const key = this.$route.params.payInKey;
    this.getPayIn(key);
  }

  getPayIn(payInKey: string): void {
    console.log('key', payInKey);
    store.commit('setLoading', true);
    this.consumerPayInApi.getPayIn(payInKey).then((response) => {
      if (response.success) {
        console.log('success, pay in response:', response);
        const cases = [
          { status: EnumTransactionStatus.SUCCEEDED, title: 'Order succeeded!' },
          { status: EnumTransactionStatus.FAILED, title: 'Order failed' },
          { status: EnumTransactionStatus.CREATED, title: 'Order created' },
        ];

        // handle empty-result issue in API call
        if (!response.result && response.success) {
          Vue.set(this.infoPage, 'title', cases.find((x) => x.status === EnumTransactionStatus.SUCCEEDED)?.title || '');
          Vue.set(this.infoPage, 'btnLink', '/dashboard');
          return;
        }

        // eslint-disable-next-line
        const title = cases.find((x) => x.status === response.result.status)!.title;
        Vue.set(this.infoPage, 'title', title);

        if (response.result.items && 'order' in response.result.items[0]) {
          const purchaseLink = `/dashboard/purchase/${response.result.items[0].order.key}`;
          Vue.set(this.infoPage, 'btnLink', purchaseLink);
        } else {
          const subscriptionsLink = '/dashboard/subscriptions';
          Vue.set(this.infoPage, 'btnLink', subscriptionsLink);
        }
      } else {
        console.log('error getting pay in', response);
        const title = 'Order failed';
        Vue.set(this.infoPage, 'title', title);
      }
      store.commit('setLoading', false);
    }).catch((err) => {
      console.log('error getting payin', err);
      store.commit('setLoading', false);
    });
  }
}
</script>
