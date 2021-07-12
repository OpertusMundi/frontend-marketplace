<template>
  <router-link :to="`order/${ order.key }`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW ORDER</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__title">Asset title</div>
        <div class="asset_card__top__right"><span>{{ order.status }}</span></div>
      </div>
      <div class="asset_card__center">
        <div>Asset title, Asset title</div>
        <!-- <div class="asset_card__price">300€</div> -->
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <span><strong>@buyer</strong></span>
          <div class="asset_card__bottom__left__info">
            <span><strong>Order created: </strong>{{ formatDate(order.createdOn) }}</span>
            <span><strong>Last order update: </strong>{{ formatDate(order.statusUpdatedOn) }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right">
          <div class="asset_card__price">{{ `${order.totalPrice} €` }}</div>
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
export default class OrderCard extends Vue {
  @Prop({ required: true }) readonly order!: Order;

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
  @import "@/assets/styles/_assets.scss";
</style>
