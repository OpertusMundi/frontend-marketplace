<template>
  <div class="assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>Assets</h1>
      </div>
      <div class="form-group">
        <input placeholder="Search in Assets" type="text" class="form-group__text" name="search_assets" id="search_assets">
      </div>

      <!-- FILTERS MENU TAB-BAR -->
      <div class="menu-select-style__wrapper">
        <span v-for="item in filterMenuItems"
          :key="item.id"
          :class="{ active: filterMenuItemSelected == item.id }"
          @click="selectfilterMenuItem(item.id)">
            {{ item.name }}
            <font-awesome-icon :icon="filterMenuItemSelected == item.id? 'angle-up' : 'angle-down'" />
        </span>
      </div>

      <div v-if="filterMenuItemSelected" class="filter-dialog-wrapper">
        <div class="filter-container">

          <!-- TYPE -->
          <div v-if="filterMenuItemSelected == 'type'">
            <div class="checkbox-group mt-md-10" v-for="type in filters.find(x => x.name == 'type').options" :key="type.name">
              <input type="checkbox" class="mr-md-10" :id="`type_${type.name}`" v-model="type.isChecked">
              <label :for="`type_${type.name}`"> {{type.name}} </label>
            </div>
            <!-- <div>{{filters.find(x => x.name == 'type')}}</div> -->
            <!-- <div>{{filterTypeSelection}}</div> -->
          </div>

          <!-- UPDATE -->
          <div v-if="filterMenuItemSelected == 'update'">
            <div class="d-flex">
              <div class="d-flex d-column">
                <h5 class="date-labels">From date</h5>
                <datepicker :inline="true" v-model="filters.find((x) => x.name == 'update').options[0].value" placeholder="select date"></datepicker>
                <div class="mt-md-30" v-if="filters.find((x) => x.name == 'update').options[0].value">
                  <h5 class="mt-md-30 date-labels">From time</h5>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filters.find((x) => x.name == 'update').options[2].value" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex d-column ml-md-15">
                <h5 class="date-labels">To date</h5>
                <datepicker :inline="true" v-model="filters.find((x) => x.name == 'update').options[1].value" placeholder="select date"></datepicker>
                <div class="mt-md-30" v-if="filters.find((x) => x.name == 'update').options[1].value">
                  <h5 class="date-labels">To time</h5>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filters.find((x) => x.name == 'update').options[3].value" placeholder="select time"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- TOPIC -->
          <div v-if="filterMenuItemSelected == 'topic'">
            <div class="checkbox-group mb-md-2" v-for="topic in filters.find(x => x.name == 'topic').options" :key="topic.name">
              <input type="checkbox" class="mr-md-10" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div v-if="filterMenuItemSelected == 'format'">
            <p><i>it has to change according to TYPE</i></p>
          </div>

          <!-- CRS -->
          <div v-if="filterMenuItemSelected == 'crs'">
            <small>Popular CRS:</small>
            <div class="checkbox-group mt-md-10 mb-md-5">
              <input type="checkbox" class="mr-md-10" id="EPSG:4326">
              <label for="EPSG:4326">WGS84 | EPSG:4326</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" id="EPSG:3857">
              <label class="ml-md-5" for="EPSG:3857">EPSG:3857</label>
            </div>

            <input type="text" class="form-group__text mt-md-20" placeholder="Search for CRS">
          </div>

          <!-- SCALE -->
          <div v-if="filterMenuItemSelected == 'scale'">
            <vue-range-slider ref="priceRangeSlider" v-model="scaleValues" :min="scaleMin" :max="scaleMax" :step="scaleStep" :enable-cross="false" :height="2"></vue-range-slider>
            <div class="values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*scaleMax/4}}€ </span>
            </div>

            <div class="mt-md-40 price-min-max-container">
              <div class="min-max-input-item">
                <label for="scaleSelectedMin">Minimum Scale</label>
                <input type="number" :min="scaleMin" :value="scaleValues[0]" @input="validateMinMaxInput('minScale', $event.target.value)" class="form-group__text" id="scaleSelectedMin">
              </div>
              <div class="min-max-input-item">
                <label for="scaleSelectedMax">Maximum Scale</label>
                <input type="number" :max="scaleMax" :value="scaleValues[1]" @input="validateMinMaxInput('maxScale', $event.target.value)" class="form-group__text" id="scaleSelectedMax">
              </div>
            </div>
          </div>

          <!-- COVERAGE -->
          <div v-if="filterMenuItemSelected == 'coverage'">
            <div class="coverage-map-menu-container">
              <div class="coverage-side-menu">
                <div class="d-flex align-items-center mb-md-20">
                  <span><strong>1</strong></span> <input type="text" class="form-group__text" placeholder="Search City/Area">
                </div>
                <div class="d-flex align-items-center mb-md-20">
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
          <div v-if="filterMenuItemSelected == 'price'">
            <vue-range-slider ref="priceRangeSlider" v-model="priceValues" :min="priceMin" :max="priceMax" :step="priceStep" :enable-cross="false" :height="2"></vue-range-slider>
            <div class="values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*priceMax/4}}€ </span>
            </div>

            <div class="mt-md-40 price-min-max-container">
              <div class="min-max-input-item">
                <label for="priceSelectedMin">Minimum Price</label>
                <input type="number" :min="priceMin" :value="priceValues[0]" @input="validateMinMaxInput('minPrice', $event.target.value)" class="form-group__text" id="priceSelectedMin">
              </div>
              <div class="min-max-input-item">
                <label for="priceSelectedMax">Maximum Price</label>
                <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateMinMaxInput('maxPrice', $event.target.value)" class="form-group__text" id="priceSelectedMax">
              </div>
            </div>
          </div>

          <!-- MORE -->
          <div v-if="filterMenuItemSelected == 'more'">
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
          <div class="filter-side-menu-main p-md-10">
            <div>
              <h3 class="m-md-10">Selections</h3>

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

      <h6 class="mt-md-50">9999 ASSETS</h6>

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
import 'leaflet-easybutton/src/easy-button.css';
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

  // filterMenuItems: string[];
  filterMenuItems: {id: string, name: string}[];

  filterMenuItemSelected: string;

  filters: filterCategory[];

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageSelectionBBox: string;

  scaleValues: number[];

  scaleMin: number;

  scaleMax: number;

  scaleStep: number;

  priceValues: number[];

  priceMin: number;

  priceMax: number;

  priceStep: number;

  constructor() {
    super();

    dom.watch();

    this.filterMenuItems = [{ id: 'type', name: 'TYPE' }, { id: 'update', name: 'UPDATE' }, { id: 'topic', name: 'TOPIC' }, { id: 'format', name: 'FORMAT' }, { id: 'crs', name: 'CRS' }, { id: 'scale', name: 'SCALE' }, { id: 'coverage', name: 'COVERAGE' }, { id: 'price', name: 'PRICE' }, { id: 'more', name: 'MORE' }];

    this.query = '';
    this.queryResults = [];
    this.catalogQuery = {
      page: 0,
      size: 6,
      query: this.query,
    };
    this.catalogueApi = new CatalogueApi();

    this.filterMenuItemSelected = '';

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

    this.mapCoverageSelectionBBox = '';

    this.scaleValues = [200, 1000000];
    this.scaleMin = 200;
    this.scaleMax = 1000000;
    this.scaleStep = 200;

    this.priceValues = [0, 5000];
    this.priceMin = 0;
    this.priceMax = 5000;
    this.priceStep = 1;
  }

  @Watch('filterMenuItemSelected')
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

  selectfilterMenuItem(filterItem: string): void {
    this.filterMenuItemSelected = filterItem;
  }

  removeFilter(category: string, filterName: string): void {
    switch (category) {
      case 'type':
      case 'topic': {
        const option = this.filters.find((x) => x.name === category)
        ?.options
        .find((x) => x.name === filterName);
        // eslint-disable-next-line
        option!.isChecked = false;
        break;
      }
      case 'update': {
        switch (filterName) {
          case 'From': {
            // eslint-disable-next-line
            this.filters.find((x) => x.name === category)!.options[0].value = '';
            // eslint-disable-next-line
            this.filters.find((x) => x.name === category)!.options[2].value = '00:00 AM';
            break;
          }
          case 'To': {
            // eslint-disable-next-line
            this.filters.find((x) => x.name === category)!.options[1].value = '';
            // eslint-disable-next-line
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
    this.filterMenuItemSelected = '';
  }

  getFiltersChecked(category: string): filterOption[] {
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
  dateFormatter(date: string): string {
    const splitted = date.toString().split(' ');
    const d = splitted[2];
    const m = splitted[1];
    const y = splitted[3];
    return `${d} ${m} ${y}`;
  }

  initMapCoverage(): void {
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

  mapExtendToSelection(): void {
    this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());
    this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
  }

  // validateSelectedMinPrice(minPrice: string): void {
  //   const price = Number(minPrice);
  //   this.priceValues[0] = price > this.priceValues[1] ? this.priceValues[1] : price;
  //   (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
  // }

  // validateSelectedMaxPrice(maxPrice: string): void {
  //   const price = Number(maxPrice);
  //   this.priceValues[1] = price < this.priceValues[0] ? this.priceValues[0] : price;
  //   (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
  // }

  validateMinMaxInput(input: string, value: number): void {
    switch (input) {
      case 'minPrice': {
        const minPrice = Number(value);
        this.priceValues[0] = minPrice > this.priceValues[1] ? this.priceValues[1] : minPrice;
        (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        break;
      }
      case 'maxPrice': {
        const maxPrice = Number(value);
        this.priceValues[1] = maxPrice < this.priceValues[0] ? this.priceValues[0] : maxPrice;
        (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        break;
      }
      default:
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_errorpage.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/_catalogue-filters.scss";
</style>
