<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <p>{{ cardDescription }}</p>
        </div>
      </div>
      <div class="graphcard__head__filters">
        <!-- Hide select asset from ui -->
        <div class="graphcard__head__filters__assets">
          <multiselect v-model="segmentModel" :options="segments" :searchable="true"
                       :close-on-select="true" :show-labels="false"
                       placeholder="Select Segment">
            <template slot="option" slot-scope="props">
              <AssetSegmentCard :segment="props.option"></AssetSegmentCard>
            </template>
          </multiselect>
        </div>
        <div class="graphcard__head__filters__time">
          <DataRangePicker :dataRangeMin.sync="temporalUnitMin" :dataRangeMax.sync="temporalUnitMax"
                           v-on:triggerchange="getAnalytics()"/>
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :constructorType="'mapChart'" class="hc" :options="chartOptions"
                ref="chart"></highcharts>
    <table class="data_table" v-if="chartOptions">
      <thead>
      <tr>
        <th class="data_table__header">Location</th>
        <th v-for="(name, index) in tableData" class="data_table__header"
            :key="`segment_name_${index}`">{{ name.country }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="data_table__row">
        <td class="data_table__data">Views</td>
        <td class="data_table__data" v-for="value in tableData" :key="value.id">
          {{ formatValue(value.views) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import AssetSelector from '@/components/AssetSelector.vue';
import DataRangePicker from '@/components/DataRangePicker.vue';
import AssetSegmentCard from '@/components/Assets/AssetSegmentCard.vue';
import DraftAssetApi from '@/service/draft';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCard from '@/components/Assets/AssetMiniCard.vue';
import AnalyticsApi from '@/service/analytics';
import {
  CoverageQuery,
  DataSeries,
  EnumAssetQueryMetric,
  EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import HighchartsMapModule from 'highcharts/modules/map';
import mapData from '@highcharts/map-collection/custom/world.geo.json';
import { EnumTopicCategory } from '@/model/catalogue';

HighchartsMapModule(Highcharts);

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DataRangePicker,
    highcharts: Chart,
    AssetSegmentCard,
  },
})
export default class MapCoverageFileAssets extends Vue {
  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardDescription!: string;

  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  selectedAssets: AssetDraft[];

  analyticsApi: AnalyticsApi;

  analyticsData: DataSeries;

  assetsQuery: string[];

  chartOptions: any | null;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  seriesData: any;

  tableData: any;

  assetQueryMetricType: EnumAssetQueryMetric;

  countryCode?: string[];

  groupData: any;

  segments: Array<any> | null;

  selectedSegments: EnumTopicCategory[] | null;

  segmentModel: EnumTopicCategory[] | null;

  EnumTopicCategory: typeof EnumTopicCategory;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.selectedAssets = [];

    this.analyticsApi = new AnalyticsApi();

    this.analyticsData = {} as DataSeries;

    this.chartOptions = null;

    this.assetsQuery = [];

    this.temporalUnitMin = '';

    this.temporalUnitMax = '';

    this.temporalUnit = EnumTemporalUnit.DAY;

    this.seriesData = [];

    this.tableData = [];

    this.assetQueryMetricType = EnumAssetQueryMetric.COUNT;

    this.countryCode = [];

    this.groupData = [];

    this.segments = [];

    this.selectedSegments = [];

    this.EnumTopicCategory = EnumTopicCategory;

    this.segmentModel = [];
  }

  async mounted(): Promise<any> {
    // TODO: If asset selection will be removed from production then the below method "getAssets()" should be removed as well from the code
    await this.getAssets();
    this.getAnalytics();
  }

  getSegments(): void {
    this.segments = Object.keys(this.EnumTopicCategory);
  }

  getAnalytics(): void {
    this.getSegments();
    const query: CoverageQuery = {
      segments: this.selectedSegments,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };

    this.analyticsApi.executeCoverageQuery(query)
      .then((response) => {
        if (response.success) {
          response.result.points.reverse();
          this.analyticsData = response.result;
          this.formatSeries();
          this.tableData = this.tableCountries();
          this.chartOptions = this.getOptions();
        }
      });
  }

  @Watch('segmentModel')
  onSelectedSegments(newVal: EnumTopicCategory): void {
    this.selectedSegments = [newVal];
    this.getAnalytics();
  }

  async getAssets(): Promise<any> {
    const query = {
      status: [EnumDraftStatus.PUBLISHED],
    };
    const pageRequest = {
      page: 0,
      size: 100,
    };
    const sort = {
      id: EnumSortField.CREATED_ON,
      order: 'ASC' as Order,
    };
    await this.draftAssetApi.find(query, pageRequest, sort)
      .then((resp) => {
        if (resp.data.success) {
          this.assets = resp.data.result.items;
        } else {
          console.log('error', resp.data);
        }
      });
  }

  getOptions(): any {
    if (!this.analyticsData) {
      return null;
    }
    return {
      chart: {
        map: mapData,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox',
        },
      },
      colorAxis: {
        minColor: '#F4F4FD',
        maxColor: '#07006F',
        min: 0,
      },
      series: [
        {
          name: 'Map',
          states: {
            hover: {
              color: '#A843B5',
            },
          },
          dataLabels: {
            enabled: false,
            format: '{point.name}',
          },
          allAreas: true,
          data: this.seriesData,
        },
      ],
    };
  }

  formatSeries(): void {
    const array: Array<[string, number]> = Object.values(
      this.analyticsData.points.reduce((acc, object: any) => {
        const entry = object.location.code.toLowerCase();
        (acc[entry] || (acc[entry] = [entry, 0]))[1] += object.value;
        return acc;
      }, {}),
    );
    this.seriesData = array.map((e) => {
      if (e[0] === 'el') {
        e[0] = 'gr';
      }
      return e;
    });
  }

  tableCountries(): any {
    const tableData: Array<any> = [];
    this.seriesData.forEach((element) => {
      const tableObject = {
        country: element[0].toUpperCase(),
        views: element[1],
      };
      tableData.push(tableObject);
    });
    return tableData;
  }

  formatValue(value: string): any {
    const regex = value.toString();
    return regex.replace(/(\.\d{2})\d*/, '$1')
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_table.scss';

.multiselect__option--highlight {
  background: none !important;
}
</style>
