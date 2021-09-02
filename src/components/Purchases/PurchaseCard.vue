<template>
  <!-- <router-link :to="`/dashboard/assets/preview/${asset.key}`" class="purchase_card"> -->
  <!-- <router-link :to="asset.status === 'DRAFT' ? `/dashboard/assets/create/${asset.key}` : `/dashboard/assets/preview/${asset.key}`" class="purchase_card"> -->
  <router-link :to="`/dashboard/purchase/${ purchase.key }`" class="purchase_card purchase_card--purchase">
    <!-- <div class="purchase_card__view" :style="{'--color': getColor()}"><span>VIEW PURCHASE</span></div> -->
    <div class="purchase_card__view"><span>VIEW PURCHASE</span></div>
      <div class="purchase_card__inner">
      <!-- <div class="purchase_card__top">
        <div class="purchase_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>asset type</span><span>Environment, Natural resources</span></div>
        <div class="purchase_card__top__right"><span>asset status</span></div>
      </div> -->
      <div class="purchase_card__top">
        <!-- <div class="purchase_card__title">{{ `Purchase #${index}` }}</div> -->
        <div class="purchase_card__title">{{ getPurchaseAssets() }}</div>
        <!-- <div class="purchase_card__price">Order Placed</div> -->
        <div class="purchase_card__top__right purchase_card__top__right--blue"><span>{{ purchase.status }}</span></div>
      </div>
      <div class="purchase_card__bottom">
        <div class="purchase_card__bottom__left">
          <!-- <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="purchase_card__bottom__left__info">
            <span><strong>Version: </strong>1.0.1</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
          </div> -->
          <div class="purchase_card__bottom__left__info">{{ formatDate(purchase.createdOn) }}</div>
        </div>
        <div class="purchase_card__bottom__right">
          <!-- <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt=""> -->
          <div class="purchase_card__price">{{ `${purchase.totalPrice} €` }}</div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsumerOrder as Order } from '@/model/order';
import moment from 'moment';

@Component
export default class PurchaseCard extends Vue {
  @Prop({ required: true }) readonly purchase!: Order;

  @Prop({ required: true }) readonly index!: number;

  getPurchaseAssets(): string {
    // eslint-disable-next-line
    return this.purchase.items.map((x) => x.description).reduce((t, v, i) => (t += i < this.purchase.items.map((x) => x.description).length ? `${v}, ` : `${v}`));
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_purchases.scss";
</style>
