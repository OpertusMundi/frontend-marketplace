<template>
  <!-- <router-link :to="`/dashboard/assets/preview/${asset.key}`" class="purchase_card"> -->
  <!-- <router-link :to="asset.status === 'DRAFT' ? `/dashboard/assets/create/${asset.key}` : `/dashboard/assets/preview/${asset.key}`" class="purchase_card"> -->
  <router-link :to="`purchase/${ purchase.key }`" class="purchase_card purchase_card--purchase">
    <div class="purchase_card__view" :style="{'--color': getColor()}"><span>VIEW PURCHASE</span></div>
      <div class="purchase_card__inner" :style="{'--color': getColor()}">
      <!-- <div class="purchase_card__top">
        <div class="purchase_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>asset type</span><span>Environment, Natural resources</span></div>
        <div class="purchase_card__top__right"><span>asset status</span></div>
      </div> -->
      <div class="purchase_card__top">
        <div class="purchase_card__title">Asset Title</div>
        <!-- <div class="purchase_card__price">Order Placed</div> -->
        <div class="purchase_card__top__right"><span>{{ purchase.status }}</span></div>
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
import { Order } from '@/model/order';
import moment from 'moment';

@Component
export default class PurchaseCard extends Vue {
  @Prop({ required: true }) readonly purchase!: Order;

  // TODO
  getColor(): string {
    const color = '#358F8B';
    // let color = '#358F8B';
    // if (this.asset.command && this.asset.command.type === 'VECTOR') {
    //   color = '#358F8B';
    // } else if (this.asset.command && this.asset.command.type === 'SERVICE') {
    //   color = '#6F43B5';
    // } else if (this.asset.command && this.asset.command.type === 'RASTER') {
    //   color = '#197196';
    // }
    return color;
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_purchases.scss";
</style>
