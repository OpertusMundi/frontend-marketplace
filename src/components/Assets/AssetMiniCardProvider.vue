<template>
  <div class="asset_card asset_card--sm asset_card--nohover">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg"
                                                alt=""><span>{{
            asset.type
          }}</span><span>{{ asset.format }}</span>
        </div>
        <div class="asset_card__top__right"><span>{{ asset.deliveryMethod }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price">{{ asset.priceRendered }}</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{
                asset.version
              }}</span><span><strong>Last updated: </strong>{{
              formatDate(asset.publicationDate)
            }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right">
          <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { EnumAssetType } from '@/model/enum';
import { CatalogueItem } from '@/model';

interface CatalogueItemWithPrice extends CatalogueItem {
  priceRendered: string;
}

@Component
export default class AssetMiniCardProvider extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItemWithPrice;

  // TODO: api must return asset type
  getColor(): string {
    let color = '#358F8B';
    if (this.asset.type === EnumAssetType.VECTOR) {
      color = '#358F8B';
    } else if (this.asset.type === EnumAssetType.SERVICE) {
      color = '#6F43B5';
    } else if (this.asset.type === EnumAssetType.RASTER) {
      color = '#197196';
    }
    return color;
  }

  formatDate(date: string): string {
    return moment(date)
      .format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
</style>
