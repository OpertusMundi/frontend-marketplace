<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'asset_views'" :class="{ active: activeTab == 'asset_views' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>Asset Views</h5>
        </div>
        <div class="analytics__types__item__desc">
          Number of Asset Views...
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'search_results'" :class="{ active: activeTab == 'search_results' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="" />
          <h5>Appeared in search results</h5>
        </div>
        <div class="analytics__types__item__desc">
          Appeared in search results...
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab = 'viewer_location'" :class="{ active: activeTab == 'viewer_location' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="" />
          <h5>Viewer location</h5>
        </div>
        <div class="analytics__types__item__desc">
          Viewer location & some other text here...
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item" v-show="activeTab == 'asset_views'">
        <views-line-graph-card :assetSourceEnum="'VIEW'" :cardHeading="'Number of Asset Views'" :symbol="''" :symbolTitle="'Number of Asset Views'"></views-line-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'search_results'">
        <views-line-graph-card :assetSourceEnum="'SEARCH'" :cardHeading="'Appeared in search results'" :symbol="''" :symbolTitle="'Appeared in search results'"></views-line-graph-card>
      </div>
      <div class="analytics__cards__item" v-show="activeTab == 'viewer_location'">
        <views-map-graph-card :assetSourceEnum="'VIEW'" :cardHeading="'Viewer location'" :symbol="''" :symbolTitle="'Viewer location'"></views-map-graph-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import ViewsLineGraphCard from './ViewsLineGraphCard.vue';
import ViewsMapGraphCard from './ViewsMapGraphCard.vue';

@Component({
  components: {
    CatalogueCard,
    ViewsLineGraphCard,
    ViewsMapGraphCard,
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
