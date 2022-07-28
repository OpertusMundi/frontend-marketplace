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
          <th v-for="(name, index) in segmentsNames" class="data_table__header" :key="`segment_name_${index}`">{{ formatDate(name) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="data_table__row" v-for="data in seriesData" :key="data.name">
          <td class="data_table__data">{{ data.name }}</td>
          <td class="data_table__data" v-for="value in data.data" :key="value.id">{{ formatValue(value) }}</td>
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
import ProviderAssetsApi from '@/service/provider-assets';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCardProvider from '@/components/Assets/AssetMiniCardProvider.vue';
import AnalyticsApi from '@/service/analytics';
import {
  EnumAssetQueryMetric, AssetQuery, EnumAssetSource, DataSeries, EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';
import Highcharts from 'highcharts';
import exportData from 'highcharts/modules/export-data';
import exportingInit from 'highcharts/modules/exporting';
import { CatalogueItem, CatalogueQueryResponse } from '@/model';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';

exportingInit(Highcharts);
exportData(Highcharts);

interface TimeResponse {
  day: number;
  month: number;
  week: number;
  year: number;
}

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCardProvider,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class ViewsLineGraphCard extends Vue {
  @Prop({ default: null }) private assetSourceEnum!: EnumAssetSource;

  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: '' }) private cardDescription!: string;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

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

  lineChartDate: any;

  assetQueryMetricType: EnumAssetQueryMetric;

  EnumTemporalUnit: typeof EnumTemporalUnit;

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
    this.lineChartDate = [];
    this.EnumTemporalUnit = EnumTemporalUnit;
    this.assetQueryMetricType = EnumAssetQueryMetric.COUNT;
    this.ProviderAssetsApi = new ProviderAssetsApi();
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  filteredAssets(assets: CatalogueItem[]): any {
    return assets.filter((asset) => this.selectedAssets.every((selected) => selected.id !== asset.id));
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
    };

    this.analyticsApi.executeAssetQuery(assetsViewsQuery).then((response) => {
      if (response.success) {
        // eslint-disable-next-line
        response.result!.points.reverse();
        // eslint-disable-next-line
        this.analyticsData = response.result!;
        this.segmentsNames = this.formatSegmentsNames();
        this.lineChartDate = this.formatTheDate();
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

    return {
      chart: {
        type: 'areaspline',
        zoomType: 'x',
      },

      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },

      xAxis: {
        categories: this.lineChartDate,
        type: 'datetime',
      },
      yAxis: {
        gridLineDashStyle: 'Dot',
        gridLineWidth: 1,
        gridLineColor: '#6C6C6C',
        title: {
          text: this.symbolTitle,
        },
      },
      legend: {
        enabled: true,
      },
      colors: [
        {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, '#190AFF'],
            [1, 'rgba(25,10,255,0)'],
          ],
        },
        {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, '#358F8B'],
            [1, 'rgba(53,143,139,0)'],
          ],
        },
        {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, '#A843B5'],
            [1, 'rgba(168,67,181,0)'],
          ],
        },
      ],
      plotOptions: {
        colorByPoint: true,
        area: {
          fillColor: [
            {
              linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
              },
              stops: [
                [0, '#190AFF'],
                [1, 'rgba(25,10,255,0)'],
              ],
            },
            {
              linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
              },
              stops: [
                [0, '#358F8B'],
                [1, 'rgba(53,143,139,0)'],
              ],
            },
            {
              linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
              },
              stops: [
                [0, '#A843B5'],
                [1, 'rgba(168,67,181,0)'],
              ],
            },
          ],
          lineWidth: 0.2,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
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
          return this.symbol === ''
            ? `${point.y} <br>${point.category}`
            : `${point.y
              .toString()
              .replace(/(\.\d{2})\d*/, '$1')
              .replace(/(\d)(?=(\d{3})+\b)/g, '$1,')}€ <br>${point.category}`;
        },
      },
      exporting: {
        csv: {
          itemDelimiter: ';',
        },
      },
      series: this.seriesData,
    };
  }

  formatSegmentsNames(): string[] {
    let names: Array<any> = [];
    names = [...new Map(this.analyticsData.points.map((item) => [JSON.stringify(item.time), item])).values()].map((a) => a.time).reverse();
    return names;
  }

  formatSeries(): any[] {
    const series: Array<any> = [];
    if (this.assetsQuery?.length > 1) {
      this.assetsQuery.forEach((assetName) => {
        const data: Array<number> = [];
        this.segmentsNames.forEach((segName) => {
          const value = this.analyticsData?.points.filter((item) => item?.asset === assetName && JSON.stringify(item?.time) === JSON.stringify(segName)).map((a) => a.value);
          if (value.length > 0) {
            data.push(value[0]);
          } else {
            data.push(0);
          }
        });
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        const assetObj = {
          marker: {
            enabled: true,
            symbol: 'circle',
            lineWidth: 1,
            radius: 4,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          name: assetTitle?.title,
          showInLegend: true,
          data,
        };
        series.push(assetObj);
      });
    } else {
      const data = this.analyticsData?.points.map((a) => a.value);
      const assetTitle = this.assets.find(({ id }) => id === this.assetsQuery[0]);
      const assetObj = {
        name: assetTitle?.title,
        marker: {
          enabled: true,
          symbol: 'circle',
          lineWidth: 1,
          radius: 4,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
        showInLegend: true,
        data,
      };
      series.push(assetObj);
    }
    return series;
  }

  setTemporalUnit(value: EnumTemporalUnit): void {
    this.temporalUnit = value;
    if (this.assetsQuery?.length) {
      this.getAnalytics();
    }
  }

  formatDate(value: TimeResponse): any {
    let date: any;
    if (Object.prototype.hasOwnProperty.call(value, 'day')) {
      date = moment(`${value.year}-${value.month}-${value.day}`)
        .format('MMM D, YY');
    } else if (Object.prototype.hasOwnProperty.call(value, 'month') && Object.prototype.hasOwnProperty.call(value, 'year') && !Object.prototype.hasOwnProperty.call(value, 'week')) {
      date = moment(`${value.year}-${value.month}`)
        .format('MMMM YYYY');
    } else if (Object.prototype.hasOwnProperty.call(value, 'week') && Object.prototype.hasOwnProperty.call(value, 'month') && Object.prototype.hasOwnProperty.call(value, 'year')) {
      const startWeek = moment(`${value.year}`)
        .add(value.week, 'weeks')
        .startOf('isoWeek')
        .format('MMM D');
      const endWeek = moment(`${value.year}`)
        .add(value.week, 'weeks')
        .endOf('isoWeek')
        .format('MMM D, YY');
      date = `${startWeek} - ${endWeek}`;
    } else if (Object.prototype.hasOwnProperty.call(value, 'year')) {
      date = moment(`${value.year}`)
        .format('YYYY');
    }
    return date;
  }

  formatTheDate(): string[] {
    const formattedDate: Array<any> = [];
    if (this.assetsQuery?.length > 0) {
      this.segmentsNames.forEach((date: any) => {
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

  formatValue(value: string): string {
    const regex = value.toString();
    return regex.replace(/(\.\d{2})\d*/, '$1').replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
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
