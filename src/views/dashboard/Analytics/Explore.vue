<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>Number of asset views</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>Viewer location</h5>
        </div>
        <div class="analytics__types__item__desc">
          See the countries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>Viewer market segment</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item">
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
      <div class="analytics__cards__item">
        <line-graph-card></line-graph-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import LineGraphCard from './LineGraphCard.vue';

@Component({
  components: { CatalogueCard, LineGraphCard },
})
export default class DashboardAnalyticsExplore extends Vue {
}
</script>
<style lang="scss">
</style>
