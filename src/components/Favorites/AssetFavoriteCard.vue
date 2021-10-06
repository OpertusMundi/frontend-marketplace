<template>
  <router-link :to="`/catalogue/${asset.asset.id}`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/vector_icon.svg" alt="" v-if="asset.asset.type === 'VECTOR'">
          <img src="@/assets/images/icons/raster_icon.svg" alt="" v-if="asset.asset.type === 'RASTER'">
          <img src="@/assets/images/icons/api_icon.svg" alt="" v-if="asset.asset.type === 'SERVICE'">
          <span class="asset_card__type">{{ asset.asset.type === 'SERVICE' ? asset.asset.spatialDataServiceType : asset.asset.type }}</span>
          <span v-for="(category, i) in asset.asset.topicCategory" :key="category">
            {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.asset.topicCategory.length - 1">, </span>
          </span>
        </div>
        <div class="asset_card__top__right">
          <a href="#" @click.prevent="onRemoveFromFavorites(asset.key)">
            <img src="@/assets/images/icons/favorites/favorite_icon__dashboard__asset_card.svg" alt="">
          </a>
        </div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.asset.title }}</div>
        <div class="asset_card__price" v-if="getPriceOrMinimumPrice().value">
          <small v-if="getPriceOrMinimumPrice().prefix">{{ getPriceOrMinimumPrice().prefix + ' ' }}</small>
          {{ getPriceOrMinimumPrice().value }}<span v-if="getPriceOrMinimumPrice().value !== 'FREE'">€ </span>
          <small v-if="getPriceOrMinimumPrice().suffix">{{ getPriceOrMinimumPrice().suffix}}</small>
        </div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div v-if="asset.asset.statistics && asset.asset.statistics.rating !== null" class="rating rating--dark">
            <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.asset.statistics.rating) >= i}">★</span>
            <i>{{ asset.asset.statistics.rating }}/5</i>
          </div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.asset.version }}</span><span><strong>Last updated: </strong>{{ formatDate(asset.asset.revisionDate) }}</span>
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
import { EnumPricingModel } from '@/model/pricing-model';
import { FavoriteAsset } from '@/model/favorite';
import FavoriteApi from '@/service/favorite';
import store from '@/store';

@Component
export default class AssetFavoriteCard extends Vue {
  @Prop({ required: true }) readonly asset!: FavoriteAsset;

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

  getPriceOrMinimumPrice(): {prefix: string, value: string, suffix: string} {
    const res = { prefix: '', value: '', suffix: '' };

    res.prefix = this.asset.asset.pricingModels.length > 1 || (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(this.asset.asset.pricingModels[0].model.type)) ? 'FROM' : '';

    let minPrice = Infinity;
    for (let i = 0; i < this.asset.asset.pricingModels.length; i += 1) {
      const x = this.asset.asset.pricingModels[i];
      if (x.model.type === EnumPricingModel.FREE) {
        minPrice = 0;
        res.value = 'FREE';
        res.suffix = '';
        break;
      }
      if (x.model.type === EnumPricingModel.FIXED && x.model.totalPriceExcludingTax < minPrice) {
        minPrice = x.model.totalPriceExcludingTax;
        res.value = `${x.model.totalPriceExcludingTax}`;
        res.suffix = '';
      }
      if (x.model.type === EnumPricingModel.FIXED_PER_ROWS && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = '1,000 rows';
      }
      if (x.model.type === EnumPricingModel.FIXED_FOR_POPULATION && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = '10,000 people';
      }
      if (x.model.type === EnumPricingModel.PER_CALL_WITH_PREPAID && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = 'per call';
      }
      if (x.model.type === EnumPricingModel.PER_CALL_WITH_BLOCK_RATE && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = 'per call';
      }
      if (x.model.type === EnumPricingModel.PER_ROW_WITH_PREPAID && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = 'per row';
      }
      if (x.model.type === EnumPricingModel.PER_ROW_WITH_BLOCK_RATE && x.model.price < minPrice) {
        minPrice = x.model.price;
        res.value = `${x.model.price}`;
        res.suffix = 'per row';
      }
    }

    return res;
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
