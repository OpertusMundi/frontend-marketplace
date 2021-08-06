<template>
  <router-link :to="getRouterLink(asset.status, asset.key, asset.assetPublished)" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/vector_icon.svg" alt="" v-if="asset.command.type === 'VECTOR'">
          <img src="@/assets/images/icons/raster_icon.svg" alt="" v-if="asset.command.type === 'RASTER'">
          <img src="@/assets/images/icons/api_icon.svg" alt="" v-if="asset.command.type === 'API'">
          <span class="asset_card__type">{{asset.command.type}}</span>
          <span v-for="(category, i) in asset.command.topicCategory" :key="category">
            {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.command.topicCategory.length - 1">, </span>
          </span>
        </div>
        <div class="asset_card__top__right"><span>{{ formatStatus(asset.status) }}</span></div>
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
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.command.revisionDate"><strong>Last updated: </strong>{{ formatDate(asset.command.revisionDate) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { AssetDraft } from '@/model/draft';
import {
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
} from '@/model/pricing-model';
import moment from 'moment';

@Component
export default class AssetCard extends Vue {
  @Prop({ required: true }) readonly asset!: AssetDraft;

  // TODO: api must return asset type
  getColor(): string {
    let color = '#358F8B';
    if (this.asset.command && this.asset.command.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.command && this.asset.command.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.command && this.asset.command.type === 'RASTER') {
      color = '#197196';
    }
    return color;
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  getRouterLink(assetStatus: string, assetKey: string, assetPublished: string): string {
    const links = {
      DRAFT: `/dashboard/assets/create/${assetKey}`,
      SUBMITTED: '',
      PENDING_HELPDESK_REVIEW: '',
      HELPDESK_REJECTED: '',
      PENDING_PROVIDER_REVIEW: `/review/${assetKey}`,
      PROVIDER_REJECTED: '',
      POST_PROCESSING: '',
      PUBLISHED: `/catalogue/${assetPublished}`,
    };
    return links[assetStatus];
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  getPriceOrMinimumPrice(): {prefix: string, value: string, suffix: string} {
    const res = { prefix: '', value: '', suffix: '' };

    res.prefix = this.asset.command.pricingModels.length > 1 || (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(this.asset.command.pricingModels[0].type)) ? 'FROM' : '';

    let minPrice = Infinity;
    for (let i = 0; i < this.asset.command.pricingModels.length; i += 1) {
      const x = this.asset.command.pricingModels[i];
      if (x.type === EnumPricingModel.FREE) {
        minPrice = 0;
        res.value = 'FREE';
        res.suffix = '';
        break;
      }
      if (x.type === EnumPricingModel.FIXED && (x as FixedPricingModelCommand).totalPriceExcludingTax < minPrice) {
        minPrice = (x as FixedPricingModelCommand).totalPriceExcludingTax;
        res.value = `${(x as FixedPricingModelCommand).totalPriceExcludingTax}`;
        res.suffix = '';
      }
      if (x.type === EnumPricingModel.FIXED_PER_ROWS && (x as FixedRowPricingModelCommand).price < minPrice) {
        minPrice = (x as FixedRowPricingModelCommand).price;
        res.value = `${(x as FixedRowPricingModelCommand).price}`;
        res.suffix = '1,000 rows';
      }
      if (x.type === EnumPricingModel.FIXED_FOR_POPULATION && (x as FixedPopulationPricingModelCommand).price < minPrice) {
        minPrice = (x as FixedPopulationPricingModelCommand).price;
        res.value = `${(x as FixedPopulationPricingModelCommand).price}`;
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
