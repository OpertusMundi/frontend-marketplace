<template>
  <router-link :to="`topiomap/dummy`" class="map_card">
    <div class="map_card__view"><span>OPEN</span></div>
      <div class="map_card__inner">
        <div class="map_card__inner__title">Iceland - Topographic Map</div>
      </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MapCard extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_mapcard.scss";
</style>
