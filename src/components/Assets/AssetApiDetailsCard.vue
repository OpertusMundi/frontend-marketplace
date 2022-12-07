<template>
  <div class="asset_card_api_details" :class="{'asset_card_api_details--selected': selected}">
    <div class="asset_card_api_details__top">
      <span>{{ formatFirstLetterUpperCase(asset.type) }}</span>
      <div class="asset_card_api_details__price" v-if="price().value">
        <small v-if="price().prefix">{{ price().prefix + ' ' }}</small>
        {{ price().value }}<span v-if="price().value !== 'FREE'">€ </span>
        <small v-if="price().suffix">{{ price().suffix}}</small>
      </div>
    </div>
    <div class="asset_card_api_details__middle">
      {{ asset.title }}
    </div>
    <div class="asset_card_api_details__bottom">
      <span><strong :class="{'min-spacings': !!isMini}">Version: </strong>{{ asset.version }}</span>
      <span v-if="asset.publicationDate"><strong style="white-space: nowrap;" :class="{'min-spacings': !!isMini}">Last updated: </strong>{{ formatDate(asset.publicationDate) }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { CatalogueItem } from '@/model';
import getPriceOrMinimumPrice from '@/helper/cards';

@Component
export default class AssetApiDetailsCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  @Prop({ required: true }) readonly selected!: boolean;

  @Prop({ required: false }) readonly isMini?: boolean;

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  price(): { prefix: string, value: string, suffix: string } {
    return getPriceOrMinimumPrice(this.asset);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";

  .min-spacings {
    width: min-content !important;
    padding-right: 5px !important;
  }
</style>
