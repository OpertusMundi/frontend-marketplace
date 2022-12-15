<template>
  <div>
    <div class="a_carousel draggable" v-dragscroll>
      <router-link
        v-for="(asset, i) in assets"
        :key="asset.id"
        :to="`/catalogue/${asset.id}`"
        class="a_carousel__item"
        :style="{'margin-left': i=== 0 ? `${relatedCardMarginLeft}px` : '10px', '--color': getColor(asset)}"
      >
        <div class="a_carousel__item__view" :style="{'--color': getColor(asset)}"><span>VIEW ASSET</span></div>
        <div class="a_carousel__item__inner" :style="{'--color': getColor(asset)}">
          <div class="a_carousel__item__top">
            <!-- <img src="@/assets/images/icons/vector_icon.svg" alt="" /> -->
            <card-icon :imgHeight="25" :asset="asset"></card-icon>
            <!-- <img height="25" src="@/assets/images/icons/types/vector.svg" alt="" v-if="asset.type === 'VECTOR'">
            <img height="25" src="@/assets/images/icons/types/raster.svg" alt="" v-if="asset.type === 'RASTER'">
            <img height="25" src="@/assets/images/icons/types/tabular.svg" alt="" v-if="asset.type === 'TABULAR'">
            <img height="25" src="@/assets/images/icons/types/wms.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'WMS'">
            <img height="25" src="@/assets/images/icons/types/wfs.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'WFS'">
            <img height="25" src="@/assets/images/icons/types/data_api.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'DATA_API'"> -->
            <span>{{ asset.type === 'SERVICE' ? asset.spatialDataServiceType : asset.type }}</span>
          </div>
          <div class="a_carousel__item__main">
            <h4 class="a_carousel__item__main__title">{{ asset.title }}</h4>
            <!-- <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div> -->
            <div class="a_carousel__item__main__rating" v-if="asset.statistics && asset.statistics.rating !== null">
              <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
              <span>{{ asset.statistics.rating }}/5</span>
            </div>
            <div class="a_carousel__item__main__vendor">{{ asset.publisherName || '' }}</div>
          </div>
          <div class="a_carousel__item__footer">
            <div class="a_carousel__item__footer__stats" v-if="asset.statistics"><img src="@/assets/images/icons/download-icon.svg" alt="" /><span>{{ asset.statistics.downloads }}</span></div>
            <div class="a_carousel__item__footer__price a_carousel__item__footer__price--open" v-if="price(asset).value">
              <!-- <img src="@/assets/images/icons/cc_icons/cc-by-nc-Attribution-NonCommercial.svg" alt="" /> -->
              <!-- <span>OPEN</span> -->
              <small style="margin-top: 0.5em" v-if="price(asset).prefix">{{ price(asset).prefix + ' ' }}</small>
              <card-open-asset-icons v-if="asset.openDataset" :asset="asset"></card-open-asset-icons>
              <span>{{ price(asset).value }}{{ !['FREE', 'OPEN'].includes(price(asset).value) ? '€ ' : '' }}{{ price(asset).suffix || '' }}</span>
              <!-- {{ price(asset).value }}<span v-if="price(asset).value !== 'FREE'">€ </span> -->
              <!-- <small v-if="price(asset).suffix">{{ price(asset).suffix}}</small> -->
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { dragscroll } from 'vue-dragscroll';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import CardOpenAssetIcons from '@/components/Catalogue/CardOpenAssetIcons.vue';
import { CatalogueItem } from '@/model';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { getAssetCardColor } from '@/helper/cards';

@Component({
  components: { CardIcon, CardOpenAssetIcons },
  directives: { dragscroll },
})
export default class AssetsCarousel extends Vue {
  @Prop({ required: true }) assets!: CatalogueItem[];

  get relatedCardMarginLeft(): number | null {
    return document.getElementById('asset__related__heading')?.getBoundingClientRect().x || null;
  }

  getColor = (asset: CatalogueItem): string => getAssetCardColor(asset.type as EnumAssetType);

  price(asset: CatalogueItem): {prefix: string, value: string, suffix: string} {
    return getPriceOrMinimumPrice(asset);
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/_acarousel.scss";
</style>
