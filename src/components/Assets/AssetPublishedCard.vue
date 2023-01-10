<template>
  <div class="asset_card__wrapper">
    <router-link :to="`/catalogue/${asset.id}`" class="asset_card asset_card--wrapped" :class="{'asset_card--red_marked': asset.status === 'DRAFT'}">
      <div @click.prevent="createNewDraftFromPublished" class="asset_card__view" :style="{'--color': getColor()}"><span>EDIT</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor()}">
        <div class="asset_card__top">
          <div class="asset_card__top__left">
            <card-icon :asset="asset"></card-icon>
            <span class="asset_card__type">{{ asset.type === 'SERVICE' ? asset.spatialDataServiceType : asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type }}</span>
            <span v-for="(category, i) in asset.topicCategory" :key="category">
              {{ formatFirstLetterUpperCase(category) }}<span v-if="i !== asset.topicCategory.length - 1">, </span>
            </span>
          </div>
          <div class="asset_card__top__right"><span>PUBLISHED</span></div>
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">{{ asset.title }}</div>
          <div class="asset_card__price" :class="{'asset_card__price--open': asset.openDataset}" v-if="price().value">
            <small v-if="price().prefix">{{ price().prefix + ' ' }}</small>
            <card-open-asset-icons v-if="asset.openDataset" :asset="asset"></card-open-asset-icons>
            <span>{{ price().value }}{{ !['FREE', 'OPEN'].includes(price().value) ? '€ ' : '' }}{{ price().suffix || '' }}</span>
            <!-- {{ price().value }}<span v-if="price().value !== 'FREE'">€ </span> -->
            <!-- <small v-if="price().suffix">{{ price().suffix}}</small> -->
          </div>
        </div>
        <div class="asset_card__bottom">
          <div class="asset_card__bottom__left">
            <div class="asset_card__bottom__left__info">
              <span><strong>Version: </strong>{{ asset.version }}</span><span v-if="asset.publicationDate"><strong>Last updated: </strong>{{ formatDate(asset.publicationDate) }}</span>
            </div>
          </div>
          <div class="asset_card__bottom__right" v-if="asset.statistics">
            <span>{{ asset.statistics.sales }}</span>
            <card-counter-icon :asset="asset"></card-counter-icon>
          </div>
        </div>
      </div>
    </router-link>
    <div class="asset_card__right_dropdown_container">
      <div @click="toggleRightDropdown" class="asset_card__three_dots_btn" v-if="!noSideMenu">
        <svg data-name="Asset actions" xmlns="http://www.w3.org/2000/svg" width="3" height="17"><g data-name="Group 2622" fill="#333"><circle data-name="Ellipse 169" cx="1.5" cy="1.5" r="1.5"/><circle data-name="Ellipse 170" cx="1.5" cy="1.5" r="1.5" transform="translate(0 14)"/><circle data-name="Ellipse 171" cx="1.5" cy="1.5" r="1.5" transform="translate(0 7)"/></g></svg>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="isRightDropdownOpen" class="asset_card__right_dropdown">
          <ul>
            <li @click="createNewDraftFromPublished">Edit</li>
            <li v-if="!['SERVICE', 'TABULAR', 'SENTINEL_HUB_OPEN_DATA', 'BUNDLE'].includes(asset.type) && !rightDropdownServiceCreationExcludedOptions.includes('WMS')" @click="createService('WMS')">Create WMS</li>
            <li v-if="!['SERVICE', 'TABULAR', 'SENTINEL_HUB_OPEN_DATA', 'BUNDLE'].includes(asset.type) && !rightDropdownServiceCreationExcludedOptions.includes('WFS')" @click="createService('WFS')">Create WFS</li>
            <li @click="deleteAsset">Delete</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import CardOpenAssetIcons from '@/components/Catalogue/CardOpenAssetIcons.vue';
import CardCounterIcon from '@/components/Catalogue/CardCounterIcon.vue';
import DraftAssetApi from '@/service/draft';
import CatalogueApi from '@/service/catalogue';
import { EnumAssetType } from '@/model/enum';
// import { AssetDraft } from '@/model/draft';
// import { DraftApiFromAssetCommand, EnumDraftCommandType, CatalogueItemCommand } from '@/model/catalogue';
import getPriceOrMinimumPrice, { getAssetCardColor } from '@/helper/cards';
import moment from 'moment';
import { CatalogueItem, DraftApiFromAssetCommand, EnumDraftCommandType } from '@/model/catalogue';
import store from '@/store';

@Component({
  components: { CardIcon, CardCounterIcon, CardOpenAssetIcons },
})
export default class AssetPublishedCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  @Prop({ required: false }) readonly noSideMenu!: boolean;

  draftAssetApi: DraftAssetApi;

  catalogueApi: CatalogueApi;

  isRightDropdownOpen: boolean;

  rightDropdownServiceCreationExcludedOptions: string[];

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();
    this.catalogueApi = new CatalogueApi();

    this.isRightDropdownOpen = false;
    this.rightDropdownServiceCreationExcludedOptions = [];
  }

  async toggleRightDropdown(): Promise<void> {
    if (this.isRightDropdownOpen) {
      this.isRightDropdownOpen = false;
      return;
    }

    store.commit('setLoading', true);

    const relatedAssetsResponse = await this.catalogueApi.findRelated(this.asset.id);
    this.rightDropdownServiceCreationExcludedOptions = relatedAssetsResponse.result.items.map((x) => x.spatialDataServiceType).filter((x) => x) as string[];

    this.isRightDropdownOpen = true;

    store.commit('setLoading', false);
  }

  getColor = (): string => getAssetCardColor(this.asset.type as EnumAssetType);

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

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
