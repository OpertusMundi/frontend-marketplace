<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.ASSET_VIEWS"
         :class="{ active: activeTab === EnumAnalyticsExplore.ASSET_VIEWS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>Number of asset views</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.VIEWER_LOCATION"
         :class="{ active: activeTab === EnumAnalyticsExplore.VIEWER_LOCATION }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>Viewer location</h5>
        </div>
        <div class="analytics__types__item__desc">
          See the countries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT"
         :class="{ active: activeTab === EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>Viewer market segment</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS"
         :class="{ active: activeTab === EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/pie_chart_icon.svg" alt="">
          <h5>Subscriber segments</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.ASSET_VIEWS">
        <views-line-graph-card
          :asset-source-enum="enumAssetSource.VIEW"
          :card-heading="EnumAnalyticsExplore.ASSET_VIEWS"
          :symbol-title="EnumAnalyticsExplore.ASSET_VIEWS"
          :symbol="''" />
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.VIEWER_LOCATION">
        <views-map-graph-card
          :asset-source-enum="enumAssetSource.VIEW"
          :card-heading="EnumAnalyticsExplore.VIEWER_LOCATION"
          :symbol-title="EnumAnalyticsExplore.VIEWER_LOCATION"
          :symbol="''" />
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT">
        <views-bar-graph-card
          :card-heading="EnumAnalyticsExplore.VIEWER_MARKET_SEGMENT"
          :asset-query-metric-type="EnumAssetQueryMetric.COUNT"
          :symbol="''"
          :symbol-title="'Views'" />
      </div>
      <div class="analytics__cards__item"
            v-show="activeTab === EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS">
        <pie-subscriber-segments
        :asset-source-enum="enumAssetSource.VIEW"
        :card-heading="EnumAnalyticsExplore.SUBSCRIBER_SEGMENTS"
        :symbol-title="'Views'"
        :symbol="''"/>
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
import PieSubscriberSegments from '@/views/dashboard/Analytics/PieSubscriberSegments.vue';

enum EnumAnalyticsExplore {
  ASSET_VIEWS = 'Number of asset views',
  VIEWER_LOCATION = 'Viewer location',
  VIEWER_MARKET_SEGMENT = 'Viewer market segment',
  SUBSCRIBER_SEGMENTS = 'Subscriber Segments',
}

@Component({
  components: {
    ViewsLineGraphCard,
    ViewsMapGraphCard,
    ViewsBarGraphCard,
    PieSubscriberSegments,
  },
})
export default class Explore extends Vue {
  activeTab: string | null;

  enumAssetSource: typeof EnumAssetSource;

  EnumAnalyticsExplore: typeof EnumAnalyticsExplore;

  EnumAssetQueryMetric: typeof EnumAssetQueryMetric;

  constructor() {
    super();

    this.activeTab = null;
    this.EnumAnalyticsExplore = EnumAnalyticsExplore;
    this.enumAssetSource = EnumAssetSource;
    this.EnumAssetQueryMetric = EnumAssetQueryMetric;
  }
}
</script>
<style lang="scss">
</style>
