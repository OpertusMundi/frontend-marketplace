<template>
  <div class="asset__otheroptions">
    <h5 v-if="assets && assets.length">Asset also available as:</h5>
    <router-link :to="`/catalogue/${asset.id}`" class="asset_card asset_card--sm" v-for="asset in assets" :key="asset.id">
      <div class="asset_card__view" :style="{'--color': getColor(asset)}"><span>VIEW</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor(asset)}">
        <div class="asset_card__top">
          <div class="asset_card__top__left">
            <card-icon :asset="asset"></card-icon>
            <span>{{ asset.type === 'SERVICE' ? asset.spatialDataServiceType : asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type }}</span></div>
          <div class="asset_card__top__right"><span>{{ asset.publisher.name }}</span></div>
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">{{ asset.title }}</div>
          <div class="asset_card__price" v-if="getPrice(asset).value">
            <div style="white-space: nowrap; margin-top: 0;">
              <small v-if="getPrice(asset).prefix">{{ getPrice(asset).prefix + ' ' }}</small>
              {{ getPrice(asset).value }}<span v-if="getPrice(asset).value !== 'FREE'">€ </span>
            </div>
          </div>
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
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import { CatalogueItem } from '@/model';
import { EnumAssetType } from '@/model/enum';
import CatalogueApi from '@/service/catalogue';
import getPriceOrMinimumPrice, { getAssetCardColor } from '@/helper/cards';

@Component({
  components: { CardIcon },
})
export default class OtherAvailableOptions extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  catalogueApi = new CatalogueApi();

  assets: CatalogueItem[] | null = null;

  created(): void {
    this.catalogueApi.findRelated(this.$route.params.id).then((response) => {
      this.assets = response.result.items.filter((x, i) => i < 3);
    });
  }

  getColor = (asset: CatalogueItem): string => getAssetCardColor(asset.type as EnumAssetType);

  getPrice(asset: CatalogueItem): {prefix: string, value: string, suffix: string} {
    return getPriceOrMinimumPrice(asset);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
