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
        <span @click="selectFilterMenuItem('type')">TYPE <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('update')">UPDATE <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('topic')">TOPIC <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('format')">FORMAT <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('crs')">CRS <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('scale')">SCALE <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('coverage')">COVERAGE <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('price')">PRICE <font-awesome-icon icon="angle-down" /></span>
        <span @click="selectFilterMenuItem('more')">MORE <font-awesome-icon icon="angle-down" /></span>
      </div>

      <div v-if="filterMenuItem" class="filter-dialog-wrapper">
        <div class="filter-container">

          <!-- TYPE -->
          <div v-if="filterMenuItem == 'type'">
            <div class="checkbox-group" v-for="type in filters.find(x => x.name == 'type').options" :key="type.name">
              <input type="checkbox" :id="`type_${type.name}`" v-model="type.isChecked">
              <label :for="`type_${type.name}`"> {{type.name}} </label>
            </div>
            <!-- <div>{{filters.find(x => x.name == 'type')}}</div> -->
            <!-- <div>{{filterTypeSelection}}</div> -->
          </div>

          <!-- UPDATE -->
          <div v-if="filterMenuItem == 'update'">
            <div class="d-flex">
              <div class="d-flex d-column">
                <h5>From date:</h5>
                <datepicker :inline="true" v-model="filters.find((x) => x.name == 'update').options[0].value" placeholder="select date"></datepicker>
                <div v-if="filters.find((x) => x.name == 'update').options[0].value">
                  <h5 class="mt-2">From time:</h5>
                  <vue-timepicker :hide-clear-button="true" format="HH:mm A" v-model="filters.find((x) => x.name == 'update').options[2].value" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex d-column ml-2">
                <h5>To date:</h5>
                <datepicker :inline="true" v-model="filters.find((x) => x.name == 'update').options[1].value" placeholder="select date"></datepicker>
                <div v-if="filters.find((x) => x.name == 'update').options[1].value">
                  <h5 class="mt-2">To time:</h5>
                  <vue-timepicker :hide-clear-button="true" format="HH:mm A" v-model="filters.find((x) => x.name == 'update').options[3].value" placeholder="select time"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- TOPIC -->
          <div v-if="filterMenuItem == 'topic'">
            <div class="checkbox-group" v-for="topic in filters.find(x => x.name == 'topic').options" :key="topic.name">
              <input type="checkbox" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
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
          <div v-if="filterMenuItem == 'more'">
            <h3>more filters</h3>
            <ul>
              <li>search by vendor</li>
              <li>search by language</li>
              <li>search by license</li>
              <li>search by geometry / number of features</li>
            </ul>
          </div>
        </div>

        <div class="filter-side-menu">
          <!-- DISPLAY OF FILTERS CHECKED -->
          <div class="filter-side-menu-main">
            <div>
              <!-- TYPE -->
              <div class="pill" v-for="filter in getFiltersChecked('type')" :key="filter.name">
                {{ filter.name }}
                <div class="close-button" @click="removeFilter('type', filter.name)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- UPDATED -->
              <div class="pill" v-if="filters.find((x) => x.name == 'update').options[0].value">
                <!-- format data & show time only if different than 00:00 AM -->
                Updated after {{dateFormatter(filters.find((x) => x.name == 'update').options[0].value)}}{{filters.find((x) => x.name == 'update').options[2].value != '00:00 AM' ? ', ' + filters.find((x) => x.name == 'update').options[2].value : '' }}
                <div class="close-button" @click="removeFilter('update', 'From')"><font-awesome-icon icon="times" /></div>
              </div>
              <div class="pill" v-if="filters.find((x) => x.name == 'update').options[1].value">
                <!-- format date & show time only if different than 23:59 PM -->
                Updated before {{dateFormatter(filters.find((x) => x.name == 'update').options[1].value)}}{{filters.find((x) => x.name == 'update').options[3].value != '23:59 PM' ? ', ' + filters.find((x) => x.name == 'update').options[3].value : '' }}
                <div class="close-button" @click="removeFilter('update', 'To')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- TOPIC -->
              <div class="pill" v-for="filter in getFiltersChecked('topic')" :key="filter.name">
                <span>{{filter.name}}</span>
                <div class="close-button" @click="removeFilter('topic', filter.name)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- COVERAGE -->
              <div class="pill" v-if="mapCoverageSelectionBBox">
                Area selection
                <div class="close-button" @click="removeFilter('coverage')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- PRICE -->
              <div class="pill" v-if="priceValues[0] != 0 || priceValues[1] != priceMax">
                {{priceValues[0]}}€ - {{priceValues[1]}}€
                <div class="close-button" @click="removeFilter('price')"><font-awesome-icon icon="times" /></div>
              </div>
            </div>
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
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import 'leaflet-easybutton';
import { dom } from '@fortawesome/fontawesome-svg-core';
// we should maybe not include default CSS
import 'vue-range-component/dist/vue-range-slider.css';
// there is a known bug: https://github.com/xwpongithub/vue-range-slider/issues/18
// fixed it by editing lib's js files as proposed
import VueRangeSlider from 'vue-range-component';

interface filterOption {
  name: string,
  isChecked?: boolean
  value?: string | number
}

interface filterCategory {
  name: string,
  options: filterOption[]
}

@Component({
  components: {
    CatalogueCard,
    Datepicker,
    VueTimepicker,
    VueRangeSlider,
  },
})
export default class Catalogue extends Vue {
  catalogQuery: CatalogueQuery;

  catalogueApi: CatalogueApi;

  queryResults: CatalogueItem[];

  query:string;

  loading = false;

  filterMenuItem: string;

  // filters
  filters: filterCategory[];

  // filterTypeOptions: string[];

  // filterTypeSelection: string[];

  // filterType: filterOption[];

  // filterTopicOptions: string[];

  // filterTopicSelection: string[];

  // filterTopic: filterOption[];

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageSelectionBBox: string;

  priceValues: number[];

  priceMin: number;

  priceMax: number;

  priceStep: number;

  constructor() {
    super();

    dom.watch();

    this.query = '';
    this.queryResults = [];
    this.catalogQuery = {
      page: 0,
      size: 6,
      query: this.query,
    };
    this.catalogueApi = new CatalogueApi();

    this.filterMenuItem = '';

    this.filters = [
      {
        name: 'type',
        options: [{ name: 'Vector dataset', isChecked: false }, { name: 'Raster dataset', isChecked: false }, { name: 'API', isChecked: false }],
      }, {
        name: 'update',
        options: [{ name: 'From', value: '' }, { name: 'To', value: '' }, { name: 'timeFrom', value: '00:00 AM' }, { name: 'timeTo', value: '23:59 PM' }],
      }, {
        name: 'topic',
        options: [{ name: 'Biota', isChecked: false }, { name: 'Boundaries', isChecked: false }, { name: 'Clima', isChecked: false }, { name: 'Economy', isChecked: false }, { name: 'Elevation', isChecked: false }, { name: 'Environment', isChecked: false }, { name: 'Farming', isChecked: false }, { name: 'Geo-Scientific', isChecked: false }, { name: 'Health', isChecked: false }, { name: 'Imagery', isChecked: false }, { name: 'Inland Waters', isChecked: false }, { name: 'Military Intelligence', isChecked: false }, { name: 'Location', isChecked: false }, { name: 'Oceans', isChecked: false }, { name: 'Planning Cadastre', isChecked: false }, { name: 'Society', isChecked: false }, { name: 'Structure', isChecked: false }, { name: 'Transportation', isChecked: false }, { name: 'Utilities Communication', isChecked: false }],
      },
    ];

    // this.filterTypeOptions = Object.keys(EnumType);

    // this.filterTypeOptions = ['Vector dataset', 'Raster dataset', 'API'];
    // this.filterTypeSelection = [];

    // this.filterType = [{ name: 'Vector dataset', isChecked: false }, { name: 'Raster dataset', isChecked: false }, { name: 'API', isChecked: false }];
    // this.filterTopic = [{ name: 'Biota', isChecked: false }, { name: 'Boundaries', isChecked: false }, { name: 'Clima', isChecked: false }, { name: 'Economy', isChecked: false }, { name: 'Elevation', isChecked: false }, { name: 'Environment', isChecked: false }, { name: 'Farming', isChecked: false }, { name: 'Geo-Scientific', isChecked: false }, { name: 'Health', isChecked: false }, { name: 'Imagery', isChecked: false }, { name: 'Inland Waters', isChecked: false }, { name: 'Military Intelligence', isChecked: false }, { name: 'Location', isChecked: false }, { name: 'Oceans', isChecked: false }, { name: 'Planning Cadastre', isChecked: false }, { name: 'Society', isChecked: false }, { name: 'Structure', isChecked: false }, { name: 'Transportation', isChecked: false }, { name: 'Utilities Communication', isChecked: false }];

    // this.filterTopicOptions = ['Biota', 'Boundaries', 'Clima', 'Economy', 'Elevation', 'Environment', 'Farming', 'Geo-Scientific', 'Health', 'Imagery', 'Inland waters', 'Military Intelligence', 'Location', 'Oceans', 'Planning Cadastre', 'Society', 'Structure', 'Transportation', 'Utilities Communication'];
    // this.filterTopicSelection = [];

    this.mapCoverageSelectionBBox = '';

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

  removeFilter(category, filterName) {
    switch (category) {
      case 'type':
      case 'topic': {
        const option = this.filters.find((x) => x.name === category)
        ?.options
        .find((x) => x.name === filterName);
        option!.isChecked = false;
        break;
      }
      case 'update': {
        switch (filterName) {
          case 'From': {
            this.filters.find((x) => x.name === category)!.options[0].value = '';
            this.filters.find((x) => x.name === category)!.options[2].value = '00:00 AM';
            break;
          }
          case 'To': {
            this.filters.find((x) => x.name === category)!.options[1].value = '';
            this.filters.find((x) => x.name === category)!.options[3].value = '23:59 PM';
            break;
          }
          default:
        }
        break;
      }
      case 'coverage': {
        this.mapCoverageSelectionBBox = '';
        break;
      }
      case 'price': {
        this.priceValues = [0, this.priceMax];
        break;
      }
      default:
    }
  }

  cancelFilters(): void {
    this.filterMenuItem = '';
  }

  getFiltersChecked(category) {
    let result;
    switch (category) {
      case 'type':
      case 'topic':
        result = this.filters
          .find((x) => x.name === category)
          ?.options
          ?.filter((x) => x.isChecked);
        break;

      default:
    }

    return result;
  }

  // we use this method cause formatter of vuejs-datepicker lib is buggy
  dateFormatter(date) {
    const splitted = date.toString().split(' ');
    const d = splitted[2];
    const m = splitted[1];
    const y = splitted[3];
    return `${d} ${m} ${y}`;
  }

  initMapCoverage() {
    this.mapCoverage = (L as any).map('mapCoverage', { editable: true }).setView([0, 0], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapCoverage);
    console.log(this.mapCoverage);

    const latMin = 28.647719;
    const latMax = 73.426841;
    const lonMin = -32.519531;
    const lonMax = 58.359375;

    const selectionLayerOptions = { fillColor: 'transparent', color: '#190AFF', dashArray: '20 20' };

    this.mapCoverageSelectionRectangle = L.rectangle([[latMin, lonMin], [latMin, lonMax], [latMax, lonMax], [latMax, lonMin], [latMin, lonMin]], selectionLayerOptions).addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.enableEdit();

    this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());

    this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
      this.mapExtendToSelection();
    });

    L.easyButton('<i class="fas fa-vector-square"></i>', () => {
      this.mapExtendToSelection();
    }, 'Zoom to Selection').addTo(this.mapCoverage);
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

  // .menu-select-style__wrapper span span {
  //   font-size: .8rem;
  // }

  .d-flex {
    display: flex;
  }

  .d-column {
    flex-direction: column;
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

  .ml-2 {
    margin-left: 2rem;
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
    display: flex;
  }

  .time-picker li.active {
    background: #190AFF !important;
  }

  .pill {
    width: auto;
    background: #190AFF;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px 5px 10px;
    margin: 5px;
    border-radius: 7px;
  }

  .close-button {
    cursor: pointer;
    margin-left: 5px;
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

  .easy-button-button {
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 10px;
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
