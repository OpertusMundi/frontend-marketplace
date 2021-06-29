<template>
  <div class="asset__map" lazy>
    <div class="asset__map__inner">
      <l-map
        ref="map"
        v-if="map.show"
        :zoom="map.zoom"
        :center="map.center"
        :options="map.options"
      >
        <l-tile-layer
          :url="map.tilesUrl"
          :attribution="map.attribution"/>
        <!-- <l-polygon v-if="map.coordinates_type === 'Polygon'"
          :latLngs="catalogueItem.geometry.coordinates[0]"
          color="#FF0045"
        /> -->
      </l-map>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
// import L, { latLng } from 'leaflet';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LPolygon } from 'vue2-leaflet';
import { CatalogueItem } from '@/model';

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolygon,
  },
})
export default class AssetHeadMap extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  map: any;

  mapRef: any;

  constructor() {
    super();

    this.map = {
      show: false,
      zoom: 7,
      center: latLng(37.9782553, 23.7263485),
      options: {
        zoomSnap: 0.5,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      },
      coordinates_type: '',
      tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  }

  mounted(): void {
    console.log('map mo');

    setTimeout(() => {
      Vue.set(this.map, 'show', true);
    }, 400);
  }
}
</script>
<style lang="scss">
  // @import "~leaflet/dist/leaflet.css";
  @import "@/assets/styles/_assets.scss";
</style>
