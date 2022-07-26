<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_TRANSACTIONS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_TRANSACTIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.NUMBER_TRANSACTIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.NUMBER_TRANSACTIONS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.EARNINGS_ASSET"
         :class="{ active: activeTab === EnumAnalyticsSales.EARNINGS_ASSET }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.EARNINGS_ASSET }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.EARNINGS_ASSET_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE"
         :class="{ active: activeTab === EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.MARKET_SEGMENT_SALES_FILE_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS"
         :class="{ active: activeTab === EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.MARKET_SEGMENT_TRANSACTIONS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_SUBSCRIBERS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_SUBSCRIBERS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.NUMBER_SUBSCRIBERS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.NUMBER_SUBSCRIBERS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_API_CALLS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_API_CALLS }">
        <div class="analytics__types__item__upper">
          COMING SOON
          <!--          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />-->
          <h5>{{ EnumAnalyticsSales.NUMBER_API_CALLS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.NUMBER_API_CALLS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.EARNINGS_API"
         :class="{ active: activeTab === EnumAnalyticsSales.EARNINGS_API }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.EARNINGS_API }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.EARNINGS_API_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.SUBSCRIBER_LOCATION"
         :class="{ active: activeTab === EnumAnalyticsSales.SUBSCRIBER_LOCATION }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.SUBSCRIBER_LOCATION }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.SUBSCRIBER_LOCATION_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.SUBSCRIBER_SEGMENTS"
         :class="{ active: activeTab === EnumAnalyticsSales.SUBSCRIBER_SEGMENTS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/pie_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.SUBSCRIBER_SEGMENTS }}s</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.SUBSCRIBER_SEGMENTS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.ASSET_TYPE_EARNINGS"
         :class="{ active: activeTab === EnumAnalyticsSales.ASSET_TYPE_EARNINGS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsSales.ASSET_TYPE_EARNINGS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsSalesDescription.ASSET_TYPE_EARNINGS_DESC }}
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsSales.NUMBER_TRANSACTIONS">
        <sales-line-graph-card
          :card-heading="EnumAnalyticsSales.NUMBER_TRANSACTIONS"
          :card-description="EnumAnalyticsSalesDescription.NUMBER_TRANSACTIONS_DESC"
          :sales-query-metric-type="EnumSalesQueryMetric.COUNT_TRANSACTIONS"
          :symbol="''"
          :symbolTitle="'Number of Transactions'"/>
      </div>
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.EARNINGS_ASSET">
        <sales-line-graph-card
          :card-heading="EnumAnalyticsSales.EARNINGS_ASSET"
          :card-description="EnumAnalyticsSalesDescription.EARNINGS_ASSET_DESC"
          :sales-query-metric-type="EnumSalesQueryMetric.SUM_SALES"
          :symbol="'Sale in €'"
          :symbolTitle="'Earnings'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE">
        <sales-bar-graph-card
          :card-heading="EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE"
          :card-description="EnumAnalyticsSalesDescription.MARKET_SEGMENT_TRANSACTIONS_DESC"
          :sales-query-metric-type="EnumSalesQueryMetric.SUM_SALES"
          :symbol="'€'"
          :symbolTitle="'Sale in €'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS">
        <sales-bar-graph-card
          :card-heading="EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS"
          :card-description="EnumAnalyticsSalesDescription.MARKET_SEGMENT_TRANSACTIONS_DESC"
          :sales-query-metric-type="EnumSalesQueryMetric.COUNT_TRANSACTIONS"
          :symbol="''"
          :symbolTitle="'Transactions'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab ===  EnumAnalyticsSales.NUMBER_SUBSCRIBERS">
        <LineSubscribersApi
          :card-heading="EnumAnalyticsSales.NUMBER_SUBSCRIBERS"
          :card-description="EnumAnalyticsSalesDescription.NUMBER_SUBSCRIBERS_DESC"
          :symbol-title="EnumAnalyticsSales.NUMBER_SUBSCRIBERS"
          :subscribers-query-metric="EnumSubscribersQueryMetric.COUNT_SUBSCRIBERS"
          :symbol="''"
        />
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab ===  EnumAnalyticsSales.NUMBER_API_CALLS">
        <h1>COMING SOON {{ EnumAnalyticsSales.NUMBER_API_CALLS }}</h1>
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.EARNINGS_API">
        <LineSubscribersApi
          :card-heading="EnumAnalyticsSales.EARNINGS_API"
          :card-description="EnumAnalyticsSalesDescription.EARNINGS_API_DESC"
          :subscribers-query-metric="EnumSubscribersQueryMetric.EARNINGS"
          :symbol="'€'"
          :symbol-title="'Earnings in €'"
        />
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab ===  EnumAnalyticsSales.SUBSCRIBER_LOCATION">
        <MapSubscribersApi
          :card-heading="EnumAnalyticsSales.SUBSCRIBER_LOCATION"
          :card-description="EnumAnalyticsSalesDescription.SUBSCRIBER_LOCATION_DESC"
          :symbol-title="EnumAnalyticsSales.SUBSCRIBER_LOCATION"
          :asset-source-enum="EnumSubscribersQueryMetric.SUBSCRIBER_LOCATION"
          :symbol="''"
        />
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsSales.SUBSCRIBER_SEGMENTS">
        <PieSubscribersApi
          :card-heading="EnumAnalyticsSales.SUBSCRIBER_SEGMENTS"
          :card-description="EnumAnalyticsSalesDescription.SUBSCRIBER_SEGMENTS_DESC"
          :asset-source-enum="EnumAssetSource.VIEW"
          :symbol="''"
          :symbolTitle="'Transactions'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab ===  EnumAnalyticsSales.ASSET_TYPE_EARNINGS">
        <LineAssetTypeEarnings
          :card-heading="EnumAnalyticsSales.ASSET_TYPE_EARNINGS"
          :card-description="EnumAnalyticsSalesDescription.ASSET_TYPE_EARNINGS_DESC"
          :enum-asset-type-dimension="EnumAssetTypeDimension.ALL_ASSET_TYPES"
          :enum-sales-query-metric="EnumSalesQueryMetric.SUM_SALES"
          :symbol-title="EnumAnalyticsSales.ASSET_TYPE_EARNINGS"
          :symbol="'€'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import {
  EnumSubscribersQueryMetric,
  EnumAssetTypeDimension,
  EnumSalesQueryMetric,
  EnumAssetSource,
} from '@/model/analytics';
import LineSubscribersApi from '@/views/dashboard/Analytics/sales/LineSubscribersApi.vue';
import MapSubscribersApi from '@/views/dashboard/Analytics/sales/MapSubscribersApi.vue';
import PieSubscribersApi from '@/views/dashboard/Analytics/sales/PieSubscribersApi.vue';
import LineAssetTypeEarnings from '@/views/dashboard/Analytics/sales/LineAssetTypeEarnings.vue';
import SalesBarGraphCard from './SalesBarGraphCard.vue';
import SalesHeatMapGraphCard from './SalesHeatMapGraphCard.vue';
import SalesLineGraphCard from './SalesLineGraphCard.vue';
import PieSubscriberSegments from './PieSubscriberSegments.vue';

enum EnumAnalyticsSales {
  NUMBER_TRANSACTIONS = 'Number of transactions (File Asset)',
  EARNINGS_ASSET = 'Earnings (File Asset)',
  MARKET_SEGMENT_SALES_FILE = 'Market segment sales (File Asset)',
  MARKET_SEGMENT_TRANSACTIONS = 'Market segment transactions (File Asset)',
  NUMBER_SUBSCRIBERS = 'Number of subscribers',
  NUMBER_API_CALLS = 'Number of calls',
  EARNINGS_API = 'Earnings (APIs)',
  SUBSCRIBER_LOCATION = 'Subscriber Location',
  SUBSCRIBER_SEGMENTS = 'Subscriber segments',
  ASSET_TYPE_EARNINGS = 'Asset Type Earnings',
}

enum EnumAnalyticsSalesDescription {
  NUMBER_TRANSACTIONS_DESC = 'Number of purchases for your file assets',
  EARNINGS_ASSET_DESC = 'How much revenue did you earn from file asset sales',
  MARKET_SEGMENT_SALES_FILE_DESC = 'Where are your clients located',
  MARKET_SEGMENT_TRANSACTIONS_DESC = 'What market segments your clients belong too',
  NUMBER_SUBSCRIBERS_DESC = 'How many subcribers your APIs have',
  NUMBER_API_CALLS_DESC = 'How many times your APIs have been invoked',
  EARNINGS_API_DESC = 'How much revenues did you earn from your API subscriptions',
  SUBSCRIBER_LOCATION_DESC = 'Where are your clients located',
  SUBSCRIBER_SEGMENTS_DESC = '',
  ASSET_TYPE_EARNINGS_DESC = 'How much revenue did you earn from file asset sales and API subscriptions',
}

@Component({
  components: {
    CatalogueCard,
    SalesBarGraphCard,
    SalesHeatMapGraphCard,
    SalesLineGraphCard,
    PieSubscriberSegments,
    LineSubscribersApi,
    MapSubscribersApi,
    PieSubscribersApi,
    LineAssetTypeEarnings,
  },
})
export default class Sales extends Vue {
  activeTab: string | null;

  EnumAnalyticsSales: typeof EnumAnalyticsSales;

  EnumSubscribersQueryMetric: typeof EnumSubscribersQueryMetric;

  EnumAssetTypeDimension: typeof EnumAssetTypeDimension;

  EnumSalesQueryMetric: typeof EnumSalesQueryMetric;

  EnumAnalyticsSalesDescription: typeof EnumAnalyticsSalesDescription;

  EnumAssetSource: typeof EnumAssetSource;


  constructor() {
    super();
    this.activeTab = null;
    this.EnumAnalyticsSales = EnumAnalyticsSales;
    this.EnumSubscribersQueryMetric = EnumSubscribersQueryMetric;
    this.EnumAssetTypeDimension = EnumAssetTypeDimension;
    this.EnumSalesQueryMetric = EnumSalesQueryMetric;
    this.EnumAnalyticsSalesDescription = EnumAnalyticsSalesDescription;
    this.EnumAssetSource = EnumAssetSource;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_charts.scss';
</style>
