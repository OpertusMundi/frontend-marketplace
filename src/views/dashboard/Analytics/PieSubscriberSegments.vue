<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <a href="#"><img src="@/assets/images/icons/dashboard/download_btn.svg" alt="" /> Download Data</a>
          <p>Keep track of your assets popularity across time and countries.</p>
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
          <multiselect v-model="selectedAssets[0]" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[1]" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[3]" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
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
    <div class="pie-container">
      <PieChart :analyticsData="analyticsData" :pieColor="bluePalette" />
      <PieChart :analyticsData="analyticsData" :pieColor="greenPalette" />
      <PieChart :analyticsData="analyticsData" :pieColor="magentaPalette" />
    </div>
    <!-- <table class="data_table" v-if="chartOptions">
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
    </table> -->
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
import moment from 'moment';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import PieChart from '@/components/Charts/PieChart.vue';

exportingInit(Highcharts);

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DataRangePicker,
    PieChart,
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  @Prop({ default: null }) private assetSourceEnum!: EnumAssetSource;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

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

  lineChartDate: any;

  assetQueryMetricType: EnumAssetQueryMetric;

  countryCode?: string[];

  bluePalette: string[];

  greenPalette: string[];

  magentaPalette: string[];

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

    this.lineChartDate = [];

    this.countryCode = [];

    this.assetQueryMetricType = EnumAssetQueryMetric.COUNT;

    this.bluePalette = ['rgb(0,0,146)', 'rgb(0,0,183)', 'rgb(0,0,219)', 'rgb(25,10,255)', 'rgb(61,46,255)', 'rgb(97,82,255)', 'rgb(134,119,255)', 'rgb(170,155,255)', 'rgb(207,192,255)', 'rgb(243,228,255)'];

    this.greenPalette = ['rgb(0,71,67)', 'rgb(17,107,103)', 'rgb(53,143,139)', 'rgb(89,179,175)', 'rgb(125,215,211)', 'rgb(162,252,248)', 'rgb(198,255,255)'];

    this.magentaPalette = ['rgb(59,0,72)', 'rgb(96,0,109)', 'rgb(132,31,145)', 'rgb(168,67,181)', 'rgb(204,103,217)', 'rgb(240,139,253)', 'rgb(255,176,255)'];
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const assetsViewsQuery: AssetQuery = {
      segments: {
        enabled: true,
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
        enabled: false,
        codes: this.countryCode,
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
        console.log(this.seriesData);
        console.log('Highcharts', Highcharts.setOptions({ colors: ['#50B432', '#ED561B'] }));
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>): void {
    // this.assetsQuery = newVal.map((a) => a.key); //TODO: get the PID of asset
    this.assetsQuery = ['topio.the-company.1.VECTOR', 'topio.the-company.2.VECTOR', 'topio.the-company.3.VECTOR'];
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
        type: 'pie',
      },
      colors: ['#190AFF'],
      title: {
        text: 'Browser market shares. January, 2018',
      },
      subtitle: {
        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
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
            format: '{point.name}: {point.y:.1f}%',
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },

      series: [
        {
          name: 'Browsers',
          colorByPoint: true,
          data: [
            {
              name: 'Chrome',
              y: 99.74,
              drilldown: 'Chrome',
            },
            {
              name: 'Firefox',
              y: 10.57,
              drilldown: 'Firefox',
            },
            {
              name: 'Internet Explorer',
              y: 7.23,
              drilldown: 'Internet Explorer',
            },
            {
              name: 'Safari',
              y: 5.58,
              drilldown: 'Safari',
            },
            {
              name: 'Edge',
              y: 4.02,
              drilldown: 'Edge',
            },
            {
              name: 'Opera',
              y: 1.92,
              drilldown: 'Opera',
            },
            {
              name: 'Other',
              y: 7.62,
              drilldown: null,
            },
          ],
        },
      ],

      // chart: {
      //   type: 'areaspline',
      //   zoomType: 'x',
      // },
      // credits: {
      //   enabled: false,
      // },
      // title: {
      //   text: this.symbolTitle,
      // },

      // xAxis: {
      //   categories: this.lineChartDate,
      //   type: 'datetime',
      // },
      // yAxis: {
      //   gridLineDashStyle: 'Dot',
      //   gridLineWidth: 1,
      //   gridLineColor: '#6C6C6C',
      //   title: {
      //     text: this.symbolTitle,
      //   },
      // },
      // legend: {
      //   enabled: true,
      // },
      // colors: [
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#190AFF'],
      //       [1, 'rgba(25,10,255,0)'],
      //     ],
      //   },
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#358F8B'],
      //       [1, 'rgba(53,143,139,0)'],
      //     ],
      //   },
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#A843B5'],
      //       [1, 'rgba(168,67,181,0)'],
      //     ],
      //   },
      // ],
      // plotOptions: {
      //   colorByPoint: true,
      //   area: {
      //     fillColor: [
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#190AFF'],
      //           [1, 'rgba(25,10,255,0)'],
      //         ],
      //       },
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#358F8B'],
      //           [1, 'rgba(53,143,139,0)'],
      //         ],
      //       },
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#A843B5'],
      //           [1, 'rgba(168,67,181,0)'],
      //         ],
      //       },
      //     ],
      //     lineWidth: 0.2,
      //     states: {
      //       hover: {
      //         lineWidth: 1,
      //       },
      //     },
      //     threshold: null,
      //   },
      // },

      // tooltip: {
      //   shadow: false,
      //   borderWidth: 0,
      //   backgroundColor: 'transparent',
      //   valueSuffix: this.symbol,
      //   style: {
      //     color: '#190AFF',
      //     fontFamily: 'Roboto',
      //     fontSize: '13px',
      //   },
      //   formatter: (a) => {
      //     const point = a.chart.hoverPoint;
      //     return this.symbol === ''
      //       ? `${point.y} <br>${point.category}`
      //       : `${point.y
      //         .toString()
      //         .replace(/(\.\d{2})\d*/, '$1')
      //         .replace(/(\d)(?=(\d{3})+\b)/g, '$1,')}€ <br>${point.category}`;
      //   },
      // },
      // series: this.seriesData,
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
        const assetObj = {
          name: assetName,
          segment: 'segment',
          y: data,
        };
        series.push(assetObj);
      });
    } else {
      const data = this.analyticsData?.points.map((a) => a.value);
      const assetObj = {
        name: this.assetsQuery[0],
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

  formatDate(value: any): any {
    let date: any;
    if (Object.prototype.hasOwnProperty.call(value, 'day')) {
      date = moment()
        .set({ year: value.year, month: value.month, date: value.day })
        .format('MMM D, YY');
      // console.log('day');
    } else if (Object.prototype.hasOwnProperty.call(value, 'month') && Object.prototype.hasOwnProperty.call(value, 'year') && !Object.prototype.hasOwnProperty.call(value, 'week')) {
      date = moment()
        .set({ year: value.year, month: value.month })
        .format('MMMM YYYY');
      // console.log('month');
    } else if (Object.prototype.hasOwnProperty.call(value, 'week') && Object.prototype.hasOwnProperty.call(value, 'month') && Object.prototype.hasOwnProperty.call(value, 'year')) {
      const startWeek = moment()
        .set('year', value.year)
        .add(value.week, 'weeks')
        .startOf('isoWeek')
        .format('MMM D');
      const endWeek = moment()
        .set('year', value.year)
        .add(value.week, 'weeks')
        .endOf('isoWeek')
        .format('MMM D, YY');
      date = `${startWeek} - ${endWeek}`;
      // console.log('week');
    } else if (Object.prototype.hasOwnProperty.call(value, 'year')) {
      date = moment()
        .set({ year: value.year })
        .format('YYYY');
      // console.log('year');
    }
    // console.log(value);
    return date;
  }

  formatTheDate(): string[] {
    const formattedDate: Array<any> = [];
    if (this.assetsQuery?.length > 1) {
      this.segmentsNames.forEach((date: any) => {
        if (Object.prototype.hasOwnProperty.call(date, 'day')) {
          const dayFormat = moment()
            .set({ year: date.year, month: date.month, date: date.day })
            .format('MMM D, YY');
          formattedDate.push(dayFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'month') && Object.prototype.hasOwnProperty.call(date, 'year') && !Object.prototype.hasOwnProperty.call(date, 'week')) {
          const monthFormat = moment()
            .set({ year: date.year, month: date.month })
            .format('MMMM YYYY');
          formattedDate.push(monthFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'week') && Object.prototype.hasOwnProperty.call(date, 'month') && Object.prototype.hasOwnProperty.call(date, 'year')) {
          const startWeek = moment()
            .set('year', date.year)
            .add(date.week, 'weeks')
            .startOf('isoWeek')
            .format('MMM D');
          const endWeek = moment()
            .set('year', date.year)
            .add(date.week, 'weeks')
            .endOf('isoWeek')
            .format('MMM D, YY');
          const weekFormat = `${startWeek} - ${endWeek}`;
          formattedDate.push(weekFormat);
        } else if (Object.prototype.hasOwnProperty.call(date, 'year')) {
          const yearFormat = moment()
            .set({ year: date.year })
            .format('YYYY');
          formattedDate.push(yearFormat);
        }
      });
    }
    return formattedDate;
  }

  formatValue(value: any): any {
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
