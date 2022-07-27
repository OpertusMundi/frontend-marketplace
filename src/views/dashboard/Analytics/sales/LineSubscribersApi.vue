<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <p>Keep track of your assets popularity across time and countries.</p>
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
        <th v-for="(name, index) in timePoints" class="data_table__header" :key="`segment_name_${index}`">{{ formatDate(name) }}</th>
      </tr>
      </thead>
      <tbody>
      <tr class="data_table__row" v-for="data in seriesData" :key="data.id">
        <td class="data_table__data">{{ data.name }}</td>
        <td class="data_table__data" v-for="value in data.data" :key="value.id">{{ formatValue(value) }}</td>
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
import DraftAssetApi from '@/service/draft';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCard from '@/components/Assets/AssetMiniCard.vue';
import AnalyticsApi from '@/service/analytics';
import {
  DataSeries, EnumSubscribersQueryMetric, EnumTemporalUnit, SubscribersQuery,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import moment from 'moment';

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
    AssetMiniCard,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class LineSubscribersApi extends Vue {
  @Prop({ default: EnumSubscribersQueryMetric.COUNT_SUBSCRIBERS })
  private subscribersQueryMetric!: EnumSubscribersQueryMetric;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  selectedAssets: AssetDraft[];

  analyticsApi: AnalyticsApi;

  analyticsData: DataSeries;

  assetsQuery: string[];

  timePoints: TimeResponse[];

  chartOptions: any | null;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  seriesData: any;

  lineChartDate: any;

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

    this.timePoints = [];

    this.temporalUnitMin = '';

    this.temporalUnitMax = '';

    this.temporalUnit = EnumTemporalUnit.DAY;

    this.seriesData = [];

    this.lineChartDate = [];
    this.EnumTemporalUnit = EnumTemporalUnit;
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>): void {
    console.log(newVal);
    this.assetsQuery = newVal.filter((el) => el).map((a) => a.assetPublished);
    this.getAnalytics();
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const subscribersQuery: SubscribersQuery = {
      segments: {
        enabled: false,
      },
      assets: this.assetsQuery,
      metric: this.subscribersQueryMetric,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };
    console.log('subscribersQuery: ', subscribersQuery);
    this.analyticsApi.executeSubscribersQuery(subscribersQuery).then((response) => {
      if (response.success) {
        console.log('response subscribers => ', response);
        this.analyticsData = response.result;
        this.timePoints = this.getTimeResponse();
        this.lineChartDate = this.formatTheDate();
        this.seriesData = this.formatSeries();
        this.chartOptions = this.getOptions();
      }
    });
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
      series: this.seriesData,
    };
  }

  getTimeResponse(): Array<any> {
    return [...new Map(this.analyticsData.points.map((item) => [JSON.stringify(item.time), item])).values()].map((a) => a.time)
      .reverse();
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
        const assetTitle = this.assets.find(({ assetPublished }) => assetPublished === assetName);
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
        const assetTitle = this.assets.find(({ assetPublished }) => assetPublished === assetName);
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
@import '@/assets/styles/graphs/_table.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
