<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Profile</h1>
      </div>
    </div>
    <div class="asset-owner asset-owner--big">
      <div class="asset-owner__inner">
        <div class="asset-owner__inner__logo"><img src="@/assets/images/about/partners/athina_logo.svg" alt=""></div>
        <div class="asset-owner__inner__info">
          <div class="asset-owner__inner__info__name"><a href="#">AthenaRC</a></div>
          <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="asset-owner__inner__info__country">Athens, Greece</div>
          <div class="asset-owner__inner__info__date">Joined February 2020</div>
          <a href="#" class="btn--std btn--blue">EDIT PROFILE</a>
        </div>
      </div>
    </div>

    <div class="collection">
      <div class="filters">
        <div class="filters__block">
          <p class="filters__title">13 ASSETS</p>
        </div>
        <div class="filters__block">
          <div class="filters__block__select">
            <label for="filter">↑↓: </label>
            <select name="filter" id="filter">
              <option value="1">NEWEST</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
              <option value="4">Option 4</option>
            </select>
          </div>
        </div>
      </div>

      <div class="collection__main">
        <catalogue-card :asset="{id:1, title:'Test Asset', type:'VECTOR'}"></catalogue-card>
        <catalogue-card :asset="{id:1, title:'Test Asset', type:'RASTER'}"></catalogue-card>
        <catalogue-card :asset="{id:1, title:'Test Asset', type:'NETCDF'}"></catalogue-card>

        <div class="more__bottom">
          <div class="more__bottom__block">
            <a href="#"> <p>LOAD MORE</p><p><svg xmlns="http://www.w3.org/2000/svg" width="17.404" height="25.65" viewBox="0 0 17.404 25.65"><path id="Path_2292" data-name="Path 2292" d="M-1105.012-7721.223l11.469 14.086 11.871-14.086" transform="translate(-7704.786 1106.175) rotate(90)" fill="none" stroke="#333" stroke-width="3"></path></svg></p> </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';

@Component({
  components: { CatalogueCard },
})
export default class DashboardProfile extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/_messages.scss";
</style>
