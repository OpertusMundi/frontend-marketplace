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
            <template v-if="!searchResults">
              <h4 class="mt-xs-20">Data source: <span class="collection_name">{{ collectionId }}</span></h4>

              <h4 class="mt-xs-20 mb-xs-10">Date Selection</h4>
              <div class="d-flex space-between">
                <div>
                  <label>From date</label>
                  <datepicker input-class="form-group__text" :value="date.from" @input="date.from = formatDate($event)"></datepicker>
                </div>
                <div>
                  <label>To date</label>
                  <datepicker input-class="form-group__text" :value="date.to" @input="date.to = formatDate($event)"></datepicker>
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

              <div class="d-flex justify-content-center mt-xs-50">
                <button class="btn btn--std btn--outlineblue mr-xs-20">CANCEL</button>
                <button class="btn btn--std btn--blue" @click="searchCollection">SEARCH</button>
              </div>
            </template>
            <template v-else>
              <a href="" @click.prevent="resetResults" class="back_btn_container"><img src="@/assets/images/icons/back_icon_dark.svg" alt="">BACK</a>
              <hr>
              <eo-explorer-card v-for="feature in searchResults.features" :key="feature.id" :feature="feature"></eo-explorer-card>
            </template>
          </div>
          <div class="col-md-8">
            <div id="eo-map"></div>
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
import Datepicker from 'vuejs-datepicker';
import EOExplorerCard from '@/components/EO-Explorer/Card.vue';
import SelectSentinelHubPlan from '@/components/CatalogueSingle/SelectSentinelHubPlan.vue';
import SentinelHubApi from '@/service/sentinel-hub';
import { ClientCatalogueQuery, SentinelHubCatalogueResponse } from '@/model/sentinel-hub';
import store from '@/store';

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
    'eo-explorer-card': EOExplorerCard,
    SelectSentinelHubPlan,
  },
})
export default class EOExplorer extends Vue {
  sentinelHubApi = new SentinelHubApi();

  assetId = '';

  assetTitle = '';

  collectionId = '';

  fromPrice: number | null = null;

  isSelectSentinelHubPlanModalOn = false;

  map: L.Map = {} as L.Map;

  bboxSelectionRect: L.Rectangle | null = null;

  featureGroup: L.FeatureGroup = {} as L.FeatureGroup;

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

  mapShades: any | null = null;

  created(): void {
    const { assetId, assetTitle, collectionId } = this.$route.query;

    this.assetId = assetId as string;
    this.assetTitle = assetTitle as string;
    this.collectionId = collectionId as string;

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

    this.drawRectangle();
  }

  get bboxString(): string {
    return `${this.bbox.minLon},${this.bbox.minLat},${this.bbox.maxLon},${this.bbox.maxLat}`;
  }

  @Watch('bboxString')
  onBBoxStringChange(): void {
    console.log('changed!');
    this.drawRectangle();
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

  formatDate(v: string): string {
    return (new Date(v)).toISOString();
  }

  searchCollection(): void {
    store.commit('setLoading', true);

    const fromDateTime = this.date.from.split('T')[0].concat('T00:00:00.000Z');
    const toDateTime = this.date.to.split('T')[0].concat('T23:59:59.999Z');

    const queryData: ClientCatalogueQuery = {
      collection: this.collectionId,
      fromDateTime,
      toDateTime,
      bbox: [this.bbox.minLon, this.bbox.minLat, this.bbox.maxLon, this.bbox.maxLat],
    };

    this.sentinelHubApi.search(queryData).then((response) => {
      if (response.success) {
        console.log(response.result);
        this.searchResults = response.result;

        this.searchResults.features.forEach((x) => {
          L.geoJSON(x.geometry).addTo(this.featureGroup);
        });

        (this.bboxSelectionRect as RectangleEditable).disableEdit();
      } else {
        console.log('error', response);
      }
      store.commit('setLoading', false);
    });
  }

  resetResults(): void {
    this.searchResults = null;
    this.featureGroup.clearLayers();
    (this.bboxSelectionRect as RectangleEditable).enableEdit();
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_eo-explorer.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
  @import "~leaflet-shades/src/css/leaflet-shades.css";
</style>
