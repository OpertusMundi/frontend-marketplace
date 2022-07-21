<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_TRANSACTIONS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_TRANSACTIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.NUMBER_TRANSACTIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Day, week, month, EU country
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.EARNINGS_ASSET"
         :class="{ active: activeTab === EnumAnalyticsSales.EARNINGS_ASSET }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.EARNINGS_ASSET }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Description goes here...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE"
         :class="{ active: activeTab === EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Find out the market industries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS"
         :class="{ active: activeTab === EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_SUBSCRIBERS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_SUBSCRIBERS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{  EnumAnalyticsSales.NUMBER_SUBSCRIBERS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.NUMBER_API_CALLS"
         :class="{ active: activeTab === EnumAnalyticsSales.NUMBER_API_CALLS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{  EnumAnalyticsSales.NUMBER_API_CALLS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.EARNINGS_API"
         :class="{ active: activeTab === EnumAnalyticsSales.EARNINGS_API }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{  EnumAnalyticsSales.EARNINGS_API }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.SUBSCRIBER_LOCATION"
         :class="{ active: activeTab === EnumAnalyticsSales.SUBSCRIBER_LOCATION }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="" />
          <h5>{{  EnumAnalyticsSales.SUBSCRIBER_LOCATION }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.SUBSCRIBER_SEGMENTS"
         :class="{ active: activeTab === EnumAnalyticsSales.SUBSCRIBER_SEGMENTS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/pie_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.SUBSCRIBER_SEGMENTS }}s</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsSales.ASSET_TYPE_EARNINGS"
         :class="{ active: activeTab === EnumAnalyticsSales.ASSET_TYPE_EARNINGS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>{{ EnumAnalyticsSales.ASSET_TYPE_EARNINGS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.NUMBER_TRANSACTIONS">
        <sales-line-graph-card
          :cardHeading="'Number of Transactions'"
          :salesQueryMetricType="'COUNT_TRANSACTIONS'"
          :symbol="''"
          :symbolTitle="'Number of Transactions'" />
      </div>
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.EARNINGS_ASSET">
        <sales-line-graph-card
          :cardHeading="'Earnings'"
          :salesQueryMetricType="'SUM_SALES'"
          :symbol="'Sale in €'"
          :symbolTitle="'Earnings'" />
      </div>
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.MARKET_SEGMENT_SALES_FILE">
        <sales-bar-graph-card
          :cardHeading="'Market Segment Sales'"
          :salesQueryMetricType="'SUM_SALES'"
          :symbol="'€'"
          :symbolTitle="'Sale in €'" />
      </div>
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.MARKET_SEGMENT_TRANSACTIONS">
        <sales-bar-graph-card
          :cardHeading="'Market Segment Transactions'"
          :salesQueryMetricType="'COUNT_TRANSACTIONS'"
          :symbol="''"
          :symbolTitle="'Transactions'" />
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.NUMBER_SUBSCRIBERS">
       <h1>{{  EnumAnalyticsSales.NUMBER_SUBSCRIBERS }}</h1>
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.NUMBER_API_CALLS">
        <h1>{{  EnumAnalyticsSales.NUMBER_API_CALLS }}</h1>
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.EARNINGS_API">
        <h1>{{  EnumAnalyticsSales.EARNINGS_API }}</h1>
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.SUBSCRIBER_LOCATION">
        <h1>{{  EnumAnalyticsSales.SUBSCRIBER_LOCATION }}</h1>
      </div>
      <div class="analytics__cards__item" v-show="activeTab === EnumAnalyticsSales.SUBSCRIBER_SEGMENTS">
        <pie-subscriber-segments
          :cardHeading="EnumAnalyticsSales.SUBSCRIBER_SEGMENTS"
          :assetSourceEnum="'VIEW'"
          :symbol="''"
          :symbolTitle="'Transactions'" />
      </div>
      <div class="analytics__cards__item" v-show="activeTab ===  EnumAnalyticsSales.ASSET_TYPE_EARNINGS">
        <h1>{{  EnumAnalyticsSales.ASSET_TYPE_EARNINGS }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
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

@Component({
  components: {
    CatalogueCard,
    SalesBarGraphCard,
    SalesHeatMapGraphCard,
    SalesLineGraphCard,
    PieSubscriberSegments,
  },
})
export default class Sales extends Vue {
  activeTab: string | null;

  EnumAnalyticsSales: typeof EnumAnalyticsSales;

  constructor() {
    super();

    this.activeTab = null;
    this.EnumAnalyticsSales = EnumAnalyticsSales;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_charts.scss';
</style>
