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
import DraftAssetApi from '@/service/draft';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCard from '@/components/Assets/AssetMiniCard.vue';
import AnalyticsApi from '@/service/analytics';
import {
  EnumSalesQueryMetric, SalesQuery, DataSeries, EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';
import HighCharts from 'highcharts';

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  @Prop({ default: null }) private salesQueryMetricType!: EnumSalesQueryMetric;

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
        this.segmentsNames = this.formatSegmentsNames();
        this.lineChartDate = this.formatTheDate();
        this.seriesData = this.formatSeries();
        this.chartOptions = this.getOptions();
        console.log(this.analyticsData);
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
    // const name = 'Sales per segment';

    return {
      chart: {
        type: 'pie',
      },
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
              y: 62.74,
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
      drilldown: {
        series: [
          {
            name: 'Chrome',
            id: 'Chrome',
            data: [
              ['v65.0', 0.1],
              ['v64.0', 1.3],
              ['v63.0', 53.02],
              ['v62.0', 1.4],
              ['v61.0', 0.88],
              ['v60.0', 0.56],
              ['v59.0', 0.45],
              ['v58.0', 0.49],
              ['v57.0', 0.32],
              ['v56.0', 0.29],
              ['v55.0', 0.79],
              ['v54.0', 0.18],
              ['v51.0', 0.13],
              ['v49.0', 2.16],
              ['v48.0', 0.13],
              ['v47.0', 0.11],
              ['v43.0', 0.17],
              ['v29.0', 0.26],
            ],
          },
          {
            name: 'Firefox',
            id: 'Firefox',
            data: [
              ['v58.0', 1.02],
              ['v57.0', 7.36],
              ['v56.0', 0.35],
              ['v55.0', 0.11],
              ['v54.0', 0.1],
              ['v52.0', 0.95],
              ['v51.0', 0.15],
              ['v50.0', 0.1],
              ['v48.0', 0.31],
              ['v47.0', 0.12],
            ],
          },
          {
            name: 'Internet Explorer',
            id: 'Internet Explorer',
            data: [
              ['v11.0', 6.2],
              ['v10.0', 0.29],
              ['v9.0', 0.27],
              ['v8.0', 0.47],
            ],
          },
          {
            name: 'Safari',
            id: 'Safari',
            data: [
              ['v11.0', 3.39],
              ['v10.1', 0.96],
              ['v10.0', 0.36],
              ['v9.1', 0.54],
              ['v9.0', 0.13],
              ['v5.1', 0.2],
            ],
          },
          {
            name: 'Edge',
            id: 'Edge',
            data: [
              ['v16', 2.6],
              ['v15', 0.92],
              ['v14', 0.4],
              ['v13', 0.1],
            ],
          },
          {
            name: 'Opera',
            id: 'Opera',
            data: [
              ['v50.0', 0.96],
              ['v49.0', 0.82],
              ['v12.1', 0.14],
            ],
          },
        ],
      },
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
          name: assetName,
          showInLegend: true,
          data,
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
