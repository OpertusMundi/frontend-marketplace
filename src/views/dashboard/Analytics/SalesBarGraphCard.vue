<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>Sales</h3>
          <a href="#"><img src="@/assets/images/icons/dashboard/download_btn.svg" alt="" /> Download Data</a>
          <p>Keep track of your assets popularity across time and countries.</p>
        </div>
        <div class="graphcard__head__data__right">
          <ul>
            <li><a href="#" @click.prevent="setTemporalUnit('DAY')" :class="{ active: temporalUnit === 'DAY' }">DAY</a></li>
            <li><a href="#" @click.prevent="setTemporalUnit('WEEK')" :class="{ active: temporalUnit === 'WEEK' }">WEEK</a></li>
            <li><a href="#" @click.prevent="setTemporalUnit('MONTH')" :class="{ active: temporalUnit === 'MONTH' }">MONTH</a></li>
            <li><a href="#" @click.prevent="setTemporalUnit('YEAR')" :class="{ active: temporalUnit === 'YEAR' }">YEAR</a></li>
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
          <date-picker v-model="date" @change="dateValueChange(date)" range placeholder="Time period" input-class="input__date_picker">
            <span>antonis</span>
            <i slot="icon-calendar"></i>
            <template v-slot:header="{ emit }">
              <div class="nav_date">
                <button class="nav_date__button" @click="today(emit)">
                  <span class="nav_date__button__text">Today</span>
                </button>
                <button class="nav_date__button" @click="lastWeek(emit)">
                  <span class="nav_date__button__text">Last Week</span>
                </button>
                <button class="nav_date__button" @click="lastMonth(emit)">
                  <span class="nav_date__button__text">Last Month</span>
                </button>
                <button class="nav_date__button" @click="lastThreeMonths(emit)">
                  <span class="nav_date__button__text">Last 3 Months</span>
                </button>
                <button class="nav_date__button" @click="lastSixMonths(emit)">
                  <span class="nav_date__button__text">Last 6 Months</span>
                </button>
                <button class="nav_date__button" @click="lastYear(emit)">
                  <span class="nav_date__button__text">Last Year</span>
                </button>
              </div>
            </template>
          </date-picker>
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
    <table class="data_table" v-if="chartOptions">
      <thead>
        <tr>
          <th></th>
          <th v-for="header in formatTable()" class="data_table__header" :key="header.id">{{ header.name }}</th>
        </tr>
      </thead>

      <tbody>
        <tr class="data_table__data" v-for="data in formatSeries()" :key="data.name">
          {{
            data.name
          }}
          <td class="data_table__data" v-for="value in data.data" :key="value.id">{{ value }}</td>
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
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from 'moment';

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    DatePicker,
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  @Prop({ default: null }) private salesQueryMetricType!: EnumSalesQueryMetric;

  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  selectedAssets: AssetDraft[];

  analyticsApi: AnalyticsApi;

  segments: DataSeries;

  assetsQuery: string[] | null;

  chartOptions: any | null;

  date: any;

  momentFormat: any;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  tableData: any;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.selectedAssets = [];

    this.analyticsApi = new AnalyticsApi();

    this.segments = {} as DataSeries;

    this.chartOptions = null;

    this.assetsQuery = [];

    this.date = null;

    this.temporalUnitMin = '';

    this.temporalUnitMax = '';

    this.temporalUnit = EnumTemporalUnit.YEAR;

    this.tableData = [];

    this.momentFormat = {
      // [optional] Date to String
      stringify: (date) => (date ? moment(date).format('LL') : ''),
      // [optional]  String to Date
      parse: (value) => (value ? moment(value, 'LL').toDate() : null),
      // [optional] getWeekNumber
      getWeek: (date) => {
        // a number
      },
    };
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    console.log(EnumTemporalUnit);
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const segmentQuery: SalesQuery = {
      segments: {
        enabled: true,
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
        this.segments = response.result!;
        this.chartOptions = this.getOptions();
        this.formatSeries();
        this.formatTable();
        console.log(this.formatSeries());
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
        console.log(this.assets);
      } else {
        console.log('error', resp.data);
      }
    });
  }

  getOptions(): any {
    if (!this.segments) {
      return null;
    }
    // const name = 'Sales per segment';
    return {
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
        categories: [...new Map(this.segments.points.map((item) => [item.segment, item])).values()].map((a) => a.segment),
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
          text: 'Sales in €',
        },
      },
      tooltip: {
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'transparent',
        valueSuffix: '€',
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '13px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          console.log(point);
          return `${point.y}€ <br>${point.category}`;
        },
      },
      series: this.formatSeries(),
    };
  }

  formatSeries(): any[] {
    const series: Array<any> = [];
    const assetsName: any = [...new Map(this.segments.points.map((item) => [item.asset, item])).values()].map((a) => a.asset);
    assetsName.forEach((assetName) => {
      const assetObj = {
        name: assetName,
        showInLegend: true,
        data: this.segments?.points.filter((item) => item?.asset === assetName).map((a) => a.value),
      };
      series.push(assetObj);
    });
    return series;
  }

  formatTable(): any[] {
    const segments: Array<any> = [];
    const segmentsName: any = [...new Map(this.segments.points.map((item) => [item.segment, item])).values()].map((a) => a.segment);
    segmentsName.forEach((segmentName) => {
      const segObj = {
        name: segmentName,
        data: this.segments?.points.filter((item) => item?.segment === segmentName).map((a) => a.value),
      };
      segments.push(segObj);
    });
    return segments;
  }

  setTemporalUnit(value: EnumTemporalUnit): void {
    this.temporalUnit = value;
    if (this.assetsQuery?.length) {
      this.getAnalytics();
    }
  }

  dateValueChange(value: string | any[]): void {
    this.temporalUnitMin = moment(value[0]).format('YYYY-MM-DD');
    this.temporalUnitMax = moment(value[1]).format('YYYY-MM-DD');
    console.log(this.temporalUnitMin, this.temporalUnitMax);
    if (value.length > 0) {
      this.getAnalytics();
    }
  }

  today(emit: (arg0: Date[]) => void): void {
    const start = moment().toDate();
    const end = moment().toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment().format('YYYY-MM-DD');
    this.temporalUnitMax = moment().format('YYYY-MM-DD');
  }

  lastWeek(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(1, 'weeks')
      .startOf('week')
      .toDate();
    const end = moment()
      .subtract(1, 'weeks')
      .endOf('week')
      .toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment()
      .subtract(1, 'weeks')
      .startOf('week')
      .format('YYYY-MM-DD');
    this.temporalUnitMax = moment()
      .subtract(1, 'weeks')
      .endOf('week')
      .format('YYYY-MM-DD');
  }

  lastMonth(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(1, 'months')
      .startOf('month')
      .toDate();
    const end = moment()
      .subtract(1, 'months')
      .endOf('month')
      .toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    this.temporalUnitMax = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
  }

  lastThreeMonths(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(3, 'months')
      .startOf('month')
      .toDate();
    const end = moment()
      .subtract(1, 'months')
      .endOf('month')
      .toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment()
      .subtract(3, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    this.temporalUnitMax = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
  }

  lastSixMonths(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(6, 'months')
      .startOf('month')
      .toDate();
    const end = moment()
      .subtract(1, 'months')
      .endOf('month')
      .toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment()
      .subtract(6, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    this.temporalUnitMax = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
  }

  lastYear(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(12, 'months')
      .startOf('month')
      .toDate();
    const end = moment()
      .subtract(1, 'months')
      .endOf('month')
      .toDate();
    const date = [start, end];
    emit(date);
    this.temporalUnitMin = moment()
      .subtract(12, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    this.temporalUnitMax = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_linegraph.scss';
@import '@/assets/styles/graphs/_date-picker.scss';
@import '@/assets/styles/graphs/_table.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
