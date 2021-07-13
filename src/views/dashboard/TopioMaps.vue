<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>topio Maps</h1>
      </div>
    </div>
    <p><strong>Available features for your subscription</strong></p>
    <p class="mt-xs-20">Create, stylise and share up to 5 maps / month.</p>
    <button class="btn btn--std btn--blue mt-xs-20 mb-xs-20">UPGRADE</button>
    <hr>
    <div class="row">
      <div class="col-md-3"><map-card></map-card></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapCard from '@/components/TopioMaps/MapCard.vue';

@Component({
  components: { MapCard },
})
export default class DashboardTopioMaps extends Vue {
}
</script>
<style lang="scss">
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
