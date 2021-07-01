<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Data Profiling and Samples</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs" v-if="isUserAuthenticated">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Attributes</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Maps</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Sample 1</a></li>
        <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Sample 2</a></li>
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
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1">
            <p>Attributes content (DUMMY)</p>
          </li>
          <li v-if="activeTab == 2">
            <div v-if="!isUserAuthenticated">
              <h2 style="background: yellow">[dev msg] user is not authenticated, maps are not shown</h2>
            </div>
            <div v-else>
              <p>Contains map images with the geometry of the dataset</p>
              <hr>
              <p style="background: yellow">[dev msg] MAPS NOT SHOWN CORRECTLY, AS THEY ARE NOT FETCHED IN EPSG:4326.</p>
              <!-- MBR -->
              <span class="map-type">MBR</span>
              <p>Rectilinear box (Minimum Bounding Rectangle) denoting the spatial extent of all features</p>
              <div class="tab_maps-map">
                <l-map
                  ref="mapConfigMbr"
                  :bounds="mbrToLeafletBounds(metadata.mbr)"
                  :maxBounds="mbrToLeafletBounds(metadata.mbr)"
                  :options="mapConfig.options"
                >
                  <l-tile-layer
                  :url="mapConfig.tilesUrl"
                  :attribution="mapConfig.attribution"/>
                  <l-geo-json
                    :geojson="wktToGeoJson(metadata.mbr)"
                    :optionsStyle="{color: 'orange'}"
                  >
                  </l-geo-json>
                </l-map>
              </div>
              <!-- CONVEX HULL -->
              <span class="map-type">Convex Hull</span>
              <p>Convex polygon enclosing all features</p>
              <div class="tab_maps-map">
                <l-map
                  ref="mapConfigConvexHull"
                  :bounds="mbrToLeafletBounds(metadata.mbr)"
                  :maxBounds="mbrToLeafletBounds(metadata.mbr)"
                  :options="mapConfig.options"
                >
                  <l-tile-layer
                  :url="mapConfig.tilesUrl"
                  :attribution="mapConfig.attribution"/>
                  <l-geo-json
                    :geojson="wktToGeoJson(metadata.convexHull)"
                    :optionsStyle="{color: 'orange'}"
                  >
                  </l-geo-json>
                </l-map>
              </div>
              <!-- THUMBNAIL -->
              <span class="map-type">Thumbnail</span>
              <p>Thumbnail image depicting the spatial coverage of the dataset</p>
              <div class="tab_maps-map tab_maps-map-thumbnail">
                <img v-if="metadata" :src="metadata.thumbnail" alt="thumbnail">
              </div>
              <!-- HEATMAP -->

              <!-- ATTENTION -->
              <!-- PROP :bounds CURRENTLY CAUSES PROBLEM RENDERING HEATMAP, DUE TO INCORRECT COORDINATES (NON 4326) -->
              <span class="map-type">Heatmap</span>
              <p>Colormap with varying intensity according to the density of features</p>
              <div class="tab_maps-map">
                <l-map
                  ref="mapConfigHeatmap"
                  :bounds="mbrToLeafletBounds(metadata.mbr)"
                  :maxBounds="mbrToLeafletBounds(metadata.mbr)"
                  :options="mapConfig.options"
                >
                  <l-tile-layer
                    :url="mapConfig.tilesUrl"
                    :attribution="mapConfig.attribution"/>
                  <l-geo-json
                    :geojson="metadata.heatmapGeoJson"
                    :optionsStyle="mapConfig.styleHeatmap"
                    :smoothFactor="0.2"
                    :opacity="0.1"
                    :options="{smoothFactor: 0.2}"
                  >
                  </l-geo-json>
                </l-map>
              </div>
              <!-- CLUSTERS -->
              <span class="map-type">Clusters</span>
              <p>Density-based spatial clusters of features</p>
              <div class="tab_maps-map">
                <l-map
                  ref="mapClusters"
                  :bounds="mbrToLeafletBounds(metadata.mbr)"
                  :maxBounds="mbrToLeafletBounds(metadata.mbr)"
                  :options="mapConfig.options"
                >
                  <l-tile-layer
                  :url="mapConfig.tilesUrl"
                  :attribution="mapConfig.attribution"/>
                  <l-geo-json
                    :geojson="metadata.clusters"
                    :optionsStyle="{color: 'orange'}"
                  >
                  </l-geo-json>
                </l-map>
              </div>
            </div>
          </li>
          <li v-if="activeTab == 3">
            <p>Sample 1 content (DUMMY)</p>
          </li>
          <li v-if="activeTab == 4">
            <p>Sample 2 content (DUMMY)</p>
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
import L from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { parse as wktToGeojsonParser } from 'wellknown';

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LGeoJson,
  },
})
export default class DataProfilingAndSamples extends Vue {
  @Prop({ required: true }) private metadata: any;

  activeTab: number;

  isUserAuthenticated: boolean;

  mapConfig: any;

  constructor() {
    super();

    console.log('met', this.metadata);

    this.activeTab = 1;

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

  @Watch('activeTab')
  onActiveTabChange(activeTab: number): void {
    // if tab is maps-tab
    if (activeTab === 2 && this.isUserAuthenticated) {
      this.setMinMaxZoomLevels();
    }
  }

  setMinMaxZoomLevels(): void {
    this.$nextTick(() => {
      const fitBoundsZoomLevel = (this as any).$refs.mapConfigMbr.mapObject.getBoundsZoom(L.geoJSON(this.wktToGeoJson(this.metadata.mbr)).getBounds());

      const zoomOffset = 2;

      const minZoom = fitBoundsZoomLevel - zoomOffset < 0 ? 0 : fitBoundsZoomLevel - zoomOffset;
      const maxZoom = fitBoundsZoomLevel + zoomOffset;

      Vue.set(this.mapConfig.options, 'minZoom', minZoom);
      Vue.set(this.mapConfig.options, 'maxZoom', maxZoom);
    });
  }

  wktToGeoJson(wkt: string): any {
    return wktToGeojsonParser(wkt);
  }

  mbrToLeafletBounds(wkt: string): number[][] {
    const geoJson = wktToGeojsonParser(wkt);
    const bounds = geoJson.coordinates[0]
      .map((x) => [x[1], x[0]]);
    return bounds;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
