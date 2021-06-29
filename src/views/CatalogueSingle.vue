<template>
  <div class="asset" v-show="isItemLoaded">

    <asset-head-map :catalogueItem="catalogueItem"></asset-head-map>

    <div class="s_container">
      <div class="asset__inner">
        <div class="asset__content" v-if="isItemLoaded">
          <asset-head :catalogueItem="catalogueItem" :mode="mode"></asset-head>

          <div class="asset__sections">

            <overview :catalogueItem="catalogueItem"></overview>

            <api-usage-example v-if="catalogueItem.type === 'API'"></api-usage-example>

            <terms-and-restrictions :catalogueItem="catalogueItem"></terms-and-restrictions>

            <data-profiling-and-samples :metadata="catalogueItem.automatedMetadata ? catalogueItem.automatedMetadata[0] : null"></data-profiling-and-samples>
          </div>
        </div>
        <div class="asset__sidebar">

          <shop-card :catalogueItem="catalogueItem"></shop-card>

          <other-available-options :catalogueItem="catalogueItem"></other-available-options>
        </div>
      </div>

    </div>
    <related-assets :catalogueItem="catalogueItem"></related-assets>

    <!-- MODALS -->
    <select-areas v-if="isSelectAreasModalOn" @close="toggleSelectAreaModal" :assetId="catalogueItem.id" :pricingModelKey="selectedPricingModel.key"></select-areas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CatalogueItem, ServerResponse } from '@/model';
import { CatalogueItemCommand, CatalogueItemDetails } from '@/model/catalogue';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';

import AssetHead from '../components/CatalogueSingle/AssetHead.vue';
import AssetHeadMap from '../components/CatalogueSingle/AssetHeadMap.vue';
import Overview from '../components/CatalogueSingle/Overview.vue';
import TermsAndRestrictions from '../components/CatalogueSingle/TermsAndRestrictions.vue';
import DataProfilingAndSamples from '../components/CatalogueSingle/DataProfilingAndSamples.vue';
import ShopCard from '../components/CatalogueSingle/ShopCard.vue';
import OtherAvailableOptions from '../components/CatalogueSingle/OtherAvailableOptions.vue';
import RelatedAssets from '../components/CatalogueSingle/RelatedAssets.vue';
import ApiUsageExample from '../components/CatalogueSingle/ApiUsageExample.vue';
import SelectAreas from '../components/CatalogueSingle/SelectAreas.vue';

@Component({
  components: {
    AssetHead,
    AssetHeadMap,
    Overview,
    TermsAndRestrictions,
    DataProfilingAndSamples,
    ShopCard,
    OtherAvailableOptions,
    RelatedAssets,
    ApiUsageExample,
    SelectAreas,
  },
})
export default class CatalogueSingle extends Vue {
  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  catalogueItem: CatalogueItem | CatalogueItemCommand;

  mode: string; // catalog or review

  isItemLoaded: boolean;

  isSelectAreasModalOn: boolean;

  constructor() {
    super();

    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();

    this.mode = '';

    this.isItemLoaded = false;

    this.catalogueItem = {} as CatalogueItem;

    this.isSelectAreasModalOn = false;
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
        });
    } else if (mode === 'review') {
      console.log('review mode!');
      const { key } = this.$route.params;
      this.draftAssetApi.findOne(key).then((queryResponse) => {
        if (queryResponse.success === false && queryResponse.messages[0].code === 'BasicMessageCode.NotFound') {
          this.$router.push('/errors/404');
        }
        this.catalogueItem = queryResponse.result.command;
        console.log('catalog item', this.catalogueItem);
        this.isItemLoaded = true;
      });
    } else {
      console.log('wrong mode');
    }
  }

  toggleSelectAreaModal(): void {
    this.isSelectAreasModalOn = !this.isSelectAreasModalOn;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
