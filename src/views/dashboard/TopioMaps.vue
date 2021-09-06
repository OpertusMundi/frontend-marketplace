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
    <div class="map_cards">
      <div class="map_cards__head">
        <h4>My maps</h4>
        <a href="#">VIEW ALL</a>
      </div>
      <div class="map_cards__grid">
        <map-card image="map_color1.jpg" title="Iceland - Topographicmap"></map-card>
        <map-card image="map_color2.jpg" title="Mediterranean Sea - Light map"></map-card>
        <map-card image="map_color3.jpg" title="World - Satellite hybrid map"></map-card>
        <map-card image="map_color4.jpg" title="Greece - Simple map"></map-card>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
      </div>
    </div>
    <div class="map_cards">
      <div class="map_cards__head">
        <h4>Shared with me</h4>
        <a href="#">VIEW ALL</a>
      </div>
      <div class="map_cards__grid">
        <map-card image="map_color4.jpg" title="Iceland - Topographicmap"></map-card>
        <map-card image="map_color2.jpg" title="Mediterranean Sea - Light map"></map-card>
        <map-card image="map_color1.jpg" title="World - Satellite hybrid map"></map-card>
        <map-card image="map_color3.jpg" title="Greece - Simple map"></map-card>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
      </div>
    </div>
    <div class="map_cards">
      <div class="map_cards__head">
        <h4>Public maps</h4>
        <a href="#">VIEW ALL</a>
      </div>
      <div class="map_cards__grid">
        <map-card image="map_color2.jpg" title="Iceland - Topographicmap"></map-card>
        <map-card image="map_color4.jpg" title="Mediterranean Sea - Light map"></map-card>
        <map-card image="map_color3.jpg" title="World - Satellite hybrid map"></map-card>
        <map-card image="map_color1.jpg" title="Greece - Simple map"></map-card>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapCard from '@/components/TopioMaps/MapCard.vue';

@Component({
  components: { MapCard },
})
export default class DashboardTopioMaps extends Vue {}
</script>
<style lang="scss">
@import '@/assets/styles/_mapcard.scss';
</style>
