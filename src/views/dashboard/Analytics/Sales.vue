<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'line_transactions'" :class="{ active: activeTab == 'line_transactions' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>Number of transactions</h5>
        </div>
        <div class="analytics__types__item__desc">
          Day, week, month, EU country
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'line_earnings'" :class="{ active: activeTab == 'line_earnings' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="" />
          <h5>Earnings</h5>
        </div>
        <div class="analytics__types__item__desc">
          Description goes here...
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'bars_sales'" :class="{ active: activeTab == 'bars_sales' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>Market segment sales</h5>
        </div>
        <div class="analytics__types__item__desc">
          Find out the market industries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'bars_transaction'" :class="{ active: activeTab == 'bars_transaction' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>Market segment transactions</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'segments'" :class="{ active: activeTab == 'segments' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/pie_chart_icon.svg" alt="" />
          <h5>Subscriber segments</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
    </div>

    <div class="analytics__cards">
      <div class="analytics__cards__item" v-show="activeTab == 'heatmap'">
        <sales-heat-map-graph-card></sales-heat-map-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'line_transactions'">
        <sales-line-graph-card :cardHeading="'Number of Transactions'" :salesQueryMetricType="'COUNT_TRANSACTIONS'" :symbol="''" :symbolTitle="'Number of Transactions'"></sales-line-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'line_earnings'">
        <sales-line-graph-card :cardHeading="'Earnings'" :salesQueryMetricType="'SUM_SALES'" :symbol="'Sale in €'" :symbolTitle="'Earnings'"></sales-line-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'bars_sales'">
        <sales-bar-graph-card :cardHeading="'Market Segment Sales'" :salesQueryMetricType="'SUM_SALES'" :symbol="'€'" :symbolTitle="'Sale in €'"></sales-bar-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'bars_transaction'">
        <sales-bar-graph-card :cardHeading="'Market Segment Transactions'" :salesQueryMetricType="'COUNT_TRANSACTIONS'" :symbol="''" :symbolTitle="'Transactions'"></sales-bar-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'segments'">
        <pie-subscriber-segments :cardHeading="'Subscriber Segments'" :assetSourceEnum="'VIEW'" :symbol="''" :symbolTitle="'Transactions'"></pie-subscriber-segments>
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

@Component({
  components: {
    CatalogueCard,
    SalesBarGraphCard,
    SalesHeatMapGraphCard,
    SalesLineGraphCard,
    PieSubscriberSegments,
  },
})
export default class DashboardAnalyticsExplore extends Vue {
  activeTab: string | null;

  constructor() {
    super();

    this.activeTab = null;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_charts.scss';
</style>
