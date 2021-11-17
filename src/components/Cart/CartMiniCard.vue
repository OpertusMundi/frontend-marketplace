<template>
  <div class="asset_card asset_card--sm asset_card--nohover asset_card--border-always-shown">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="item.asset.type === 'VECTOR'">
          <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="item.asset.type === 'RASTER'">
          <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="item.asset.type === 'TABULAR'">
          <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="item.asset.type === 'SERVICE' && item.asset.spatialDataServiceType === 'WMS'">
          <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="item.asset.type === 'SERVICE' && item.asset.spatialDataServiceType === 'WFS'">
          <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="item.asset.type === 'SERVICE' && item.asset.spatialDataServiceType === 'DATA_API'">
          <span class="asset_card__type">{{ item.asset.type }}</span>
        </div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ item.asset.title }}</div>
        <div class="asset_card__price">{{ item.pricingModel.quotation ? `${item.pricingModel.quotation.totalPrice}€` : '' }}</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ item.asset.version }}</span><span><strong>Vendor: </strong>{{ item.asset.publisherName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CartItem } from '@/model/cart';
import { EnumAssetType } from '@/model/enum';
// import moment from 'moment';

@Component
export default class CartMiniCard extends Vue {
  @Prop({ required: true }) readonly item!: CartItem;

  // TODO
  getColor(): string {
    // const color = '#358F8B';
    let color = '#358F8B';
    if (this.item.asset.type && this.item.asset.type === EnumAssetType.VECTOR) {
      color = '#358F8B';
    } else if (this.item.asset.type && this.item.asset.type === EnumAssetType.SERVICE) {
      color = '#6F43B5';
    } else if (this.item.asset.type && this.item.asset.type === EnumAssetType.RASTER) {
      color = '#197196';
    }
    return color;
  }

  // formatDate(date: string): string {
  //   return moment(date).format('MMM Do YY');
  // }
}
</script>
<style lang="scss">
  // @import "@/assets/styles/_purchases.scss";
  @import "@/assets/styles/_assets.scss";
</style>
