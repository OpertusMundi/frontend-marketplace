<template>
  <div class="wrapper">
    <div class="eo_explorer_page">
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-md-4">
            <template v-if="!searchResults">
              <h4>Data source: Something</h4>

              <h4 class="mt-xs-20">Date Selection</h4>
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

              <h4 class="mt-xs-20">Spatial extent</h4>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet-shades';
import Datepicker from 'vuejs-datepicker';
import EOExplorerCard from '@/components/EO-Explorer/Card.vue';
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
  },
})
export default class EOExplorer extends Vue {
  sentinelHubApi = new SentinelHubApi();

  map: L.Map = {} as L.Map;

  bboxSelectionRect: L.Rectangle | null = null;

  featureGroup: L.FeatureGroup = {} as L.FeatureGroup;

  date = {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  };

  bbox = {
    minLat: 54,
    minLon: -5,
    maxLat: 56,
    maxLon: -3,
  };

  searchResults: SentinelHubCatalogueResponse | null = null;

  mapShades: any | null = null;

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
      collection: 'sentinel-1-grd',
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
