<template>
  <div class="wrapper">
    <div class="eo_explorer_page">
      <div class="eo_explorer_page__header">
        <div class="d-flex align-items-center">
          <div @click="$router.go(-1)" class="eo_explorer_page__header__btn_back">
            <svg xmlns="http://www.w3.org/2000/svg" width="11.06" height="15.144" viewBox="0 0 11.06 15.144"><path data-name="Path 13446" d="m10.102 1.154-7.75 6.429 7.75 6.4" fill="none" stroke="#333" stroke-width="3"/></svg>
          </div>
          <h1>{{ assetTitle }}</h1>
        </div>
        <div class="d-flex align-items-center">
          <span v-if="fromPrice !== null" class="eo_explorer_page__header__price">from <h1>{{ fromPrice }}€/month</h1></span>
          <button class="btn btn--std btn--blue ml-xs-10" @click="isSelectSentinelHubPlanModalOn = true">subscribe</button>
        </div>
      </div>
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-md-4">
            <h4 class="mt-xs-20">Data source: <span class="collection_name">{{ collectionId }}</span></h4>

            <!-- <template v-if="!searchResults"> -->
            <template v-if="menuState === 'SEARCH'">
              <h4 class="mt-xs-20 mb-xs-10">Date Selection</h4>
              <div class="d-flex space-between">
                <div>
                  <label>From date</label>
                  <datepicker input-class="form-group__text" :value="date.from" @input="date.from = formatDateForDatePicker($event)"></datepicker>
                </div>
                <div>
                  <label>To date</label>
                  <datepicker input-class="form-group__text" :value="date.to" @input="date.to = formatDateForDatePicker($event)"></datepicker>
                </div>
              </div>

              <h4 class="mt-xs-20 mb-xs-10">Spatial extent</h4>
              <div class="d-flex flex-column align-items-center">
                <label for="bboxNorth">North</label>
                <div><input id="bboxNorth" type="number" v-model="bbox.maxLat" class="form-group__text"></div>
              </div>
              <div class="d-flex space-between">
                <div>
                  <label for="bboxWest">West</label>
                  <div><input id="bboxWest" type="number" v-model="bbox.minLon" class="form-group__text"></div>
                </div>
                <div>
                  <label for="bboxEast">East</label>
                  <div><input id="bboxEast" type="number" v-model="bbox.maxLon" class="form-group__text"></div>
                </div>
              </div>
              <div class="d-flex flex-column align-items-center">
                <label for="bboxSouth">South</label>
                <div><input id="bboxSouth" type="number" v-model="bbox.minLat" class="form-group__text"></div>
              </div>

              <h4 class="btn-show-advanced-filters mt-xs-10 mb-xs-10" @click="isAdvancedFiltersShown = !isAdvancedFiltersShown">{{ isAdvancedFiltersShown ? 'Hide advanced filters' : 'Show advanced filters' }}</h4>
              <div v-if="isAdvancedFiltersShown">
                <advanced-filters-extension v-if="collectionId" :collectionId="collectionId" @querychange="onAdvancedFiltersQueryChange"></advanced-filters-extension>

                <!-- <div class="form-group">
                  <label for="multiselect_include_fields">Include fields</label>
                  <multiselect id="multiselect_include_fields" v-model="fieldsToInclude" tag-placeholder="Press enter to add field" :options="fieldsToInclude" :multiple="true" :taggable="true" @tag="(x) => fieldsToInclude.push(x)" :close-on-select="true" :show-labels="false" placeholder="e.g. id, type"></multiselect>
                </div>
                <div class="form-group">
                  <label for="multiselect_exclude_fields">Exclude fields</label>
                  <multiselect id="multiselect_exclude_fields" v-model="fieldsToExclude" tag-placeholder="Press enter to add field" :options="fieldsToExclude" :multiple="true" :taggable="true" @tag="(x) => fieldsToExclude.push(x)" :close-on-select="true" :show-labels="false" placeholder="e.g. id, type"></multiselect>
                </div>
                <div class="form-group">
                  <label for="multiselect_product_ids">Product ids</label>
                  <multiselect id="multiselect_product_ids" v-model="productIDs" tag-placeholder="Press enter to add id" :options="productIDs" :multiple="true" :taggable="true" @tag="(x) => productIDs.push(x)" :close-on-select="true" :show-labels="false" placeholder="Add product id"></multiselect>
                </div> -->
              </div>

              <div class="d-flex justify-content-center mt-xs-50 mb-xs-20">
                <button class="btn btn--std btn--outlineblue mr-xs-20" :disabled="!isAdvancedFiltersShown" @click="isAdvancedFiltersShown = false">CANCEL</button>
                <button class="btn btn--std btn--blue" @click="searchCollection()">SEARCH</button>
              </div>
            </template>
            <!-- <template v-if="searchResults && !selectedFeatureToShowMetadata && !visualiseLayers.length"> -->
            <template v-if="menuState === 'SHOW_FEATURES' && searchResults">
              <a href="" @click.prevent="goBack" class="back_btn_container"><img src="@/assets/images/icons/back_icon_dark.svg" alt="">BACK</a>
              <div>
                <div class="pill pill--blue" v-for="filter in getSelectedFilters()" :key="filter.id">
                  {{ filter.label }}
                  <div class="close-button" @click="removeFilter(filter.id)"><font-awesome-icon icon="times" /></div>
                </div>
              </div>
              <hr>
              <eo-explorer-card
                v-for="feature in searchResults.features"
                :key="feature.id"
                :feature="feature"
                :collectionId="collectionId"
                @viewAllMetadata="onViewAllMetadata"
                @visualise="onVisualise"
              ></eo-explorer-card>
            </template>
            <template v-if="menuState === 'SHOW_FEATURE_METADATA'">
              <a href="" @click.prevent="goBack" class="back_btn_container"><img src="@/assets/images/icons/back_icon_dark.svg" alt="">BACK</a>
              <small class="break-word-anywhere">{{ selectedFeatureToShowMetadata }}</small>
              <hr>
              <!-- <img v-if="searchResults.features.find(x => x.id === selectedFeatureToShowMetadata) && searchResults.features.find(x => x.id === selectedFeatureToShowMetadata).assets && searchResults.features.find(x => x.id === selectedFeatureToShowMetadata).assets.thumbnail && searchResults.features.find(x => x.id === selectedFeatureToShowMetadata).assets.thumbnail.href" :src="searchResults.features.find(x => x.id === selectedFeatureToShowMetadata).assets.thumbnail.href" alt="Thumbnail"> -->
              <!-- <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZYAAADpCAIAAACImYZhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAMUSURBVHhe7dQxDQAwDMCwbvwhFdyekYhkP2GQs7sD0HR/AYIsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoCsmQc7rwQGCUtr1QAAAABJRU5ErkJggg==" alt="missing thumbnail" /> -->
              <img v-if="searchResults.features.some(x => x.id === selectedFeatureToShowMetadata)" :src="getFeatureThumbnail(collectionId, searchResults.features.find(x => x.id === selectedFeatureToShowMetadata))" alt="Thumbnail">
              <img v-else :src="fallbackThumbnail" alt="missing thumbnail" />
              <div v-for="[key, value] in Object.entries(searchResults.features.find(x => x.id === selectedFeatureToShowMetadata).properties)" :key="key" class="mt-xs-10 mb-xs-15">
                <template v-if="Array.isArray(value) && value.length && (value[0] instanceof Object)">
                  <span class="metadata-property"><strong>{{ key.toUpperCase() }}</strong></span>
                  <metadata-table :data="value"></metadata-table>
                </template>
                <span v-else class="metadata-property"><strong>{{ formatMetadataProperty(key) }}:</strong> {{ Array.isArray(value) ? value.join(', ') : value }}</span>
              </div>
            </template>
            <template v-if="menuState === 'SHOW_VISUALISE_LAYERS' && visualiseLayers.length">
              <a href="" @click.prevent="goBack" class="back_btn_container"><img src="@/assets/images/icons/back_icon_dark.svg" alt="">BACK</a>
              <small class="break-word-anywhere">{{ selectedFeatureToShowMetadata }}</small>
              <hr>
              <datepicker
                input-class="form-group__text"
                :disabled-dates="{from: new Date()}"
                :value="visualizeCurrentLayerDate"
                @input="visualizeCurrentLayerDate = formatDateForDatePicker($event)"
                class="mb-xs-40"
              ></datepicker>
              <eo-explorer-layer-card v-for="layer in visualiseLayers" :key="layer.name" :layer="layer" @click.native="visualiseLayerSelection(layer)" :isActive="visualizeCurrentLayerId === layer.name"></eo-explorer-layer-card>
            </template>
          </div>
          <div class="col-md-8 p-relative">
            <div class="eo-map-container">
              <div id="eo-map"></div>
              <div class="clicked-features-list" v-if="clickedResultFeatures.length" @click.stop="">
                <div class="d-flex space-between">
                  <h3>{{ clickedResultFeatures.length }} {{ clickedResultFeatures.length === 1 ? 'RESULT' : 'RESULTS' }}</h3>
                  <div class="clicked-features-list__btn-close" @click="clickedResultFeatures = []"><svg xmlns="http://www.w3.org/2000/svg" width="11.414" height="11.414" viewBox="0 0 11.414 11.414"><g data-name="Group 4926" fill="none" stroke="#190aff" stroke-width="2"><path data-name="Path 815" d="m.707.707 10 10"/><path data-name="Path 2030" d="m.707 10.707 10-10"/></g></svg></div>
                </div>
                <eo-explorer-card
                  v-for="feature in clickedResultFeatures"
                  :key="feature.id"
                  :feature="feature"
                  :collectionId="collectionId"
                  @viewAllMetadata="onViewAllMetadata"
                  @visualise="onVisualise"
                ></eo-explorer-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <select-sentinel-hub-plan v-if="isSelectSentinelHubPlanModalOn" @close="isSelectSentinelHubPlanModalOn = false" :assetId="assetId"></select-sentinel-hub-plan>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet-shades';
import isPointInPolygon from '@turf/boolean-point-in-polygon';
// eslint-disable-next-line
import { MultiPolygon, Point, Polygon } from 'geojson';
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import moment from 'moment';
import EOExplorerCard from '@/components/EO-Explorer/Card.vue';
import EOExplorerLayerCard from '@/components/EO-Explorer/LayerCard.vue';
import AdvancedFiltersExtension from '@/components/EO-Explorer/AdvancedFiltersExtension.vue';
import MetadataTable from '@/components/EO-Explorer/MetadataTable.vue';
import SelectSentinelHubPlan from '@/components/CatalogueSingle/SelectSentinelHubPlan.vue';
import SentinelHubApi from '@/service/sentinel-hub';
import { getFeatureThumbnail, fallbackThumbnail } from '@/helper/eo-explorer';
import {
  ClientCatalogueQuery,
  SentinelHubCatalogueResponse,
  Feature,
  WMSLayer,
} from '@/model/sentinel-hub';
import store from '@/store';

enum EnumMenuState {
  SEARCH = 'SEARCH',
  SHOW_FEATURES = 'SHOW_FEATURES',
  SHOW_FEATURE_METADATA = 'SHOW_FEATURE_METADATA',
  SHOW_VISUALISE_LAYERS = 'SHOW_VISUALISE_LAYERS',
}

interface ExtendedMapOptions extends L.MapOptions {
  editable: boolean,
}

interface RectangleEditable extends L.Rectangle {
  enableEdit: any,
  disableEdit: any,
}

@Component({
  components: {
    Datepicker,
    Multiselect,
    'eo-explorer-card': EOExplorerCard,
    'eo-explorer-layer-card': EOExplorerLayerCard,
    AdvancedFiltersExtension,
    MetadataTable,
    SelectSentinelHubPlan,
  },
})
export default class EOExplorer extends Vue {
  sentinelHubApi = new SentinelHubApi();

  assetId = '';

  assetTitle = '';

  collectionId = '';

  baseURL = '';

  instanceId = '';

  fromPrice: number | null = null;

  menuState: EnumMenuState = EnumMenuState.SEARCH;

  isAdvancedFiltersShown = false;

  selectedFeatureToShowMetadata = '';

  isSelectSentinelHubPlanModalOn = false;

  map: L.Map = {} as L.Map;

  bboxSelectionRect: L.Rectangle | null = null;

  featureGroup: L.FeatureGroup = {} as L.FeatureGroup;

  refFeatures: {[key: string]: L.GeoJSON} = {};

  date = {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  };

  bbox = {
    minLat: 49,
    minLon: -13,
    maxLat: 59,
    maxLon: 5,
  };

  searchResults: SentinelHubCatalogueResponse | null = null;

  clickedResultFeatures: Feature[] = [];

  visualiseLayers: WMSLayer[] = [];

  visualizeCurrentLayer: L.TileLayer | null = null;

  visualizeCurrentLayerId = '';

  visualizeCurrentLayerDate = new Date().toISOString();

  mapShades: any | null = null;

  fieldsToInclude: string[] = [];

  fieldsToExclude: string[] = [];

  productIDs: string[] = [];

  queryExtension: any = {};

  lastQueryData: ClientCatalogueQuery | null = null;

  fallbackThumbnail = fallbackThumbnail;

  getFeatureThumbnail = getFeatureThumbnail;

  async created(): Promise<void> {
    const { assetId, assetTitle, collectionId } = this.$route.query;

    this.assetId = assetId as string;
    this.assetTitle = assetTitle as string;
    this.collectionId = collectionId as string;

    const { result: collections } = await this.sentinelHubApi.getOpenDataCollections();
    const collection = collections.find((x) => x.id === this.collectionId);

    this.instanceId = collection ? collection.instanceId : '';
    this.baseURL = collection ? collection.endpoint : '';

    this.sentinelHubApi.getSubscriptionPlans().then((response) => {
      if (!response.success) return;
      const subscriptionPlans = response.result;

      this.fromPrice = subscriptionPlans.reduce((p, c) => (c.billing.monthly < p ? c.billing.monthly : p), Infinity);
    });
  }

  mounted(): void {
    this.map = L.map('eo-map', { editable: true } as ExtendedMapOptions);

    this.featureGroup = L.featureGroup().addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.attributionControl.setPrefix('');

    this.map.on('click', (e) => {
      const { lat, lng } = (e as L.LeafletMouseEvent).latlng;
      this.showClickedLayersInfo(lat, lng);
    });

    this.drawRectangle();
  }

  @Watch('searchResults', { deep: true, immediate: false })
  onSerachResultsChange(): void {
    if (this.searchResults === null) this.resetFilters();
  }

  @Watch('isAdvancedFiltersShown')
  onAdvancedFitersShownChange(): void {
    this.fieldsToInclude = [];
    this.fieldsToExclude = [];
    this.productIDs = [];
  }

  @Watch('visualiseLayers', { deep: true })
  onVisualiseLayersChange(layers: WMSLayer[], layersPrev: WMSLayer[]): void {
    if (layersPrev.length && !layers.length && this.visualizeCurrentLayer) {
      this.visualizeCurrentLayer.removeFrom(this.map);
      this.visualizeCurrentLayerId = '';
    }
  }

  get bboxString(): string {
    return `${this.bbox.minLon},${this.bbox.minLat},${this.bbox.maxLon},${this.bbox.maxLat}`;
  }

  // eslint-disable-next-line
  onAdvancedFiltersQueryChange(q: any): void {
    this.queryExtension = q;
  }

  @Watch('bboxString')
  onBBoxStringChange(): void {
    this.drawRectangle();
  }

  @Watch('visualizeCurrentLayerDate')
  onVisualizeCurrentLayerDateChange(): void {
    if (!this.visualizeCurrentLayerId) return;

    const selectedLayer = this.visualiseLayers.find((x) => x.name === this.visualizeCurrentLayerId);
    if (!selectedLayer) return;

    this.visualiseLayerSelection(selectedLayer);
  }

  drawRectangle(): void {
    console.log('draw');
    if (this.bboxSelectionRect) {
      this.bboxSelectionRect.removeFrom(this.map);
      this.bboxSelectionRect = null;
    }

    const bounds = [[this.bbox.minLat, this.bbox.minLon], [this.bbox.maxLat, this.bbox.maxLon]];

    this.bboxSelectionRect = L.rectangle(bounds as L.LatLngBoundsExpression, { color: '#190AFF', fillColor: 'transparent' }).addTo(this.map);

    this.map.fitBounds(this.bboxSelectionRect.getBounds(), { padding: [1, 1] });

    (this.bboxSelectionRect as RectangleEditable).enableEdit();

    if (this.mapShades) {
      this.mapShades.onRemove(this.map);
      this.mapShades = null;
    }
    this.mapShades = new (L as any).LeafletShades({ bounds: this.bboxSelectionRect.getBounds() });
    this.mapShades.addTo(this.map);
    // this.map.invalidateSize();

    if (!this.bboxSelectionRect) return;

    this.bboxSelectionRect.on('editable:vertex:dragstart', () => {
      this.onBboxRectStartEditing();
    });

    this.bboxSelectionRect.on('editable:vertex:dragend', () => {
      this.onBboxRectStopEditing();
    });

    // todo: catch move event
    this.bboxSelectionRect.on('editable:dragstart', () => {
      this.onBboxRectStartEditing();
    });

    this.bboxSelectionRect.on('editable:dragend', () => {
      this.onBboxRectStopEditing();
    });
  }

  showClickedLayersInfo(lat: number, lon: number): void {
    if (!this.searchResults) return;

    const pointGeoJSON = {
      type: 'Point',
      coordinates: [lon, lat],
    } as Point;
    this.clickedResultFeatures = this.searchResults.features.filter((x) => isPointInPolygon(pointGeoJSON, x.geometry as Polygon | MultiPolygon));
  }

  onBboxRectStartEditing(): void {
    console.log('dragstart');
    this.mapShades.onRemove(this.map);
    this.mapShades = null;
  }

  onBboxRectStopEditing(): void {
    console.log('dragend');
    if (!this.bboxSelectionRect) return;
    const boundsArr = this.bboxSelectionRect.getBounds().toBBoxString().split(',');
    this.bbox = {
      minLat: parseFloat(boundsArr[1]),
      minLon: parseFloat(boundsArr[0]),
      maxLat: parseFloat(boundsArr[3]),
      maxLon: parseFloat(boundsArr[2]),
    };
  }

  formatDateForDatePicker(v: string): string {
    return (new Date(v)).toISOString();
  }

  formatDateForLabel(dateString: string): string {
    return moment(dateString).format('MMM Do YY');
  }

  getSelectedFilters(): { id: string, label: string }[] {
    if (!this.lastQueryData) return [];

    let selectedFilters: { id: string, label: string }[] = [];

    if (this.lastQueryData.fromDateTime || this.lastQueryData.toDateTime) {
      const id = 'temporal_extent';
      // eslint-disable-next-line
      const label = this.lastQueryData.fromDateTime && this.lastQueryData.toDateTime
        ? `${this.formatDateForLabel(this.lastQueryData.fromDateTime)} - ${this.formatDateForLabel(this.lastQueryData.toDateTime)}`
        : this.lastQueryData.fromDateTime
          ? `From ${this.formatDateForLabel(this.lastQueryData.fromDateTime)}`
          // eslint-disable-next-line
          : `To ${this.formatDateForLabel(this.lastQueryData.toDateTime!)}`;

      selectedFilters.push({ id, label });
    }

    selectedFilters = this.lastQueryData.fields?.include ? selectedFilters.concat(this.lastQueryData.fields.include.map((x) => ({
      id: `include_${x}`,
      label: `include: ${x}`,
    }))) : selectedFilters;

    selectedFilters = this.lastQueryData.fields?.exclude ? selectedFilters.concat(this.lastQueryData.fields.exclude.map((x) => ({
      id: `exclude_${x}`,
      label: `exclude: ${x}`,
    }))) : selectedFilters;

    selectedFilters = this.lastQueryData.ids ? selectedFilters.concat(this.lastQueryData.ids.map((x) => ({
      id: `id_${x}`,
      label: `id: ${x}`,
    }))) : selectedFilters;

    /* QUERY EXTENSION */

    if (this.lastQueryData.query && this.lastQueryData.query['sar:instrument_mode']) {
      selectedFilters.push({
        id: 'sar:instrument_mode',
        label: `acquisition mode: ${this.lastQueryData.query['sar:instrument_mode'].eq}`,
      });
    }

    if (this.lastQueryData.query && this.lastQueryData.query.polarization) {
      selectedFilters.push({
        id: 'polarization',
        label: `polarization: ${this.lastQueryData.query.polarization.eq}`,
      });
    }

    if (this.lastQueryData.query && this.lastQueryData.query['sat:orbit_state']) {
      selectedFilters.push({
        id: 'sat:orbit_state',
        label: `orbit direction: ${this.lastQueryData.query['sat:orbit_state'].eq}`,
      });
    }

    if (this.lastQueryData.query && this.lastQueryData.query.resolution) {
      selectedFilters.push({
        id: 'resolution',
        label: `resolution: ${this.lastQueryData.query.resolution.eq}`,
      });
    }

    if (this.lastQueryData.query && this.lastQueryData.query['eo:cloud_cover']) {
      selectedFilters.push({
        id: 'eo:cloud_cover',
        label: `Max cloud coverage: ${this.lastQueryData.query['eo:cloud_cover'].lte}`,
      });
    }

    if (this.lastQueryData.query && this.lastQueryData.query.type) {
      selectedFilters.push({
        id: 'type',
        label: `Type: ${this.lastQueryData.query.type.eq}`,
      });
    }

    /* END OF QUERY EXTENSION */

    return selectedFilters;
  }

  removeFilter(filterId: string): void {
    const queryData = {
      ...this.lastQueryData,
    } as ClientCatalogueQuery;

    if (filterId === 'temporal_extent') {
      queryData.fromDateTime = undefined;
      queryData.toDateTime = undefined;
    } else if (filterId.startsWith('include_')) {
      const includeString = filterId.split('include_')[1];
      if (!queryData.fields || !queryData.fields.include) return;
      queryData.fields.include = queryData.fields.include.filter((x) => x !== includeString);
    } else if (filterId.startsWith('exclude_')) {
      const excludeString = filterId.split('exclude_')[1];
      if (!queryData.fields || !queryData.fields.exclude) return;
      queryData.fields.exclude = queryData.fields.exclude.filter((x) => x !== excludeString);
      console.log('e', excludeString, queryData);
    } else if (filterId.startsWith('id_')) {
      const idString = filterId.split('id_')[1];
      if (!queryData.ids) return;
      queryData.ids = queryData.ids.filter((x) => x !== idString);
    } else if (filterId === 'sar:instrument_mode') {
      delete queryData.query['sar:instrument_mode'];
    } else if (filterId === 'polarization') {
      delete queryData.query.polarization;
    } else if (filterId === 'sat:orbit_state') {
      delete queryData.query['sat:orbit_state'];
    } else if (filterId === 'resolution') {
      delete queryData.query.resolution;
    } else if (filterId === 'eo:cloud_cover') {
      delete queryData.query['eo:cloud_cover'];
    } else if (filterId === 'type') {
      delete queryData.query.type;
    }

    if (queryData.fields && queryData.fields.include && queryData.fields.include.length === 0) delete queryData.fields.include;
    if (queryData.fields && queryData.fields.exclude && queryData.fields.exclude.length === 0) delete queryData.fields.exclude;
    if (queryData.fields && Object.entries(queryData.fields).length === 0) delete queryData.fields;
    if (queryData.ids && queryData.ids.length === 0) delete queryData.ids;
    if (queryData.query && Object.entries(queryData.query).length === 0) delete queryData.query;

    this.searchCollection(queryData);
  }

  resetFilters(): void {
    this.fieldsToInclude = [];
    this.fieldsToExclude = [];
    this.productIDs = [];
    this.isAdvancedFiltersShown = false;
  }

  searchCollection(data: ClientCatalogueQuery | null = null): void {
    store.commit('setLoading', true);

    this.menuState = EnumMenuState.SHOW_FEATURES;

    this.resetResults(false);

    const fromDateTime = this.date.from.split('T')[0].concat('T00:00:00.000Z');
    const toDateTime = this.date.to.split('T')[0].concat('T23:59:59.999Z');

    const queryData = data || {
      collection: this.collectionId,
      fromDateTime,
      toDateTime,
      bbox: [this.bbox.minLon, this.bbox.minLat, this.bbox.maxLon, this.bbox.maxLat],
      ...((this.fieldsToInclude.length || this.fieldsToExclude.length) && {
        fields: {
          ...(this.fieldsToInclude.length && { include: this.fieldsToInclude }),
          ...(this.fieldsToExclude.length && { exclude: this.fieldsToExclude }),
        },
      }),
      ...(this.productIDs.length && { ids: this.productIDs }),
      ...(Object.keys(this.queryExtension).length && { query: this.queryExtension }),
    } as ClientCatalogueQuery;

    console.log('q', queryData);

    this.sentinelHubApi.search(queryData).then((response) => {
      if (response.success) {
        this.lastQueryData = queryData;
        console.log('o', response.result);
        this.searchResults = response.result;

        this.searchResults.features.forEach((x) => {
          this.refFeatures[x.id] = L.geoJSON(x.geometry).addTo(this.featureGroup);
        });

        (this.bboxSelectionRect as RectangleEditable).disableEdit();
      } else {
        console.log('error', response);
      }
      store.commit('setLoading', false);
    });
  }

  zoomToFeature(id: string): void {
    const featureGeoJSON = this.refFeatures[id];
    if (!featureGeoJSON) return;
    this.map.fitBounds(featureGeoJSON.getBounds());
  }

  onViewAllMetadata(id: string): void {
    this.zoomToFeature(id);
    this.selectedFeatureToShowMetadata = id;
    this.menuState = EnumMenuState.SHOW_FEATURE_METADATA;
  }

  applyFilterRulesToVisualiseLayers(layers: WMSLayer[]): WMSLayer[] {
    const extension = this.queryExtension;

    switch (this.collectionId) {
      case 'sentinel-1-grd': {
        const type: string | null = extension.polarization && extension.polarization.eq ? extension.polarization.eq : null;

        switch (type) {
          case null: {
            return layers;
          }
          /* to be checked!! todo */
          case 'SH':
          case 'DH':
            return layers.filter((x) => !x.name.includes('VV'));
          case 'SV':
          case 'DV':
            return layers.filter((x) => !x.name.includes('HH'));
          /* */
          default: {
            return layers;
          }
        }
      }
      case 'sentinel-5p-l2': {
        const type: string | null = extension.type && extension.type.eq ? extension.type.eq : null;

        switch (type) {
          case null: {
            return layers;
          }
          case 'AER_AI_340_380': {
            return layers.filter((x) => ['AER-AI-340-AND-380', 'AER_AI_340_380'].includes(x.name));
          }
          case 'AER_AI_354_388': {
            return layers.filter((x) => ['AER-AI-354-AND-388', 'AER_AI_354_388'].includes(x.name));
          }
          default: {
            return layers.filter((x) => x.name === type);
          }
        }
      }
      default:
    }
    return layers;
  }

  onVisualise(id: string): void {
    store.commit('setLoading', true);

    this.zoomToFeature(id);
    this.selectedFeatureToShowMetadata = id;

    this.menuState = EnumMenuState.SHOW_VISUALISE_LAYERS;

    this.sentinelHubApi.getAvailableWMSLayersByInstanceID(this.instanceId, this.baseURL).then((response) => {
      this.visualiseLayers = this.applyFilterRulesToVisualiseLayers(response);
      store.commit('setLoading', false);
    });
  }

  visualiseLayerSelection(layer: WMSLayer): void {
    this.visualizeCurrentLayerId = layer.name;

    if (this.visualizeCurrentLayer) this.visualizeCurrentLayer.removeFrom(this.map);

    const time = this.visualizeCurrentLayerDate.split('T')[0];

    this.visualizeCurrentLayer = L.tileLayer.wms(layer.endpoint, {
      tileSize: 512,
      layers: layer.name,
      time: `${time}/${time}`,
    } as L.WMSOptions & { time: string });
    this.visualizeCurrentLayer.addTo(this.map);
  }

  resetResults(totalReset = true): void {
    this.searchResults = totalReset ? null : {} as SentinelHubCatalogueResponse;
    this.featureGroup.clearLayers();
    this.refFeatures = {};
    (this.bboxSelectionRect as RectangleEditable).enableEdit();
  }

  formatMetadataProperty(property: string): string {
    if (property === 'datetime') return 'DATE & TIME';

    return property.split('_').join(' ').toUpperCase();
  }

  goBack(): void {
    switch (this.menuState) {
      case EnumMenuState.SHOW_FEATURES: {
        this.resetResults();
        this.menuState = EnumMenuState.SEARCH;
        break;
      }
      case EnumMenuState.SHOW_FEATURE_METADATA: {
        this.selectedFeatureToShowMetadata = '';
        this.menuState = EnumMenuState.SHOW_FEATURES;
        break;
      }
      case EnumMenuState.SHOW_VISUALISE_LAYERS: {
        this.selectedFeatureToShowMetadata = '';
        this.visualiseLayers = [];
        this.menuState = EnumMenuState.SHOW_FEATURES;
        break;
      }
      default:
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_eo-explorer.scss";
  @import "@/assets/styles/_catalogue-filters.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
  @import "~leaflet-shades/src/css/leaflet-shades.css";
</style>
