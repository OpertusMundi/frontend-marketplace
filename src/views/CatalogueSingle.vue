<template>
  <div class="asset" v-show="isItemLoaded">

    <asset-head-map :catalogueItem="catalogueItem"></asset-head-map>

    <div class="s_container">
      <div class="asset__inner">
        <div class="asset__content" v-if="isItemLoaded">
          <asset-head :catalogueItem="catalogueItem"></asset-head>

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
import { BasePricingModelCommand } from '@/model/pricing-model';
import { CatalogueItemDetails } from '@/model/catalogue';
import CatalogueApi from '@/service/catalogue';
import CartApi from '@/service/cart';

// eslint-disable-next-line
import { GeoJsonObject } from 'geojson';

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

  catalogueItem: CatalogueItem;

  // isUserAuthenticated: boolean;

  // variables added for API metadata

  // we currently dont know the exact interface of the API metadata.
  // we store our dummy API metadata to the following variable as any
  catalogueItemDummyMetadata: any = {};

  // geojson fetched from APIs metadata
  geoJson!: GeoJsonObject;

  // a var for storing item type (value "api" for API)
  catalogueItemType: string;

  // a dummy API response example
  apiSampleResponse: any = {
    status: 'ok',
    geometries: {
      foo: 'foo',
      bar: 'bar',
    },
    fooNumber: 123,
  }
  /* */

  isItemLoaded: boolean;

  // selectedPricingModel: string;
  selectedPricingModel: BasePricingModelCommand | null;

  map: any;

  mapMetadata: any;

  cartErrors: string;

  cartApi: CartApi;

  selectedVersion: string;

  activeTermsTab: number;

  activeProfilingTab: number;

  metadata: any;

  isSelectAreasModalOn: boolean;

  constructor() {
    super();

    this.isItemLoaded = false;
    this.selectedVersion = '';
    this.activeTermsTab = 1;
    this.activeProfilingTab = 1;
    this.catalogueItem = {} as CatalogueItem;
    this.catalogueItemType = '';
    this.catalogueApi = new CatalogueApi();
    this.selectedPricingModel = null;
    this.cartErrors = '';
    this.cartApi = new CartApi();
    this.metadata = null;
    this.isSelectAreasModalOn = false;
  }

  mounted():void {
    this.calcAssetHeaderTitle();
    window.addEventListener('resize', () => {
      this.calcAssetHeaderTitle();
    });
    this.loadAsset();

    // imitate REST-API latency
    // setTimeout(() => {
    //   // this.metadata = mockMetadata;
    // }, 3000);
  }

  beforeDestroy():void {
    window.removeEventListener('resize', this.calcAssetHeaderTitle);
  }

  loadAsset(): void {
    const catalogueItemID = this.$route.params.id;

    this.catalogueApi.findOne(catalogueItemID)
      .then((queryResponse: ServerResponse<CatalogueItem | CatalogueItemDetails>) => {
        if (queryResponse.success === false && queryResponse.messages[0].code === 'BasicMessageCode.NotFound') {
          this.$router.push('/errors/404');
        }
        this.catalogueItem = queryResponse.result;
        console.log('catalog item', this.catalogueItem);
        this.selectedVersion = this.catalogueItem.version;
        this.isItemLoaded = true;
        setTimeout(() => {
          this.calcAssetHeaderTitle();
        }, 200);

        if ((this.catalogueItem as CatalogueItemDetails).automatedMetadata) {
          // TODO: why array of objects instead of object? should be fixed in API.
          // eslint-disable-next-line
          this.metadata = (this.catalogueItem as CatalogueItemDetails).automatedMetadata![0];

          this.catalogueApi.getAssetHeatmap(this.metadata.heatmap).then((heatmapResponse) => {
            this.$set(this.metadata, 'heatmapGeoJson', heatmapResponse);
            console.log('h', this.metadata.heatmapGeoJson);
          });
        }
      });
  }

  toggleSelectAreaModal(): void {
    this.isSelectAreasModalOn = !this.isSelectAreasModalOn;
  }

  // eslint-disable-next-line
  // heatmapStyle(feature: any): any {
  //   return {
  //     fillColor: feature.properties.fill,
  //     color: feature.properties.fill,
  //     fillOpacity: 0.7,
  //     opacity: 0.4,
  //     weight: 1,
  //     stroke: true,
  //   };
  // }

  calcAssetHeaderTitle():void {
    const assetHead:HTMLElement|null = document.querySelector('.asset__head');
    let assetHeadHeight = 0;
    if (assetHead) {
      assetHeadHeight = assetHead.offsetHeight;
    }
    document.documentElement.style.setProperty('--asset-head-height', `${assetHeadHeight}px`);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
