<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <p>{{ cardDescription }}</p>
        </div>
        <div v-if="false" class="graphcard__head__data__right">
          <ul>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(EnumTemporalUnit.DAY)"
                 :class="{ active: temporalUnit === EnumTemporalUnit.DAY }">DAY</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(EnumTemporalUnit.WEEK)"
                 :class="{ active: temporalUnit === EnumTemporalUnit.WEEK }">WEEK</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(EnumTemporalUnit.MONTH)"
                 :class="{ active: temporalUnit === EnumTemporalUnit.MONTH }">MONTH</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(EnumTemporalUnit.YEAR)"
                 :class="{ active: temporalUnit === EnumTemporalUnit.YEAR }">YEAR</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="graphcard__head__filters">
        <div v-if="false" class="graphcard__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[1]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[2]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
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
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
    <table class="data_table" v-if="chartOptions">
      <thead>
      <tr>
        <th class="data_table__header">Asset</th>
        <th v-for="(name, index) in assetNames" class="data_table__header" :key="index">{{ upperCaseTransform(name) }}</th>
      </tr>
      </thead>
      <tbody>
      <tr class="data_table__row" v-for="data in seriesData" :key="data.id">
        <td class="data_table__data">{{ data.name }}</td>
        <td class="data_table__data" v-for="(value, index) in data.data" :key="index">{{ value }}</td>
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
  EnumAssetQueryMetric, DataSeries, EnumTemporalUnit, AssetQuery, EnumAssetSource,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class BarPopularAssets extends Vue {
  @Prop({ default: EnumAssetSource.VIEW })
  private EnumAssetSource!: EnumAssetSource;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: '' }) private cardDescription!: string;

  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  selectedAssets: AssetDraft[];

  analyticsApi: AnalyticsApi;

  analyticsData: DataSeries;

  assetsQuery: string[];

  segmentsNames: string[];

  chartOptions: any | null;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  seriesData: any;

  chartDate: any;

  datetimeSeries: any

  assetNames: string[]

  EnumTemporalUnit: typeof EnumTemporalUnit;

  constructor() {
    super();
    this.draftAssetApi = new DraftAssetApi();
    this.assets = [];
    this.selectedAssets = [];
    this.analyticsApi = new AnalyticsApi();
    this.analyticsData = {} as DataSeries;
    this.chartOptions = null;
    this.assetsQuery = [];
    this.segmentsNames = [];
    this.temporalUnitMin = '';
    this.temporalUnitMax = '';
    this.temporalUnit = EnumTemporalUnit.DAY;
    this.seriesData = [];
    this.chartDate = [];
    this.datetimeSeries = [];
    this.assetNames = [];
    this.EnumTemporalUnit = EnumTemporalUnit;
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    await this.getAnalytics();
  }

  getAnalytics(): void {
    const query: AssetQuery = {
      segments: {
        enabled: true,
      },
      source: this.EnumAssetSource,
      assets: this.assetsQuery,
      metric: EnumAssetQueryMetric.COUNT,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };

    this.analyticsApi.getPopularAssetCounts(query, 10000).then(({ result, success }) => {
      if (success) {
        // const series = DataTransform.groupByPopularAssetsSeriesData(response.result, this.assets);
        this.seriesData = [{
          data: result.map((e) => e.count),
          name: this.cardHeading,
        }];
        this.assetNames = result.map((e) => e.asset.title);
        this.chartOptions = this.getOptions();
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>): void {
    this.assetsQuery = newVal.filter((el) => el).map((a) => a.assetPublished);
    this.getAnalytics();
  }

  @Watch('EnumAssetSource')
  onEnumAssetSourceChange(): void {
    this.getAnalytics();
  }

  filteredAssets(assets: AssetDraft[]): any {
    return assets.filter((asset) => this.selectedAssets.every((selected) => selected.key !== asset.key));
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
    await this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
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
    // const name = 'Sales per segment';
    return {
      credits: {
        enabled: false,
      },
      chart: {
        type: 'column',
      },
      plotOptions: {
        series: {
          borderWidth: 0.5,
          borderColor: 'white',
          borderRadius: 6,
        },
      },
      showInLegend: true,
      colors: ['#190AFF', '#358F8B', '#A843B5'],
      title: {
        text: '',
      },
      xAxis: {
        categories: this.assetNames,
        labels: {
          allowOverlap: false,
          autoRotationLimit: -90,
          rotation: -45,
          style: {
            fontFamily: 'Roboto',
            fontSize: '8px',
          },
        },
      },
      yAxis: {
        min: 0,
        gridLineWidth: 0,
        title: {
          text: this.symbolTitle,
        },
      },
      tooltip: {
        shadow: false,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#190AFF',
        valueSuffix: this.symbol,
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '13px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          return this.symbol === '' ? `${point.y} views <br>${point.category}` : `${point.y}€ <br>${point.category}`;
        },
      },
      series: this.seriesData,
    };
  }

  setTemporalUnit(value: EnumTemporalUnit): void {
    this.temporalUnit = value;
    if (this.assetsQuery?.length) {
      this.getAnalytics();
    }
  }

  upperCaseTransform(value: string): any {
    return value;
    // return value.toLowerCase().replace(/(?:_| |\b)(\w)/g, ($1) => $1.toUpperCase().replace('_', ' '));
  }

  formatTheDate(): string[] {
    const formattedDate: Array<any> = [];
    if (this.assetsQuery?.length > 0) {
      this.datetimeSeries.forEach((date: any) => {
        if (Object.prototype.hasOwnProperty.call(date, 'day')) {
          const dayFormat = moment(`${date.year}-${date.month}-${date.day}`)
            .format('MMM D, YY');
          formattedDate.push(dayFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'month') && Object.prototype.hasOwnProperty.call(date, 'year') && !Object.prototype.hasOwnProperty.call(date, 'week')) {
          const monthFormat = moment(`${date.year}-${date.month}`)
            // .set({ year: date.year, month: date.month })
            .format('MMMM YYYY');
          formattedDate.push(monthFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'week') && Object.prototype.hasOwnProperty.call(date, 'month') && Object.prototype.hasOwnProperty.call(date, 'year')) {
          const startWeek = moment(`${date.year}`)
            .add(date.week, 'weeks')
            .startOf('isoWeek')
            .format('MMM D');
          const endWeek = moment(`${date.year}`)
            .add(date.week, 'weeks')
            .endOf('isoWeek')
            .format('MMM D, YY');
          const weekFormat = `${startWeek} - ${endWeek}`;
          formattedDate.push(weekFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'year')) {
          const yearFormat = moment(`${date.year}`)
            .format('YYYY');
          formattedDate.push(yearFormat);
        }
      });
    }
    return formattedDate;
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
