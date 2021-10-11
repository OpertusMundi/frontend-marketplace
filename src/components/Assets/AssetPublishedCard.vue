<template>
  <div class="asset_card__wrapper">
    <router-link :to="`/catalogue/${asset.id}`" class="asset_card asset_card--wrapped" :class="{'asset_card--red_marked': asset.status === 'DRAFT'}">
      <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor()}">
        <div class="asset_card__top">
          <div class="asset_card__top__left">
            <div>
              <img src="@/assets/images/icons/vector_icon.svg" alt="" v-if="asset.type === 'VECTOR'">
              <img src="@/assets/images/icons/raster_icon.svg" alt="" v-if="asset.type === 'RASTER'">
              <img src="@/assets/images/icons/api_icon.svg" alt="" v-if="asset.type === 'SERVICE'">
              <span class="asset_card__type">{{ asset.type === 'SERVICE' ? asset.spatialDataServiceType : asset.type }}</span>
              <span v-for="(category, i) in asset.topicCategory" :key="category">
                {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.topicCategory.length - 1">, </span>
              </span>
            </div>
          </div>
          <div class="asset_card__top__right"><span>PUBLISHED</span></div>
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
            <div class="asset_card__bottom__left__info">
              <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.revisionDate"><strong>Last updated: </strong>{{ formatDate(asset.revisionDate) }}</span>
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
            <li @click="createNewDraftFromPublished">Edit</li>
            <li v-if="asset.type !== 'SERVICE'" @click="createService('WMS')">Create WMS</li>
            <li v-if="asset.type !== 'SERVICE'" @click="createService('WFS')">Create WFS</li>
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
// import { AssetDraft } from '@/model/draft';
// import { DraftApiFromAssetCommand, EnumDraftCommandType, CatalogueItemCommand } from '@/model/catalogue';
import getPriceOrMinimumPrice from '@/helper/cards';
import moment from 'moment';
import { CatalogueItem, DraftApiFromAssetCommand, EnumDraftCommandType } from '@/model/catalogue';
import store from '@/store';

@Component
export default class AssetPublishedCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

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
    if (this.asset.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.type === 'RASTER') {
      color = '#197196';
    }
    return color;
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  // getRouterLink(assetStatus: string, assetKey: string, assetPublished: string): string {
  //   const links = {
  //     DRAFT: `/dashboard/assets/create/${assetKey}`,
  //     SUBMITTED: '',
  //     PENDING_HELPDESK_REVIEW: '',
  //     HELPDESK_REJECTED: '',
  //     PENDING_PROVIDER_REVIEW: `/review/${assetKey}`,
  //     PROVIDER_REJECTED: '',
  //     POST_PROCESSING: '',
  //     PUBLISHED: `/catalogue/${assetPublished}`,
  //   };
  //   return links[assetStatus];
  // }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  price(): { prefix: string, value: string, suffix: string } {
    return getPriceOrMinimumPrice(this.asset);
  }

  createService(serviceType: 'WMS' | 'WFS' | 'DATA_API'): void {
    // todo: refactoring, logic should be transfered in parent component
    console.log('create Service');
    store.commit('setLoading', true);
    const draftApi: DraftApiFromAssetCommand = {
      type: EnumDraftCommandType.ASSET,
      pid: this.asset.id,
      title: `${this.asset.title} (${serviceType})`,
      version: this.asset.version,
      serviceType,
    };
    this.draftAssetApi.createApi(draftApi).then((createApiResponse) => {
      if (createApiResponse.success) {
        console.log('service draft created successfully!!', createApiResponse);
        const { key } = createApiResponse.result;
        store.commit('setLoading', false);
        this.$emit('serviceDraftCreated', { key, serviceType });
        // console.log(`/dashboard/assets/create/${key}`);
        // this.$router.push(`/dashboard/assets/create/${key}`);
      } else {
        console.log('error creating service draft', createApiResponse);
      }
    });
  }

  createNewDraftFromPublished(): void {
    this.$emit('createNewDraft', this.asset.id);
  }

  deleteAsset(): void {
    this.$emit('delete', this.asset.id);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
