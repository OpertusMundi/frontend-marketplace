<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Data Profiling and Samples</h4>

      <div class="asset__section__head__sample_download" v-if="isUserAuthenticated && metadata.samples && metadata.samples.length">
        <span><strong>Select file:</strong></span>
        <multiselect v-model="sampleToDownload" :options="getSampleDownloadOptions()" :allowEmpty="false" :preselectFirst="true" :searchable="false" :openDirection="'bottom'" :close-on-select="true" :show-labels="false" placeholder="Select a sample to download"></multiselect>
        <div v-if="sampleToDownload" class="asset__section__head__sample_download__btn" @click="onDownloadSample"><svg data-name="Group 2342" xmlns="http://www.w3.org/2000/svg" width="15" height="16"><g data-name="Group 753"><g data-name="Group 752"><path data-name="Path 2224" d="M11.455 7.293A.5.5 0 0 0 11.002 7h-2V.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7h-2a.5.5 0 0 0-.376.829l3.5 4a.5.5 0 0 0 .752 0l3.5-4a.5.5 0 0 0 .077-.536z" fill="#333"/></g></g><g data-name="Group 755"><g data-name="Group 754"><path data-name="Path 2225" d="M13 11v3H2v-3H0v4a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4z" fill="#333"/></g></g></svg></div>
      </div>

      <div class="asset__section__head__main_information" v-if="isUserAuthenticated">
        <p><strong>FEATURE COUNT:</strong> {{ metadata.featureCount }} <small class="ml-xs-20">Number of records in the dataset</small></p>
        <p><strong>NATIVE CRS:</strong> {{ metadata.crs }} <small class="ml-xs-20">Coordinate reference system (SRID/EPSG) of the original dataset</small></p>
        <p><strong>ATTRIBUTE NAMES:</strong> <span v-for="(attribute, i) in metadata.attributes" :key="attribute">{{ attribute }}<span v-if="i !== metadata.attributes.length - 1">, </span></span></p>
      </div>

      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs" v-if="isUserAuthenticated">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Attributes</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Maps</a></li>
        <!-- <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Sample 1</a></li> -->
        <!-- <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Sample 2</a></li> -->
        <li v-for="(sample, i) in metadata.samples" :key="i"><a href="#" @click.prevent="activeTab = i + 3" :class="{ 'active' : activeTab == i + 3 }">Sample {{ i + 1 }}</a></li>
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
            <div v-if="!metadata.mbr && !metadata.convexHull && !metadata.thumbnail && !metadata.heatmap && (!metadata.clusters || !metadata.clusters.features.length)">
              <h5>No maps to show</h5>
            </div>
            <div v-else>
              <p>Contains map images with the geometry of the dataset</p>
              <hr>
              <!-- MBR -->
              <div v-if="metadata.mbr">
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
              </div>
              <!-- CONVEX HULL -->
              <div v-if="metadata.convexHull">
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
              </div>
              <!-- THUMBNAIL -->
              <div v-if="metadata.thumbnail">
                <span class="map-type">Thumbnail</span>
                <p>Thumbnail image depicting the spatial coverage of the dataset</p>
                <div class="tab_maps-map tab_maps-map-thumbnail">
                  <img v-if="metadata" :src="metadata.thumbnail" alt="thumbnail">
                </div>
              </div>
              <!-- HEATMAP -->
              <div v-if="metadata.heatmap">
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
                      :geojson="heatmapGeoJson"
                      :optionsStyle="mapConfig.styleHeatmap"
                      :smoothFactor="0.2"
                      :opacity="0.1"
                      :options="{smoothFactor: 0.2}"
                    >
                    </l-geo-json>
                  </l-map>
                </div>
              </div>
              <!-- CLUSTERS -->
              <div v-if="metadata.clusters && metadata.clusters.features.length">
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
            </div>
          </li>

          <li v-if="activeTab > 2">
            <div v-for="(sampleTab, i) in metadata.samples" :key="i">
              <div v-if="activeTab === i + 3" class="samples_table__wrapper">
                <table class="samples_table">
                  <tr class="samples_table__header">
                    <th v-for="(attribute, j) in Object.keys(metadata.samples[i])" :key="j">{{ attribute }}</th>
                  </tr>
                  <tr class="samples_table__data" v-for="(value, j) in Object.values(metadata.samples[i])[0]" :key="j">
                    <td v-for="(attribute, k) in Object.keys(metadata.samples[i])" :key="k">
                      {{ metadata.samples[i][attribute][j] ? metadata.samples[i][attribute][j] : '-' }}
                    </td>
                  </tr>
                </table>
              </div>
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
import { ExportToCsv } from 'export-to-csv';
import CatalogueApi from '@/service/catalogue';
// eslint-disable-next-line
import { GeoJsonObject } from 'geojson';

@Component({
  components: {
    Chart,
    Multiselect,
    LMap,
    LTileLayer,
    LPolygon,
    LGeoJson,
  },
})
export default class DataProfilingAndSamples extends Vue {
  @Prop({ required: true }) private metadata: any;

  catalogueApi: CatalogueApi;

  activeTab: number;

  isUserAuthenticated: boolean;

  mapConfig: any;

  heatmapGeoJson: GeoJsonObject | null;

  sampleToDownload: string;

  constructor() {
    super();

    this.catalogueApi = new CatalogueApi();

    console.log('met', this.metadata);

    this.activeTab = 1;

    this.isUserAuthenticated = store.getters.isAuthenticated;

    this.heatmapGeoJson = null;

    // this.sampleToDownload = 'sample 1';
    this.sampleToDownload = '';

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
    console.log('heatmap link', this.metadata.heatmap);
    this.catalogueApi.getAssetHeatmap(this.metadata.heatmap).then((heatmapResponse) => {
      this.heatmapGeoJson = heatmapResponse;
    });
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

  getSampleDownloadOptions(): string[] {
    return this.metadata.samples.map((x, i) => `sample_${i + 1}.csv`);
  }

  onDownloadSample(): void {
    // eslint-disable-next-line
    const index = parseInt(this.sampleToDownload.split('_')!.pop()!.split('.')[0]) - 1;

    const csvArr: Record<string, string>[] = [];
    Object.values<Array<any>>(this.metadata.samples[index])[0].forEach((v, i) => {
      const obj: Record<string, string> = {};
      Object.keys(this.metadata.samples[index]).forEach((x) => {
        obj[x] = this.metadata.samples[index][x][i];
      });
      csvArr.push(obj);
    });

    const options = {
      filename: this.sampleToDownload.split('.csv')[0],
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvArr);
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
  @import "~vue-multiselect/dist/vue-multiselect.min.css";
  @import "@/assets/styles/graphs/_table.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
