<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsAssets.ASSET_VIEWS"
         :class="{ active: activeTab === EnumAnalyticsAssets.ASSET_VIEWS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsAssets.ASSET_VIEWS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsAssetsDescription.ASSET_VIEWS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsAssets.APPEARED_SEARCH_RESULTS"
         :class="{ active: activeTab === EnumAnalyticsAssets.APPEARED_SEARCH_RESULTS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsAssets.APPEARED_SEARCH_RESULTS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsAssetsDescription.APPEARED_SEARCH_RESULTS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsAssets.VIEWER_LOCATION"
         :class="{ active: activeTab === EnumAnalyticsAssets.VIEWER_LOCATION }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt=""/>
          <h5>{{ EnumAnalyticsAssets.VIEWER_LOCATION }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsAssetsDescription.VIEWER_LOCATION_DESC }}
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsAssets.ASSET_VIEWS">
        <views-line-graph-card
          :asset-source-enum="EnumAssetSource.VIEW"
          :card-heading="EnumAnalyticsAssets.ASSET_VIEWS"
          :card-description="EnumAnalyticsAssetsDescription.ASSET_VIEWS_DESC"
          :symbol="''"
          :symbolTitle="'Number of Asset Views'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsAssets.APPEARED_SEARCH_RESULTS">
        <views-line-graph-card
          :asset-source-enum="EnumAssetSource.SEARCH"
          :card-heading="EnumAnalyticsAssets.APPEARED_SEARCH_RESULTS"
          :card-description="EnumAnalyticsAssetsDescription.APPEARED_SEARCH_RESULTS_DESC"
          :symbol="''"
          :symbolTitle="'Appeared in search results'"/>
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsAssets.VIEWER_LOCATION">
        <views-map-graph-card
          :assetSourceEnum="EnumAssetSource.VIEW"
          :card-heading="EnumAnalyticsAssets.VIEWER_LOCATION"
          :card-description="EnumAnalyticsAssetsDescription.VIEWER_LOCATION_DESC"
          :symbol="''"
          :symbolTitle="'Viewer location'"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import { EnumAssetSource } from '@/model/analytics';
import ViewsLineGraphCard from './ViewsLineGraphCard.vue';
import ViewsMapGraphCard from './ViewsMapGraphCard.vue';

enum EnumAnalyticsAssets {
  ASSET_VIEWS = 'Number of Asset Views',
  APPEARED_SEARCH_RESULTS = 'Appeared in search results',
  VIEWER_LOCATION = 'Viewer location',
}

enum EnumAnalyticsAssetsDescription {
  ASSET_VIEWS_DESC = 'How many times was the asset viewed by visitors',
  APPEARED_SEARCH_RESULTS_DESC = 'How many times did the asset appear in search results',
  VIEWER_LOCATION_DESC = 'Where are the viewers of an asset located',
}

@Component({
  components: {
    CatalogueCard,
    ViewsLineGraphCard,
    ViewsMapGraphCard,
  },
})
export default class Assets extends Vue {
  activeTab: string | null;

  EnumAnalyticsAssets: typeof EnumAnalyticsAssets;

  EnumAnalyticsAssetsDescription: typeof EnumAnalyticsAssetsDescription;

  EnumAssetSource: typeof EnumAssetSource;

  constructor() {
    super();
    this.activeTab = null;
    this.EnumAnalyticsAssets = EnumAnalyticsAssets;
    this.EnumAnalyticsAssetsDescription = EnumAnalyticsAssetsDescription;
    this.EnumAssetSource = EnumAssetSource;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_charts.scss';
</style>
