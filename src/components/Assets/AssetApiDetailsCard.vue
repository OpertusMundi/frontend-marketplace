<template>
  <div class="asset_card_api_details" :class="{'asset_card_api_details--selected': selected}">
    <div class="asset_card_api_details__top">
      <span>{{ formatFirstLetterUpperCase(asset.type) }}</span>
      <div class="asset_card_api_details__price">
        <small v-if="getPriceOrMinimumPrice().prefix">{{ getPriceOrMinimumPrice().prefix + ' ' }}</small>
        {{ getPriceOrMinimumPrice().value }}<span v-if="getPriceOrMinimumPrice().value !== 'FREE'">€</span>
        <small v-if="getPriceOrMinimumPrice().suffix">{{ getPriceOrMinimumPrice().suffix}}</small>
      </div>
    </div>
    <div class="asset_card_api_details__middle">
      {{ asset.title }}
    </div>
    <div class="asset_card_api_details__bottom">
      <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.revisionDate"><strong>Last updated: </strong>{{ formatDate(asset.revisionDate) }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { CatalogueItem } from '@/model';
import {
  EffectivePricingModel,
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
  FreePricingModelCommand,
} from '@/model/pricing-model';

@Component
export default class AssetApiDetailsCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  @Prop({ required: true }) readonly selected!: boolean;

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  getPriceOrMinimumPrice(): {prefix: string, value: string, suffix: string} {
    const res = { prefix: '', value: '', suffix: '' };

    if (!this.asset.pricingModels || !this.asset.pricingModels.length) return { prefix: '', value: '', suffix: '' };

    res.prefix = this.asset.pricingModels.length > 1 || (this.asset.pricingModels[0] && (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(this.asset.pricingModels[0].model.type))) ? 'FROM' : '';

    let minPrice = Infinity;
    for (let i = 0; i < this.asset.pricingModels.length; i += 1) {
      const x = this.asset.pricingModels[i] as EffectivePricingModel;
      if ((x.model as FreePricingModelCommand).type === EnumPricingModel.FREE) {
        minPrice = 0;
        res.value = 'FREE';
        res.suffix = '';
        break;
      }
      if (x.model.type === EnumPricingModel.FIXED && (x.model as FixedPricingModelCommand).totalPriceExcludingTax < minPrice) {
        minPrice = (x.model as FixedPricingModelCommand).totalPriceExcludingTax;
        res.value = `${(x.model as FixedPricingModelCommand).totalPriceExcludingTax}`;
        res.suffix = '';
      }
      if (x.model.type === EnumPricingModel.FIXED_PER_ROWS && (x.model as FixedRowPricingModelCommand).price < minPrice) {
        minPrice = (x.model as FixedRowPricingModelCommand).price;
        res.value = `${(x.model as FixedRowPricingModelCommand).price}`;
        res.suffix = '1,000 rows';
      }
      if (x.model.type === EnumPricingModel.FIXED_FOR_POPULATION && (x.model as FixedPopulationPricingModelCommand).price < minPrice) {
        minPrice = (x.model as FixedPopulationPricingModelCommand).price;
        res.value = `${(x.model as FixedPopulationPricingModelCommand).price}`;
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
