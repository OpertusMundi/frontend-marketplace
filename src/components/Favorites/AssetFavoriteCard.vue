<template>
  <router-link :to="`/catalogue/${asset.asset.id}`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="asset.asset.type === 'VECTOR'">
          <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="asset.asset.type === 'RASTER'">
          <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="asset.asset.type === 'TABULAR'">
          <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="asset.asset.type === 'SERVICE' && asset.asset.spatialDataServiceType === 'WMS'">
          <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="asset.asset.type === 'SERVICE' && asset.asset.spatialDataServiceType === 'WFS'">
          <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="asset.asset.type === 'SERVICE' && asset.asset.spatialDataServiceType === 'DATA_API'">
          <span class="asset_card__type">{{ asset.asset.type === 'SERVICE' ? asset.asset.spatialDataServiceType : asset.asset.type }}</span>
          <span v-for="(category, i) in asset.asset.topicCategory" :key="category">
            {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.asset.topicCategory.length - 1">, </span>
          </span>
        </div>
        <div class="asset_card__top__right">
          <a href="#" @click.prevent="onRemoveFromFavorites(asset.key)" v-if="!hideFavoriteToggleButton">
            <img src="@/assets/images/icons/favorites/favorite_icon__dashboard__asset_card.svg" alt="">
          </a>
        </div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.asset.title }}</div>
        <div class="asset_card__price" v-if="price().value">
          <small v-if="price().prefix">{{ price().prefix + ' ' }}</small>
          {{ price().value }}<span v-if="price().value !== 'FREE'">€ </span>
          <small v-if="price().suffix">{{ price().suffix}}</small>
        </div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div v-if="asset.asset.statistics && asset.asset.statistics.rating !== null" class="rating rating--dark">
            <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.asset.statistics.rating) >= i}">★</span>
            <i>{{ asset.asset.statistics.rating }}/5</i>
          </div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.asset.version }}</span><span v-if="asset.asset.publicationDate"><strong>Last updated: </strong>{{ formatDate(asset.asset.publicationDate) }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right" v-if="asset.asset.statistics">
          <span>{{ asset.asset.statistics.sales }}</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import {
//   CatalogueItem,
// } from '@/model';
import moment from 'moment';
import { FavoriteAsset } from '@/model/favorite';
import FavoriteApi from '@/service/favorite';
import getPriceOrMinimumPrice from '@/helper/cards';
import store from '@/store';

@Component
export default class AssetFavoriteCard extends Vue {
  @Prop({ required: true }) readonly asset!: FavoriteAsset;

  @Prop() readonly hideFavoriteToggleButton?: boolean;

  favoriteApi: FavoriteApi;

  constructor() {
    super();

    this.favoriteApi = new FavoriteApi();
  }

  getColor(): string {
    let color = '#358F8B';
    if (this.asset.asset.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.asset.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.asset.type === 'RASTER') {
      color = '#197196';
    }
    return color;
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  price(): {prefix: string, value: string, suffix: string} {
    return getPriceOrMinimumPrice(this.asset.asset);
  }

  onRemoveFromFavorites(assetKey: string): void {
    store.commit('setLoading', true);

    this.favoriteApi.remove(assetKey).then((response) => {
      if (response.success) {
        this.$emit('reload');
      } else {
        console.log('error removing asset from favorites', response);
        store.commit('setLoading', false);
      }
    }).catch((err) => {
      console.log('error removing asset from favorites', err);
      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
