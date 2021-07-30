<template>
  <router-link :to="`/catalogue/${asset.id}`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/vector_icon.svg" alt="">
          <span class="asset_card__type">{{asset.type}}</span>
          <span v-for="(category, i) in asset.topicCategory" :key="category">
            {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.topicCategory.length - 1">, </span>
          </span>
        </div>
        <div class="asset_card__top__right"><span>{{ asset.publisher.name }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price">
          <small v-if="getPriceOrMinimumPrice().prefix">{{ getPriceOrMinimumPrice().prefix + ' ' }}</small>
          {{ getPriceOrMinimumPrice().value }}<span v-if="getPriceOrMinimumPrice().value !== 'FREE'">€</span>
          <small v-if="getPriceOrMinimumPrice().suffix">{{ getPriceOrMinimumPrice().suffix}}</small>
        </div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div v-if="asset.statistics && asset.statistics.rating !== null" class="rating rating--dark">
            <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
            <i>{{ asset.statistics.rating }}/5</i>
          </div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.version }}</span><span><strong>Last updated: </strong>{{ formatDate(asset.revisionDate) }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right" v-if="asset.statistics">
          <span>{{ asset.statistics.sales }}</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  CatalogueItem,
} from '@/model';
import moment from 'moment';
import { EnumPricingModel } from '@/model/pricing-model';

@Component
export default class CatalogueCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  constructor() {
    super();

    console.log('asd asset:', this.asset);
  }

  getColor(): string {
    let color = '#358F8B';
    if (this.asset.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.type === 'RASTER') {
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

    res.prefix = this.asset.pricingModels.length > 1 || (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(this.asset.pricingModels[0].model.type)) ? 'FROM' : '';

    let minPrice = Infinity;
    for (let i = 0; i < this.asset.pricingModels.length; i += 1) {
      const x = this.asset.pricingModels[i];
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
    }

    return res;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
