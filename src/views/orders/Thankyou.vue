<template>
  <info-page
    v-if="purchaseLink"
    title="Thank you for your order!"
    text="We are processing your payment. An order confirmation has been generated and is available in your Purchases."
    btnText="VIEW ORDER"
    :btnLink="purchaseLink">
  </info-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoPage from '@/components/InfoPage.vue';

@Component({
  components: { InfoPage },
})
export default class Thankyou extends Vue {
  purchaseLink: string;

  constructor() {
    super();

    this.purchaseLink = '';
  }

  mounted():void {
    console.log(this.$route.params.error);

    const key = this.$route.params.orderKey;
    this.purchaseLink = `/dashboard/purchase/${key}`;
  }
}
</script>
