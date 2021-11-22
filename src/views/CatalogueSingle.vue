<template>
  <div class="asset" v-show="isItemLoaded">

    <asset-head-map :catalogueItem="catalogueItem"></asset-head-map>

    <div class="s_container">
      <div class="asset__inner">
        <div class="asset__content" v-if="isItemLoaded">
          <asset-head :catalogueItem="catalogueItem" :mode="mode" @reloadAsset="loadAsset('catalogue')"></asset-head>

          <div class="asset__sections">

            <overview :mode="mode" :catalogueItem="catalogueItem"></overview>

            <!-- <api-usage-example v-if="catalogueItem && catalogueItem.type === 'SERVICE'"></api-usage-example> -->

            <terms-and-restrictions v-if="mode === 'catalogue'" :catalogueItem="catalogueItem"></terms-and-restrictions>

            <!-- <data-profiling-and-samples :mode="mode" :assetKey="reviewModeAssetKey ? reviewModeAssetKey : ''" :catalogueItem="catalogueItem.automatedMetadata ? catalogueItem.automatedMetadata[0] : null"></data-profiling-and-samples> -->
            <data-profiling-and-samples v-if="catalogueItem.type !== 'SERVICE'" :mode="mode" :assetKey="reviewModeAssetKey" :catalogueItem="catalogueItem"></data-profiling-and-samples>
            <api-layer-profiler v-if="catalogueItem.type === 'SERVICE'" :mode="mode" :catalogueItem="catalogueItem"></api-layer-profiler>

            <!-- <api-metadata v-if="catalogueItem.type === 'SERVICE'" :catalogueItem="catalogueItem"></api-metadata> -->
            <metadata :catalogueItem="catalogueItem"></metadata>
          </div>
        </div>
        <div class="asset__sidebar">

          <shop-card v-if="mode === 'catalogue' && isItemLoaded" :catalogueItem="catalogueItem" @openSelectAreaModal="openSelectAreaModal" @showModalLoginToAddToCart="modalToShow='modalLoginToAddAssetToCart'"></shop-card>
          <shop-card-provider-review v-if="mode === 'review' && isItemLoaded" :catalogueItem="catalogueItem" @openSelectAreaModal="openSelectAreaModal"></shop-card-provider-review>

          <vendor-information :catalogueItem="catalogueItem" @reloadAsset="loadAsset('catalogue')"></vendor-information>

          <other-available-options :catalogueItem="catalogueItem"></other-available-options>
        </div>
      </div>

    </div>
    <related-assets :catalogueItem="catalogueItem"></related-assets>

    <!-- MODALS -->
    <select-areas v-if="isSelectAreasModalOn" @close="closeSelectAreaModal" :assetId="catalogueItem.id" :pricingModelKey="selectedPricingModelKey"></select-areas>

    <modal :withSlots="true" :show="modalToShow === 'modalLoginToAddAssetToCart'" @dismiss="modalToShow = ''">
      <template v-slot:body>
        <h3>Your have to be logged in to proceed with the purchase</h3>
      </template>

      <template v-slot:footer>
        <router-link :to="{name: 'Login', params: { pathToNavigateAfterLogin: $route.path }}" class="btn btn--std btn--blue ml-xs-20">Log In</router-link>
      </template>
    </modal>
    <!-- END OF MODALS -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CatalogueItem, ServerResponse } from '@/model';
import { CatalogueItemCommand, CatalogueItemDetails } from '@/model/catalogue';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';

import store from '@/store';

import Modal from '@/components/Modal.vue';

import AssetHead from '../components/CatalogueSingle/AssetHead.vue';
import AssetHeadMap from '../components/CatalogueSingle/AssetHeadMap.vue';
import Overview from '../components/CatalogueSingle/Overview.vue';
import TermsAndRestrictions from '../components/CatalogueSingle/TermsAndRestrictions.vue';
import DataProfilingAndSamples from '../components/CatalogueSingle/DataProfilingAndSamples.vue';
import ShopCard from '../components/CatalogueSingle/ShopCard.vue';
import ShopCardProviderReview from '../components/CatalogueSingle/ShopCardProviderReview.vue';
import VendorInformation from '../components/CatalogueSingle/VendorInformation.vue';
import OtherAvailableOptions from '../components/CatalogueSingle/OtherAvailableOptions.vue';
import RelatedAssets from '../components/CatalogueSingle/RelatedAssets.vue';
import ApiUsageExample from '../components/CatalogueSingle/ApiUsageExample.vue';
import ApiLayerProfiler from '../components/CatalogueSingle/ApiLayerProfiler.vue';
import Metadata from '../components/CatalogueSingle/Metadata.vue';
import SelectAreas from '../components/CatalogueSingle/SelectAreas.vue';

@Component({
  components: {
    AssetHead,
    AssetHeadMap,
    Overview,
    TermsAndRestrictions,
    DataProfilingAndSamples,
    ShopCard,
    ShopCardProviderReview,
    VendorInformation,
    OtherAvailableOptions,
    RelatedAssets,
    ApiUsageExample,
    ApiLayerProfiler,
    Metadata,
    SelectAreas,
    Modal,
  },
})
export default class CatalogueSingle extends Vue {
  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  catalogueItem: CatalogueItem | CatalogueItemCommand;

  mode: string; // catalog or review

  reviewModeAssetKey: string;

  isItemLoaded: boolean;

  selectedPricingModelKey: string;

  isSelectAreasModalOn: boolean;

  modalToShow: string;

  constructor() {
    super();

    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();

    // todo: enum
    this.mode = '';

    this.reviewModeAssetKey = '';

    this.isItemLoaded = false;

    this.catalogueItem = {} as CatalogueItem;

    this.selectedPricingModelKey = '';

    this.isSelectAreasModalOn = false;

    this.modalToShow = '';
  }

  mounted():void {
    console.log('route', this.$route.path);
    const { path } = this.$route;
    const { 1: pathFirstRoute } = path.split('/'); // catalogue or review
    this.mode = pathFirstRoute;

    this.loadAsset(this.mode);
  }

  loadAsset(mode: string): void {
    console.log('mode', mode);
    if (mode === 'catalogue') {
      const catalogueItemID = this.$route.params.id;

      this.catalogueApi.findOne(catalogueItemID)
        .then((queryResponse: ServerResponse<CatalogueItem | CatalogueItemDetails>) => {
          if (queryResponse.success === false && queryResponse.messages[0].code === 'BasicMessageCode.NotFound') {
            this.$router.push('/errors/404');
          }
          this.catalogueItem = queryResponse.result;
          console.log('catalog item', this.catalogueItem);
          this.isItemLoaded = true;
          store.commit('setLoading', false);
        });
    } else if (mode === 'review') {
      console.log('review mode!');
      const { key } = this.$route.params;
      this.reviewModeAssetKey = key;
      this.draftAssetApi.findOne(key).then((queryResponse) => {
        if (queryResponse.success === false && queryResponse.messages[0].code === 'BasicMessageCode.NotFound') {
          this.$router.push('/errors/404');
        }
        console.log('draft: ', queryResponse.result.command);
        this.catalogueItem = queryResponse.result.command;
        console.log('catalog item', this.catalogueItem);
        this.isItemLoaded = true;
        store.commit('setLoading', false);
      });
    } else {
      console.log('wrong mode');
    }
  }

  openSelectAreaModal(key: string): void {
    this.selectedPricingModelKey = key;
    this.isSelectAreasModalOn = !this.isSelectAreasModalOn;
  }

  closeSelectAreaModal(): void {
    this.isSelectAreasModalOn = false;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
