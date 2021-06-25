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
        <div class="graphcard__head__filters__time">TIME</div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
export default class SalesHeatMapGraphCard extends Vue {
  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  asset1: AssetDraft;

  asset2: AssetDraft;

  asset3: AssetDraft;

  analyticsApi: AnalyticsApi;

  features: GeoJSON.FeatureCollection | null;

  chartOptions: any | null;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.asset1 = {} as AssetDraft;

    this.asset2 = {} as AssetDraft;

    this.asset3 = {} as AssetDraft;

    this.analyticsApi = new AnalyticsApi();

    this.features = null;

    this.chartOptions = null;
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    await this.getAnalytics();
  }

  getAnalytics(): void {
    const areaQuery: SalesQuery = {
      areas: {
        enabled: true,
      },
      metric: EnumSalesQueryMetric.SUM_SALES,
    };

    this.analyticsApi.executeSalesQuery(areaQuery)
      .then((response) => {
        if (response.success) {
          // eslint-disable-next-line
          const features = this.analyticsApi.toFeatureCollections(response.result!);

          // Get min/max values
          let min = Number.MAX_SAFE_INTEGER;
          let max = 0;
          features.features.forEach((f) => {
            // eslint-disable-next-line
            const value = f.properties.value;
            min = value < min ? value : min;
            max = value > max ? value : max;
          });
          // Normalize values to range [0,1]
          features.features.forEach((f) => {
            // eslint-disable-next-line
            const value = f.properties.value;
            // eslint-disable-next-line
            f.properties.value = (value - min) / (max - min);
          });
          this.features = features;
          this.chartOptions = this.getOptions();
        }
      });
  }

  getOptions():any {
    if (!this.features) {
      return null;
    }
    const name = 'Sales per segment';

    return {
      chart: {
        map: this.features,
      },
      credits: { enabled: false },
      title: {
        show: false,
      },
    };
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
      } else {
        console.log('error', resp.data);
      }
    });
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
