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
      <!-- <div class="map_cards__head">
        <h4>My maps</h4>
        <a href="#">VIEW ALL</a>
      </div> -->
      <div class="map_cards__grid">
        <map-card
          v-for="item in maps"
          :key="item.key"
          image="map_color1.jpg"
          :title="item.title"
          :url="item.mapUrl"
        ></map-card>

        <!-- <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div>
        <div class="map_card map_card--empty"></div> -->
      </div>
    </div>
    <!-- <div class="map_cards">
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
    </div> -->
    <!-- <div class="map_cards">
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
    </div> -->

    <pagination :currentPage="pagination.currentPage" :itemsPerPage="pagination.itemsPerPage" :itemsTotal="pagination.itemsTotal" @pageSelection="loadMaps($event)"></pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapCard from '@/components/TopioMaps/MapCard.vue';
import Pagination from '@/components/Pagination.vue';
import MapsApi from '@/service/map';
import { TopioMap } from '@/model/map';
import store from '@/store';

@Component({
  components: { MapCard, Pagination },
})
export default class DashboardTopioMaps extends Vue {
  mapsApi = new MapsApi();

  maps: TopioMap[] | null = null;

  pagination = {
    currentPage: 0,
    itemsPerPage: 1,
    itemsTotal: 0,
  };

  mounted(): void {
    this.loadMaps();
  }

  loadMaps(page = 0): void {
    store.commit('setLoading', true);
    this.mapsApi.getMaps(page, this.pagination.itemsPerPage)
      .then((response) => {
        this.maps = response.result.items;

        this.pagination = {
          ...this.pagination,
          currentPage: response.result.pageRequest.page,
          itemsTotal: response.result.count,
        };

        store.commit('setLoading', false);
      });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_mapcard.scss';
</style>
