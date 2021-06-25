<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item" @click.prevent="activeTab='heatmap'" :class="{ active: activeTab == 'heatmap' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>Viewer location</h5>
        </div>
        <div class="analytics__types__item__desc">
          See the countries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab='bars'" :class="{ active: activeTab == 'bars' }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>Viewer market segment</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item" @click.prevent="activeTab='segments'" :class="{ active: activeTab == 'segments' }">
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
      <div class="analytics__cards__item" v-if="activeTab == 'heatmap'">
        <sales-heat-map-graph-card></sales-heat-map-graph-card>
      </div>
      <div class="analytics__cards__item" v-if="activeTab == 'bars'">
        <sales-bar-graph-card></sales-bar-graph-card>
      </div>
      <div class="analytics__cards__item" v-if="activeTab == 'segments'">
        segments
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import SalesBarGraphCard from './SalesBarGraphCard.vue';
import SalesHeatMapGraphCard from './SalesHeatMapGraphCard.vue';

@Component({
  components: { CatalogueCard, SalesBarGraphCard, SalesHeatMapGraphCard },
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
</style>
