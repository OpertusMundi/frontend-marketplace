<template>
  <div class="asset__otheroptions">
    <h5>Other EO Collections</h5>
    <router-link :to="`/catalogue/${asset.id}`" class="asset_card asset_card--sm" v-for="asset in assets" :key="asset.id">
      <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor()}">
        <div class="asset_card__top">
          <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>Sentinel Hub</span></div>
          <!-- <div class="asset_card__top__right"><span>@provider</span></div> -->
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">{{ asset.title }}</div>
          <div class="asset_card__price" v-if="minPrice"><small style="font-size: .8em;">from</small> {{ minPrice }}€</div>
        </div>
        <div class="asset_card__bottom">
          <div class="asset_card__bottom__left">
            <div v-if="asset.statistics && asset.statistics.rating !== null" class="rating rating--dark">
              <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
              <i>{{ asset.statistics.rating }}/5</i>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { shuffle } from 'lodash';
import CatalogueApi from '@/service/catalogue';
import { CatalogueItem } from '@/model';
import { EnumAssetType } from '@/model/enum';
import { SHSubscriptionPricingModelCommand } from '@/model/pricing-model';

@Component
export default class OtherAvailableOptionsSH extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  catalogueApi = new CatalogueApi();

  assets: CatalogueItem[] | null = null;

  get minPrice(): number | null {
    const prices = this.catalogueItem.pricingModels.map((x) => (x.model as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax || 0);
    return Math.min(...prices);
  }

  created(): void {
    this.catalogueApi.find({ type: [EnumAssetType.SENTINEL_HUB_OPEN_DATA], page: 0, size: 20 }).then((response) => {
      this.assets = shuffle(response.result.items).filter((x, i) => i < 3);
    });
  }

  getColor(): string {
    return '#358F8B';
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
