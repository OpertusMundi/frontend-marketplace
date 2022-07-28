<template>
  <div class="line_chart">
    <div class="line_chart__head">
      <div class="line_chart__head__filters">
        <div class="line_chart__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
        </div>
        <div class="line_chart__head__filters__time">
          <DataRangePicker :dataRangeMin.sync="temporalUnitMin" :dataRangeMax.sync="temporalUnitMax" v-on:triggerchange="getAnalytics()" />
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
    <div class="placeholder" v-else></div>
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
import AnalyticsApi from '@/service/analytics';
import {
  EnumSalesQueryMetric, SalesQuery, DataSeries, EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';
import { CatalogueItem, CatalogueQueryResponse } from '@/model';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';
import AssetMiniCardProvider from '@/components/Assets/AssetMiniCardProvider.vue';

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
export default class SalesLineGraphCard extends Vue {
  @Prop({ default: null }) private salesQueryMetricType!: EnumSalesQueryMetric;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  datesSelect: any;

  ProviderAssetsApi: ProviderAssetsApi;

  assets: CatalogueItem[];

  selectedAssets: CatalogueItem[];

  analyticsApi: AnalyticsApi;

  analyticsData: DataSeries;

  assetsQuery: string[];

  timePoints: string[];

  chartOptions: any | null;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  seriesData: any;

  lineChartDate: any;

  constructor() {
    super();

    this.datesSelect = [{ date: 'today' }, { date: 'last week' }, { date: 'last month' }, { date: 'last 3 months' }, { date: 'last 6 months' }, { date: 'last year' }];

    this.assets = [];

    this.selectedAssets = [];

    this.analyticsApi = new AnalyticsApi();

    this.analyticsData = {} as DataSeries;

    this.chartOptions = null;

    this.assetsQuery = [];

    this.timePoints = [];

    this.temporalUnitMin = '';

    this.temporalUnitMax = '';

    this.temporalUnit = EnumTemporalUnit.DAY;

    this.seriesData = [];

    this.lineChartDate = [];

    this.ProviderAssetsApi = new ProviderAssetsApi();
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const segmentQuery: SalesQuery = {
      segments: {
        enabled: false,
      },
      assets: this.assetsQuery,
      metric: this.salesQueryMetricType,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };

    this.analyticsApi.executeSalesQuery(segmentQuery).then((response) => {
      if (response.success) {
        // eslint-disable-next-line
        response.result!.points.reverse();
        // eslint-disable-next-line
        this.analyticsData = response.result!;
        this.timePoints = this.formatSegmentsNames();
        this.lineChartDate = this.formatTheDate();
        this.seriesData = this.formatSeries();
        this.chartOptions = this.getOptions();
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: CatalogueItem[]): void {
    this.assetsQuery = newVal.filter((val) => val).map((a) => a.id);
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
      chart: {
        height: '250px',
        type: 'areaspline',
        zoomType: 'x',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: null,
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
          text: null,
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
        this.timePoints.forEach((segName) => {
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
      this.assetsQuery.forEach((assetName) => {
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        const data = this.analyticsData?.points.map((a) => a.value);
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
      this.timePoints.forEach((date: any) => {
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

  formatValue(value: string): any {
    const regex = value.toString();
    return regex.replace(/(\.\d{2})\d*/, '$1').replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_line-chart.scss';
@import '@/assets/styles/graphs/_table.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
