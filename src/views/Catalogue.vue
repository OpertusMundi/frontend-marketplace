<template>
  <div class="assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>Assets</h1>
      </div>
      <div class="form-group">
        <input placeholder="Search in Assets" type="text" class="form-group__text" name="search_assets" id="search_assets">
      </div>

      <div class="menu-select-style__wrapper">
        <span @click="selectFilterMenuItem('type')">TYPE <span>&or;</span></span>
        <span @click="selectFilterMenuItem('update')">UPDATE <span>&or;</span></span>
        <span @click="selectFilterMenuItem('topic')">TOPIC <span>&or;</span></span>
        <span @click="selectFilterMenuItem('format')">FORMAT <span>&or;</span></span>
        <span @click="selectFilterMenuItem('crs')">CRS <span>&or;</span></span>
        <span @click="selectFilterMenuItem('scale')">SCALE <span>&or;</span></span>
        <span @click="selectFilterMenuItem('coverage')">COVERAGE <span>&or;</span></span>
        <span @click="selectFilterMenuItem('price')">PRICE <span>&or;</span></span>
        <span @click="selectFilterMenuItem('more')">MORE <span>&or;</span></span>
      </div>

      <div v-if="filterMenuItem" class="filter-dialog-wrapper">
        <div class="filter-container">
          <div v-if="filterMenuItem == 'type'">
            <h3>type filter</h3>
            <span v-for="type in filterTypes" :key="type"> {{type}} </span>
          </div>
          <div v-if="filterMenuItem == 'update'"><h3>update filter</h3></div>
          <div v-if="filterMenuItem == 'topic'"><h3>topic filter</h3></div>
          <div v-if="filterMenuItem == 'format'"><h3>format filter</h3></div>
          <div v-if="filterMenuItem == 'crs'"><h3>crs filter</h3></div>
          <div v-if="filterMenuItem == 'scale'"><h3>scale filter</h3></div>
          <div v-if="filterMenuItem == 'coverage'"><h3>coverage filter</h3></div>
          <div v-if="filterMenuItem == 'price'"><h3>price filter</h3></div>
          <div v-if="filterMenuItem == 'more'"><h3>more filter</h3></div>
        </div>
        <div class="filter-buttons-container">
          <button class="btn--std btn--outlineblue" @click="cancelFilters()">CANCEL</button>
          <button class="btn--std btn--blue">APPLY FILTERS</button>
        </div>
      </div>

      <h6 class="mt-3">9999 ASSETS</h6>

      <div class="assets__items">
        <catalogue-card v-for="asset in queryResults" v-bind:key="asset.id" :asset="asset"></catalogue-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import CatalogueApi from '@/service/catalogue';
import { EnumType } from '@/model/catalogue';
import {
  CatalogueQueryResponse, CatalogueQuery, CatalogueItem,
} from '@/model';
import { AxiosError } from 'axios';

@Component({
  components: { CatalogueCard },
})
export default class Catalogue extends Vue {
  catalogQuery: CatalogueQuery;

  catalogueApi: CatalogueApi;

  queryResults: CatalogueItem[];

  query:string;

  loading = false;

  filterMenuItem: string;

  filterTypes: string[];

  constructor() {
    super();

    this.query = '';
    this.queryResults = [];
    this.catalogQuery = {
      page: 0,
      size: 6,
      query: this.query,
    };
    this.catalogueApi = new CatalogueApi();

    this.filterMenuItem = '';

    this.filterTypes = Object.keys(EnumType);
    console.log('types: ', this.filterTypes);
  }

  mounted(): void {
    this.searchAssets();
  }

  searchAssets(): void {
    this.loading = true;
    this.queryResults = [];
    this.catalogQuery.query = this.query;
    this.catalogueApi.find(this.query)
      .then((queryResponse: CatalogueQueryResponse) => {
        if (queryResponse.success) {
          this.queryResults = queryResponse.result.items;
        }
        this.loading = false;
      })
      .catch((error: AxiosError) => {
        console.log(error);
        this.loading = false;
      });
  }

  selectFilterMenuItem(filterItem: string): void {
    this.filterMenuItem = filterItem;
  }

  cancelFilters(): void {
    this.filterMenuItem = '';
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_errorpage.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_btns.scss";

  #search_assets {
    width: 50%;
  }

  .menu-select-style__wrapper {
    width: 100%;
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    // grid-gap: 4px;
  }

  .menu-select-style__wrapper span {
    border-radius: 3px;
    background: #fff;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: .85rem;
    padding: 3px;
    padding-left: 10px;
    cursor: pointer;
  }

  .menu-select-style__wrapper span span {
    font-size: .8rem;
  }

  .mt-3 {
    margin-top: 3rem;
  }

  .filter-dialog-wrapper {
    background: white;
    min-height: 400px;
    width: 100%;
    border-radius: 7px;
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
    box-shadow: 7px 7px 15px rgb(134, 134, 134);
    padding: 20px;
  }

  .filter-buttons-container {
    display: inline-block;
    width: 100%;
  }

  .filter-buttons-container button {
    margin-left: 20px;
  }

  .filter-container {
    flex-grow: 1;
  }

  .filter-buttons-container button {
    float: right;
  }
</style>
