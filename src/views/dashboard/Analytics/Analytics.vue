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
          <sales></sales>
        </tab>
        <tab title="Explore">
          <explore></explore>
        </tab>
        <tab title="Assets">
          ASSETS
        </tab>
        <tab title="topio Marketplace">
          TOPIO
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import Explore from './Explore.vue';
import Sales from './Sales.vue';

@Component({
  components: {
    Tabs,
    Tab,
    Explore,
    Sales,
  },
})
export default class DashboardAnalytics extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_analytics.scss";
</style>
