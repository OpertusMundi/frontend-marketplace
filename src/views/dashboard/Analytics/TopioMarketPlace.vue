<template>
  <div class="analytics__group">
    <div class="analytics__types">
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          See the countries your assets are most popular at.
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.TOP_SEARCH_TERMS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.TOP_SEARCH_TERMS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/lines_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.TOP_SEARCH_TERMS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.MARKETPLACE_VISITORS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VISITORS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.MARKETPLACE_VISITORS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.MARKETPLACE_VENDORS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VENDORS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.MARKETPLACE_VENDORS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.SUBSCRIBERS_API"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.SUBSCRIBERS_API }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.SUBSCRIBERS_API }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.NUMBER_OF_ASSETS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.NUMBER_OF_ASSETS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.NUMBER_OF_ASSETS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.VALUE_FILE_ASSETS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.VALUE_FILE_ASSETS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/line_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.VALUE_FILE_ASSETS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.VIEWER_LOCATIONS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.VIEWER_LOCATIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.VIEWER_LOCATIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.PURCHASES_LOCATIONS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>{{ EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          Some text...
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS">
        {{ EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED">
        {{ EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.TOP_SEARCH_TERMS">
        {{ EnumAnalyticsMarketplace.TOP_SEARCH_TERMS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VISITORS">
        {{ EnumAnalyticsMarketplace.MARKETPLACE_VISITORS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VENDORS">
        {{ EnumAnalyticsMarketplace.MARKETPLACE_VENDORS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS">
        {{ EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.SUBSCRIBERS_API">
        {{ EnumAnalyticsMarketplace.SUBSCRIBERS_API }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.NUMBER_OF_ASSETS">
        {{ EnumAnalyticsMarketplace.NUMBER_OF_ASSETS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.VALUE_FILE_ASSETS">
        {{ EnumAnalyticsMarketplace.VALUE_FILE_ASSETS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS">
        {{ EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.VIEWER_LOCATIONS">
        {{ EnumAnalyticsMarketplace.VIEWER_LOCATIONS }}
      </div>
      <div class="analytics__cards__item"
           v-show="activeTab === EnumAnalyticsMarketplace.PURCHASES_LOCATIONS">
        {{ EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ViewsLineGraphCard from '@/views/dashboard/Analytics/ViewsLineGraphCard.vue';
import ViewsMapGraphCard from '@/views/dashboard/Analytics/ViewsMapGraphCard.vue';
import ViewsBarGraphCard from '@/views/dashboard/Analytics/ViewsBarGraphCard.vue';
import PieSubscriberSegments from '@/views/dashboard/Analytics/PieSubscriberSegments.vue';

enum EnumAnalyticsMarketplace {
  TOP_VIEWED_ASSETS = 'Top viewed assets',
  TOP_ASSETS_APPEARED = 'Top assets appeared in search results',
  TOP_SEARCH_TERMS = 'Top searched terms',
  MARKETPLACE_VISITORS = 'Marketplace visitors (Google Analytics)',
  MARKETPLACE_VENDORS = 'Marketplace vendors',
  MARKETPLACE_TRANSACTIONS = 'Marketplace transactions',
  SUBSCRIBERS_API = 'Subscribers to Topio APIs',
  NUMBER_OF_ASSETS = 'Number of assets',
  VALUE_FILE_ASSETS = 'Value of file assets',
  COVERAGE_FILE_ASSETS = 'Coverage of file assets',
  VIEWER_LOCATIONS = 'Viewer locations',
  PURCHASES_LOCATIONS = 'Purchases locations'
}

@Component({
  components: {
    ViewsLineGraphCard,
    ViewsMapGraphCard,
    ViewsBarGraphCard,
    PieSubscriberSegments,
  },
})
export default class TopioMarketPlace extends Vue {
  activeTab: string | null;

  EnumAnalyticsMarketplace: typeof EnumAnalyticsMarketplace;

  constructor() {
    super();

    this.activeTab = null;
    this.EnumAnalyticsMarketplace = EnumAnalyticsMarketplace;
  }
}
</script>
<style lang="scss">
</style>
