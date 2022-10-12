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

            <terms-and-restrictions v-if="mode === 'catalogue' && !catalogueItem.openDataset" :catalogueItem="catalogueItem"></terms-and-restrictions>

            <!-- <data-profiling-and-samples :mode="mode" :assetKey="reviewModeAssetKey ? reviewModeAssetKey : ''" :catalogueItem="catalogueItem.automatedMetadata ? catalogueItem.automatedMetadata[0] : null"></data-profiling-and-samples> -->
            <data-profiling-and-samples v-if="!['SERVICE', 'SENTINEL_HUB_OPEN_DATA', 'SENTINEL_HUB_COMMERCIAL_DATA'].includes(catalogueItem.type)" :mode="mode" :assetKey="reviewModeAssetKey" :catalogueItem="catalogueItem"></data-profiling-and-samples>
            <api-layer-profiler v-if="catalogueItem.type === 'SERVICE'" :mode="mode" :catalogueItem="catalogueItem"></api-layer-profiler>
            <satellite-images-explorer
              v-if="['SENTINEL_HUB_OPEN_DATA', 'SENTINEL_HUB_COMMERCIAL_DATA'].includes(catalogueItem.type) && mode === 'catalogue'"
              :assetId="catalogueItem.id"
              :assetTitle="catalogueItem.title"
              :collectionId="catalogueItem.extensions.sentinelHub.collection"
              @showModalLoginToOpenEOExplorer="modalToShow='modalLoginToOpenEOExplorer'"
            ></satellite-images-explorer>

            <!-- <api-metadata v-if="catalogueItem.type === 'SERVICE'" :catalogueItem="catalogueItem"></api-metadata> -->
            <metadata :catalogueItem="catalogueItem"></metadata>
          </div>
        </div>
        <div class="asset__sidebar">

          <template v-if="isItemLoaded && mode === 'catalogue'">
            <shop-card-open v-if="catalogueItem.openDataset" :catalogueItem="catalogueItem"></shop-card-open>
            <shop-card
              v-else
              :catalogueItem="catalogueItem"
              @openSelectAreaModal="openSelectAreaModal"
              @openSelectSentinelHubPlanModal="openSelectSentinelHubPlanModal"
              @showModalLoginToAddToCart="modalToShow='modalLoginToAddAssetToCart'"
            ></shop-card>
          </template>
          <template v-if="isItemLoaded && mode && ['review', 'helpdesk-review'].includes(mode)">
            <shop-card-provider-review-open v-if="catalogueItem.openDataset" :catalogueItem="catalogueItem"></shop-card-provider-review-open>
            <shop-card-provider-review v-else :catalogueItem="catalogueItem" @openSelectAreaModal="openSelectAreaModal"></shop-card-provider-review>
          </template>

          <vendor-information :catalogueItem="catalogueItem" @reloadAsset="loadAsset('catalogue')"></vendor-information>

          <other-available-options :catalogueItem="catalogueItem"></other-available-options>
        </div>
      </div>

    </div>
    <related-assets :catalogueItem="catalogueItem" v-if="isItemLoaded && mode && !['review', 'helpdesk-review'].includes(mode)"></related-assets>

    <!-- MODALS -->
    <select-areas v-if="isSelectAreasModalOn" @close="closeSelectAreaModal" :assetId="catalogueItem.id" :pricingModel="selectedPricingModelForAreaSelection"></select-areas>
    <select-sentinel-hub-plan v-if="isSelectSentinelHubPlanModalOn" @close="closeSelectSentinelHubPlanModal" :assetId="catalogueItem.id"></select-sentinel-hub-plan>

    <modal :withSlots="true" :show="modalToShow === 'modalLoginToAddAssetToCart'" @dismiss="modalToShow = ''">
      <template v-slot:body>
        <h3>Your have to be logged in to proceed with the purchase</h3>
      </template>

      <template v-slot:footer>
        <button @click="loginWithKeycloak" class="btn btn--std btn--blue ml-xs-20">Log In</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'modalLoginToOpenEOExplorer'" @dismiss="modalToShow = ''">
      <template v-slot:body>
        <h3>Your have to be logged in to open explorer</h3>
      </template>

      <template v-slot:footer>
        <button @click="loginWithKeycloak" class="btn btn--std btn--blue ml-xs-20">Log In</button>
      </template>
    </modal>
    <!-- END OF MODALS -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CatalogueItem, ServerResponse } from '@/model';
import { CatalogueItemCommand, CatalogueItemDetails } from '@/model/catalogue';
import { FixedPopulationPricingModelCommand, FixedRowPricingModelCommand } from '@/model/pricing-model';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';
import HelpdeskDraftApi from '@/service/draft-helpdesk';

import store from '@/store';

import Modal from '@/components/Modal.vue';

import { navigateToKeycloakLogin } from '@/helper/login';
import { fetchUserProfileAndCart } from '@/helper/user';

import AssetHead from '../components/CatalogueSingle/AssetHead.vue';
import AssetHeadMap from '../components/CatalogueSingle/AssetHeadMap.vue';
import Overview from '../components/CatalogueSingle/Overview.vue';
import TermsAndRestrictions from '../components/CatalogueSingle/TermsAndRestrictions.vue';
import DataProfilingAndSamples from '../components/CatalogueSingle/DataProfilingAndSamples.vue';
import ShopCard from '../components/CatalogueSingle/ShopCard.vue';
import ShopCardOpen from '../components/CatalogueSingle/ShopCardOpen.vue';
import ShopCardProviderReview from '../components/CatalogueSingle/ShopCardProviderReview.vue';
import ShopCardProviderReviewOpen from '../components/CatalogueSingle/ShopCardProviderReviewOpen.vue';
import VendorInformation from '../components/CatalogueSingle/VendorInformation.vue';
import OtherAvailableOptions from '../components/CatalogueSingle/OtherAvailableOptions.vue';
import RelatedAssets from '../components/CatalogueSingle/RelatedAssets.vue';
import ApiUsageExample from '../components/CatalogueSingle/ApiUsageExample.vue';
import ApiLayerProfiler from '../components/CatalogueSingle/ApiLayerProfiler.vue';
import SatelliteImagesExplorer from '../components/CatalogueSingle/SatelliteImagesExplorer.vue';
import Metadata from '../components/CatalogueSingle/Metadata.vue';
import SelectAreas from '../components/CatalogueSingle/SelectAreas.vue';
import SelectSentinelHubPlan from '../components/CatalogueSingle/SelectSentinelHubPlan.vue';

@Component({
  components: {
    AssetHead,
    AssetHeadMap,
    Overview,
    TermsAndRestrictions,
    DataProfilingAndSamples,
    ShopCard,
    ShopCardOpen,
    ShopCardProviderReview,
    ShopCardProviderReviewOpen,
    VendorInformation,
    OtherAvailableOptions,
    RelatedAssets,
    ApiUsageExample,
    ApiLayerProfiler,
    SatelliteImagesExplorer,
    Metadata,
    SelectAreas,
    SelectSentinelHubPlan,
    Modal,
  },
})
export default class CatalogueSingle extends Vue {
  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  helpdeskDraftApi: HelpdeskDraftApi;

  catalogueItem: CatalogueItem | CatalogueItemCommand;

  mode: string; // catalog or review

  reviewModeAssetKey: string;

  isItemLoaded: boolean;

  selectedPricingModelForAreaSelection: FixedRowPricingModelCommand | FixedPopulationPricingModelCommand | null;

  isSelectAreasModalOn: boolean;

  isSelectSentinelHubPlanModalOn: boolean;

  modalToShow: string;

  constructor() {
    super();

    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();
    this.helpdeskDraftApi = new HelpdeskDraftApi();

    // todo: enum
    this.mode = '';

    this.reviewModeAssetKey = '';

    this.isItemLoaded = false;

    this.catalogueItem = {} as CatalogueItem;

    this.selectedPricingModelForAreaSelection = null;

    this.isSelectAreasModalOn = false;
    this.isSelectSentinelHubPlanModalOn = false;

    this.modalToShow = '';
  }

  mounted():void {
    console.log('route', this.$route.path);
    const { path } = this.$route;
    const { 1: pathFirstRoute } = path.split('/'); // catalogue or review
    this.mode = pathFirstRoute;

    this.loadAsset(this.mode);
  }

  async loadAsset(mode: string): Promise<void> {
    if (!store.getters.isAuthenticated) {
      await fetchUserProfileAndCart();
    }

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
    } else if (mode === 'helpdesk-review') {
      console.log('helpdesk-review mode!');
      const { key } = this.$route.params;
      this.helpdeskDraftApi.findOne(key).then((response) => {
        this.catalogueItem = response.result;
        this.isItemLoaded = true;
        store.commit('setLoading', false);
      });
    } else {
      console.log('wrong mode');
    }
  }

  openSelectAreaModal(pricingModel: FixedRowPricingModelCommand | FixedPopulationPricingModelCommand): void {
    this.selectedPricingModelForAreaSelection = pricingModel;
    this.isSelectAreasModalOn = !this.isSelectAreasModalOn;
  }

  openSelectSentinelHubPlanModal(): void {
    this.isSelectSentinelHubPlanModalOn = !this.isSelectSentinelHubPlanModalOn;
  }

  closeSelectAreaModal(): void {
    this.isSelectAreasModalOn = false;
  }

  closeSelectSentinelHubPlanModal(): void {
    this.isSelectSentinelHubPlanModalOn = false;
  }

  loginWithKeycloak(): void {
    navigateToKeycloakLogin(this.$route.path);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
