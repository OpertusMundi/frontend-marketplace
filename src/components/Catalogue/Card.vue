<template>
  <router-link :to="`/catalogue/${asset.id}`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <card-icon :asset="asset"></card-icon>
          <span class="asset_card__type">{{ asset.type === 'SERVICE' ? asset.spatialDataServiceType : asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type }}</span>
          <span v-for="(category, i) in asset.topicCategory" :key="category">
            {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.topicCategory.length - 1">, </span>
          </span>
        </div>
        <div class="asset_card__top__right"><span>{{ asset.publisher.name }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price" v-if="price().value">
          <small v-if="price().prefix">{{ price().prefix + ' ' }}</small>
          {{ price().value }}<span v-if="price().value !== 'FREE'">€ </span>
          <small v-if="price().suffix">{{ price().suffix}}</small>
        </div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div v-if="asset.statistics && asset.statistics.rating !== null" class="rating rating--dark">
            <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
            <i>{{ asset.statistics.rating }}/5</i>
          </div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.publicationDate"><strong>Last updated: </strong>{{ formatDate(asset.publicationDate) }}</span>
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
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import {
  CatalogueItem,
} from '@/model';
import { EnumAssetType } from '@/model/enum';
import moment from 'moment';
import getPriceOrMinimumPrice, { getAssetCardColor } from '@/helper/cards';

@Component({
  components: { CardIcon },
})
export default class CatalogueCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  getColor = (): string => getAssetCardColor(this.asset.type as EnumAssetType);

  getIcon(type: EnumAssetType): string {
    if (type === EnumAssetType.VECTOR) return '/assets/images/icons/types/vector.svg';
    if (type === EnumAssetType.RASTER) return '/assets/images/icons/types/raster.svg';
    if (type === EnumAssetType.TABULAR) return '/assets/images/icons/types/tabular.svg';
    return '';
  }

  // getColor(): string {
  //   let color = '#358F8B';
  //   if (this.asset.type === 'VECTOR') {
  //     color = '#358F8B';
  //   } else if (this.asset.type === 'SERVICE') {
  //     color = '#6F43B5';
  //   } else if (this.asset.type === 'RASTER') {
  //     color = '#197196';
  //   }
  //   return color;
  // }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  price(): {prefix: string, value: string, suffix: string} {
    return getPriceOrMinimumPrice(this.asset);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
