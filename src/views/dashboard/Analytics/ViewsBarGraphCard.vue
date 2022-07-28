<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <p>{{ cardDescription }}</p>
        </div>
        <div class="graphcard__head__data__right">
          <ul>
            <li>
              <a href="#" @click.prevent="setTemporalUnit('DAY')" :class="{ active: temporalUnit === 'DAY' }">DAY</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit('WEEK')" :class="{ active: temporalUnit === 'WEEK' }">WEEK</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit('MONTH')" :class="{ active: temporalUnit === 'MONTH' }">MONTH</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit('YEAR')" :class="{ active: temporalUnit === 'YEAR' }">YEAR</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="graphcard__head__filters">
        <div class="graphcard__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[1]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[2]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
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
        <th v-for="(name, index) in segmentsNames" class="data_table__header" :key="index">{{ upperCaseTransform(name) }}</th>
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
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AnalyticsApi from '@/service/analytics';
import {
  EnumAssetQueryMetric, DataSeries, EnumTemporalUnit, AssetQuery, EnumAssetSource,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';
import { CatalogueItem, CatalogueQueryResponse } from '@/model';
import ProviderAssetsApi from '@/service/provider-assets';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';
import AssetMiniCardProvider from '@/components/Assets/AssetMiniCardProvider.vue';

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCardProvider,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class ViewsBarGraphCard extends Vue {
  @Prop({ default: EnumAssetQueryMetric.COUNT }) private assetQueryMetricType!: EnumAssetQueryMetric;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: '' }) private cardDescription!: string;

  ProviderAssetsApi: ProviderAssetsApi;

  assets: CatalogueItem[];

  selectedAssets: CatalogueItem[];

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

  datetimeSeries: any;

  constructor() {
    super();

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

    this.ProviderAssetsApi = new ProviderAssetsApi();
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const query: AssetQuery = {
      segments: {
        enabled: true,
      },
      source: EnumAssetSource.VIEW,
      assets: this.assetsQuery,
      metric: this.assetQueryMetricType,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };

    this.analyticsApi.executeAssetQuery(query).then((response) => {
      console.log('segmentQuery: ', query);
      if (response.success) {
        response.result.points.reverse();
        this.analyticsData = response.result;
        this.segmentsNames = this.formatSegmentsNames();
        this.datetimeSeries = this.formatSegmentNamesTime();
        this.chartDate = this.formatTheDate();
        this.seriesData = this.formatSeries();
        this.chartOptions = this.getOptions();
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>): void {
    this.assetsQuery = newVal.map((a) => a.id);
    this.getAnalytics();
  }

  filteredAssets(assets: CatalogueItem[]): any {
    return assets.filter((asset) => this.selectedAssets.every((selected) => selected.id !== asset.id));
  }

  getAssets(): void {
    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.VECTOR,
      pageRequest: {
        page: 0,
        size: 100,
      },
      sorting: {
        id: EnumProviderAssetSortField.TYPE,
        order: 'ASC',
      },
    };
    this.ProviderAssetsApi.find(query)
      .then((response: CatalogueQueryResponse) => {
        if (response.success) {
          this.assets = response.result.items.map((item) => ({
            ...item,
            price: getPriceOrMinimumPrice(item),
            priceRendered: renderedPriceAsString(getPriceOrMinimumPrice(item)),
          }));
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
        categories: this.chartDate,
        type: 'datetime',
        labels: {
          allowOverlap: true,
          autoRotationLimit: 0,
          style: {
            fontFamily: 'Roboto',
            fontSize: '10px',
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
        borderWidth: 0,
        backgroundColor: 'transparent',
        valueSuffix: this.symbol,
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '13px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          return this.symbol === '' ? `${point.y} <br>${point.category}` : `${point.y}€ <br>${point.category}`;
        },
      },
      series: this.seriesData,
    };
  }

  formatSegmentsNames(): string[] {
    let names: Array<any> = [];
    names = [...new Map(this.analyticsData.points.map((item) => [item.segment, item])).values()].map((a) => a.segment);
    return names;
  }

  formatSegmentNamesTime(): Array<any> {
    return [...new Map(this.analyticsData.points.map((item) => [JSON.stringify(item.time), item])).values()].map((a) => a.time).reverse();
  }

  formatSeries(): any[] {
    const series: Array<any> = [];
    if (this.assetsQuery?.length > 1) {
      this.assetsQuery.forEach((assetName) => {
        console.log('asset name: ', assetName);
        const data: Array<number> = [];
        this.segmentsNames.forEach((segName) => {
          const value = this.analyticsData?.points.filter((item) => item?.asset === assetName && item?.segment === segName).map((a) => a.value);
          if (value.length > 0) {
            data.push(value[0]);
          } else {
            data.push(0);
          }
        });
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        const assetObj = {
          name: assetTitle?.title,
          showInLegend: true,
          data,
        };
        series.push(assetObj);
      });
    } else {
      this.assetsQuery.forEach((assetName) => {
        console.log('asset name: ', assetName);
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        const data = this.analyticsData?.points.map((a) => a.value);
        const assetObj = {
          name: assetTitle?.title,
          showInLegend: true,
          data,
        };
        series.push(assetObj);
      });
    }
    return series;
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
