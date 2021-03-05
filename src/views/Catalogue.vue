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

          <!-- TYPE -->
          <div v-if="filterMenuItem == 'type'">
            <div class="checkbox-group" v-for="(type, i) in filterTypeOptions" :key="type">
              <input type="checkbox" :id="`type_${type}`" v-model="filterTypeSelection[i]">
              <label :for="`type_${type}`"> {{type}} </label>
            </div>
            <div>{{filterTypeSelection}}</div>
          </div>

          <!-- UPDATE -->
          <div v-if="filterMenuItem == 'update'">
            <h5>Updated after</h5>
            <datepicker placeholder="select date"></datepicker>

            <h5 class="mt-2">Updated before</h5>
            <datepicker placeholder="select date"></datepicker>
          </div>

          <!-- TOPIC -->
          <div v-if="filterMenuItem == 'topic'">
            <div class="checkbox-group" v-for="(topic, i) in filterTopicOptions" :key="topic">
              <input type="checkbox" :id="`topic_${topic}`" v-model="filterTopicSelection[i]">
              <label :for="`topic_${topic}`"> {{topic}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div v-if="filterMenuItem == 'format'">
            <p><i>it has to change according to TYPE</i></p>
          </div>

          <!-- CRS -->
          <div v-if="filterMenuItem == 'crs'">
            <h5>Popular CRS</h5>
            <div class="checkbox-group mt-1">
              <input type="checkbox" id="EPSG:4326">
              <label for="EPSG:4326">WGS84 | EPSG:4326</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" id="EPSG:3857">
              <label for="EPSG:3857">EPSG:3857</label>
            </div>

            <input type="text" class="form-group__text mt-3" placeholder="Search for CRS">
          </div>

          <!-- SCALE -->
          <div v-if="filterMenuItem == 'scale'"><h3>scale filter</h3></div>

          <!-- COVERAGE -->
          <div v-if="filterMenuItem == 'coverage'">
            <div class="coverage-map-menu-container">
              <div class="coverage-side-menu">
                <div class="d-flex align-items-center mb-1">
                  <span><strong>1</strong></span> <input type="text" class="form-group__text" placeholder="Search City/Area">
                </div>
                <div class="d-flex align-items-center mb-1">
                  <span><strong>2</strong></span>
                  <select class="form-group__select">
                    <option value="" disabled selected>Select country/area</option>
                  </select>
                </div>
                <div class="d-flex align-items-center">
                  <span><strong>3</strong></span> <div class="select-area-text">Or select an area of interest via a bounding box on the map.</div>
                </div>
              </div>
              <div id="mapCoverage"></div>
            </div>
          </div>

          <!-- PRICE -->
          <div v-if="filterMenuItem == 'price'">
            <vue-range-slider ref="priceRangeSlider" v-model="priceValues" :min="priceMin" :max="priceMax" :step="priceStep" :enable-cross="false"></vue-range-slider>
            <div class="price-values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*priceMax/4}}€ </span>
            </div>

            <div class="mt-3 price-min-max-container">
              <div class="price-min-max-item">
                <label for="priceSelectedMin">Minimum Price</label>
                <input type="number" :min="priceMin" :value="priceValues[0]" @input="validateSelectedMinPrice($event.target.value)" class="form-group__text" id="priceSelectedMin">
              </div>
              <div class="price-min-max-item">
                <label for="priceSelectedMax">Maximum Price</label>
                <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateSelectedMaxPrice($event.target.value)" class="form-group__text" id="priceSelectedMax">
              </div>
            </div>
          </div>

          <!-- MORE -->
          <div v-if="filterMenuItem == 'more'"><h3>more filter</h3></div>
        </div>

        <div class="filter-side-menu">
          <div class="filter-side-menu-main">
            <p>search & filters sum</p>
          </div>
          <div class="filter-side-menu-bottom">
            <button class="btn--std btn--outlineblue" @click="cancelFilters()">CANCEL</button>
            <button class="btn--std btn--blue">APPLY FILTERS</button>
          </div>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import CatalogueApi from '@/service/catalogue';
// import { EnumType } from '@/model/catalogue';
import {
  CatalogueQueryResponse, CatalogueQuery, CatalogueItem,
} from '@/model';
import { AxiosError } from 'axios';
import Datepicker from 'vuejs-datepicker';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import 'leaflet-easybutton';
// we should maybe not include default CSS
import 'vue-range-component/dist/vue-range-slider.css';
// there is a known bug: https://github.com/xwpongithub/vue-range-slider/issues/18
// fixed it by editing lib's js files as proposed
import VueRangeSlider from 'vue-range-component';

@Component({
  components: { CatalogueCard, Datepicker, VueRangeSlider },
})
export default class Catalogue extends Vue {
  catalogQuery: CatalogueQuery;

  catalogueApi: CatalogueApi;

  queryResults: CatalogueItem[];

  query:string;

  loading = false;

  filterMenuItem: string;

  filterTypeOptions: string[];

  filterTypeSelection: string[];

  filterTopicOptions: string[];

  filterTopicSelection: string[];

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageSelectionBBox: string;

  priceValues: number[];

  priceMin: number;

  priceMax: number;

  priceStep: number;

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

    // this.filterTypeOptions = Object.keys(EnumType);
    this.filterTypeOptions = ['Vector dataset', 'Raster dataset', 'API'];
    this.filterTypeSelection = [];

    this.filterTopicOptions = ['Biota', 'Boundaries', 'Clima', 'Economy', 'Elevation', 'Environment', 'Farming', 'Geo-Scientific', 'Health', 'Imagery', 'Inland waters', 'Military Intelligence', 'Location', 'Oceans', 'Planning Cadastre', 'Society', 'Structure', 'Transportation', 'Utilities Communication'];
    this.filterTopicSelection = [];

    this.mapCoverageSelectionBBox = 'bboxstring';

    this.priceValues = [0, 5000];
    this.priceMin = 0;
    this.priceMax = 5000;
    this.priceStep = 1;
  }

  @Watch('filterMenuItem')
  onPropertyChanged(menuItem: string): void {
    if (menuItem === 'coverage') {
      setTimeout(() => {
        this.initMapCoverage();
      }, 0);
    }
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

  initMapCoverage() {
    this.mapCoverage = (L as any).map('mapCoverage', { editable: true }).setView([0, 0], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapCoverage);
    console.log(this.mapCoverage);

    this.mapCoverageSelectionRectangle = L.rectangle([[-50, -50], [-50, 50], [50, 50], [50, -50], [-50, -50]]).addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.enableEdit();

    this.mapExtendToSelection();

    this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
      this.mapExtendToSelection();
    });

    L.easyButton('[]', () => {
      this.mapExtendToSelection();
    }).addTo(this.mapCoverage);
  }

  mapExtendToSelection() {
    this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());
    this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
  }

  validateSelectedMinPrice(minPrice: string): void {
    const price = Number(minPrice);
    this.priceValues[0] = price > this.priceValues[1] ? this.priceValues[1] : price;
    (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
  }

  validateSelectedMaxPrice(maxPrice: string): void {
    const price = Number(maxPrice);
    this.priceValues[1] = price < this.priceValues[0] ? this.priceValues[0] : price;
    (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
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

  .d-flex {
    display: flex;
  }

  .align-items-center {
    align-items: center;
  }

  .justify-content-center {
    justify-content: center;
  }

  .mb-1 {
    margin-bottom: 1rem;
  }

  .mt-1 {
    margin-top: 1rem;
  }

  .mt-2 {
    margin-top: 2rem;
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
    // flex-direction: column;
    box-shadow: 7px 7px 15px rgb(134, 134, 134);
    padding: 20px;
  }

  .filter-side-menu-bottom {
    display: inline-block;
    width: 100%;
  }

  .filter-side-menu-bottom button {
    margin: 20px 20px 20px 0px;
    float: right;
  }

  .filter-container {
    flex-grow: 1;
  }

  .filter-side-menu {
    width: 360px;
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
  }

  .filter-side-menu-main {
    flex-grow: 1;
  }

  .filter-buttons-container button {
    float: right;
  }

  input[type="checkbox"] {
    vertical-align:middle;
  }

  .container-map-menu {
    display: flex;
  }

  #mapCoverage {
    height: 300px;
    width: 100%;
    margin: 0 10px 0 10px;
  }

  .coverage-side-menu {
    flex-grow: 1;
    min-width: 300px;
  }

  .coverage-side-menu input,
  .coverage-side-menu select,
  .coverage-side-menu .select-area-text {
    margin-bottom: 0;
    margin-left: 10px;
  }

  .coverage-map-menu-container {
    display: flex;
  }

  .price-values-line {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .price-values-line span {
    // background: blue;
    width: 60px;
    text-align: center;
    color: rgb(122, 122, 122);
  }

  .price-min-max-container {
    display: flex;
  }

  .price-min-max-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .price-min-max-item label {
    color: rgb(122, 122, 122);
  }

  /* css solution cause disabling in props throws error */
  .slider-tooltip-wrap, .slider-tooltip {
    display: none !important;
  }

</style>
