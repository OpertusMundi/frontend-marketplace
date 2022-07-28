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
          {{ EnumAnalyticsMarketplaceDescription.TOP_VIEWED_ASSETS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.TOP_ASSETS_APPEARED_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.TOP_SEARCH_TERMS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.MARKETPLACE_VISITORS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.MARKETPLACE_VENDORS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.MARKETPLACE_TRANSACTIONS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.SUBSCRIBERS_API_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.NUMBER_OF_ASSETS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.VALUE_FILE_ASSETS_DESC }}
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
          {{ EnumAnalyticsMarketplaceDescription.COVERAGE_FILE_ASSETS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.VIEWER_LOCATIONS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.VIEWER_LOCATIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>COMMING SOON: {{ EnumAnalyticsMarketplace.VIEWER_LOCATIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsMarketplaceDescription.VIEWER_LOCATIONS_DESC }}
        </div>
      </a>
      <a href="#" class="analytics__types__item"
         @click.prevent="activeTab = EnumAnalyticsMarketplace.PURCHASES_LOCATIONS"
         :class="{ active: activeTab === EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }">
        <div class="analytics__types__item__upper">
          <img src="@/assets/images/icons/dashboard/map_chart_icon.svg" alt="">
          <h5>COMMING SOON: {{ EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }}</h5>
        </div>
        <div class="analytics__types__item__desc">
          {{ EnumAnalyticsMarketplaceDescription.PURCHASES_LOCATIONS_DESC }}
        </div>
      </a>
    </div>
    <div class="analytics__cards">
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS">
        <BarPopularAssets
          :card-heading="EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS"
          :card-description="EnumAnalyticsMarketplaceDescription.TOP_VIEWED_ASSETS_DESC"
          :enum-asset-source="EnumAssetSource.VIEW"
          :symbol="''"
          :symbol-title="EnumAnalyticsMarketplace.TOP_VIEWED_ASSETS"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED">
        <BarPopularAssets
          :card-heading="EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED"
          :card-description="EnumAnalyticsMarketplaceDescription.TOP_ASSETS_APPEARED_DESC"
          :enum-asset-source="EnumAssetSource.SEARCH"
          :symbol="''"
          :symbol-title="EnumAnalyticsMarketplace.TOP_ASSETS_APPEARED"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.TOP_SEARCH_TERMS">
        <BarPopularTerms
          :card-heading="EnumAnalyticsMarketplace.TOP_SEARCH_TERMS"
          :card-description="EnumAnalyticsMarketplaceDescription.TOP_SEARCH_TERMS_DESC"
          :enum-asset-source="EnumAssetSource.VIEW"
          :symbol-title="EnumAnalyticsMarketplace.TOP_SEARCH_TERMS"
          :symbol="''"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VISITORS">
        <LineGoogleAnalytics
          :card-heading="EnumAnalyticsMarketplace.MARKETPLACE_VISITORS"
          :card-description="EnumAnalyticsMarketplaceDescription.MARKETPLACE_VISITORS_DESC"
          :enum-google-analytics-metric="EnumGoogleAnalyticsMetric.COUNT_USERS"
          :symbol="''"
          :symbol-title="EnumAnalyticsMarketplace.MARKETPLACE_VISITORS"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_VENDORS">
        <LineVendorsCount
          :card-heading="EnumAnalyticsMarketplace.MARKETPLACE_VENDORS"
          :card-description="EnumAnalyticsMarketplaceDescription.MARKETPLACE_VENDORS_DESC"
          :symbol-title="EnumAnalyticsMarketplace.MARKETPLACE_VENDORS"
          :symbol="''"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS">
        <LineTransactions
          :card-heading="EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS"
          :card-description="EnumAnalyticsMarketplaceDescription.MARKETPLACE_TRANSACTIONS_DESC"
          :enum-sales-query-metric="EnumSalesQueryMetric.COUNT_TRANSACTIONS"
          :symbol-title="EnumAnalyticsMarketplace.MARKETPLACE_TRANSACTIONS"
          :legend="'Transactions'"
          :symbol="''"/>
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.SUBSCRIBERS_API">
        <LineSubscribersApiCount
          :card-heading="EnumAnalyticsMarketplace.SUBSCRIBERS_API"
          :card-description="EnumAnalyticsMarketplaceDescription.SUBSCRIBERS_API_DESC"
          :subscribers-query-metric="EnumSubscribersQueryMetric.COUNT_SUBSCRIBERS"
          :symbol-title="EnumAnalyticsMarketplace.SUBSCRIBERS_API"
          :legend="'API Subscribers'"
          :symbol="''"/>
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.NUMBER_OF_ASSETS">
        <LineAssetsTotal
          :card-heading="EnumAnalyticsMarketplace.NUMBER_OF_ASSETS"
          :card-description="EnumAnalyticsMarketplaceDescription.NUMBER_OF_ASSETS_DESC"
          :symbol-title="EnumAnalyticsMarketplace.NUMBER_OF_ASSETS"
          :symbol="''"/>
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.VALUE_FILE_ASSETS">
        <LineValueFileAssets
          :card-heading="EnumAnalyticsMarketplace.VALUE_FILE_ASSETS"
          :card-description="EnumAnalyticsMarketplaceDescription.VALUE_FILE_ASSETS_DESC"
          :symbol-title="EnumAnalyticsMarketplace.VALUE_FILE_ASSETS"
          :symbol="'€'"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS">
        <MapCoverageFileAssets
          :card-heading="EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS"
          :card-description="EnumAnalyticsMarketplaceDescription.COVERAGE_FILE_ASSETS_DESC"
          :symbol-title="EnumAnalyticsMarketplace.COVERAGE_FILE_ASSETS"
          :symbol="''"
        />
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.VIEWER_LOCATIONS">
        COMING SOON: {{ EnumAnalyticsMarketplace.VIEWER_LOCATIONS }}
      </div>
      <div class="analytics__cards__item"
           v-if="activeTab === EnumAnalyticsMarketplace.PURCHASES_LOCATIONS">
        COMING SOON: {{ EnumAnalyticsMarketplace.PURCHASES_LOCATIONS }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  EnumAssetSource,
  EnumGoogleAnalyticsMetric,
  EnumSalesQueryMetric,
  EnumSubscribersQueryMetric,
} from '@/model/analytics';
import ViewsLineGraphCard from '@/views/dashboard/Analytics/ViewsLineGraphCard.vue';
import ViewsMapGraphCard from '@/views/dashboard/Analytics/ViewsMapGraphCard.vue';
import ViewsBarGraphCard from '@/views/dashboard/Analytics/ViewsBarGraphCard.vue';
import PieSubscriberSegments from '@/views/dashboard/Analytics/PieSubscriberSegments.vue';
import BarPopularAssets from '@/views/dashboard/Analytics/TopioMarketplace/BarPopularAssets.vue';
import BarPopularTerms from '@/views/dashboard/Analytics/TopioMarketplace/BarPopularTerms.vue';
import LineGoogleAnalytics
  from '@/views/dashboard/Analytics/TopioMarketplace/LineGoogleAnalytics.vue';
import LineVendorsCount from '@/views/dashboard/Analytics/TopioMarketplace/LineVendorsCount.vue';
import LineTransactions from '@/views/dashboard/Analytics/TopioMarketplace/LineTransactions.vue';
import LineSubscribersApiCount
  from '@/views/dashboard/Analytics/TopioMarketplace/LineSubscribersApiCount.vue';
import LineAssetsTotal from '@/views/dashboard/Analytics/TopioMarketplace/LineAssetsTotal.vue';
import LineValueFileAssets
  from '@/views/dashboard/Analytics/TopioMarketplace/LineValueFileAssets.vue';
import MapCoverageFileAssets
  from '@/views/dashboard/Analytics/TopioMarketplace/MapCoverageFileAssets.vue';
import MapViewerLocations
  from '@/views/dashboard/Analytics/TopioMarketplace/MapViewerLocations.vue';

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

enum EnumAnalyticsMarketplaceDescription {
  TOP_VIEWED_ASSETS_DESC = 'The top viewed assets in Topio market',
  TOP_ASSETS_APPEARED_DESC = 'The top assets in search results across Topio',
  TOP_SEARCH_TERMS_DESC = 'The top search terms of Topio visitors',
  MARKETPLACE_VISITORS_DESC = 'Number of Topio visitors',
  MARKETPLACE_VENDORS_DESC = 'Number of Topio suppliers',
  MARKETPLACE_TRANSACTIONS_DESC = 'Number of sales in Topio for all assets',
  SUBSCRIBERS_API_DESC = 'Number of subsribers to APIs offered via Topio',
  NUMBER_OF_ASSETS_DESC = 'Total number of assets',
  VALUE_FILE_ASSETS_DESC = 'Total value of assets offered via Topio',
  COVERAGE_FILE_ASSETS_DESC = 'Geographic coverage of assets availalble in Topio',
  VIEWER_LOCATIONS_DESC = 'What are the locations of Topio viewers',
  PURCHASES_LOCATIONS_DESC = 'What are the locations of users purchasing assets?'
}

@Component({
  components: {
    ViewsLineGraphCard,
    ViewsMapGraphCard,
    ViewsBarGraphCard,
    PieSubscriberSegments,
    BarPopularAssets,
    BarPopularTerms,
    LineGoogleAnalytics,
    LineVendorsCount,
    LineTransactions,
    LineSubscribersApiCount,
    LineAssetsTotal,
    LineValueFileAssets,
    MapCoverageFileAssets,
    MapViewerLocations,
  },
})
export default class TopioMarketPlace extends Vue {
  activeTab: string | null;

  EnumAnalyticsMarketplace: typeof EnumAnalyticsMarketplace;

  EnumAnalyticsMarketplaceDescription: typeof EnumAnalyticsMarketplaceDescription;

  EnumAssetSource: typeof EnumAssetSource;

  EnumGoogleAnalyticsMetric: typeof EnumGoogleAnalyticsMetric;

  EnumSalesQueryMetric: typeof EnumSalesQueryMetric;

  EnumSubscribersQueryMetric: typeof EnumSubscribersQueryMetric;

  constructor() {
    super();

    this.activeTab = null;
    this.EnumAnalyticsMarketplace = EnumAnalyticsMarketplace;
    this.EnumAnalyticsMarketplaceDescription = EnumAnalyticsMarketplaceDescription;
    this.EnumAssetSource = EnumAssetSource;
    this.EnumGoogleAnalyticsMetric = EnumGoogleAnalyticsMetric;
    this.EnumSalesQueryMetric = EnumSalesQueryMetric;
    this.EnumSubscribersQueryMetric = EnumSubscribersQueryMetric;
  }
}
</script>
<style lang="scss">
</style>
