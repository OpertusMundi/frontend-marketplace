<template>
  <div class="assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>Assets</h1>
      </div>
      <div class="form-group">
        <input v-model="catalogQuery.query" placeholder="Search in Assets" type="text" class="form-group__text" name="search_assets" id="search_assets">
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
            <div class="checkbox-group mt-xs-10" v-for="type in types" :key="type.name">
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
                    <button v-if="updated.dateFrom" @click="removeFilter('update', 'date_from')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="updated.dateFrom" placeholder="select date"></datepicker>
                <div class="mt-xs-30" v-if="updated.dateFrom">
                  <div class="d-flex space-between mb-xs-5">
                    <small class="date-labels">From time</small>
                    <div class="flex align-items-center">
                      <button v-if="updated.timeFrom != '00:00 AM'" @click="removeFilter('update', 'time_from')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="updated.timeFrom" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex flex-column ml-xs-15">
                <div class="d-flex space-between mb-xs-5">
                  <small class="date-labels">To date</small>
                  <div class="flex align-items-center">
                    <button v-if="updated.dateTo" @click="removeFilter('update', 'date_to')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="updated.dateTo" placeholder="select date"></datepicker>
                <div class="mt-xs-30" v-if="updated.dateTo">
                  <div class="d-flex space-between mb-xs-5">
                    <small class="date-labels">To time</small>
                    <div class="flex align-items-center">
                      <button v-if="updated.timeTo != '23:59 PM'" @click="removeFilter('update', 'time_to')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="updated.timeTo" placeholder="select time"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- TOPIC -->
          <div class="tab tab-topic" v-show="filterMenuItemSelected == 'topic'">
            <div class="checkbox-group mb-xs-2" v-for="topic in topics" :key="topic.name">
              <input type="checkbox" class="mr-xs-10" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div class="tab tab-format d-flex" v-show="filterMenuItemSelected == 'format'">

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('vector') }" class="flex-grow-1">
              <h3 class="format-category-title">Vector</h3>
              <div class="checkbox-group mb-xs-5" v-for="format in formats.vector" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('vector')" type="checkbox" class="mr-xs-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('raster') }" class="flex-grow-1">
              <h3 class="format-category-title">Raster</h3>
              <div class="checkbox-group mb-xs-5" v-for="format in formats.raster" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('raster')" type="checkbox" class="mr-xs-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('api') }" class="flex-grow-1">
              <h3 class="format-category-title">API</h3>
              <div class="checkbox-group mb-xs-5" v-for="format in formats.api" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('api')" type="checkbox" class="mr-xs-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

          </div>

          <!-- CRS -->
          <div class="tab tab-crs" v-show="filterMenuItemSelected == 'crs'">
            <small>Popular CRS</small>
            <div class="mt-xs-10">
              <div v-for="crs in crsList" :key="crs.code" class="checkbox-group mb-xs-5">
                <input type="checkbox" class="mr-xs-10" :id="'EPSG_' + crs.code" v-model="crs.isChecked">
                <label :for="'EPSG_' + crs.code"> {{ crs.description }} </label>
              </div>
            </div>

            <div class="mt-xs-30">
              <small>Search for CRS</small>
              <input v-model="crsSearchString" @input="searchCrs($event.target.value)" type="text" class="form-group__text mt-xs-10" placeholder="CRS name or Code">
              <div v-if="crsSearchString" class="crs-search-autocomplete">
                <ul>
                  <li @click="addCrsToList(crs)" v-for="crs in crsSearchList" :key="crs.code">{{crs.description}}</li>
                </ul>
              </div>
            </div>

          </div>

          <!-- SCALE -->
          <div class="tab tab-scale" v-show="filterMenuItemSelected == 'scale'">
            <div class="ml-xs-20 mr-xs-20" @click="onScaleSliderClick">
              <vue-slider :processStyle="{ background: isScaleSliderDisabled()? 'whitesmoke' : '#1a0aff' }" :dotSize="isScaleSliderDisabled()? 0 : 16" :disabled="isScaleSliderDisabled()" v-model="scaleValues" :data="scaleSliderOptions" :data-value="'id'" :data-label="'name'" :adsorb="true" :tooltip="'none'" :height="2" :marks="false" :direction="'rtl'" />
            </div>

            <div class="mt-xs-40 min-max-container">
              <div class="min-max-input-item">
                <label for="scaleSelectedMin">Minimum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :min="scaleMax" :value="scaleValues[1]" @input="validateMinMaxInput('maxScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMin">
                </div>
              </div>
              <div class="min-max-input-item ml-xs-20">
                <label for="scaleSelectedMax">Maximum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :max="scaleMin" :value="scaleValues[0]" @input="validateMinMaxInput('minScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMax">
                </div>
              </div>
            </div>

          </div>

          <!-- COVERAGE -->
          <div class="tab tab-coverage" v-show="filterMenuItemSelected == 'coverage'">
            <div class="coverage-map-menu-container">
              <div class="coverage-side-menu">
                <div class="d-flex align-items-center mb-xs-20">
                  <span><strong>1</strong></span>
                  <div class="mr-xs-10">
                    <select @change="onCountrySelected($event.target.value)" :disabled="mapCoverageSelectionBBox || mapCoverageDrawMode ? true : false" v-model="countrySelected" class="form-group__select">
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
                    <button v-if="mapCoverageSelectionIsDrawn && !mapCoverageSelectionBBox" @click="onSetArea" style="float: right" class="btn--std btn--blue">Set Area</button>
                    <button v-if="mapCoverageSelectionRectangle && mapCoverageSelectionBBox" @click="onClearArea" style="float: right" class="btn--std btn--outlineblue">Clear Selection</button>
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
                <label for="priceSelectedMin">Minimum Price</label>
                <input type="number" :min="0" v-model="priceMin" placeholder="Free" class="form-group__text">
              </div>
              <div class="min-max-input-item ml-xs-20">
                <label for="priceSelectedMax">Maximum Price</label>
                <input type="number" :min="0" v-model="priceMax" placeholder="No Limit" class="form-group__text">
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
                  <input v-model="numberOfFeatures.isSmallChecked" type="checkbox" class="mr-xs-10" id="dataset_small">
                  <label for="dataset_small"> Small <small class="grayed ml-xs-20">&lt; 1000 features</small></label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input v-model="numberOfFeatures.isMediumChecked" type="checkbox" class="mr-xs-10" id="dataset_medium">
                  <label for="dataset_medium"> Medium <small class="grayed ml-xs-20">1000 - 100.000 features</small></label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input v-model="numberOfFeatures.isLargeChecked" type="checkbox" class="mr-xs-10" id="dataset_large">
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
                      <input v-for="(attribute, i) in attributes" :key="i" v-model="attributes[i]" type="text" class="form-group__text" :name="'search_attribute_' + i" :id="'search_attribute_' + i" placeholder="attribute name">
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
                      <input v-for="(vendor, i) in vendors" :key="i" v-model="vendors[i]" type="text" class="form-group__text" :name="'search_vendor_' + i" :id="'search_vendor_' + i" placeholder="Vendor name">
                    </div>
                    <button @click="addVendor" class="fab-button align-self-end ml-xs-15 mb-xs-10">+</button>
                  </div>
                </div>
              </div>

              <!-- LANGUAGE -->
              <div v-show="filterMoreSubmenuItemSelected == 'language'">
                <h4>Language of asset fields / labels</h4>
                <span style="color: orange">more to be added</span>
                <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="dataset_small">
                  <label for="dataset_small"> English (UK/US)</label>
                </div>
                <hr>
                <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="dataset_medium">
                  <label for="dataset_medium"> German</label>
                </div>
                <div class="checkbox-group mt-xs-10">
                  <input type="checkbox" class="mr-xs-10" id="dataset_large">
                  <label for="dataset_large"> French</label>
                </div>
              </div>

              <!-- LICENSE -->
              <div v-show="filterMoreSubmenuItemSelected == 'license'">
                <h4>Permitted use</h4>
                <span style="color: orange">more to be added</span>
                <div v-for="license in licenses" :key="license.id">
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

              <!-- TYPE -->
              <div class="pill" v-for="filter in getFiltersChecked('type')" :key="filter.name">
                {{ filter.pillLabel }}
                <div class="close-button" @click="removeFilter('type', filter.id)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- UPDATED -->
              <div v-if="updated.dateFrom && !updated.dateTo" class="pill">
                After {{ dateFormatter(updated.dateFrom) }}{{ updated.timeFrom != '00:00 AM' ? ', ' + updated.timeFrom : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <div v-if="!updated.dateFrom && updated.dateTo" class="pill">
                Before {{ dateFormatter(updated.dateTo) }}{{ updated.timeTo != '23:59 PM' ? ', ' + updated.timeTo : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <div v-if="updated.dateFrom && updated.dateTo" class="pill">
                {{ dateFormatter(updated.dateFrom) }}{{ updated.timeFrom != '00:00 AM' ? ', ' + updated.timeFrom : '' }} - {{ dateFormatter(updated.dateTo) }}{{ updated.timeTo != '23:59 PM' ? ', ' + updated.timeTo : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- TOPIC -->
              <div class="pill" v-for="filter in getFiltersChecked('topic')" :key="filter.name">
                <span>{{filter.pillLabel}}</span>
                <div class="close-button" @click="removeFilter('topic', filter.id)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- FORMAT -->
              <div class="pill" v-for="filter in getFiltersChecked('format')" :key="filter.name">
                <span>{{filter.name}}</span>
                <div class="close-button" @click="removeFilter('format', filter.id)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- SCALE -->
              <div class="pill" v-if="scaleValues[0] != scaleMin || scaleValues[1] != scaleMax">
                1:{{scaleValues[1]}} - 1:{{scaleValues[0]}}
                <div class="close-button" @click="removeFilter('scale')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- CRS -->
              <div class="pill" v-for="filter in getFiltersChecked('crs')" :key="filter.code">
                EPSG:{{filter.code}}
                <div class="close-button" @click="removeFilter('crs', filter.code)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- COVERAGE -->
              <div class="pill" v-if="mapCoverageSelectionBBox">
                Area selection
                <div class="close-button" @click="removeFilter('coverage')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- PRICE -->
              <div v-if="priceMin && !priceMax" class="pill">
                &gt;{{ priceMin }}€
                <div class="close-button" @click="removeFilter('price')"><font-awesome-icon icon="times" /></div>
              </div>
              <div v-if="!priceMin && priceMax" class="pill">
                &lt;{{ priceMax }}€
                <div class="close-button" @click="removeFilter('price')"><font-awesome-icon icon="times" /></div>
              </div>
              <div v-if="priceMin && priceMax" class="pill">
                {{ priceMin }}€ - {{ priceMax }}€
                <div class="close-button" @click="removeFilter('price')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- NUMBER OF FEATURES -->
              <div class="pill" v-if="numberOfFeatures.isSmallChecked && !numberOfFeatures.isMediumChecked && !numberOfFeatures.isLargeChecked">Small <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>
              <div class="pill" v-if="!numberOfFeatures.isSmallChecked && numberOfFeatures.isMediumChecked && !numberOfFeatures.isLargeChecked">Medium <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>
              <div class="pill" v-if="!numberOfFeatures.isSmallChecked && !numberOfFeatures.isMediumChecked && numberOfFeatures.isLargeChecked">Large <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>
              <div class="pill" v-if="numberOfFeatures.isSmallChecked && numberOfFeatures.isMediumChecked && !numberOfFeatures.isLargeChecked">Small & Medium <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>
              <div class="pill" v-if="numberOfFeatures.isSmallChecked && !numberOfFeatures.isMediumChecked && numberOfFeatures.isLargeChecked">Small & Large <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>
              <div class="pill" v-if="!numberOfFeatures.isSmallChecked && numberOfFeatures.isMediumChecked && numberOfFeatures.isLargeChecked">Medium & Large <div class="close-button" @click="removeFilter('numberOfFeatures')"><font-awesome-icon icon="times" /></div></div>

              <!-- ATTRIBUTES -->
              <div v-if="attributes.some((x) => {return x !== ''})" class="pill">
                Attributes: {{ getInputsAsOneLabel(attributes) }}
                <div class="close-button" @click="removeFilter('attributes')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- VENDOR -->
              <div v-if="vendors.some((x) => {return x !== ''})" class="pill">
                Vendors: {{ getInputsAsOneLabel(vendors) }}
                <div class="close-button" @click="removeFilter('vendor')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- LICENSES -->
              <div v-if="licenses.some((x) => x.isChecked)" class="pill">
                Licenses: {{ getInputsAsOneLabel(licenses.filter(x => x.isChecked).map(x => x.pillLabel)) }}
                <div class="close-button" @click="removeFilter('license')"><font-awesome-icon icon="times" /></div>
              </div>

            </div>
          </div>
          <div class="filter-side-menu-bottom">
            <button class="btn--std btn--outlineblue" @click="closeFilters()">CANCEL</button>
            <button @click="applyFilters" class="btn--std btn--blue">APPLY FILTERS</button>
          </div>
        </div>
      </div>

      <h6 class="mt-xs-50">9999 ASSETS</h6>

      <div class="assets__items">
        <catalogue-card v-for="asset in queryResults" v-bind:key="asset.id" :asset="asset"></catalogue-card>
      </div>

      <loader v-if="isLoading"></loader>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import Loader from '@/components/Loader.vue';
import CatalogueApi from '@/service/catalogue';
import {
  CatalogueQueryResponse, CatalogueQuery, CatalogueItem,
} from '@/model';
import { EnumAssetType } from '@/model/enum';
import { ElasticCatalogueQuery, EnumTopicCategory } from '@/model/catalogue';
import moment from 'moment';
import { AxiosError } from 'axios';
import Datepicker from 'vuejs-datepicker';
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-shades';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import epsgList from '../service/lists/epsg';
import countries from '../service/lists/countries';
import nuts from '../service/lists/nuts';

interface filterOption {
  id: string | EnumAssetType | EnumTopicCategory,
  name: string,
  isChecked?: boolean
  value?: string | number
  pillLabel?: string
}

interface crs {
  code: string,
  description: string,
  isChecked?: boolean
}

@Component({
  components: {
    CatalogueCard,
    Loader,
    Datepicker,
    VueTimepicker,
    VueSlider,
  },
})
export default class Catalogue extends Vue {
  catalogQuery: CatalogueQuery;

  catalogueApi: CatalogueApi;

  queryResults: CatalogueItem[];

  query:string;

  isLoading = false;

  // --- FILTERS ---

  filterMenuItems: {id: string, name: string}[];

  filterMoreSubmenuItems: {id: string, name: string}[];

  filterMenuItemSelected: string;

  filterMoreSubmenuItemSelected: string;

  // filters: filterCategory[];

  types: { id: EnumAssetType, name: string, pillLabel: string, isChecked: boolean }[];

  topics: { id: EnumTopicCategory, name: string, pillLabel: string, isChecked: boolean }[];

  updated: {dateFrom: string, dateTo: string, timeFrom: string, timeTo: string};

  formats: {api: { id: string, name: string, isChecked: boolean }[], vector: { id: string, name: string, isChecked: boolean }[], raster: { id: string, name: string, isChecked: boolean }[], };

  mapCoverage: any;

  mapCoverageSelectionRectangle: any;

  mapCoverageDrawMode: boolean;

  mapCoverageSelectionIsDrawn: boolean;

  mapCoverageSelectionBBox: string;

  mapShades: any;

  scaleValues: number[];

  scaleSliderOptions: {id: number, name: string}[];

  scaleMin: number;

  scaleMax: number;

  priceMin: number|null;

  priceMax: number|null;

  epsgAll: crs[];

  crsList: crs[];

  crsSearchString: string;

  crsSearchList: crs[];

  countries: { code: string, name: string, bbox: number[] }[];

  areas: { code: string, name: string }[];

  countrySelected: string;

  numberOfFeatures: { isSmallChecked: boolean, isMediumChecked: boolean, isLargeChecked: boolean };

  vendors: string[];

  attributes: string[];

  licenses: { id: string, name: string, pillLabel: string, isChecked: boolean }[];

  constructor() {
    super();

    this.filterMenuItems = [{ id: 'type', name: 'TYPE' }, { id: 'coverage', name: 'COVERAGE' }, { id: 'price', name: 'PRICE' }, { id: 'topic', name: 'TOPIC' }, { id: 'update', name: 'UPDATE' }, { id: 'format', name: 'FORMAT' }, { id: 'crs', name: 'CRS' }, { id: 'scale', name: 'SCALE' }, { id: 'more', name: 'MORE' }];
    this.filterMoreSubmenuItems = [{ id: 'numberOfFeatures', name: 'Number of Features' }, { id: 'areaOfInterest', name: 'Area of Interest' }, { id: 'attributes', name: 'Attributes' }, { id: 'vendor', name: 'Vendor' }, { id: 'language', name: 'Language' }, { id: 'license', name: 'License' }];

    this.query = '';
    this.queryResults = [];
    this.catalogQuery = {
      page: 0,
      size: 6,
      query: this.query,
    };
    this.catalogueApi = new CatalogueApi();

    this.filterMenuItemSelected = '';

    this.filterMoreSubmenuItemSelected = 'numberOfFeatures';

    this.types = [
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
    this.topics = [{ id: EnumTopicCategory.BIOTA, name: 'Biota', pillLabel: 'Biota', isChecked: false }, { id: EnumTopicCategory.BOUNDARIES, name: 'Boundaries', pillLabel: 'Boundaries', isChecked: false }, { id: EnumTopicCategory.CLIMA, name: 'Clima', pillLabel: 'Clima', isChecked: false }, { id: EnumTopicCategory.ECONOMY, name: 'Economy', pillLabel: 'Economy', isChecked: false }, { id: EnumTopicCategory.ELEVATION, name: 'Elevation', pillLabel: 'Elevation', isChecked: false }, { id: EnumTopicCategory.ENVIRONMENT, name: 'Environment', pillLabel: 'Environment', isChecked: false }, { id: EnumTopicCategory.FARMING, name: 'Farming', pillLabel: 'Farming', isChecked: false }, { id: EnumTopicCategory.GEO_SCIENTIFIC, name: 'Geo-Scientific', pillLabel: 'Geo-Scientific', isChecked: false }, { id: EnumTopicCategory.HEALTH, name: 'Health', pillLabel: 'Health', isChecked: false }, { id: EnumTopicCategory.IMAGERY, name: 'Imagery', pillLabel: 'Imagery', isChecked: false }, { id: EnumTopicCategory.INLAND_WATERS, name: 'Inland Waters', pillLabel: 'Inland Waters', isChecked: false }, { id: EnumTopicCategory.INTELLIGENCE_MILITARY, name: 'Military Intelligence', pillLabel: 'Military Intelligence', isChecked: false }, { id: EnumTopicCategory.LOCATION, name: 'Location', pillLabel: 'Location', isChecked: false }, { id: EnumTopicCategory.OCEANS, name: 'Oceans', pillLabel: 'Oceans', isChecked: false }, { id: EnumTopicCategory.PLANNING_CADASTRE, name: 'Planning Cadastre', pillLabel: 'Planning Cadastre', isChecked: false }, { id: EnumTopicCategory.SOCIETY, name: 'Society', pillLabel: 'Society', isChecked: false }, { id: EnumTopicCategory.STRUCTURE, name: 'Structure', pillLabel: 'Structure', isChecked: false }, { id: EnumTopicCategory.TRANSPORTATION, name: 'Transportation', pillLabel: 'Transportation', isChecked: false }, { id: EnumTopicCategory.UTILITIES_COMMUNICATION, name: 'Utilities Communication', pillLabel: 'Utilities Communication', isChecked: false }];

    this.updated = {
      dateFrom: '',
      dateTo: '',
      timeFrom: '00:00 AM',
      timeTo: '23:59 PM',
    };

    this.formats = {
      vector: [{ id: 'shp', name: 'Shapefile', isChecked: false }, { id: 'geoPackage', name: 'GeoPackage', isChecked: false }, { id: 'geoJson', name: 'GeoJSON', isChecked: false }],
      raster: [{ id: 'png', name: 'PNG', isChecked: false }, { id: 'jpeg', name: 'JPEG', isChecked: false }, { id: 'tiff', name: 'Tiff', isChecked: false }],
      api: [{ id: 'wms', name: 'WMS', isChecked: false }, { id: 'wfs', name: 'WFS', isChecked: false }, { id: 'wcs', name: 'WCS', isChecked: false }, { id: 'wmts', name: 'WMTS', isChecked: false }, { id: 'wps', name: 'WPS', isChecked: false }, { id: 'wcps', name: 'WCPS', isChecked: false }],
    };

    this.mapCoverageSelectionBBox = '';

    this.mapCoverageDrawMode = false;

    this.mapCoverageSelectionRectangle = null;

    this.mapCoverageSelectionIsDrawn = false;

    this.scaleMin = 10;
    this.scaleMax = 10000000;
    this.scaleValues = [this.scaleMin, this.scaleMax];
    this.scaleSliderOptions = [
      { id: 10, name: '1 : 10' },
      { id: 100, name: '1 : 100' },
      { id: 1000, name: '1 : 1.000' },
      { id: 10000, name: '1 : 10.000' },
      { id: 100000, name: '1 : 100.000' },
      { id: 1000000, name: '1 : 1.000.000' },
      { id: 10000000, name: '1 : 10.000.000' },
    ];

    this.priceMin = null;
    this.priceMax = null;

    this.epsgAll = epsgList;
    this.crsList = [{ code: '4326', description: 'EPSG:4326, WGS84', isChecked: false }, { code: '3857', description: 'EPSG:3857, Pseudo-Mercator WGS84', isChecked: false }];
    this.crsSearchString = '';
    this.crsSearchList = [];

    this.countries = countries;
    this.areas = nuts;
    this.countrySelected = '';

    this.numberOfFeatures = { isSmallChecked: false, isMediumChecked: false, isLargeChecked: false };
    this.vendors = [''];
    this.attributes = [''];
    this.licenses = [
      // eslint-disable-next-line
      { id: 'open', name: 'Open license', pillLabel: 'open', isChecked: false },
      // eslint-disable-next-line
      { id: 'within_organisation', name: 'Within your organisation', pillLabel: 'within organisation', isChecked: false },
      // eslint-disable-next-line
      { id: 'web_gis', name: 'Web-GIS applications', pillLabel: 'web-GIS', isChecked: false },
    ];
  }

  @Watch('filterMenuItemSelected')
  onFilterItemChanged(menuItem: string): void {
    if (menuItem === 'coverage' && !this.mapCoverage) {
      setTimeout(() => {
        this.initMapCoverage();
      }, 0);
    }
  }

  mounted(): void {
    this.searchAssets();
  }

  searchAssets(): void {
    this.isLoading = true;
    this.queryResults = [];
    this.catalogQuery.query = this.query;
    this.catalogueApi.find(this.query)
      .then((queryResponse: CatalogueQueryResponse) => {
        if (queryResponse.success) {
          this.queryResults = queryResponse.result.items;
        }
        this.isLoading = false;
      })
      .catch((error: AxiosError) => {
        console.log(error);
        this.isLoading = false;
      });
  }

  selectfilterMenuItem(filterItem: string): void {
    this.filterMenuItemSelected = filterItem;
  }

  selectFilterMoreSubmenuItem(filterItem: string): void {
    this.filterMoreSubmenuItemSelected = filterItem;
  }

  removeFilter(category: string, filterName: string): void {
    switch (category) {
      case 'type':
        // eslint-disable-next-line
        this.types.find((x) => x.id === filterName)!.isChecked = false;
        break;
      case 'topic': {
        // eslint-disable-next-line
        this.topics.find((x) => x.id === filterName)!.isChecked = false;
        break;
      }
      case 'crs': {
        // eslint-disable-next-line
        this.crsList.find((x) => x.code === filterName)!.isChecked = false;
        break;
      }
      case 'update': {
        switch (filterName) {
          case 'date_from': {
            this.updated.dateFrom = '';
            this.updated.timeFrom = '00:00 AM';
            break;
          }
          case 'date_to': {
            this.updated.dateTo = '';
            this.updated.timeTo = '23:59 PM';
            break;
          }
          case 'time_from': {
            this.updated.timeFrom = '00:00 AM';
            break;
          }
          case 'time_to': {
            this.updated.timeTo = '23:59 PM';
            break;
          }
          default: {
            this.updated.dateFrom = '';
            this.updated.dateTo = '';
            this.updated.timeFrom = '00:00 AM';
            this.updated.timeTo = '23:59 PM';
          }
        }
        break;
      }
      case 'format': {
        const option = Object.values(this.formats)
          .flat()
          .find((x) => x.id === filterName);
        // eslint-disable-next-line
        option!.isChecked = false;

        break;
      }
      case 'coverage': {
        this.onClearArea();
        break;
      }
      case 'price': {
        this.priceMin = null;
        this.priceMax = null;
        break;
      }
      case 'scale': {
        this.scaleValues = [this.scaleMin, this.scaleMax];
        break;
      }
      case 'numberOfFeatures': {
        this.numberOfFeatures = { isSmallChecked: false, isMediumChecked: false, isLargeChecked: false };
        break;
      }
      case 'attributes': {
        this.attributes = this.attributes.map(() => '');
        break;
      }
      case 'vendor': {
        this.vendors = this.vendors.map(() => '');
        break;
      }
      case 'license': {
        this.licenses.forEach((x) => {
          // eslint-disable-next-line
          x.isChecked = false;
        });
        break;
      }
      default:
    }
  }

  closeFilters(): void {
    this.filterMenuItemSelected = '';
  }

  getFiltersChecked(category: string): filterOption[] | crs[] {
    let result;
    switch (category) {
      case 'type':
        result = this.types.filter((x) => x.isChecked);
        break;

      case 'topic':
        result = this.topics.filter((x) => x.isChecked);
        break;

      case 'format':
        result = Object.values(this.formats)
          .flat()
          .filter((x) => x.isChecked);
        break;

      case 'crs':
        result = this.crsList
          .filter((x) => x.isChecked);
        break;

      case 'license':
        result = this.licenses
          .filter((x) => x.isChecked);
        break;

      default:
    }

    return result;
  }

  shownFormatCategories(): string[] {
    // eslint-disable-next-line
    const isVectorChecked = this.types.find((x) => x.name === 'Vector dataset')!.isChecked;
    // eslint-disable-next-line
    const isRasterChecked = this.types.find((x) => x.name === 'Raster dataset')!.isChecked;
    // eslint-disable-next-line
    const isApiChecked = this.types.find((x) => x.name === 'API')!.isChecked;

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
    this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
    this.mapShades = new (L as any).LeafletShades({ bounds: this.mapCoverageSelectionRectangle.getBounds() });
    this.mapShades.addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.disableEdit();
  }

  onClearArea(): void {
    if (this.mapShades) {
      this.mapShades.onRemove(this.mapCoverage);
    }
    if (this.mapCoverageSelectionRectangle) {
      this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
    }
    this.mapCoverageSelectionRectangle = null;
    this.mapShades = null;
    this.mapCoverageSelectionIsDrawn = false;
    this.mapCoverageSelectionBBox = '';
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
    const filtered = this.epsgAll.filter((x) => x.code.toLowerCase().includes(str.toLowerCase()) || x.description.toLowerCase().includes(str.toLowerCase()));
    this.crsSearchList = filtered;
  }

  addCrsToList(crs: crs): void {
    // eslint-disable-next-line
    crs.isChecked = true;
    this.crsList.push(crs);
    this.crsSearchString = '';
    this.crsList = JSON.parse(JSON.stringify(this.crsList));
    this.epsgAll = this.epsgAll.filter((x) => x.code !== crs.code);
  }

  addVendor(): void {
    this.vendors.push('');
  }

  addAttribute(): void {
    this.attributes.push('');
  }

  validateMinMaxInput(input: string, value: number): void {
    switch (input) {
      case 'minScale': {
        const minScale = Number(value);
        this.scaleValues = [minScale > this.scaleValues[1] ? this.scaleValues[1] : minScale, this.scaleValues[1]];
        break;
      }
      case 'maxScale': {
        const maxScale = Number(value);
        this.scaleValues = [this.scaleValues[0], maxScale < this.scaleValues[0] ? this.scaleValues[0] : maxScale];
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

  formatMoment(date: string, time: string): string {
    return `${moment(date).format('YYYYMMDD')}_${moment(time, 'HH:mm a').format('HHmm')}`;
  }

  applyFilters(): void {
    this.closeFilters();
    this.isLoading = true;

    // const filters: string[] = [];
    const filters: Partial<ElasticCatalogueQuery> = {};

    // TEXT-SEARCH
    filters.text = this.catalogQuery.query;

    // PAGE PARAMS
    filters.page = this.catalogQuery.page;
    filters.size = this.catalogQuery.size;

    // TYPE
    if (this.getFiltersChecked('type').length) {
      filters.type = [];
      this.getFiltersChecked('type').forEach((x) => {
        // eslint-disable-next-line
        filters.type!.push(x.id as EnumAssetType);
      });
    }

    // UPDATED
    // TODO: check format
    if (this.updated.dateFrom) {
      filters.fromDate = this.formatMoment(this.updated.dateFrom, this.updated.timeFrom);
    }
    if (this.updated.dateTo) {
      filters.toDate = this.formatMoment(this.updated.dateTo, this.updated.timeTo);
    }

    // TOPIC
    if (this.getFiltersChecked('topic').length) {
      filters.topic = [];
      this.getFiltersChecked('topic').forEach((x) => {
        // eslint-disable-next-line
        filters.topic!.push(x.id as EnumTopicCategory);
      });
    }

    // FORMAT
    if (this.getFiltersChecked('format').length) {
      filters.format = [];
      this.getFiltersChecked('format').forEach((x) => {
        // eslint-disable-next-line
        filters.format!.push(x.id);
      });
    }

    // CRS
    if (this.getFiltersChecked('crs').length) {
      filters.crs = [];
      this.getFiltersChecked('crs').forEach((x) => {
        // eslint-disable-next-line
        filters.crs!.push((x as crs).code);
      });
    }

    // SCALE
    // TODO: check if should be changed so that max scale is bigger integer than min scale (as denominator)
    const [selectedMinScale, selectedMaxScale] = this.scaleValues;
    if (selectedMinScale !== this.scaleMin) {
      filters.minScale = selectedMinScale;
    }
    if (selectedMaxScale !== this.scaleMax) {
      filters.maxScale = selectedMaxScale;
    }

    // COVERAGE
    if (this.mapCoverageSelectionBBox) {
      const [minX, minY, maxX, maxY] = this.mapCoverageSelectionBBox.split(',');
      filters.topLeftX = parseFloat(minX);
      filters.topLeftY = parseFloat(maxY);
      filters.bottomRightX = parseFloat(maxX);
      filters.bottomRightY = parseFloat(minY);
    }

    // PRICE
    if (this.priceMin) {
      filters.minPrice = Number(this.priceMin);
    }
    if (this.priceMax) {
      filters.maxPrice = Number(this.priceMax);
    }

    // ATTRIBUTES
    if (this.attributes.length && this.attributes.some((x) => x.length)) {
      filters.attribute = [];
      this.attributes.filter((x) => x.length).forEach((x) => {
        // eslint-disable-next-line
        filters.attribute!.push(x);
      });
    }

    // VENDORS
    if (this.vendors.length && this.vendors.some((x) => x.length)) {
      filters.publisher = [];
      this.vendors.filter((x) => x.length).forEach((x) => {
        // eslint-disable-next-line
        filters.publisher!.push(x);
      });
    }

    // LICENSE
    if (this.getFiltersChecked('license').length) {
      filters.license = [];
      this.getFiltersChecked('license').forEach((x) => {
        // eslint-disable-next-line
        filters.license!.push(x.id);
      });
    }

    console.log(filters);
    this.catalogueApi.findAdvanced(filters).then((advancedQueryResponse: CatalogueQueryResponse) => {
      this.queryResults = advancedQueryResponse.result.items;
      this.isLoading = false;
    });
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
