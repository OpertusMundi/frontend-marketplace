<template>
  <div class="asset_card asset_card--sm asset_card--nohover asset_card--border-always-shown">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <card-icon :asset="item.asset"></card-icon>
          <span class="asset_card__type">{{ item.asset.type === 'BUNDLE' ? 'COLLECTION' : item.asset.type }}</span>
        </div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ item.asset.title }}</div>
        <div class="asset_card__price">{{ item.pricingModel.quotation ? `${item.pricingModel.quotation.totalPrice}€` : '' }}</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ item.asset.version }}</span><span><strong>Supplier: </strong>{{ item.asset.publisherName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import { CartItem } from '@/model/cart';
import { EnumAssetType } from '@/model/enum';
import { getAssetCardColor } from '@/helper/cards';
// import moment from 'moment';

@Component({
  components: { CardIcon },
})
export default class CartMiniCard extends Vue {
  @Prop({ required: true }) readonly item!: CartItem;

  getColor = (): string => getAssetCardColor(this.item.asset.type as EnumAssetType);

  // formatDate(date: string): string {
  //   return moment(date).format('MMM Do YY');
  // }
}
</script>
<style lang="scss">
  // @import "@/assets/styles/_purchases.scss";
  @import "@/assets/styles/_assets.scss";
</style>
