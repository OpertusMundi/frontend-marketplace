<template>
  <router-link :to="`order/${ order.key }`" class="asset_card asset_card__order">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW ORDER</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__title">{{ `Order #${index}` }}</div>
        <div class="asset_card__top__right asset_card__top__right--blue"><span>{{ order.status }}</span></div>
      </div>
      <div class="asset_card__center">
        <div>
          <span v-for="(asset, i) in order.items" :key="asset.assetId">{{ asset.description }}{{ i !== order.items.length - 1 ? ', ' : '' }}</span>
        </div>
        <!-- <div class="asset_card__price">300€</div> -->
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="asset_card__bottom__left__info">
            <span><strong>Consumer: </strong>{{ order.consumer.name }}</span>
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

  @Prop({ required: true }) readonly index!: number;

  // TODO
  getColor(): string {
    const color = '#190AFF';
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
