<template>
  <div class="asset_card asset_card--sm asset_card--nohover">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <card-icon :asset="asset"></card-icon>
          <span>{{ `${asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type}` }}</span><span>{{ asset.format }}</span>
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
          <span>{{ asset.statistics.sales }}</span>
          <card-counter-icon :asset="asset"></card-counter-icon>
          <!-- <img src="@/assets/images/icons/bag-icon.svg" alt=""> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import CardCounterIcon from '@/components/Catalogue/CardCounterIcon.vue';
import moment from 'moment';
import { EnumAssetType } from '@/model/enum';
import { CatalogueItem } from '@/model';
import { getAssetCardColor } from '@/helper/cards';

interface CatalogueItemWithPrice extends CatalogueItem {
  priceRendered: string;
}

@Component({
  components: { CardIcon, CardCounterIcon },
})
export default class AssetMiniCardProvider extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItemWithPrice;

  getColor = (): string => getAssetCardColor(this.asset.type as EnumAssetType);

  formatDate(date: string): string {
    return moment(date)
      .format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
</style>
