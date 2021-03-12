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
              <div class="d-flex flex-column">
                <h5 class="date-labels">From date</h5>
                <datepicker :inline="true" v-model="filters.find((x) => x.name == 'update').options[0].value" placeholder="select date"></datepicker>
                <div class="mt-md-30" v-if="filters.find((x) => x.name == 'update').options[0].value">
                  <h5 class="mt-md-30 date-labels">From time</h5>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filters.find((x) => x.name == 'update').options[2].value" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex flex-column ml-md-15">
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
          <div class="tab-topic" v-if="filterMenuItemSelected == 'topic'">
            <div class="checkbox-group mb-md-2" v-for="topic in filters.find(x => x.name == 'topic').options" :key="topic.name">
              <input type="checkbox" class="mr-md-10" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div v-if="filterMenuItemSelected == 'format'" class="d-flex">

            <div class="flex-grow-1" v-if="shownFormatCategories().includes('vector')">
              <h3 class="format-category-title">Vector</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.vector" :key="format.id">
                <input type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div class="flex-grow-1" v-if="shownFormatCategories().includes('raster')">
              <h3 class="format-category-title">Raster</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.raster" :key="format.id">
                <input type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div class="flex-grow-1" v-if="shownFormatCategories().includes('api')">
              <h3 class="format-category-title">API</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.api" :key="format.id">
                <input type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

          </div>

          <!-- CRS -->
          <div v-if="filterMenuItemSelected == 'crs'">
            <small>Popular CRS</small>
            <div class="checkbox-group mt-md-10 mb-md-5">
              <input type="checkbox" class="mr-md-10" id="EPSG:4326">
              <label for="EPSG:4326">WGS84 | EPSG:4326</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" class="mr-md-10" id="EPSG:3857">
              <label for="EPSG:3857">EPSG:3857</label>
            </div>

            <div class="mt-md-30">
              <small>Search for CRS</small>
              <input type="text" class="form-group__text mt-md-20" placeholder="CRS name or Code">
            </div>

          </div>

          <!-- SCALE -->
          <div v-if="filterMenuItemSelected == 'scale'">
            <div @click="onScaleSliderClick">
              <vue-slider :processStyle="{ background: isScaleSliderDisabled()? 'whitesmoke' : '#1a0aff' }" :dotSize="isScaleSliderDisabled()? 0 : 16" :disabled="isScaleSliderDisabled()" v-model="scaleValues" :data="scaleSliderOptions" :data-value="'id'" :data-label="'name'" :adsorb="true" :tooltip="'none'" :height="2" :marks="false" />
            </div>

            <!-- <div class="values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*(scaleMax - scaleMin)/4 + scaleMin}}€ </span>
            </div> -->

            <div class="mt-md-40 min-max-container">
              <div class="min-max-input-item">
                <label for="scaleSelectedMin">Minimum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :min="scaleMin" :value="scaleValues[0]" @input="validateMinMaxInput('minScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMin">
                </div>
              </div>
              <div class="min-max-input-item ml-md-20">
                <label for="scaleSelectedMax">Maximum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :max="scaleMax" :value="scaleValues[1]" @input="validateMinMaxInput('maxScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMax">
                </div>
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
                <div class="d-flex">
                  <span><strong>3</strong></span>
                  <div class="select-area-text">
                    Or select an area of interest via a bounding box on the map.
                    <div class="form-group mt-md-10">
                      <label class="control control-radio">
                        Box overlaps with asset geometry
                        <input type="radio" name="asset_type" checked />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="control control-radio">
                        Box fully contains asset geometry
                        <input type="radio" name="asset_type" />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="control control-radio">
                        Box is fully covered by asset geometry
                        <input type="radio" name="asset_type" />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div id="mapCoverage"></div>
            </div>
          </div>

          <!-- PRICE -->
          <div v-if="filterMenuItemSelected == 'price'">
            <!-- <vue-range-slider ref="priceRangeSlider" v-model="priceValues" :min="priceMin" :max="priceMax" :step="priceStep" :enable-cross="false" :height="2"></vue-range-slider> -->
            <vue-slider :dotSize="16" v-model="priceValues" :min="priceMin" :max="priceMax" :tooltip="'none'" :height="2" />

            <div class="values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*priceMax/4}}€ </span>
            </div>

            <div class="mt-md-40 min-max-container">
              <div class="min-max-input-item">
                <label for="priceSelectedMin">Minimum Price</label>
                <input type="number" :min="priceMin" :value="priceValues[0]" @input="validateMinMaxInput('minPrice', $event.target.value)" class="form-group__text" id="priceSelectedMin">
              </div>
              <div class="min-max-input-item ml-md-20">
                <label for="priceSelectedMax">Maximum Price</label>
                <!-- <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateMinMaxInput('maxPrice', $event.target.value)" class="form-group__text" id="priceSelectedMax"> -->
                <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateMinMaxInput('maxPrice', $event.target.value)" class="form-group__text" id="priceSelectedMax">
              </div>
            </div>
          </div>

          <!-- MORE -->
          <div class="tab-more" v-if="filterMenuItemSelected == 'more'">
            <div class="form-group">
              <label for="postal_code">Minimum number of Features</label>
              <input type="number" class="form-group__text" name="postal_code" id="postal_code" placeholder="e.g. 1500">
            </div>

            <hr>

            <div class="form-group">
              <label for="postal_code">Search by Vendor</label>
              <input type="text" class="form-group__text" name="postal_code" id="postal_code" placeholder="Vendor name">
            </div>

            <div class="form-group">
              <label for="postal_code">Search by Language</label>
              <input type="text" class="form-group__text" name="postal_code" id="postal_code" placeholder="Language">
            </div>

            <div class="form-group">
              <label for="postal_code">Search by License</label>
              <input type="text" class="form-group__text" name="postal_code" id="postal_code" placeholder="License">
            </div>
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

              <!-- FORMAT -->
              <div class="pill" v-for="filter in getFiltersChecked('format')" :key="filter.name">
                <span>{{filter.name}}</span>
                <div class="close-button" @click="removeFilter('format', filter.name)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- SCALE -->
              <div class="pill" v-if="scaleValues[0] != scaleMin || scaleValues[1] != scaleMax">
                1:{{scaleValues[1]}} - 1:{{scaleValues[0]}}€
                <div class="close-button" @click="removeFilter('scale')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- COVERAGE -->
              <div class="pill" v-if="mapCoverageSelectionBBox">
                Area selection
                <div class="close-button" @click="removeFilter('coverage')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- PRICE -->
              <div class="pill" v-if="priceValues[0] != priceMin || priceValues[1] != priceMax">
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
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
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
    VueSlider,
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

  formats: {api: { id: string, name: string, isChecked: boolean }[], vector: { id: string, name: string, isChecked: boolean }[], raster: { id: string, name: string, isChecked: boolean }[], };

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageSelectionBBox: string;

  scaleValues: number[];

  scaleSliderOptions: {id: number, name: string}[];

  scaleMin: number;

  scaleMax: number;

  // scaleStep: number;

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

    this.formats = {
      vector: [{ id: 'shp', name: 'Shapefile', isChecked: false }, { id: 'geoPackage', name: 'GeoPackage', isChecked: false }, { id: 'geoJson', name: 'GeoJSON', isChecked: false }],
      raster: [{ id: 'png', name: 'PNG', isChecked: false }, { id: 'jpeg', name: 'JPEG', isChecked: false }, { id: 'tiff', name: 'Tiff', isChecked: false }],
      api: [{ id: 'wms', name: 'WMS', isChecked: false }, { id: 'wfs', name: 'WFS', isChecked: false }, { id: 'wcs', name: 'WCS', isChecked: false }, { id: 'wmts', name: 'WMTS', isChecked: false }, { id: 'wps', name: 'WPS', isChecked: false }, { id: 'wcps', name: 'WCPS', isChecked: false }],
    };

    this.mapCoverageSelectionBBox = '';

    this.scaleValues = [10, 10000000];
    this.scaleSliderOptions = [
      { id: 10, name: '1 : 10' },
      { id: 100, name: '1 : 100' },
      { id: 1000, name: '1 : 1.000' },
      { id: 10000, name: '1 : 10.000' },
      { id: 100000, name: '1 : 100.000' },
      { id: 1000000, name: '1 : 1.000.000' },
      { id: 10000000, name: '1 : 10.000.000' },
    ];
    this.scaleMin = 10;
    this.scaleMax = 10000000;
    // this.scaleStep = 10;

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
      case 'format': {
        const option = Object.values(this.formats)
          .flat()
          .find((x) => x.name === filterName);
        // eslint-disable-next-line
        option!.isChecked = false;

        break;
      }
      case 'coverage': {
        this.mapCoverageSelectionBBox = '';
        break;
      }
      case 'price': {
        this.priceValues = [this.priceMin, this.priceMax];
        break;
      }
      case 'scale': {
        this.scaleValues = [this.scaleMin, this.scaleMax];
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

      case 'format':
        result = Object.values(this.formats)
          .flat()
          .filter((x) => x.isChecked);
        break;

      default:
    }

    return result;
  }

  shownFormatCategories(): string[] {
    const isVectorChecked = this.filters.find((x) => x.name === 'type')?.options.find((x) => x.name === 'Vector dataset')?.isChecked;
    const isRasterChecked = this.filters.find((x) => x.name === 'type')?.options.find((x) => x.name === 'Raster dataset')?.isChecked;
    const isApiChecked = this.filters.find((x) => x.name === 'type')?.options.find((x) => x.name === 'API')?.isChecked;

    let res: string[] = [];

    // if no selection, return results for all
    if (!isVectorChecked && !isRasterChecked && !isApiChecked) {
      res = ['vector', 'raster', 'api'];
      return res;
    }

    if (isVectorChecked) {
      res.push('vector');
    }
    if (isRasterChecked) {
      res.push('raster');
    }
    if (isApiChecked) {
      res.push('api');
    }
    return res;
  }

  isScaleSliderDisabled(): boolean {
    if (this.scaleSliderOptions.map((x) => x.id).includes(this.scaleValues[0]) && this.scaleSliderOptions.map((x) => x.id).includes(this.scaleValues[1])) {
      return false;
    }
    return true;
  }

  onScaleSliderClick(): void {
    if (this.isScaleSliderDisabled()) {
      this.scaleValues = [this.scaleMin, this.scaleMax];
    }
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
        let min = Number(value);
        min = min > this.priceValues[1] ? this.priceValues[1] : min;
        min = min < this.priceMin ? this.priceMin : min;
        this.priceValues = [min, this.priceValues[1]];
        // this.priceValues = [minPrice > this.priceValues[1] ? this.priceValues[1] : minPrice, this.priceValues[1]];
        // (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        break;
      }
      case 'maxPrice': {
        let max = Number(value);
        max = max < this.priceValues[0] ? this.priceValues[0] : max;
        max = max > this.priceMax ? this.priceMax : max;
        this.priceValues = [this.priceValues[0], max];
        // this.priceValues = [this.priceValues[0], maxPrice < this.priceValues[0] ? this.priceValues[0] : maxPrice];
        // (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        break;
      }
      case 'minScale': {
        console.log('min scale');
        const minScale = Number(value);
        this.scaleValues = [minScale > this.scaleValues[1] ? this.scaleValues[1] : minScale, this.scaleValues[1]];
        // (this as any).$refs.scaleRangeSlider.setValue(this.scaleValues);
        break;
      }
      case 'maxScale': {
        const maxScale = Number(value);
        this.scaleValues = [this.scaleValues[0], maxScale < this.scaleValues[0] ? this.scaleValues[0] : maxScale];
        // (this as any).$refs.scaleRangeSlider.setValue(this.scaleValues);
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
