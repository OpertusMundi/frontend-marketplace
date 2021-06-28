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
            <li><a href="#">DAY</a></li>
            <li><a href="#">WEEK</a></li>
            <li><a href="#">MONTH</a></li>
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
          <date-picker v-model="date" range placeholder="Time period" input-class="input__date_picker" :formatter="momentFormat">
            <span>antonis</span>
            <i slot="icon-calendar"></i>
            <template v-slot:header="{ emit }">
              <div class="nav_date">
                <button class="nav_date__button" @click="emit(new Date())">
                  <span class="nav_date__button__text">Today</span>
                </button>
                <button class="nav_date__button" @click="lastWeek(emit)">
                  <span class="nav_date__button__text">Last Week</span>
                </button>
                <button class="nav_date__button" @click="selectNextThreeDay(emit)">
                  <span class="nav_date__button__text">Last Month</span>
                </button>
                <button class="nav_date__button" @click="selectNextThreeDay(emit)">
                  <span class="nav_date__button__text">Last 3 Months</span>
                </button>
                <button class="nav_date__button" @click="selectNextThreeDay(emit)">
                  <span class="nav_date__button__text">Last 6 Months</span>
                </button>
                <button class="nav_date__button" @click="selectNextThreeDay(emit)">
                  <span class="nav_date__button__text">Last Year</span>
                </button>
              </div>
            </template>
          </date-picker>
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
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
import { EnumSalesQueryMetric, SalesQuery, DataSeries } from '@/model/analytics';
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
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const segmentQuery: SalesQuery = {
      segments: {
        enabled: true,
      },
      assets: this.assetsQuery,
      metric: this.salesQueryMetricType,
    };

    this.analyticsApi.executeSalesQuery(segmentQuery).then((response) => {
      if (response.success) {
        // eslint-disable-next-line
        response.result!.points.reverse();
        // eslint-disable-next-line
        this.segments = response.result!;
        this.chartOptions = this.getOptions();
        this.formatSeries();
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
    const name = 'Sales per segment';
    return {
      chart: {
        type: 'column',
      },
      showInLegend: true,
      colors: ['#190AFF', '#358F8B', '#A843B5'],
      title: {
        text: '',
      },
      xAxis: {
        categories: [...new Map(this.segments.points.map((item) => [item.segment, item])).values()].map((a) => a.segment),
        crosshair: { color: '#fff' },
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
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: this.formatSeries(),
    };
  }

  formatSeries() {
    const series: Array<any> = [];
    const assetsName: any = [...new Map(this.segments.points.map((item) => [item.asset, item])).values()].map((a) => a.asset);
    assetsName.forEach((assetName) => {
      const assetObj = {
        name: assetName,
        showInLegend: true,
        borderRadius: 6,
        borderWidth: 5,
        data: this.segments?.points.filter((item) => item?.asset === assetName).map((a) => a.value),
      };
      series.push(assetObj);
    });
    return series;
  }

  lastWeek(emit) {
    const start = new Date();
    const end = new Date();
    end.setTime(end.getTime() + 7 * 24 * 3600 * 1000);
    const date = [start, end];
    emit(date);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_linegraph.scss';
@import '@/assets/styles/graphs/_date-picker.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
