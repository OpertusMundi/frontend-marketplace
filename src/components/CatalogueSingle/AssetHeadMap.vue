<template>
  <div class="asset__map" lazy>
    <div class="asset__map__inner">
      <l-map
        ref="map"
        v-if="map.show"
        :bounds="bounds"
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
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';
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
  @Prop({ required: true }) readonly catalogueItem!: CatalogueItem;

  @Watch('catalogueItem', { deep: true, immediate: true })
  onCatalogueItemChange(catalogueItem: CatalogueItem): void {
    if (!catalogueItem.geometry || catalogueItem.geometry.type !== 'Polygon') return;

    console.log('CCCCCCc', catalogueItem);
    const lats = catalogueItem.geometry.coordinates[0].map(([lon, lat]) => lat);
    const lons = catalogueItem.geometry.coordinates[0].map(([lon, lat]) => lon);

    console.log('ccccc', lats, lons);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    this.bounds = [[minLat, minLon], [maxLat, maxLon]];
    console.log('BBBBBb', this.bounds);
  }

  map: any;

  bounds: [[number, number], [number, number]] | null = null;

  resizeObserver: any;

  constructor() {
    super();

    this.map = {
      show: false,
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
    this.resizeObserver = new (window as any).ResizeObserver((entries) => {
      entries.forEach(() => {
        (this as any).$refs.map.mapObject.invalidateSize();
      });
    });
    // eslint-disable-next-line
    this.resizeObserver.observe(document.querySelector('.asset__map__inner')!);

    Vue.set(this.map, 'show', true);
  }

  beforeDestroy():void {
    // eslint-disable-next-line
    this.resizeObserver.unobserve(document.querySelector('.asset__map__inner')!);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
