<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>Number of asset views</h3>
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
          <multiselect v-model="asset1" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="asset2" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
          <multiselect v-model="asset3" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <asset-mini-card :asset="props.option"></asset-mini-card>
            </template>
          </multiselect>
        </div>
        <div class="graphcard__head__filters__time"></div>
      </div>
    </div>
    linegraph..
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

@Component({
  components: { AssetSelector, Multiselect, AssetMiniCard },
})
export default class DashboardAnalyticsGraphCard extends Vue {
  draftAssetApi: DraftAssetApi;

  assets: AssetDraft[];

  asset1: AssetDraft;

  asset2: AssetDraft;

  asset3: AssetDraft;

  analyticsApi: AnalyticsApi;

  segments: DataSeries;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.asset1 = {} as AssetDraft;

    this.asset2 = {} as AssetDraft;

    this.asset3 = {} as AssetDraft;

    this.analyticsApi = new AnalyticsApi();

    this.segments = {} as DataSeries;
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    this.getAnalytics();
  }

  getAnalytics(): void {
    // executeAssetQuery
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
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
