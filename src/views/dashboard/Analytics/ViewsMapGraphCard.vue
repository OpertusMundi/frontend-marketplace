<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <a href="#"><img src="@/assets/images/icons/dashboard/download_btn.svg" alt="" /> Download Data</a>
          <p>Keep track of your assets popularity across time and countries.</p>
        </div>
      </div>
      <div class="graphcard__head__filters">
        <div class="graphcard__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
        </div>
        <div class="graphcard__head__filters__time">
          <DataRangePicker :dataRangeMin.sync="temporalUnitMin" :dataRangeMax.sync="temporalUnitMax" v-on:triggerchange="getAnalytics()" />
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :constructorType="'mapChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
    <table class="data_table" v-if="chartOptions">
      <thead>
        <tr>
          <th class="data_table__header">Asset</th>
          <th v-for="(name, index) in tableData" class="data_table__header" :key="`segment_name_${index}`">{{ name.country }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="data_table__row">
          <td class="data_table__data">Asset Name</td>
          <td class="data_table__data" v-for="value in tableData" :key="value.id">{{ formatValue(value.views) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import {
  Component, Watch, Vue, Prop,
} from 'vue-property-decorator';
import AssetSelector from '@/components/AssetSelector.vue';
import DataRangePicker from '@/components/DataRangePicker.vue';
import DraftAssetApi from '@/service/draft';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCard from '@/components/Assets/AssetMiniCard.vue';
import AnalyticsApi from '@/service/analytics';
import {
  EnumAssetQueryMetric, AssetQuery, EnumAssetSource, DataSeries, EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import HighchartsMapModule from 'highcharts/modules/map';
import mapData from '@highcharts/map-collection/custom/world.geo.json';

HighchartsMapModule(Highcharts);

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class ViewsMapGraphCard extends Vue {
  @Prop({ default: null }) private assetSourceEnum!: EnumAssetSource;

  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

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
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const assetsViewsQuery: AssetQuery = {
      segments: {
        enabled: false,
      },
      assets: this.assetsQuery,
      metric: this.assetQueryMetricType,
      source: this.assetSourceEnum,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
      areas: {
        enabled: true,
        codes: this.countryCode,
      },
    };

    this.analyticsApi.executeAssetQuery(assetsViewsQuery).then((response) => {
      if (response.success) {
        // eslint-disable-next-line
        response.result!.points.reverse();
        // eslint-disable-next-line
        this.analyticsData = response.result!;
        this.formatSeries();
        this.tableData = this.tableCountries();
        this.chartOptions = this.getOptions();
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>): void {
    // this.assetsQuery = newVal.map((a) => a.key); //TODO: get the PID of asset
    this.assetsQuery = ['topio.the-company.1.VECTOR'];
    this.getAnalytics();
  }

  async getAssets(): Promise<any> {
    const query = {
      status: [EnumDraftStatus.PUBLISHED, EnumDraftStatus.DRAFT, EnumDraftStatus.SUBMITTED, EnumDraftStatus.PENDING_HELPDESK_REVIEW, EnumDraftStatus.HELPDESK_REJECTED, EnumDraftStatus.PENDING_PROVIDER_REVIEW, EnumDraftStatus.PROVIDER_REJECTED, EnumDraftStatus.POST_PROCESSING],
    };
    const pageRequest = {
      page: 0,
      size: 100,
    };
    const sort = {
      id: EnumSortField.CREATED_ON,
      order: 'ASC' as Order,
    };
    this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
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

  formatSeries(): any {
    const result: any[] = Object.values(
      this.analyticsData.points.reduce((acc, object: any) => {
        const entry = object.location.code.toLowerCase();
        (acc[entry] || (acc[entry] = [entry, 0]))[1] += object.value;
        return acc;
      }, {}),
    );
    this.seriesData = result;
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

  setTemporalUnit(value: EnumTemporalUnit): void {
    this.temporalUnit = value;
    if (this.assetsQuery?.length) {
      this.getAnalytics();
    }
  }

  formatValue(value: string): any {
    const regex = value.toString();
    return regex.replace(/(\.\d{2})\d*/, '$1').replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_linegraph.scss';
@import '@/assets/styles/graphs/_table.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
