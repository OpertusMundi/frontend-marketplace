<template>
  <section class="asset__section" :class="{'asset__section--expanded': isExpanded}">

    <!-- MODALS -->
    <modal :withSlots="true" :show="modalToShow === 'modalShowCrsList'" @dismiss="modalToShow = ''" :modalId="'modalShowCrsList'" :showCancelButton="false" :showCloseButton="false">
      <template v-slot:body>
        <div class="p-xs-30">
          <h4>CRS list</h4>
          <div style="max-height: 300px; overflow-y: auto">
            <ul v-if="resources[1] && resources[1].crs && resources[1].crs" style="text-align: left">
              <li v-for="crs in resources[1].crs" :key="crs">{{ crs }}</li>
            </ul>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="modalToShow = ''">OK</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'modalShowOutputFormatsList'" @dismiss="modalToShow = ''" :modalId="'modalShowOutputFormatsList'" :showCancelButton="false" :showCloseButton="false">
      <template v-slot:body>
        <div class="p-xs-30">
          <h4>All output formats</h4>
          <div style="max-height: 300px; overflow-y: auto">
            <ul v-if="resources[1] && resources[1].outputFormats" style="text-align: left">
              <li v-for="format in resources[1].outputFormats" :key="format">{{ format }}</li>
            </ul>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="modalToShow = ''">OK</button>
      </template>
    </modal>
    <!-- END OF MODALS -->

    <div class="asset__section__head">
      <div class="d-flex space-between">
        <h4>Layer Profiler</h4>
        <div @click="toggleExpansion" style="cursor: pointer"><svg data-name="Full screen icon" xmlns="http://www.w3.org/2000/svg" width="15.989" height="16"><path data-name="Path 9453" d="m15.187 0 .8.8v3.763h-1.346v-1.73l.093-.453-.1-.058-.29.372-3.24 3.24L10.07 4.9l3.229-3.252.372-.29-.058-.1-.453.093h-1.73V0z" fill="#333"/><path data-name="Path 9452" d="m.801 0-.8.8v3.765h1.346v-1.73l-.093-.453.1-.058.29.372 3.245 3.239 1.034-1.034-3.229-3.252-.372-.29.058-.1.453.093h1.731V0z" fill="#333"/><path data-name="Path 9451" d="m.801 16-.8-.8v-3.764h1.346v1.73l-.093.453.1.058.29-.372 3.24-3.24L5.923 11.1l-3.229 3.251-.372.29.058.1.453-.093h1.731V16z" fill="#333"/><path data-name="Path 9450" d="m15.187 16 .8-.8v-3.76h-1.346v1.73l.093.453-.1.058-.29-.372-3.24-3.24-1.034 1.034 3.229 3.252.372.29-.058.1-.453-.093h-1.73v1.347z" fill="#333"/></svg></div>
      </div>

      <!-- <div class="asset__section__head__sample_download" v-if="isUserAuthenticated && metadata.samples">
        <span><strong>Select layer:</strong></span>
        <multiselect v-model="metadataDownloadFileSelection" :options="['file_1']" :allowEmpty="false" :preselectFirst="true" :searchable="false" :openDirection="'bottom'" :close-on-select="true" :show-labels="false" placeholder="Select a sample to download"></multiselect>
        <div v-if="metadataDownloadFileSelection" @click="onDownloadAutomatedMetadata" class="asset__section__head__sample_download__btn"><svg data-name="Group 2342" xmlns="http://www.w3.org/2000/svg" width="15" height="16"><g data-name="Group 753"><g data-name="Group 752"><path data-name="Path 2224" d="M11.455 7.293A.5.5 0 0 0 11.002 7h-2V.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7h-2a.5.5 0 0 0-.376.829l3.5 4a.5.5 0 0 0 .752 0l3.5-4a.5.5 0 0 0 .077-.536z" fill="#333"/></g></g><g data-name="Group 755"><g data-name="Group 754"><path data-name="Path 2225" d="M13 11v3H2v-3H0v4a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4z" fill="#333"/></g></g></svg></div>
      </div> -->

      <div class="asset__section__head__main_information asset__section__head__main_information--includes-buttons" v-if="isUserAuthenticated && resources[1]">
        <p v-if="resources[1].crs && resources[1].crs.length < 5"><strong>CRS:</strong> {{ resources[1].crs.join(', ') }}</p>
        <p v-if="resources[1].crs && resources[1].crs.length >= 5"><strong>CRS:</strong> {{ resources[1].crs.slice(0, 5).join(', ') }}... <button @click="onShowWholeCrsList" class="btn btn--std btn--outlinedark">show all</button></p>
        <p v-if="!resources[1].crs"><strong>CRS: </strong></p>
        <p><strong>ATTRIBUTION:</strong> {{ resources[1].attribution ? resources[1].attribution : '' }}</p>
        <p><strong>TYPE:</strong> {{ resources[1].serviceType ? resources[1].serviceType : '' }}</p>
      </div>

      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs" v-if="isUserAuthenticated">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">COVERAGE</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">DETAILS</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">STYLES</a></li>
        <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">DIMENSIONS</a></li>
        <li><a href="#" @click.prevent="activeTab = 5" :class="{ 'active' : activeTab == 5 }">TILES</a></li>
        <li><a href="#" @click.prevent="activeTab = 6" :class="{ 'active' : activeTab == 6 }">SAMPLE 1</a></li>
        <li><a href="#" @click.prevent="activeTab = 7" :class="{ 'active' : activeTab == 7 }">SAMPLE 2</a></li>
        <li><a href="#" @click.prevent="activeTab = 8" :class="{ 'active' : activeTab == 8 }">SAMPLE 3</a></li>
        <!-- <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Sample 1</a></li> -->
        <!-- <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Sample 2</a></li> -->
      </ul>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner asset__section__content__inner--centered" v-if="!isUserAuthenticated">
        <div class="m-xs-40">
          <h2>Automated metadata and samples are visible only to registered users</h2>
          <p>Create a topio user account and explore geodata without limitations</p>
          <a href="/register" class="btn--std btn--blue">REGISTER</a>
        </div>
      </div>
      <div class="asset__section__content__inner" v-else>
        <ul class="asset__section__tabs asset__section__tabs__service_details">

          <!-- COVERAGE -->
          <li v-if="activeTab == 1">
            <p>Contains visualisation of the coverage on a map</p>
            <div v-if="resources[1] && resources[1].bbox" class="tab_maps-map mt-xs-20">
              <l-map
                ref="mapMbr"
                :bounds="getMapBoundsFromGeoJson(resources[1].bbox)"
                :maxBounds="getMapBoundsFromGeoJson(resources[1].bbox)"
                :options="mapConfig.options"
              >
                <l-tile-layer
                :url="mapConfig.tilesUrl"
                :attribution="mapConfig.attribution"/>
                <l-geo-json
                  :geojson="resources[1].bbox"
                  :optionsStyle="{color: 'orange'}"
                >
                </l-geo-json>
              </l-map>
            </div>
            <h5 v-else>No map to show</h5>
          </li>

          <!-- DETAILS -->
          <li v-if="activeTab == 2">
            <p>Details of the service</p>
            <hr>
            <h3>General</h3>
            <div class="asset__section__tabs__info_table asset__section__tabs__info_table--includes-buttons" v-if="resources[1]">
              <p><strong>Identifier</strong>{{ resources[1].id ? resources[1].id : '' }}</p>
              <p v-if="!resources[1].maxScale && !resources[1].minScale">Scale </p>
              <p v-if="resources[1].maxScale && !resources[1].minScale">Max scale {{ resources[1].maxScale }}</p>
              <p v-if="!resources[1].maxScale && resources[1].minScale">Min scale {{ resources[1].minScale }}</p>
              <p v-if="resources[1].maxScale && resources[1].minScale"><strong>Scale</strong>{{ `1:${resources[1].maxScale}` }} - {{ `1:${resources[1].minScale}` }}</p>
              <p v-if="resources[1].outputFormats.length < 3"><strong>Output formats</strong> {{ resources[1].outputFormats.join(', ') }}</p>
              <p v-else><strong>Output formats</strong> <span>{{ resources[1].outputFormats.slice(0, 3).join(', ') }}... <button @click="onShowWholeOutputFormatsList" class="btn btn--std btn--outlinedark">show all</button></span></p>
            </div>
            <hr>
            <h3>Attributes</h3>
            <!-- <div v-if="resources[1] && resources[1].attributes" class="asset__section__tabs__info_table asset__section__tabs__info_table--includes-buttons"> -->
            <div v-if="resources[1] && resources[1].attributes" class="asset__section__tabs__info_table">
              <p><strong>queryable</strong><span>{{ 'queryable' in resources[1].attributes && resources[1].attributes.queryable !== null ? resources[1].attributes.queryable : '' }}</span></p>
              <p><strong>cascaded</strong><span>{{ 'cascaded' in resources[1].attributes && resources[1].attributes.cascaded !== null ? resources[1].attributes.cascaded : '' }}</span></p>
              <p><strong>opaque</strong><span>{{ 'opaque' in resources[1].attributes && resources[1].attributes.opaque !== null ? resources[1].attributes.opaque : '' }}</span></p>
              <p><strong>noSubsets</strong><span>{{ 'noSubsets' in resources[1].attributes && resources[1].attributes.noSubsets !== null ? resources[1].attributes.noSubsets : '' }}</span></p>
              <p><strong>fixedWidth</strong><span>{{ 'fixedWidth' in resources[1].attributes && resources[1].attributes.fixedWidth !== null ? resources[1].attributes.fixedWidth : '' }}</span></p>
              <p><strong>fixedHeight</strong><span>{{ 'fixedHeight' in resources[1].attributes && resources[1].attributes.fixedHeight !== null ? resources[1].attributes.fixedHeight : '' }}</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';
import store from '@/store';
import { Chart } from 'highcharts-vue';
import Multiselect from 'vue-multiselect';
import L from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { parse as wktToGeojsonParser } from 'wellknown';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';
import {
  CatalogueItemDetails,
} from '@/model/catalogue';
// eslint-disable-next-line
import { GeoJsonObject } from 'geojson';
import Modal from '@/components/Modal.vue';
import { bbox as turfBBox } from '@turf/turf';
import { FileResource, Resource, ServiceResource } from '@/model/asset';

@Component({
  components: {
    Chart,
    Multiselect,
    LMap,
    LTileLayer,
    LPolygon,
    LGeoJson,
    Modal,
  },
})
export default class ApiLayerProfiler extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItemDetails;

  @Prop() private mode?: string;

  @Prop() private assetKey?: string;

  resources: (Resource | FileResource | ServiceResource)[];

  hiddenMetadata: string[] | undefined;

  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  activeTab: number;

  isUserAuthenticated: boolean;

  mapConfig: any;

  isMapBBox: boolean;

  isExpanded: boolean;

  modalToShow: string;

  constructor() {
    super();

    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();

    this.resources = this.catalogueItem.resources;

    this.activeTab = 1;

    this.isExpanded = false;

    this.isMapBBox = !!this.resources[1] && !!(this.resources[1] as ServiceResource).bbox;

    this.modalToShow = '';

    this.isUserAuthenticated = store.getters.isAuthenticated;

    this.mapConfig = {
      options: {
        minZoom: 1,
        maxZoom: 10,
      },
      styleHeatmap: (feature) => ({
        fillColor: feature.properties.fill,
        color: feature.properties.fill,
        fillOpacity: 0.7,
        opacity: 0.4,
        weight: 1,
        stroke: true,
      }),
      tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  }

  mounted(): void {
    console.log('resources', this.resources);
  }

  @Watch('activeTab', { immediate: true })
  onActiveTabChange(activeTab: number): void {
    // if tab is maps-tab
    if (activeTab === 1 && this.isMapBBox && this.isUserAuthenticated) {
      this.setMinMaxZoomLevels();
    }
  }

  toggleExpansion(): void {
    // if (!this.isExpanded) window.scrollTo(0, 0);
    this.isExpanded = !this.isExpanded;
    document.body.style.overflowY = this.isExpanded ? 'hidden' : 'visible';
  }

  setMinMaxZoomLevels(): void {
    this.$nextTick(() => {
      if (!(this as any).$refs.mapMbr) return;

      const fitBoundsZoomLevel = (this as any).$refs.mapMbr.mapObject.getBoundsZoom(L.geoJSON((this.resources[1] as ServiceResource).bbox as GeoJsonObject).getBounds());

      const zoomOffset = 2;

      const minZoom = fitBoundsZoomLevel - zoomOffset < 0 ? 0 : fitBoundsZoomLevel - zoomOffset;
      const maxZoom = fitBoundsZoomLevel + zoomOffset;

      console.log('minZoom', minZoom, 'maxZoom', maxZoom);

      Vue.set(this.mapConfig.options, 'minZoom', minZoom);
      Vue.set(this.mapConfig.options, 'maxZoom', maxZoom);
    });
  }

  onShowWholeCrsList(): void {
    this.modalToShow = 'modalShowCrsList';
  }

  onShowWholeOutputFormatsList(): void {
    this.modalToShow = 'modalShowOutputFormatsList';
  }

  wktToGeoJson(wkt: string): any {
    return wktToGeojsonParser(wkt);
  }

  // mbrToLeafletBounds(wkt: string): number[][] {
  //   const geoJson = wktToGeojsonParser(wkt);
  //   const bounds = geoJson.coordinates[0]
  //     .map((x) => [x[1], x[0]]);
  //   return bounds;
  // }

  // getMapBoundsFromWKT(wkt: string): number[][] {
  //   const geoJson = wktToGeojsonParser(wkt);
  //   const bbox = turfBBox(geoJson);
  //   return [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
  // }

  getMapBoundsFromGeoJson(geoJson: GeoJsonObject): number[][] {
    const bbox = turfBBox(geoJson);
    return [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "~vue-multiselect/dist/vue-multiselect.min.css";
  @import "@/assets/styles/graphs/_table.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";

  // LEAFLET FIXES DUE TO STYLE OVERRIDE
  .leaflet-container a {
    -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4) !important;
  }
  .leaflet-container a {
    color: #0078A8 !important;
  }
  .leaflet-touch .leaflet-bar a {
    width: 30px !important;
    height: 30px !important;
    line-height: 30px !important;
  }
  .leaflet-control-attribution, .leaflet-control-attribution a {
    font-size: 11px !important;
  }
  .leaflet-control-attribution a {
    text-decoration: none !important;
  }
  .leaflet-bar > a:link {
    color: black !important;
    text-decoration: none !important;
    font-size: 22px !important;
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
</style>
