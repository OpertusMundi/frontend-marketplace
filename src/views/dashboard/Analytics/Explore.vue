<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.ASSET_VIEWS"
         :class="{ active: activeTab === EnumAnalyticsExplore.ASSET_VIEWS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsExplore.ASSET_VIEWS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsExploreDescription.ASSET_VIEWS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.VIEWER_LOCATION"
         :class="{ active: activeTab === EnumAnalyticsExplore.VIEWER_LOCATION }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsExplore.VIEWER_LOCATION }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsExploreDescription.VIEWER_LOCATION_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT"
         :class="{ active: activeTab === EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsExploreDescription.VIEWER_MARKET_SEGMENT_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS"
         :class="{ active: activeTab === EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/pie_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsExploreDescription.SUBSCRIBER_SEGMENTS_DESC }}
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.ASSET_VIEWS">
        <views-line-graph-card
          :asset-source-enum="enumAssetSource.VIEW"
          :card-heading="EnumAnalyticsExplore.ASSET_VIEWS"
          :card-description="EnumAnalyticsExploreDescription.ASSET_VIEWS_DESC"
          :symbol-title="EnumAnalyticsExplore.ASSET_VIEWS"
          :symbol="''"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.VIEWER_LOCATION">
        <views-map-graph-card
          :asset-source-enum="enumAssetSource.VIEW"
          :card-heading="EnumAnalyticsExplore.VIEWER_LOCATION"
          :card-description="EnumAnalyticsExploreDescription.VIEWER_LOCATION_DESC"
          :symbol-title="EnumAnalyticsExplore.VIEWER_LOCATION"
          :symbol="''"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT">
        <views-bar-graph-card
          :card-heading="EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT"
          :card-description="EnumAnalyticsExploreDescription.VIEWER_MARKET_SEGMENT_DESC"
          :asset-query-metric-type="EnumAssetQueryMetric.COUNT"
          :symbol="''"
          :symbol-title="'Views'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS">
        <PieSubscribersApi
          :card-heading="EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS"
          :card-description="EnumAnalyticsExploreDescription.SUBSCRIBER_SEGMENTS_DESC"
          :asset-source-enum="enumAssetSource.VIEW"
          :symbol="''"
          :symbolTitle="'Transactions'"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { EnumAssetSource, EnumAssetQueryMetric } from '@/model/analytics';
import ViewsLineGraphCard from '@/views/dashboard/Analytics/ViewsLineGraphCard.vue';
import ViewsMapGraphCard from '@/views/dashboard/Analytics/ViewsMapGraphCard.vue';
import ViewsBarGraphCard from '@/views/dashboard/Analytics/ViewsBarGraphCard.vue';
import PieSubscribersApi from '@/views/dashboard/Analytics/sales/PieSubscribersApi.vue';

enum EnumAnalyticsExplore {
  ASSET_VIEWS = 'Number of asset views',
  VIEWER_LOCATION = 'Viewer location',
  VIEWER_MARKET_SEGMENT = 'Viewer market segment',
  SUBSCRIBER_SEGMENTS = 'Subscriber segments',
}

enum EnumAnalyticsExploreDescription {
  ASSET_VIEWS_DESC = 'How many times was the asset viewed by visitors',
  VIEWER_LOCATION_DESC = 'Where are the clients of the API asset located',
  VIEWER_MARKET_SEGMENT_DESC = 'What market segment do the viewers of an asset belong to',
  SUBSCRIBER_SEGMENTS_DESC = 'What market segments do the clients of the API asset belong to',
}

@Component({
  components: {
    ViewsLineGraphCard,
    ViewsMapGraphCard,
    ViewsBarGraphCard,
    PieSubscribersApi,
  },
})
export default class Explore extends Vue {
  activeTab: string | null;

  enumAssetSource: typeof EnumAssetSource;

  EnumAnalyticsExplore: typeof EnumAnalyticsExplore;

  EnumAnalyticsExploreDescription: typeof EnumAnalyticsExploreDescription;

  EnumAssetQueryMetric: typeof EnumAssetQueryMetric;

  constructor() {
    super();

    this.activeTab = null;
    this.EnumAnalyticsExplore = EnumAnalyticsExplore;
    this.EnumAnalyticsExploreDescription = EnumAnalyticsExploreDescription;
    this.enumAssetSource = EnumAssetSource;
    this.EnumAssetQueryMetric = EnumAssetQueryMetric;
  }
}
</script>
<style lang="scss">
</style>
