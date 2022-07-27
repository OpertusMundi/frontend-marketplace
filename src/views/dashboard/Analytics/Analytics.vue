<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__left">
        <h1>Analytics</h1>
      </div>
    </div>
    <div class="analytics">
      <tabs>
        <tab title="Sales">
          <Sales />
        </tab>
        <tab title="Explore">
          <Explore />
        </tab>
        <tab title="Assets">
          <Assets />
        </tab>
        <tab title="Topio Marketplace">
          <TopioMarketPlace />
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import TopioMarketPlace from '@/views/dashboard/Analytics/TopioMarketPlace.vue';
import Explore from '@/views/dashboard/Analytics/Explore.vue';
import Sales from '@/views/dashboard/Analytics/Sales.vue';
import Assets from '@/views/dashboard/Analytics/Assets.vue';


@Component({
  components: {
    Tabs,
    Tab,
    Explore,
    Sales,
    Assets,
    TopioMarketPlace,
  },
})
export default class DashboardAnalytics extends Vue {}
</script>
<style lang="scss">
@import '@/assets/styles/_analytics.scss';
</style>
