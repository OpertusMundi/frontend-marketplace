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

          <!-- ATTRIBUTES -->
          <li v-if="activeTab == 1">
            <div v-for="(attribute, i) in metadata.attributes" :key="attribute">
              <h4 class="mb-xs-20">[<small>{{ metadata.datatypes[attribute] }}</small>] {{ attribute }}</h4>

              <div class="row">
                <div :class="showDistributionPieChart(attribute) ? 'col-sm-6' : 'col-sm-12'">

                  <div class="asset__section__tabs__attribute-info">
                    <strong>Values in total</strong> <span>{{ metadata.count[attribute] }}</span>

                    <div v-if="attribute in metadata.distribution" class="grid-ignore-wrapper">
                      <strong>Most frequent values</strong>
                      <div>
                        <div v-for="attributeValuePair in getMostFrequentValues(metadata.distribution[attribute])" :key="attributeValuePair.attribute">
                          <span>{{ attributeValuePair.attribute }} [<small>{{ attributeValuePair.amount }}</small>]</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="attribute in metadata.distinct" class="grid-ignore-wrapper">
                      <strong>Distinct values</strong>
                      <div>
                        <span v-for="(distinctValue, i) in metadata.distinct[attribute]" :key="distinctValue">{{ distinctValue }}<span v-if="i !== metadata.distinct[attribute].length - 1">, </span></span>
                      </div>
                    </div>

                    <div v-if="attribute in metadata.statistics.min" class="grid-ignore-wrapper">
                      <strong>Statistics</strong>
                      <div class="asset__section__tabs__attribute-info__statistics">
                        <span>Min</span> <span>{{ metadata.statistics.min[attribute] }}</span>
                        <span>Max</span> <span>{{ metadata.statistics.max[attribute] }}</span>
                        <span>Mean</span> <span>{{ metadata.statistics.mean[attribute] }}</span>
                        <span>Median</span> <span>{{ metadata.statistics.median[attribute] }}</span>
                        <span>Std</span> <span>{{ metadata.statistics.std[attribute] }}</span>
                        <span>Sum</span> <span>{{ metadata.statistics.sum[attribute] }}</span>
                      </div>
                    </div>

                    <div v-if="attribute in metadata.quantiles['5']" class="grid-ignore-wrapper">
                      <strong>Quantiles</strong>
                      <div class="asset__section__tabs__attribute-info__quantiles">
                        <span>5</span> <span>{{ metadata.quantiles['5'][attribute] }}</span>
                        <span>25</span> <span>{{ metadata.quantiles['25'][attribute] }}</span>
                        <span>50</span> <span>{{ metadata.quantiles['50'][attribute] }}</span>
                        <span>75</span> <span>{{ metadata.quantiles['75'][attribute] }}</span>
                        <span>95</span> <span>{{ metadata.quantiles['95'][attribute] }}</span>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="col-sm-6 asset__section__tabs__pie-chart-container" v-if="showDistributionPieChart(attribute)">
                  <p><strong>Distribution</strong></p>
                  <chart :options="getChartOptions(metadata.count[attribute], metadata.distribution[attribute])"></chart>
                </div>
              </div>

              <hr v-if="i !== metadata.attributes.length - 1">
            </div>
          </li>

          <!-- MAPS -->
          <li v-if="activeTab == 2">
            <div>
              <p>Contains map images with the geometry of the dataset</p>
              <hr>
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
import { Chart } from 'highcharts-vue';
import L from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { parse as wktToGeojsonParser } from 'wellknown';

@Component({
  components: {
    Chart,
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

  showDistributionPieChart(attribute: string): boolean {
    if (attribute in this.metadata.distribution && this.getMostFrequentValues(this.metadata.distribution[attribute]).length > 1) {
      return true;
    }
    return false;
  }

  getChartOptions(total: number, distribution: Record<string, number>): any {
    const chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
      },
      colorByPoint: true,
      credits: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false,
        },
      },
      // colors: this.pieColor,
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },

      accessibility: {
        announceNewData: {
          enabled: true,
        },
        point: {
          valueSuffix: '%',
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            // format: '{point.name}: {point.y:.1f}%',
            format: '{point.name}',
          },
        },
      },

      tooltip: {
        // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },

      series: [
        {
          // name: 'Browsers',
          colorByPoint: true,
          dataLabels: {
            connectorShape: 'straight',
            style: {
              fontSize: 8,
            },
          },
          // data: [
          //   {
          //     name: 'BIOTA',
          //     y: 45.74,
          //   },
          //   {
          //     name: 'ECONOMY',
          //     y: 10.57,
          //   },
          //   {
          //     name: 'ELEVATION',
          //     y: 7.23,
          //   },
          //   {
          //     name: 'PLANNING_CADASTRE',
          //     y: 5.58,
          //   },
          //   {
          //     name: 'STRUCTURE',
          //     y: 22.02,
          //   },
          //   {
          //     name: 'TRANSPORTATION',
          //     y: 3.92,
          //     drilldown: 'Opera',
          //   },
          //   {
          //     name: 'BOUNDARIES',
          //     y: 7.62,
          //     drilldown: null,
          //   },
          //   {
          //     name: 'CLIMA',
          //     y: 2.62,
          //     drilldown: null,
          //   },
          // ],
          data: this.formatDistributionForChart(total, distribution),
        },
      ],
    };

    return chartOptions;
  }

  formatDistributionForChart(total: number, distribution: Record<string, number>): any {
    const vals = Object.keys(distribution).map((x) => ({ name: x, y: (distribution[x] / total) * 100 }));
    const remainingPercentageTo100 = 100 - vals.reduce((sum, obj) => obj.y + sum, 0);
    if (Math.round(remainingPercentageTo100 * 100) / 100) vals.push({ name: 'other', y: remainingPercentageTo100 }); // add 'other' in pie chart if remaining percentage is at least 0.01 (2 decimals)
    return vals;
  }

  getMostFrequentValues(distribution: Record<string, number>): {attribute: string, amount: number}[] {
    return Object.keys(distribution)
      .map((x) => ({ attribute: x, amount: distribution[x] }))
      .sort((a, b) => b.amount - a.amount);
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
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
