<template>
  <div class="asset_card__wrapper">
    <router-link :to="getRouterLink(asset.status, asset.key, asset.assetPublished)" class="asset_card asset_card--wrapped" :class="{'asset_card--red_marked': asset.status === 'DRAFT'}">
      <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor()}">
        <div class="asset_card__top">
          <div class="asset_card__top__left">
            <div v-if="asset.command">
              <img src="@/assets/images/icons/vector_icon.svg" alt="" v-if="asset.command.type === 'VECTOR'">
              <img src="@/assets/images/icons/raster_icon.svg" alt="" v-if="asset.command.type === 'RASTER'">
              <img src="@/assets/images/icons/api_icon.svg" alt="" v-if="asset.command.type === 'SERVICE'">
              <span class="asset_card__type">{{asset.command.type}}</span>
              <span v-for="(category, i) in asset.command.topicCategory" :key="category">
                {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.command.topicCategory.length - 1">, </span>
              </span>
            </div>
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
              <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.command && asset.command.revisionDate"><strong>Last updated: </strong>{{ formatDate(asset.command.revisionDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
    <div class="asset_card__right_dropdown_container">
      <div @click="isRightDropdownOpen = !isRightDropdownOpen" class="asset_card__three_dots_btn">
        <svg data-name="Asset actions" xmlns="http://www.w3.org/2000/svg" width="3" height="17"><g data-name="Group 2622" fill="#333"><circle data-name="Ellipse 169" cx="1.5" cy="1.5" r="1.5"/><circle data-name="Ellipse 170" cx="1.5" cy="1.5" r="1.5" transform="translate(0 14)"/><circle data-name="Ellipse 171" cx="1.5" cy="1.5" r="1.5" transform="translate(0 7)"/></g></svg>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="isRightDropdownOpen" class="asset_card__right_dropdown">
          <ul>
            <li>Publish</li>
            <li>Edit</li>
            <li @click="createService('WMS')">Create WMS</li>
            <li @click="createService('WFS')">Create WFS</li>
            <li @click="deleteAsset">Delete</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DraftAssetApi from '@/service/draft';
import { AssetDraft } from '@/model/draft';
// import { DraftApiFromAssetCommand, EnumDraftCommandType, CatalogueItemCommand } from '@/model/catalogue';
import {
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
} from '@/model/pricing-model';
import moment from 'moment';
import { DraftApiFromAssetCommand, EnumDraftCommandType } from '@/model/catalogue';

@Component
export default class AssetDraftCard extends Vue {
  @Prop({ required: true }) readonly asset!: AssetDraft;

  draftAssetApi: DraftAssetApi;

  isRightDropdownOpen: boolean;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.isRightDropdownOpen = false;
  }

  // TODO: api must return asset type
  getColor(): string {
    let color = '#358F8B';
    if (!this.asset.command || !this.asset.command.type) return color; // in buggy case that no type is returned
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

    if (!this.asset.command) return { prefix: '', value: '', suffix: '' };

    res.prefix = this.asset.command.pricingModels.length > 1 || (this.asset.command.pricingModels[0] && (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(this.asset.command.pricingModels[0].type))) ? 'FROM' : '';

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

  createService(serviceType: 'WMS' | 'WFS' | 'DATA_API'): void {
    console.log('create WMS');
    const draftApi: DraftApiFromAssetCommand = {
      type: EnumDraftCommandType.ASSET,
      pid: this.asset.assetPublished,
      title: this.asset.title,
      version: this.asset.version,
      serviceType,
    };
    this.draftAssetApi.createApi(draftApi).then((createApiResponse) => {
      if (createApiResponse.success) {
        console.log('service draft created successfully!!', createApiResponse);
        const { key } = createApiResponse.result;
        console.log(`/dashboard/assets/create/${key}`);
        this.$router.push(`/dashboard/assets/create/${key}`);
      } else {
        console.log('error creating service draft', createApiResponse);
      }
    });
  }

  deleteAsset(): void {
    this.$emit('delete', this.asset.assetPublished);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
