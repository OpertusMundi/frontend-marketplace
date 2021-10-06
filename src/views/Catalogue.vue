<template>
  <div class="assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>Assets</h1>
      </div>
      <div class="d-flex space-between">
        <div class="form-group catalogue_search">
          <input v-model="catalogQuery.query" placeholder="Search in Assets" type="text" class="form-group__text" name="search_assets" id="search_assets">
          <div class="catalogue_search__button" @click="searchTextOnly"><img src="@/assets/images/icons/search_black.svg" alt=""></div>
        </div>
        <div class="d-inline-flex align-items-center">
          <div class="btn--checkbox-type" :class="{'btn--checkbox-type--selected': filters.isOpen}" @click="onToggleFilterShortcut('OPEN')">Open</div>
          <div class="btn--checkbox-type" :class="{'btn--checkbox-type--selected': filters.types.find((x) => x.id === 'VECTOR').isChecked}" @click="onToggleFilterShortcut('VECTOR')">Vector</div>
          <div class="btn--checkbox-type" :class="{'btn--checkbox-type--selected': filters.types.find((x) => x.id === 'RASTER').isChecked}" @click="onToggleFilterShortcut('RASTER')">Raster</div>
          <div class="btn--checkbox-type" :class="{'btn--checkbox-type--selected': filters.types.find((x) => x.id === 'SERVICE').isChecked}" @click="onToggleFilterShortcut('SERVICE')">APIs</div>
        </div>
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

      <div v-show="filterMenuItemSelected" class="filter-dialog-wrapper">
        <div class="filter-container">

          <!-- TYPE -->
          <div class="tab tab-type" v-show="filterMenuItemSelected == 'type'">
            <div class="checkbox-group mt-xs-10" v-for="type in filters.types" :key="type.name">
              <input type="checkbox" class="mr-xs-10" :id="`type_${type.name}`" v-model="type.isChecked">
              <label :for="`type_${type.name}`"> {{type.name}} </label>
            </div>
          </div>

          <!-- UPDATED -->
          <div class="tab tab-update" v-show="filterMenuItemSelected == 'update'">
            <h5 class="date-labels"><strong>Select last update date</strong></h5>
            <div class="d-flex">
              <div class="d-flex flex-column">
                <div class="d-flex space-between mb-xs-5">
                  <small class="date-labels">From date</small>
                  <div class="flex align-items-center">
                    <button v-if="filters.updated.dateFrom" @click="removeFilter(false, 'update', 'date_from')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="filters.updated.dateFrom" placeholder="select date"></datepicker>
                <div class="mt-xs-30" v-if="filters.updated.dateFrom">
                  <div class="d-flex space-between mb-xs-5">
                    <small class="date-labels">From time</small>
                    <div class="flex align-items-center">
                      <button v-if="filters.updated.timeFrom != '00:00 AM'" @click="removeFilter(false, 'update', 'time_from')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filters.updated.timeFrom" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex flex-column ml-xs-15">
                <div class="d-flex space-between mb-xs-5">
                  <small class="date-labels">To date</small>
                  <div class="flex align-items-center">
                    <button v-if="filters.updated.dateTo" @click="removeFilter(false, 'update', 'date_to')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="filters.updated.dateTo" placeholder="select date"></datepicker>
                <div class="mt-xs-30" v-if="filters.updated.dateTo">
                  <div class="d-flex space-between mb-xs-5">
                    <small class="date-labels">To time</small>
                    <div class="flex align-items-center">
                      <button v-if="filters.updated.timeTo != '23:59 PM'" @click="removeFilter(false, 'update', 'time_to')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filters.updated.timeTo" placeholder="select time"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- TOPIC -->
          <div class="tab tab-topic" v-show="filterMenuItemSelected == 'topic'">
            <div class="checkbox-group mb-xs-2" v-for="topic in filters.topics" :key="topic.name">
              <input type="checkbox" class="mr-xs-10" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div class="tab tab-format d-flex" v-show="filterMenuItemSelected == 'format'">

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('vector') }" class="flex-grow-1">
              <h3 class="format-category-title">Vector</h3>
              <div class="checkbox-group mb-xs-5" v-for="format in filters.formats.vector" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('vector')" type="checkbox" class="mr-xs-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('raster') }" class="flex-grow-1">
              <h3 class="format-category-title">Raster</h3>
              <div class="checkbox-group mb-xs-5" v-for="format in filters.formats.raster" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('raster')" type="checkbox" class="mr-xs-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('api') }" class="flex-grow-1">
              <h3 class="format-category-title">API</h3>
              <div class="checkbox-group mb-xs-5" v-for="serviceType in filters.serviceTypes" :key="serviceType.id">
                <input :disabled="!shownFormatCategories().includes('api')" type="checkbox" class="mr-xs-10" :id="`format_${serviceType.id}`" v-model="serviceType.isChecked">
                <label :for="`format_${serviceType.id}`"> {{serviceType.name}} </label>
              </div>
            </div>

          </div>

          <!-- CRS -->
          <div class="tab tab-crs" v-show="filterMenuItemSelected == 'crs'">
            <small>Popular CRS</small>
            <div class="mt-xs-10">
              <div v-for="crs in filters.crsList" :key="crs.code" class="checkbox-group mb-xs-5">
                <input type="checkbox" class="mr-xs-10" :id="'EPSG_' + crs.code" v-model="crs.isChecked">
                <label :for="'EPSG_' + crs.code"> {{`EPSG:${crs.code}, ${crs.description}`}} </label>
              </div>
            </div>

            <div class="mt-xs-30">
              <small>Search for CRS</small>
              <input v-model="crsSearchString" @input="searchCrs($event.target.value)" type="text" class="form-group__text mt-xs-10" placeholder="CRS name or Code">
              <div v-if="crsSearchString" class="crs-search-autocomplete">
                <ul>
                  <li @click="addCrsToList(crs)" v-for="crs in crsSearchList" :key="crs.code">{{`EPSG:${crs.code}, ${crs.description}`}}</li>
                </ul>
              </div>
            </div>

          </div>

          <!-- SCALE -->
          <div class="tab tab-scale" v-show="filterMenuItemSelected == 'scale'">
            <!-- <div class="ml-xs-20 mr-xs-20" @click="onScaleSliderClick">
              <vue-slider :processStyle="{ background: isScaleSliderDisabled()? 'whitesmoke' : '#1a0aff' }" :dotSize="isScaleSliderDisabled()? 0 : 16" :disabled="isScaleSliderDisabled()" v-model="filters.scaleValues" :data="scaleSliderOptions" :data-value="'id'" :data-label="'name'" :adsorb="true" :tooltip="'none'" :height="2" :marks="false" :direction="'rtl'" />
            </div> -->

            <div class="min-max-container">
              <div class="min-max-input-item">
                <label for="scaleSelectedMin" class="mb-xs-10">Minimum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :min="scaleMax" :value="filters.scaleValues[1]" @input="validateMinMaxInput('maxScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMin">
                </div>
              </div>
              <div class="min-max-input-item ml-xs-20">
                <label for="scaleSelectedMax" class="mb-xs-10">Maximum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :max="scaleMin" :value="filters.scaleValues[0]" @input="validateMinMaxInput('minScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMax">
                </div>
              </div>
            </div>
            <p class="mt-xs-20 mb-xs-10"><label class="ml-xs-20 grayed">Common scales</label></p>
            <div class="d-inline-flex">
              <div class="btn--checkbox-type" :class="{'btn--checkbox-type--selected': scale.isChecked}" v-for="scale in filters.fixedScales" :key="scale.id" @click="togglePopularScale(scale.id)">{{ scale.label }}</div>
            </div>

          </div>

          <!-- COVERAGE -->
          <div class="tab tab-coverage" v-show="filterMenuItemSelected == 'coverage'">
            <div class="coverage-map-menu-container">
              <div class="coverage-side-menu">
                <div class="d-flex align-items-center mb-xs-20">
                  <span><strong>1</strong></span>
                  <div class="mr-xs-10">
                    <select @change="onCountrySelected($event.target.value)" :disabled="filters.mapCoverageSelectionBBox || mapCoverageDrawMode ? true : false" v-model="countrySelected" class="form-group__select">
                      <option value="">(Select country)</option>
                      <option v-for="country in countries" :value="country.code" :key="country.code"> {{ country.name }} </option>
                    </select>
                  </div>
                </div>
                <div class="d-flex">
                  <span><strong>2</strong></span>
                  <div class="select-area-text">
                    Or select an area of interest via a bounding box on the map.
                    <div class="form-group mt-xs-10">
                      <label class="control control-radio">
                        Box overlaps with asset geometry
                        <input v-model="filters.spatialOperation" value="INTERSECTS" type="radio" name="asset_type" />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="control control-radio">
                        Box fully contains asset geometry
                        <input v-model="filters.spatialOperation" value="CONTAINS" type="radio" name="asset_type" />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="control control-radio">
                        Box is fully covered by asset geometry
                        <input v-model="filters.spatialOperation" value="WITHIN" type="radio" name="asset_type" />
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                    <button v-if="mapCoverageSelectionIsDrawn && !filters.mapCoverageSelectionBBox" @click="onSetArea" style="float: right" class="btn--std btn--blue">Set Area</button>
                    <button v-if="mapCoverageSelectionRectangle && filters.mapCoverageSelectionBBox" @click="onClearArea(false)" style="float: right" class="btn--std btn--outlineblue">Clear Selection</button>
                  </div>
                </div>
              </div>

              <div class="map-coverage-wrapper">
                <div id="mapCoverage">
                </div>
                <input type="text" class="form-group__text" placeholder="Search City/Area">
                <button v-if="!mapCoverageSelectionRectangle && !mapCoverageDrawMode" @click="onDrawArea" class="btn--std btn--blue"><font-awesome-icon class="mr-xs-10" icon="vector-square" /> Draw Area</button>
              </div>

            </div>
          </div>

          <!-- PRICE -->
          <div class="tab tab-price" v-show="filterMenuItemSelected == 'price'">
            <div class="min-max-container">
              <div class="min-max-input-item">
                <label for="priceSelectedMin">Minimum Price €</label>
                <input type="number" :min="0" v-model="filters.priceMin" placeholder="Free" class="form-group__text">
              </div>
              <div class="min-max-input-item ml-xs-20">
                <label for="priceSelectedMax">Maximum Price €</label>
                <input type="number" :min="0" v-model="filters.priceMax" placeholder="No Limit" class="form-group__text">
              </div>
            </div>
          </div>

          <!-- MORE -->
          <div class="tab tab-more" v-show="filterMenuItemSelected == 'more'">

            <div class="tab-more-side-menu d-flex flex-column">
              <span v-for="filter in filterMoreSubmenuItems"
                :key="filter.id"
                @click="selectFilterMoreSubmenuItem(filter.id)"
                :class="{ active: filterMoreSubmenuItemSelected == filter.id }">
                  {{ filter.name }}
              </span>
            </div>

            <div class="tab-more-main p-xs-20 pl-xs-30">
              <!-- NUMBER OF FEATURES -->
              <div class="ml-xs-20" v-show="filterMoreSubmenuItemSelected == 'numberOfFeatures'">
                <h4>Dataset size</h4>
                <div class="checkbox-group mt-xs-10">
                  <input v-model="filters.numberOfFeatures.isSmallChecked" type="checkbox" class="mr-xs-10" id="dataset_small">
                  <label for="dataset_small"> Small <small class="grayed ml-xs-20">&lt; 1000 features</small></label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input v-model="filters.numberOfFeatures.isMediumChecked" type="checkbox" class="mr-xs-10" id="dataset_medium">
                  <label for="dataset_medium"> Medium <small class="grayed ml-xs-20">1000 - 100.000 features</small></label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input v-model="filters.numberOfFeatures.isLargeChecked" type="checkbox" class="mr-xs-10" id="dataset_large">
                  <label for="dataset_large"> Large <small class="grayed ml-xs-20">&gt; 100.000 features</small></label>
                </div>
              </div>

              <!-- AREA OF INTEREST -->
              <div v-show="filterMoreSubmenuItemSelected == 'areaOfInterest'">
                <h4>Area of Interest</h4>
                <span style="color: orange">more to be added</span>
              </div>

              <!-- ATTRIBUTES -->
              <div v-show="filterMoreSubmenuItemSelected == 'attributes'">
                <div class="form-group">
                  <label>Fields that must be contained in dataset</label>
                  <div class="d-flex">
                    <div>
                      <input v-for="(attribute, i) in filters.attributes" :key="i" v-model="filters.attributes[i]" type="text" class="form-group__text" :name="'search_attribute_' + i" :id="'search_attribute_' + i" placeholder="attribute name">
                    </div>
                    <button @click="addAttribute" class="fab-button align-self-end ml-xs-15 mb-xs-10">+</button>
                  </div>
                </div>
              </div>

              <!-- VENDOR -->
              <div v-show="filterMoreSubmenuItemSelected == 'vendor'">
                <div class="form-group">
                  <label>Search by Vendor</label>
                  <div class="d-flex">
                    <div>
                      <input v-for="(vendor, i) in filters.vendors" :key="i" v-model="filters.vendors[i]" type="text" class="form-group__text" :name="'search_vendor_' + i" :id="'search_vendor_' + i" placeholder="Vendor name">
                    </div>
                    <button @click="addVendor" class="fab-button align-self-end ml-xs-15 mb-xs-10">+</button>
                  </div>
                </div>
              </div>

              <!-- LANGUAGE -->
              <div v-show="filterMoreSubmenuItemSelected == 'language'">
                <h4>Language of asset fields / labels</h4>
                <div class="filters__language_container">
                  <div class="checkbox-group mt-xs-10" v-for="language in filters.languages" :key="language.code">
                    <input :value="language.code" v-model="language.isChecked" type="checkbox" class="mr-xs-10" :id="`lang_${language.code}`">
                    <label :for="`lang_${language.code}`"> {{ language.name }}</label>
                  </div>
                </div>
              </div>

              <!-- LICENSE -->
              <div v-show="filterMoreSubmenuItemSelected == 'license'">
                <h4>Permitted use</h4>
                <span style="color: orange">more to be added</span>
                <div v-for="license in filters.licenses" :key="license.id">
                  <div class="checkbox-group mt-xs-10">
                    <input v-model="license.isChecked" type="checkbox" class="mr-xs-10" :id="`license_${license.id}`">
                    <label :for="`license_${license.id}`"> {{ license.name }}</label>
                  </div>
                </div>

                <!-- <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="license_open">
                  <label for="license_open"> Open license</label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="license_organization">
                  <label for="license_organization"> Within your organization</label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="license_webgis">
                  <label for="license_webgis"> Web-GIS applications</label>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div class="filter-side-menu">
          <!-- DISPLAY OF FILTERS CHECKED -->
          <div class="filter-side-menu-main p-xs-10">
            <div>
              <h3 class="m-xs-10">Selections</h3>

              <div class="pill" v-for="filter in getSelectedFilters(false)" :key="filter.label">
                {{ filter.label }}
                <div class="close-button" @click="removeFilter(false, filter.category, filter.filterName)"><font-awesome-icon icon="times" /></div>
              </div>
            </div>
          </div>
          <div class="filter-side-menu-bottom">
            <button class="btn--std btn--outlineblue" @click="closeFilters()">CANCEL</button>
            <button @click="searchUsingFilters(false)" class="btn--std btn--blue">APPLY FILTERS</button>
          </div>
        </div>
      </div>

      <div class="assets__top-info">
        <div class="pill" v-for="filter in getSelectedFilters(true)" :key="filter.label">
          {{ filter.label }}
          <div class="close-button" @click="removeFilter(true, filter.category, filter.filterName)"><font-awesome-icon icon="times" /></div>
        </div>
      </div>

      <div class="filters mt-xs-30">
        <div class="filters__block">
          <p class="filters__title">
            <template v-if="!$store.getters.isLoading">
              {{ queryResultsCount }} ASSETS
            </template>
          </p>
        </div>
        <div class="filters__block">
          <div class="filters__block__select">
            <label for="filter">&uarr;&darr;</label>
            <select v-model="selectedOrderOption" name="filter" id="filter">
              <option v-for="orderOption in ['NAME ASCENDING', 'NAME DESCENDING', 'DATE ASCENDING', 'DATE DESCENDING', 'SCORE ASCENDING', 'SCORE DESCENDING']" :key="orderOption">{{ orderOption }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="assets__items">
        <catalogue-card v-for="asset in queryResults" v-bind:key="asset.id" :asset="asset"></catalogue-card>
      </div>
      <pagination :currentPage="queryCurrentPage" :itemsPerPage="catalogQuery.size" :itemsTotal="queryResultsCount" @pageSelection="onSelectPage" class="mt-xs-30"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import Pagination from '@/components/Pagination.vue';
import CatalogueApi from '@/service/catalogue';
import ConfigurationApi from '@/service/config';
import SpatialApi from '@/service/spatial';
import {
  CatalogueQueryResponse, CatalogueQuery, CatalogueItem,
} from '@/model';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import {
  CatalogueItemDetails,
  ElasticCatalogueQuery,
  EnumTopicCategory,
  EnumElasticSearchSortField,
  EnumDatasetSize,
  EnumSpatialOperation,
} from '@/model/catalogue';
import { Order } from '@/model/request';
// import { Configuration } from '@/model/configuration';
import { Filters, FilterCRS } from '@/model/catalogue-filters';
import store from '@/store';
import moment from 'moment';
import { cloneDeep } from 'lodash';
// import { AxiosError } from 'axios';
import VueSlider from 'vue-slider-component';
import Datepicker from 'vuejs-datepicker';
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-shades';
import 'vue-slider-component/theme/antd.css';
import epsgList from '../service/lists/epsg';
import countries from '../service/lists/countries';
import nuts from '../service/lists/nuts';

@Component({
  components: {
    CatalogueCard,
    Pagination,
    Datepicker,
    VueTimepicker,
    VueSlider,
  },
})
export default class Catalogue extends Vue {
  catalogQuery: CatalogueQuery;

  catalogueApi: CatalogueApi;

  configurationApi: ConfigurationApi;

  spatialApi: SpatialApi;

  queryResults: CatalogueItem[] | CatalogueItemDetails[];

  queryResultsCount: number | null;

  queryCurrentPage: number | null;

  selectedOrderOption: string;

  // query:string;

  // --- FILTERS ---

  filterMenuItems: {id: string, name: string}[];

  filterMoreSubmenuItems: {id: string, name: string}[];

  filterMenuItemSelected: string;

  filterMoreSubmenuItemSelected: string;

  filters: Filters;

  filtersApplied: Filters;

  // filters: filterCategory[];

  // types: FilterType[];

  // topics: FilterTopic[];

  // updated: FilterUpdated;

  // formats: FilterFormats;

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageDrawMode: boolean;

  mapCoverageSelectionIsDrawn: boolean;

  // mapCoverageSelectionBBox: string;

  mapShades: any;

  // scaleValues: number[];

  // scaleSliderOptions: {id: number, name: string}[];

  scaleMin: number;

  scaleMax: number;

  // priceMin: number|null;

  // priceMax: number|null;

  epsgAll: FilterCRS[];

  // crsList: FilterCRS[];

  crsSearchString: string;

  crsSearchList: FilterCRS[];

  countries: { code: string, name: string, bbox: number[] }[];

  areas: { code: string, name: string }[];

  countrySelected: string;

  // numberOfFeatures: { isSmallChecked: boolean, isMediumChecked: boolean, isLargeChecked: boolean };

  // vendors: string[];

  // attributes: string[];

  // licenses: { id: string, name: string, pillLabel: string, isChecked: boolean }[];

  constructor() {
    super();

    this.filterMenuItems = [{ id: 'type', name: 'TYPE' }, { id: 'coverage', name: 'COVERAGE' }, { id: 'price', name: 'PRICE' }, { id: 'topic', name: 'TOPIC' }, { id: 'update', name: 'UPDATE' }, { id: 'format', name: 'FORMAT' }, { id: 'crs', name: 'CRS' }, { id: 'scale', name: 'SCALE' }, { id: 'more', name: 'MORE' }];
    this.filterMoreSubmenuItems = [{ id: 'numberOfFeatures', name: 'Number of Features' }, { id: 'areaOfInterest', name: 'Area of Interest' }, { id: 'attributes', name: 'Attributes' }, { id: 'vendor', name: 'Vendor' }, { id: 'language', name: 'Language' }, { id: 'license', name: 'License' }];

    // this.query = '';
    this.queryResults = [];
    this.queryResultsCount = null;
    this.queryCurrentPage = null;
    this.catalogQuery = {
      page: 0,
      size: 5,
      query: '',
    };
    this.selectedOrderOption = 'DATE DESCENDING';

    this.catalogueApi = new CatalogueApi();
    this.configurationApi = new ConfigurationApi();
    this.spatialApi = new SpatialApi();

    this.filterMenuItemSelected = '';

    this.filterMoreSubmenuItemSelected = 'numberOfFeatures';

    this.filters = {} as Filters;

    this.filters.types = [
      {
        id: EnumAssetType.VECTOR,
        name: 'Vector dataset',
        pillLabel: 'Vector',
        isChecked: false,
      },
      {
        id: EnumAssetType.RASTER,
        name: 'Raster dataset',
        pillLabel: 'Raster',
        isChecked: false,
      },
      {
        id: EnumAssetType.SERVICE,
        name: 'API',
        pillLabel: 'API',
        isChecked: false,
      },
    ];

    // eslint-disable-next-line
    this.filters.topics = [{ id: EnumTopicCategory.BIOTA, name: 'Biota', pillLabel: 'Biota', isChecked: false }, { id: EnumTopicCategory.BOUNDARIES, name: 'Boundaries', pillLabel: 'Boundaries', isChecked: false }, { id: EnumTopicCategory.CLIMA, name: 'Clima', pillLabel: 'Clima', isChecked: false }, { id: EnumTopicCategory.ECONOMY, name: 'Economy', pillLabel: 'Economy', isChecked: false }, { id: EnumTopicCategory.ELEVATION, name: 'Elevation', pillLabel: 'Elevation', isChecked: false }, { id: EnumTopicCategory.ENVIRONMENT, name: 'Environment', pillLabel: 'Environment', isChecked: false }, { id: EnumTopicCategory.FARMING, name: 'Farming', pillLabel: 'Farming', isChecked: false }, { id: EnumTopicCategory.GEO_SCIENTIFIC, name: 'Geo-Scientific', pillLabel: 'Geo-Scientific', isChecked: false }, { id: EnumTopicCategory.HEALTH, name: 'Health', pillLabel: 'Health', isChecked: false }, { id: EnumTopicCategory.IMAGERY, name: 'Imagery', pillLabel: 'Imagery', isChecked: false }, { id: EnumTopicCategory.INLAND_WATERS, name: 'Inland Waters', pillLabel: 'Inland Waters', isChecked: false }, { id: EnumTopicCategory.INTELLIGENCE_MILITARY, name: 'Military Intelligence', pillLabel: 'Military Intelligence', isChecked: false }, { id: EnumTopicCategory.LOCATION, name: 'Location', pillLabel: 'Location', isChecked: false }, { id: EnumTopicCategory.OCEANS, name: 'Oceans', pillLabel: 'Oceans', isChecked: false }, { id: EnumTopicCategory.PLANNING_CADASTRE, name: 'Planning Cadastre', pillLabel: 'Planning Cadastre', isChecked: false }, { id: EnumTopicCategory.SOCIETY, name: 'Society', pillLabel: 'Society', isChecked: false }, { id: EnumTopicCategory.STRUCTURE, name: 'Structure', pillLabel: 'Structure', isChecked: false }, { id: EnumTopicCategory.TRANSPORTATION, name: 'Transportation', pillLabel: 'Transportation', isChecked: false }, { id: EnumTopicCategory.UTILITIES_COMMUNICATION, name: 'Utilities Communication', pillLabel: 'Utilities Communication', isChecked: false }];

    this.filters.updated = {
      dateFrom: '',
      dateTo: '',
      timeFrom: '00:00 AM',
      timeTo: '23:59 PM',
    };

    this.filters.formats = {
      vector: [], // loaded from config
      raster: [], // loaded from config
    };

    this.filters.serviceTypes = [
      {
        id: EnumSpatialDataServiceType.WMS,
        name: 'WMS',
        pillLabel: 'WMS',
        isChecked: false,
      },
      {
        id: EnumSpatialDataServiceType.WFS,
        name: 'WFS',
        pillLabel: 'WFS',
        isChecked: false,
      },
      {
        id: EnumSpatialDataServiceType.DATA_API,
        name: 'Data API',
        pillLabel: 'Data API',
        isChecked: false,
      },
    ];

    this.filters.mapCoverageSelectionBBox = '';

    this.filters.spatialOperation = EnumSpatialOperation.INTERSECTS;

    this.filters.isOpen = false;

    this.mapCoverageDrawMode = false;

    this.mapCoverageSelectionRectangle = null;

    this.mapCoverageSelectionIsDrawn = false;

    this.scaleMin = 10;
    this.scaleMax = 10000000;
    this.filters.scaleValues = [this.scaleMin, this.scaleMax];
    this.filters.fixedScales = [
      { id: 10000, label: '1:10.000', isChecked: false },
      { id: 25000, label: '1:25.000', isChecked: false },
      { id: 50000, label: '1:50.000', isChecked: false },
      { id: 100000, label: '1:100.000', isChecked: false },
      { id: 500000, label: '1:500.000', isChecked: false },
    ];

    // this.scaleSliderOptions = [
    //   { id: 10, name: '1 : 10' },
    //   { id: 100, name: '1 : 100' },
    //   { id: 1000, name: '1 : 1.000' },
    //   { id: 10000, name: '1 : 10.000' },
    //   { id: 100000, name: '1 : 100.000' },
    //   { id: 1000000, name: '1 : 1.000.000' },
    //   { id: 10000000, name: '1 : 10.000.000' },
    // ];

    this.filters.priceMin = null;
    this.filters.priceMax = null;

    this.epsgAll = epsgList;
    this.filters.crsList = [{ code: '4326', description: 'WGS84', isChecked: false }, { code: '3857', description: 'Pseudo-Mercator WGS84', isChecked: false }];
    this.crsSearchString = '';
    this.crsSearchList = [];

    this.countries = countries;
    this.areas = nuts;
    this.countrySelected = '';

    this.filters.numberOfFeatures = { isSmallChecked: false, isMediumChecked: false, isLargeChecked: false };
    this.filters.vendors = [''];
    this.filters.attributes = [''];
    this.filters.languages = [];
    this.filters.licenses = [
      // eslint-disable-next-line
      { id: 'open', name: 'Open license', pillLabel: 'open', isChecked: false },
      // eslint-disable-next-line
      { id: 'within_organisation', name: 'Within your organisation', pillLabel: 'within organisation', isChecked: false },
      // eslint-disable-next-line
      { id: 'web_gis', name: 'Web-GIS applications', pillLabel: 'web-GIS', isChecked: false },
    ];

    this.filtersApplied = cloneDeep(this.filters);
  }

  @Watch('filterMenuItemSelected')
  onFilterItemChanged(menuItem: string): void {
    if (menuItem === 'coverage' && !this.mapCoverage) {
      setTimeout(() => {
        this.initMapCoverage();
      }, 0);
    }
  }

  @Watch('selectedOrderOption')
  onSelectedOrderOptionChange(): void {
    this.searchUsingFilters(true);
  }

  mounted(): void {
    if (store.getters.getLastRouteName === 'CatalogueSingle') this.filtersApplied = store.getters.getLastAppliedFilters;

    if (this.$route.params.filterShortcut) {
      store.commit('setLoading', true);
      this.onToggleFilterShortcut(this.$route.params.filterShortcut);
    } else {
      this.searchUsingFilters(true);
    }

    this.filters.languages = store.getters.getConfig.configuration.europeLanguages.map((x) => ({ ...x, isChecked: false }));

    const availableFormats = store.getters.getConfig.configuration.asset.fileTypes.map((x) => ({ format: x.format, category: x.category }));
    console.log('formats', availableFormats);
    this.filters.formats.vector = availableFormats.filter((x) => x.category === EnumAssetType.VECTOR).map((x) => ({ id: x.format, name: x.format, isChecked: false }));
    this.filters.formats.raster = availableFormats.filter((x) => x.category === EnumAssetType.RASTER).map((x) => ({ id: x.format, name: x.format, isChecked: false }));
  }

  onSelectPage(i: number): void {
    console.log('page', i);
    this.catalogQuery.page = i;
    this.searchUsingFilters(true);
    // this.searchAssets();
  }

  selectfilterMenuItem(filterItem: string): void {
    this.filterMenuItemSelected = filterItem;
  }

  selectFilterMoreSubmenuItem(filterItem: string): void {
    this.filterMoreSubmenuItemSelected = filterItem;
  }

  onToggleFilterShortcut(filter: EnumAssetType | string): void {
    switch (filter) {
      case EnumAssetType.VECTOR:
      case EnumAssetType.RASTER:
      case EnumAssetType.SERVICE:
        // eslint-disable-next-line
        this.filters.types.find((x) => x.id === filter)!.isChecked = !this.filters.types.find((x) => x.id === filter)!.isChecked;
        break;
      case 'OPEN':
        this.filters.isOpen = !this.filters.isOpen;
        break;
      default:
    }

    // todo: check
    this.searchUsingFilters(false);
  }

  removeFilter(fromAppliedFilters: boolean, category: string, filterName?: string): void {
    const filters = fromAppliedFilters ? this.filtersApplied : this.filters;

    switch (category) {
      case 'type':
        // eslint-disable-next-line
        filters.types.find((x) => x.id === filterName)!.isChecked = false;
        break;
      case 'topic': {
        // eslint-disable-next-line
        filters.topics.find((x) => x.id === filterName)!.isChecked = false;
        break;
      }
      case 'crs': {
        // eslint-disable-next-line
        filters.crsList.find((x) => x.code === filterName)!.isChecked = false;
        break;
      }
      case 'update': {
        switch (filterName) {
          case 'date_from': {
            filters.updated.dateFrom = '';
            filters.updated.timeFrom = '00:00 AM';
            break;
          }
          case 'date_to': {
            filters.updated.dateTo = '';
            filters.updated.timeTo = '23:59 PM';
            break;
          }
          case 'time_from': {
            filters.updated.timeFrom = '00:00 AM';
            break;
          }
          case 'time_to': {
            filters.updated.timeTo = '23:59 PM';
            break;
          }
          default: {
            filters.updated.dateFrom = '';
            filters.updated.dateTo = '';
            filters.updated.timeFrom = '00:00 AM';
            filters.updated.timeTo = '23:59 PM';
          }
        }
        break;
      }
      case 'format': {
        const option = Object.values(filters.formats)
          .flat()
          .find((x) => x.id === filterName);
        // eslint-disable-next-line
        option!.isChecked = false;
        break;
      }
      case 'serviceType':
        // eslint-disable-next-line
        filters.serviceTypes.find((x) => x.id === filterName)!.isChecked = false;
        break;
      case 'coverage': {
        this.onClearArea(fromAppliedFilters);
        break;
      }
      case 'price': {
        filters.priceMin = null;
        filters.priceMax = null;
        break;
      }
      case 'scale': {
        filters.scaleValues = [this.scaleMin, this.scaleMax];
        break;
      }
      case 'fixedScale': {
        // eslint-disable-next-line
        filters.fixedScales.find((x) => `${x.id}` === filterName)!.isChecked = false;
        break;
      }
      case 'numberOfFeatures': {
        filters.numberOfFeatures = { isSmallChecked: false, isMediumChecked: false, isLargeChecked: false };
        break;
      }
      case 'attributes': {
        filters.attributes = filters.attributes.map(() => '');
        break;
      }
      case 'vendor': {
        filters.vendors = filters.vendors.map(() => '');
        break;
      }
      case 'language': {
        // eslint-disable-next-line
        filters.languages.find((x) => x.code === filterName)!.isChecked = false;
        break;
      }
      case 'license': {
        filters.licenses.forEach((x) => {
          // eslint-disable-next-line
          x.isChecked = false;
        });
        break;
      }
      case 'open': {
        filters.isOpen = false;
        break;
      }
      default:
    }

    if (fromAppliedFilters) {
      this.searchUsingFilters(true);
      this.removeFilter(false, category, filterName);
    }
  }

  closeFilters(): void {
    this.filterMenuItemSelected = '';
  }

  getSelectedFilters(onAppliedFilters: boolean): { label: string, category: string, filterName?: string }[] {
    const filters = onAppliedFilters ? this.filtersApplied : this.filters;

    let result = [] as { label: string, category: string, filterName?: string }[];

    // TYPE
    result = result.concat(
      filters.types.filter((x) => x.isChecked).map((x) => ({ label: x.pillLabel, category: 'type', filterName: x.id })),
    );

    // UPDATED
    if (filters.updated.dateFrom && !filters.updated.dateTo) {
      result.push({
        // eslint-disable-next-line
        label: `After ${this.dateFormatter(filters.updated.dateFrom)}${filters.updated.timeFrom !== '00:00 AM' ? ', ' + filters.updated.timeFrom : ''}`,
        category: 'update',
      });
    }
    if (!filters.updated.dateFrom && filters.updated.dateTo) {
      result.push({
        // eslint-disable-next-line
        label: `Before ${this.dateFormatter(filters.updated.dateTo)}${filters.updated.timeTo !== '23:59 PM' ? ', ' + filters.updated.timeTo : ''}`,
        category: 'update',
      });
    }
    if (filters.updated.dateFrom && filters.updated.dateTo) {
      result.push({
        // eslint-disable-next-line
        label: `${this.dateFormatter(filters.updated.dateFrom)}${filters.updated.timeFrom !== '00:00 AM' ? ', ' + filters.updated.timeFrom : ''} - ${this.dateFormatter(filters.updated.dateTo)}${filters.updated.timeTo !== '23:59 PM' ? ', ' + filters.updated.timeTo : ''}`,
        category: 'update',
      });
    }

    // TOPIC
    result = result.concat(
      filters.topics.filter((x) => x.isChecked).map((x) => ({ label: x.pillLabel, category: 'topic', filterName: x.id })),
    );

    // FORMAT
    result = result.concat(
      Object.values(filters.formats).flat().filter((x) => x.isChecked).map((x) => ({ label: x.name, category: 'format', filterName: x.id })),
    );

    // SERVICE TYPE
    result = result.concat(
      filters.serviceTypes.filter((x) => x.isChecked).map((x) => ({ label: x.pillLabel, category: 'serviceType', filterName: x.id })),
    );

    // SCALE
    if (filters.scaleValues[0] !== this.scaleMin || filters.scaleValues[1] !== this.scaleMax) {
      result.push({
        label: `1:${filters.scaleValues[1]} - 1:${filters.scaleValues[0]}`,
        category: 'scale',
      });
    }

    // FIXED SCALES
    result = result.concat(
      filters.fixedScales.filter((x) => x.isChecked).map((x) => ({ label: x.label, category: 'fixedScale', filterName: `${x.id}` })),
    );

    // CRS
    result = result.concat(
      filters.crsList.filter((x) => x.isChecked).map((x) => ({ label: `EPSG:${x.code}`, category: 'crs', filterName: x.code })),
    );

    // COVERAGE
    if (filters.mapCoverageSelectionBBox) {
      result.push({
        label: 'Area selection',
        category: 'coverage',
      });
    }

    // PRICE
    if (filters.priceMin && !filters.priceMax) {
      result.push({
        label: `>${filters.priceMin}€`,
        category: 'price',
      });
    }
    if (!filters.priceMin && filters.priceMax) {
      result.push({
        label: `<${filters.priceMax}€`,
        category: 'price',
      });
    }
    if (filters.priceMin && filters.priceMax) {
      result.push({
        label: `${filters.priceMin}€ - ${filters.priceMax}€`,
        category: 'price',
      });
    }

    // NUMBER OF FEATURES
    if (filters.numberOfFeatures.isSmallChecked && !filters.numberOfFeatures.isMediumChecked && !filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Small', category: 'numberOfFeatures' });
    if (!filters.numberOfFeatures.isSmallChecked && filters.numberOfFeatures.isMediumChecked && !filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Medium', category: 'numberOfFeatures' });
    if (!filters.numberOfFeatures.isSmallChecked && !filters.numberOfFeatures.isMediumChecked && filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Large', category: 'numberOfFeatures' });
    if (filters.numberOfFeatures.isSmallChecked && filters.numberOfFeatures.isMediumChecked && !filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Small & Medium', category: 'numberOfFeatures' });
    if (filters.numberOfFeatures.isSmallChecked && !filters.numberOfFeatures.isMediumChecked && filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Small & Large', category: 'numberOfFeatures' });
    if (!filters.numberOfFeatures.isSmallChecked && filters.numberOfFeatures.isMediumChecked && filters.numberOfFeatures.isLargeChecked) result.push({ label: 'Medium & Large', category: 'numberOfFeatures' });

    // ATTRIBUTES
    if (filters.attributes.some((x) => (x !== ''))) {
      result.push({
        label: `Attributes: ${this.getInputsAsOneLabel(filters.attributes)}`,
        category: 'attributes',
      });
    }

    // VENDOR
    if (filters.vendors.some((x) => (x !== ''))) {
      result.push({
        label: `Vendors: ${this.getInputsAsOneLabel(filters.vendors)}`,
        category: 'vendor',
      });
    }

    // LANGUAGES
    result = result.concat(
      filters.languages.filter((x) => x.isChecked).map((x) => ({ label: x.code.toUpperCase(), category: 'language', filterName: x.code })),
    );

    // LICENSES
    if (filters.licenses.some((x) => (x.isChecked))) {
      result.push({
        label: `Licenses: ${this.getInputsAsOneLabel(filters.licenses.filter((x) => x.isChecked).map((x) => x.pillLabel))}`,
        category: 'license',
      });
    }

    // OPEN
    if (filters.isOpen) {
      result.push({ label: 'Open', category: 'open' });
    }

    return result;
  }

  shownFormatCategories(): string[] {
    // eslint-disable-next-line
    const isVectorChecked = this.filters.types.find((x) => x.name === 'Vector dataset')!.isChecked;
    // eslint-disable-next-line
    const isRasterChecked = this.filters.types.find((x) => x.name === 'Raster dataset')!.isChecked;
    // eslint-disable-next-line
    const isApiChecked = this.filters.types.find((x) => x.name === 'API')!.isChecked;

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

  // isScaleSliderDisabled(): boolean {
  //   if (this.scaleSliderOptions.map((x) => x.id).includes(this.filters.scaleValues[0]) && this.scaleSliderOptions.map((x) => x.id).includes(this.filters.scaleValues[1])) {
  //     return false;
  //   }
  //   return true;
  // }

  // onScaleSliderClick(): void {
  //   if (this.isScaleSliderDisabled()) {
  //     this.filters.scaleValues = [this.scaleMin, this.scaleMax];
  //   }
  // }

  togglePopularScale(id: number): void {
    // eslint-disable-next-line
    this.filters.fixedScales.find((x) => x.id === id)!.isChecked = !this.filters.fixedScales.find((x) => x.id === id)!.isChecked;
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
    this.mapCoverage = (L as any).map('mapCoverage', { editable: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapCoverage);

    this.initMapView();
  }

  initMapView(): void {
    const latMin = 28.647719;
    const latMax = 73.426841;
    const lonMin = -32.519531;
    const lonMax = 58.359375;

    this.mapCoverage.fitBounds([[latMin, lonMin], [latMax, lonMax]]);
  }

  onCountrySelected(country: string): void {
    if (!country) {
      if (this.mapCoverageSelectionRectangle) {
        this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
        this.mapCoverageSelectionRectangle = null;
      }
      this.initMapView();
      return;
    }

    // eslint-disable-next-line
    const coords = this.countries
      .find((x) => x.code === country)!
      .bbox;

    if (this.mapCoverageSelectionRectangle) {
      this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
      this.mapCoverageSelectionRectangle = null;
    }
    this.mapCoverageSelectionRectangle = L.rectangle([[coords[1], coords[0]], [coords[3], coords[2]]], { color: '#190AFF', fillColor: 'transparent' })
      .addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.enableEdit();
    this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
      this.countrySelected = '';
      this.mapCoverageSelectionIsDrawn = true;
      this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds(), { padding: [50, 50] });
    });
    this.mapCoverageSelectionIsDrawn = true;
    this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds(), { padding: [50, 50] });
  }

  onSetArea(): void {
    this.filters.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
    this.mapShades = new (L as any).LeafletShades({ bounds: this.mapCoverageSelectionRectangle.getBounds() });
    this.mapShades.addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.disableEdit();
  }

  onClearArea(onAppliedFilters: boolean): void {
    if (this.mapShades) {
      this.mapShades.onRemove(this.mapCoverage);
    }
    if (this.mapCoverageSelectionRectangle) {
      this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
    }
    this.mapCoverageSelectionRectangle = null;
    this.mapShades = null;
    this.mapCoverageSelectionIsDrawn = false;

    if (onAppliedFilters) {
      this.filtersApplied.mapCoverageSelectionBBox = '';
    }
    this.filters.mapCoverageSelectionBBox = '';

    this.countrySelected = '';
  }

  onDrawArea(): void {
    this.mapCoverageDrawMode = true;
    this.mapCoverageSelectionRectangle = this.mapCoverage.editTools.startRectangle();
    this.mapCoverageSelectionRectangle.setStyle({ color: '#190AFF', fillColor: 'transparent' });
    this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
      this.countrySelected = '';
      this.mapCoverageSelectionIsDrawn = true;
      this.mapCoverageDrawMode = false;
      this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds(), { padding: [50, 50] });
    });
  }

  searchCrs(str: string): void {
    if (!str) {
      this.crsSearchList = [];
      return;
    }
    // const filtered = this.epsgAll.filter((x) => x.code.toLowerCase().includes(str.toLowerCase()) || x.description.toLowerCase().includes(str.toLowerCase()));
    // this.crsSearchList = filtered;

    const epsgPromise = Number.isNaN(Number(str)) ? this.spatialApi.getEpsgCodes(undefined, str) : this.spatialApi.getEpsgCodes(str, undefined);
    epsgPromise.then((epsgListResponse) => {
      console.log(epsgListResponse);
      this.crsSearchList = epsgListResponse.result.map((x) => ({ code: x.code.toString(), description: x.name, isChecked: false })).filter((x) => !this.filters.crsList.some((y) => y.code === x.code));
    });
  }

  addCrsToList(crs: FilterCRS): void {
    // eslint-disable-next-line
    crs.isChecked = true;
    this.filters.crsList.push(crs);
    this.crsSearchString = '';
    this.filters.crsList = JSON.parse(JSON.stringify(this.filters.crsList));
    this.epsgAll = this.epsgAll.filter((x) => x.code !== crs.code);
  }

  addVendor(): void {
    this.filters.vendors.push('');
  }

  addAttribute(): void {
    this.filters.attributes.push('');
  }

  validateMinMaxInput(input: string, value: number): void {
    switch (input) {
      case 'minScale': {
        const minScale = Number(value);
        this.filters.scaleValues = [minScale > this.filters.scaleValues[1] ? this.filters.scaleValues[1] : minScale, this.filters.scaleValues[1]];
        break;
      }
      case 'maxScale': {
        const maxScale = Number(value);
        this.filters.scaleValues = [this.filters.scaleValues[0], maxScale < this.filters.scaleValues[0] ? this.filters.scaleValues[0] : maxScale];
        break;
      }
      default:
    }
  }

  getInputsAsOneLabel(arr: string[]): string {
    let label = '';
    arr.forEach((x) => {
      if (x) {
        label += ', ';
        label += x;
      }
    });
    label = label.substring(1);
    return label;
  }

  searchTextOnly(): void {
    this.closeFilters();
    store.commit('setLoading', true);
    // this.searchAssets();
    this.searchUsingFilters(true);
  }

  // eslint-disable-next-line
  formatMoment(date: string, time: string): string {
    // return `${moment(date).format('YYYY-MM-DD')}_${moment(time, 'HH:mm a').format('HHmm')}`;
    // TODO: include time
    return moment(date).format('YYYY-MM-DD');
  }

  searchUsingFilters(byAlteringCurrentFilterState: boolean): void {
    this.closeFilters();
    store.commit('setLoading', true);

    const filters = byAlteringCurrentFilterState ? this.filtersApplied : this.filters;

    // const filters: string[] = [];
    const filterSet: Partial<ElasticCatalogueQuery> = {};

    // TEXT-SEARCH
    filterSet.text = this.catalogQuery.query;

    // PAGE PARAMS
    filterSet.page = this.catalogQuery.page;
    filterSet.size = this.catalogQuery.size;

    const orderOptions = [
      { option: 'NAME ASCENDING', orderBy: EnumElasticSearchSortField.TITLE, order: 'ASC' },
      { option: 'NAME DESCENDING', orderBy: EnumElasticSearchSortField.TITLE, order: 'DESC' },
      { option: 'DATE ASCENDING', orderBy: EnumElasticSearchSortField.REVISION_DATE, order: 'ASC' },
      { option: 'DATE DESCENDING', orderBy: EnumElasticSearchSortField.REVISION_DATE, order: 'DESC' },
      { option: 'SCORE ASCENDING', orderBy: EnumElasticSearchSortField.SCORE, order: 'ASC' },
      { option: 'SCORE DESCENDING', orderBy: EnumElasticSearchSortField.SCORE, order: 'DESC' },
    ];
    // eslint-disable-next-line
    filterSet.orderBy = orderOptions.find((x) => x.option === this.selectedOrderOption)!.orderBy;
    // eslint-disable-next-line
    filterSet.order = orderOptions.find((x) => x.option === this.selectedOrderOption)!.order as Order;

    // TYPE
    if (filters.types.some((x) => x.isChecked)) {
      filterSet.type = filters.types.filter((x) => x.isChecked).map((x) => x.id as EnumAssetType);
    }

    // UPDATED
    // TODO: check format
    if (filters.updated.dateFrom) {
      filterSet.fromDate = this.formatMoment(filters.updated.dateFrom, filters.updated.timeFrom);
    }
    if (filters.updated.dateTo) {
      filterSet.toDate = this.formatMoment(filters.updated.dateTo, filters.updated.timeTo);
    }

    // TOPIC
    if (filters.topics.some((x) => x.isChecked)) {
      filterSet.topic = filters.topics.filter((x) => x.isChecked).map((x) => x.id as EnumTopicCategory);
    }

    // FORMAT
    if (Object.values(filters.formats).flat().some((x) => x.isChecked)) {
      filterSet.format = Object.values(filters.formats).flat().filter((x) => x.isChecked).map((x) => x.id);
    }

    // SERVICE TYPE
    if (filters.serviceTypes.some((x) => x.isChecked)) {
      filterSet.serviceType = filters.serviceTypes.filter((x) => x.isChecked).map((x) => x.id as EnumSpatialDataServiceType);
    }

    // CRS
    if (filters.crsList.some((x) => x.isChecked)) {
      filterSet.crs = filters.crsList.filter((x) => x.isChecked).map((x) => `EPSG:${x.code}`);
    }

    // SCALE
    // TODO: check if should be changed so that max scale is bigger integer than min scale (as denominator)
    const [selectedMinScale, selectedMaxScale] = filters.scaleValues;
    if (selectedMinScale !== this.scaleMin) {
      filterSet.minScale = selectedMinScale;
    }
    if (selectedMaxScale !== this.scaleMax) {
      filterSet.maxScale = selectedMaxScale;
    }

    // POPULAR SCALES
    if (filters.fixedScales.some((x) => x.isChecked)) {
      filterSet.scales = filters.fixedScales.filter((x) => x.isChecked).map((x) => x.id);
    }

    // COVERAGE
    if (filters.mapCoverageSelectionBBox) {
      const [minX, minY, maxX, maxY] = filters.mapCoverageSelectionBBox.split(',');
      filterSet.topLeftX = parseFloat(minX);
      filterSet.topLeftY = parseFloat(maxY);
      filterSet.bottomRightX = parseFloat(maxX);
      filterSet.bottomRightY = parseFloat(minY);
      filterSet.spatialOperation = filters.spatialOperation;
    }

    // PRICE
    if (filters.priceMin) {
      filterSet.minPrice = Number(filters.priceMin);
    }
    if (filters.priceMax !== null) {
      filterSet.maxPrice = Number(filters.priceMax);
    }

    // NUMBER OF FEATURES
    if (filters.numberOfFeatures.isSmallChecked || filters.numberOfFeatures.isMediumChecked || filters.numberOfFeatures.isLargeChecked) {
      filterSet.sizeOfDataset = [];
      if (filters.numberOfFeatures.isSmallChecked) filterSet.sizeOfDataset.push(EnumDatasetSize.SMALL);
      if (filters.numberOfFeatures.isMediumChecked) filterSet.sizeOfDataset.push(EnumDatasetSize.MEDIUM);
      if (filters.numberOfFeatures.isLargeChecked) filterSet.sizeOfDataset.push(EnumDatasetSize.LARGE);
    }

    // ATTRIBUTES
    if (filters.attributes.length && filters.attributes.some((x) => x.length)) {
      filterSet.attribute = filters.attributes.filter((x) => x.length);
    }

    // VENDORS
    if (filters.vendors.length && filters.vendors.some((x) => x.length)) {
      filterSet.publisher = filters.vendors.filter((x) => x.length);
    }

    // LANGUAGES
    if (filters.languages.some((x) => x.isChecked)) {
      // filterSet.crs = filters.crsList.filter((x) => x.isChecked).map((x) => x.code);
      filterSet.language = filters.languages.filter((x) => x.isChecked).map((x) => x.code);
    }

    // LICENSE
    if (filters.licenses.some((x) => x.isChecked)) {
      filterSet.license = filters.licenses.filter((x) => x.isChecked).map((x) => x.id);
    }

    // OPEN
    if (filters.isOpen) {
      filterSet.openDataset = true;
    }

    console.log(filterSet);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.catalogueApi.findAdvanced(filterSet).then((advancedQueryResponse: CatalogueQueryResponse) => {
      console.log('aqr', advancedQueryResponse);
      this.queryResults = advancedQueryResponse.result.items;
      this.queryResultsCount = advancedQueryResponse.result.count;
      this.queryCurrentPage = advancedQueryResponse.result.pageRequest.page;
      if (!byAlteringCurrentFilterState) this.filtersApplied = cloneDeep(this.filters);
      store.commit('setLastAppliedFilters', cloneDeep(this.filtersApplied));
      store.commit('setLoading', false);
    }).catch((err) => {
      console.log('err', err);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_errorpage.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_filters.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/_catalogue-filters.scss";
</style>
