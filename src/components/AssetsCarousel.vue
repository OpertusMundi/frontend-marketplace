<template>
  <div>
    <div class="a_carousel draggable">
      <a href="" class="a_carousel__item a_carousel__item--green" v-for="asset in assets" :key="asset.id">
        <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
        <div class="a_carousel__item__inner">
          <div class="a_carousel__item__top">
            <!-- <img src="@/assets/images/icons/vector_icon.svg" alt="" /> -->
            <img height="25" src="@/assets/images/icons/types/vector.svg" alt="" v-if="asset.type === 'VECTOR'">
            <img height="25" src="@/assets/images/icons/types/raster.svg" alt="" v-if="asset.type === 'RASTER'">
            <img height="25" src="@/assets/images/icons/types/tabular.svg" alt="" v-if="asset.type === 'TABULAR'">
            <img height="25" src="@/assets/images/icons/types/wms.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'WMS'">
            <img height="25" src="@/assets/images/icons/types/wfs.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'WFS'">
            <img height="25" src="@/assets/images/icons/types/data_api.svg" alt="" v-if="asset.type === 'SERVICE' && asset.spatialDataServiceType === 'DATA_API'">
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
              <small v-if="price(asset).prefix">{{ price(asset).prefix + ' ' }}</small>
              {{ price(asset).value }}<span v-if="price(asset).value !== 'FREE'">€ </span>
              <small v-if="price(asset).suffix">{{ price(asset).suffix}}</small>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';
import getPriceOrMinimumPrice from '@/helper/cards';

@Component
export default class AssetsCarousel extends Vue {
  @Prop({ required: true }) assets!: CatalogueItem[];

  price(asset: CatalogueItem): {prefix: string, value: string, suffix: string} {
    return getPriceOrMinimumPrice(asset);
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/_acarousel.scss";
</style>
