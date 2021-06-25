<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>Sales</h3>
          <a href="#"><img src="@/assets/images/icons/dashboard/download_btn.svg" alt=""> Download Data</a>
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
          <multiselect
            v-model="selectedAssets[0]"
            :options="assets"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            label="title"
            placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect
            v-model="selectedAssets[1]"
            :options="assets"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            label="title"
            placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect
            v-model="selectedAssets[3]"
            :options="assets"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            label="title"
            placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
        </div>
        <div class="graphcard__head__filters__time"></div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
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

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCard,
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  selectedAssets: AssetDraft[];

  analyticsApi: AnalyticsApi;

  segments: DataSeries;

  assetsQuery: string[] | null;

  chartOptions: any | null;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.selectedAssets = [];

    this.analyticsApi = new AnalyticsApi();

    this.segments = {} as DataSeries;

    this.chartOptions = null;

    this.assetsQuery = [];
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
      metric: EnumSalesQueryMetric.SUM_SALES,
    };

    this.analyticsApi.executeSalesQuery(segmentQuery)
      .then((response) => {
        if (response.success) {
          // eslint-disable-next-line
          response.result!.points.reverse();
          // eslint-disable-next-line
          this.segments = response.result!;
          this.chartOptions = this.getOptions();
        }
      });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: Array<any>):void {
    // this.assetsQuery = newVal.map((a) => a.key); //TODO: get the PID of asset
    this.assetsQuery = ['topio.the-company.1.VECTOR', 'topio.the-company.2.VECTOR', 'topio.the-company.3.VECTOR'];
    this.getAnalytics();
  }

  async getAssets():Promise<any> {
    const query = {
      status: [
        EnumDraftStatus.PUBLISHED,
        EnumDraftStatus.DRAFT,
        EnumDraftStatus.SUBMITTED,
        EnumDraftStatus.PENDING_HELPDESK_REVIEW,
        EnumDraftStatus.HELPDESK_REJECTED,
        EnumDraftStatus.PENDING_PROVIDER_REVIEW,
        EnumDraftStatus.PROVIDER_REJECTED,
        EnumDraftStatus.POST_PROCESSING,
      ],
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

  getOptions():any {
    if (!this.segments) {
      return null;
    }
    const name = 'Sales per segment';

    return {
      credits: { enabled: false },
      title: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        // formatter: (params: any) => {
        //   return useIntl().formatNumber(
        //     Array.isArray(params) ? params[0].value : params.value,
        //     { currency: 'EUR', style: 'currency', currencyDisplay: 'symbol' }
        //   );
        // },
      },
      legend: {
        data: [name],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (value < 1000) {
              return value;
            }
            if (value < 1000000) {
              return `${value / 1000} K`;
            }
            return `${value / 1000000} M`;
          },
        },
      },
      yAxis: {
        type: 'category',
        data: this.segments.points.map((p) => p.segment),
      },
      series: [{
        name,
        type: 'bar',
        data: this.segments.points.map((p) => p.value),
      }],
    };
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/graphs/_graphcard.scss";
  @import "@/assets/styles/graphs/_linegraph.scss";
  .multiselect__option--highlight {
    background: none!important;
  }
</style>
