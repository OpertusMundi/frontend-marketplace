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
          <div class="tab tab-type" v-if="filterMenuItemSelected == 'type'">
            <div class="checkbox-group mt-md-10" v-for="type in filters.find(x => x.name == 'type').options" :key="type.name">
              <input type="checkbox" class="mr-md-10" :id="`type_${type.name}`" v-model="type.isChecked">
              <label :for="`type_${type.name}`"> {{type.name}} </label>
            </div>
            <!-- <div>{{filters.find(x => x.name == 'type')}}</div> -->
            <!-- <div>{{filterTypeSelection}}</div> -->
          </div>

          <!-- UPDATED -->
          <div class="tab tab-update" v-if="filterMenuItemSelected == 'update'">
            <h5 class="date-labels"><strong>Select last update date</strong></h5>
            <div class="d-flex">
              <div class="d-flex flex-column">
                <div class="d-flex space-between mb-md-5">
                  <small class="date-labels">From date</small>
                  <div class="flex align-items-center">
                    <button v-if="filterUpdated.dateFrom" @click="removeFilter('update', 'date_from')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="filterUpdated.dateFrom" placeholder="select date"></datepicker>
                <div class="mt-md-30" v-if="filterUpdated.dateFrom">
                  <div class="d-flex space-between mb-md-5">
                    <small class="date-labels">From time</small>
                    <div class="flex align-items-center">
                      <button v-if="filterUpdated.timeFrom != '00:00 AM'" @click="removeFilter('update', 'time_from')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filterUpdated.timeFrom" placeholder="select time"></vue-timepicker>
                </div>
              </div>
              <div class="d-flex flex-column ml-md-15">
                <div class="d-flex space-between mb-md-5">
                  <small class="date-labels">To date</small>
                  <div class="flex align-items-center">
                    <button v-if="filterUpdated.dateTo" @click="removeFilter('update', 'date_to')"><font-awesome-icon icon="times" /></button>
                  </div>
                </div>
                <datepicker :inline="true" v-model="filterUpdated.dateTo" placeholder="select date"></datepicker>
                <div class="mt-md-30" v-if="filterUpdated.dateTo">
                  <div class="d-flex space-between mb-md-5">
                    <small class="date-labels">To time</small>
                    <div class="flex align-items-center">
                      <button v-if="filterUpdated.timeTo != '23:59 PM'" @click="removeFilter('update', 'time_to')"><font-awesome-icon icon="times" /></button>
                    </div>
                  </div>
                  <vue-timepicker :input-width="'100%'" :hide-clear-button="true" format="HH:mm A" v-model="filterUpdated.timeTo" placeholder="select time"></vue-timepicker>
                </div>
              </div>
            </div>
          </div>

          <!-- TOPIC -->
          <div class="tab tab-topic" v-if="filterMenuItemSelected == 'topic'">
            <div class="checkbox-group mb-md-2" v-for="topic in filters.find(x => x.name == 'topic').options" :key="topic.name">
              <input type="checkbox" class="mr-md-10" :id="`topic_${topic.name}`" v-model="topic.isChecked">
              <label :for="`topic_${topic.name}`"> {{topic.name}} </label>
            </div>
          </div>

          <!-- FORMAT -->
          <div class="tab tab-format d-flex" v-if="filterMenuItemSelected == 'format'">

            <!-- <div class="flex-grow-1" v-if="shownFormatCategories().includes('vector')"> -->
            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('vector') }" class="flex-grow-1">
              <h3 class="format-category-title">Vector</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.vector" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('vector')" type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('raster') }" class="flex-grow-1">
              <h3 class="format-category-title">Raster</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.raster" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('raster')" type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

            <div :class="{ 'checkbox-group-disabled': !shownFormatCategories().includes('api') }" class="flex-grow-1">
              <h3 class="format-category-title">API</h3>
              <div class="checkbox-group mb-md-5" v-for="format in formats.api" :key="format.id">
                <input :disabled="!shownFormatCategories().includes('api')" type="checkbox" class="mr-md-10" :id="`format_${format.id}`" v-model="format.isChecked">
                <label :for="`format_${format.id}`"> {{format.name}} </label>
              </div>
            </div>

          </div>

          <!-- CRS -->
          <div class="tab tab-crs" v-if="filterMenuItemSelected == 'crs'">
            <small>Popular CRS</small>
            <div class="mt-md-10">
              <div v-for="crs in crsList" :key="crs.code" class="checkbox-group mb-md-5">
                <input type="checkbox" class="mr-md-10" :id="'EPSG_' + crs.code" v-model="crs.isChecked">
                <label :for="'EPSG_' + crs.code"> {{ crs.description }} </label>
              </div>
            </div>

            <div class="mt-md-30">
              <small>Search for CRS</small>
              <input v-model="crsSearchString" @input="searchCrs($event.target.value)" type="text" class="form-group__text mt-md-10" placeholder="CRS name or Code">
              <div v-if="crsSearchString" class="crs-search-autocomplete">
                <ul>
                  <li @click="addCrsToList(crs)" v-for="crs in crsSearchList" :key="crs.code">{{crs.description}}</li>
                </ul>
              </div>
            </div>

          </div>

          <!-- SCALE -->
          <div class="tab tab-scale" v-if="filterMenuItemSelected == 'scale'">
            <div class="ml-md-20 mr-md-20" @click="onScaleSliderClick">
              <vue-slider :processStyle="{ background: isScaleSliderDisabled()? 'whitesmoke' : '#1a0aff' }" :dotSize="isScaleSliderDisabled()? 0 : 16" :disabled="isScaleSliderDisabled()" v-model="scaleValues" :data="scaleSliderOptions" :data-value="'id'" :data-label="'name'" :adsorb="true" :tooltip="'none'" :height="2" :marks="false" :direction="'rtl'" />
            </div>

            <!-- <div class="values-line">
              <span v-for="index in 5" :key="index"> {{(index-1)*(scaleMax - scaleMin)/4 + scaleMin}}€ </span>
            </div> -->

            <div class="mt-md-40 min-max-container">
              <div class="min-max-input-item">
                <label for="scaleSelectedMin">Minimum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :min="scaleMax" :value="scaleValues[1]" @input="validateMinMaxInput('maxScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMin">
                </div>
              </div>
              <div class="min-max-input-item ml-md-20">
                <label for="scaleSelectedMax">Maximum Scale</label>
                <div>
                  <span>1 : </span>
                  <input :max="scaleMin" :value="scaleValues[0]" @input="validateMinMaxInput('minScale', $event.target.value)" class="form-group__text min-max-scale-input" type="number" id="scaleSelectedMax">
                </div>
              </div>
            </div>

          </div>

          <!-- COVERAGE -->
          <div class="tab tab-coverage" v-if="filterMenuItemSelected == 'coverage'">
            <div class="coverage-map-menu-container">
              <div class="coverage-side-menu">
                <!-- <div class="d-flex align-items-center mb-md-20">
                  <span><strong>1</strong></span> <input type="text" class="form-group__text" placeholder="Search City/Area">
                </div> -->
                <div class="d-flex align-items-center mb-md-20">
                  <span><strong>1</strong></span>
                  <div class="mr-md-10">
                    <select @change="onCountrySelected($event.target.value)" :disabled="mapCoverageSelectionBBox || mapCoverageDrawMode ? true : false" v-model="countrySelected" class="form-group__select">
                      <option value="">(Select country)</option>
                      <option v-for="country in countries" :value="country.code" :key="country.code"> {{ country.name }} </option>
                    </select>
                    <!-- <select :disabled="mapCoverageSelectionBBox ? true : false" v-if="countrySelected" v-model="areaSelected" class="form-group__select mt-md-5">
                      <option value="">(select area)</option>
                      <option v-for="area in getAreas()" :key="area.code"> {{area.name}} </option>
                    </select> -->
                  </div>
                </div>
                <div class="d-flex">
                  <span><strong>2</strong></span>
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
                    <!-- <button v-if="!mapCoverageSelectionIsDrawn && !mapCoverageSelectionBBox" @click="onSetArea" style="float: right" class="btn--std btn--outlineblue">Draw Area</button> -->
                    <!-- <button v-if="mapCoverageSelectionIsDrawn && !mapCoverageSelectionBBox" @click="onSetArea" style="float: right" class="btn--std btn--blue">Set Area</button> -->
                    <button v-if="mapCoverageSelectionIsDrawn && !mapCoverageSelectionBBox" @click="onSetArea" style="float: right" class="btn--std btn--blue">Set Area</button>
                    <button v-if="mapCoverageSelectionRectangle && mapCoverageSelectionBBox" @click="onClearArea" style="float: right" class="btn--std btn--outlineblue">Clear Selection</button>
                  </div>
                </div>
              </div>

              <div class="map-coverage-wrapper">
                <div id="mapCoverage">
                </div>
                <input type="text" class="form-group__text" placeholder="Search City/Area">
                <button v-if="!mapCoverageSelectionRectangle && !mapCoverageDrawMode" @click="onDrawArea" class="btn--std btn--blue"><font-awesome-icon class="mr-md-10" icon="vector-square" /> Draw Area</button>
              </div>

            </div>
          </div>

          <!-- PRICE -->
          <div class="tab tab-price" v-if="filterMenuItemSelected == 'price'">
            <div class="min-max-container">
              <div class="min-max-input-item">
                <label for="priceSelectedMin">Minimum Price</label>
                <!-- <input type="number" :min="priceMin" :value="priceValues[0]" @input="validateMinMaxInput('minPrice', $event.target.value)" class="form-group__text" id="priceSelectedMin"> -->
                <input type="number" :min="0" v-model="priceMin" placeholder="Free" class="form-group__text">
              </div>
              <div class="min-max-input-item ml-md-20">
                <label for="priceSelectedMax">Maximum Price</label>
                <!-- <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateMinMaxInput('maxPrice', $event.target.value)" class="form-group__text" id="priceSelectedMax"> -->
                <!-- <input type="number" :max="priceMax" :value="priceValues[1]" @input="validateMinMaxInput('maxPrice', $event.target.value)" class="form-group__text" id="priceSelectedMax"> -->
                <input type="number" :min="0" v-model="priceMax" placeholder="No Limit" class="form-group__text">
              </div>
            </div>
          </div>

          <!-- MORE -->
          <div class="tab tab-more" v-if="filterMenuItemSelected == 'more'">

            <div class="tab-more-side-menu d-flex flex-column">
              <span v-for="filter in filterMoreSubmenuItems"
                :key="filter.id"
                @click="selectFilterMoreSubmenuItem(filter.id)"
                :class="{ active: filterMoreSubmenuItemSelected == filter.id }">
                  {{ filter.name }}
              </span>
            </div>

            <div class="tab-more-main p-md-20 pl-md-30">
              <!-- NUMBER OF FEATURES -->
              <div class="ml-md-20" v-if="filterMoreSubmenuItemSelected == 'numberOfFeatures'">
                <h4>Dataset size</h4>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_small">
                  <label for="dataset_small"> Small <small class="grayed ml-md-20">&lt; 1000 features</small></label>
                </div>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_medium">
                  <label for="dataset_medium"> Medium <small class="grayed ml-md-20">1000 - 100.000 features</small></label>
                </div>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_large">
                  <label for="dataset_large"> Large <small class="grayed ml-md-20">&gt; 100.000 features</small></label>
                </div>
              </div>

              <!-- AREA OF INTEREST -->
              <div v-if="filterMoreSubmenuItemSelected == 'areaOfInterest'">
                <h4>Area of Interest</h4>
              </div>

              <!-- ATTRIBUTES -->
              <div v-if="filterMoreSubmenuItemSelected == 'attributes'">
                <div class="form-group">
                  <label>Fields that must be contained in dataset</label>
                  <div class="d-flex">
                    <div>
                      <input v-for="(attribute, i) in attributes" :key="i" v-model="attributes[i]" type="text" class="form-group__text" :name="'search_attribute_' + i" :id="'search_attribute_' + i" placeholder="attribute name">
                    </div>
                    <button @click="addAttribute" class="fab-button align-self-end ml-md-15 mb-md-10">+</button>
                  </div>
                </div>
              </div>

              <!-- VENDOR -->
              <div v-if="filterMoreSubmenuItemSelected == 'vendor'">
                <!-- <div class="form-group">
                  <label>Search by Vendor</label>
                  <input v-for="(vendor, i) in vendors" :key="i" v-model="vendors[i]" type="text" class="form-group__text" :name="'search_vendor_' + i" :id="'search_vendor_' + i" placeholder="Vendor name">
                </div>
                <button @click="addVendor" class="fab-button">+</button> -->

                <div class="form-group">
                  <label>Search by Vendor</label>
                  <div class="d-flex">
                    <div>
                      <input v-for="(vendor, i) in vendors" :key="i" v-model="vendors[i]" type="text" class="form-group__text" :name="'search_vendor_' + i" :id="'search_vendor_' + i" placeholder="Vendor name">
                    </div>
                    <button @click="addVendor" class="fab-button align-self-end ml-md-15 mb-md-10">+</button>
                  </div>
                </div>
              </div>

              <!-- LANGUAGE -->
              <div v-if="filterMoreSubmenuItemSelected == 'language'">
                <h4>Language of asset fields / labels</h4>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_small">
                  <label for="dataset_small"> English (UK/US)</label>
                </div>
                <hr>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_medium">
                  <label for="dataset_medium"> German</label>
                </div>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="dataset_large">
                  <label for="dataset_large"> French</label>
                </div>
                <!-- <div class="form-group">
                  <label for="postal_code">Search by Language</label>
                  <input type="text" class="form-group__text" name="postal_code" id="postal_code" placeholder="Language">
                </div> -->
              </div>

              <!-- LICENSE -->
              <div v-if="filterMoreSubmenuItemSelected == 'license'">
                <h4>Permitted use</h4>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="license_open">
                  <label for="license_open"> Open license</label>
                </div>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="license_organization">
                  <label for="license_organization"> Within your organization</label>
                </div>
                <div class="checkbox-group mt-md-10">
                  <input type="checkbox" class="mr-md-10" id="license_webgis">
                  <label for="license_webgis"> Web-GIS applications</label>
                </div>
              </div>
            </div>

            <!-- <div class="form-group">
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
            </div> -->
          </div>
        </div>

        <div class="filter-side-menu">
          <!-- DISPLAY OF FILTERS CHECKED -->
          <div class="filter-side-menu-main p-md-10">
            <div>
              <h3 class="m-md-10">Selections</h3>

              <!-- TYPE -->
              <div class="pill" v-for="filter in getFiltersChecked('type')" :key="filter.name">
                {{ filter.pillLabel }}
                <div class="close-button" @click="removeFilter('type', filter.name)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- UPDATED -->

              <!-- <div class="pill" v-if="filters.find((x) => x.name == 'update').options[0].value">
                <!- - format data & show time only if different than 00:00 AM - ->
                Updated after {{dateFormatter(filters.find((x) => x.name == 'update').options[0].value)}}{{filters.find((x) => x.name == 'update').options[2].value != '00:00 AM' ? ', ' + filters.find((x) => x.name == 'update').options[2].value : '' }}
                <div class="close-button" @click="removeFilter('update', 'From')"><font-awesome-icon icon="times" /></div>
              </div>
              <div class="pill" v-if="filters.find((x) => x.name == 'update').options[1].value">
                <!- - format date & show time only if different than 23:59 PM - ->
                Updated before {{dateFormatter(filters.find((x) => x.name == 'update').options[1].value)}}{{filters.find((x) => x.name == 'update').options[3].value != '23:59 PM' ? ', ' + filters.find((x) => x.name == 'update').options[3].value : '' }}
                <div class="close-button" @click="removeFilter('update', 'To')"><font-awesome-icon icon="times" /></div>
              </div> -->

              <div v-if="filterUpdated.dateFrom && !filterUpdated.dateTo" class="pill">
                After {{ dateFormatter(filterUpdated.dateFrom) }}{{ filterUpdated.timeFrom != '00:00 AM' ? ', ' + filterUpdated.timeFrom : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <div v-if="!filterUpdated.dateFrom && filterUpdated.dateTo" class="pill">
                Before {{ dateFormatter(filterUpdated.dateTo) }}{{ filterUpdated.timeTo != '23:59 PM' ? ', ' + filterUpdated.timeTo : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <div v-if="filterUpdated.dateFrom && filterUpdated.dateTo" class="pill">
                {{ dateFormatter(filterUpdated.dateFrom) }}{{ filterUpdated.timeFrom != '00:00 AM' ? ', ' + filterUpdated.timeFrom : '' }} - {{ dateFormatter(filterUpdated.dateTo) }}{{ filterUpdated.timeTo != '23:59 PM' ? ', ' + filterUpdated.timeTo : '' }}
                <div class="close-button" @click="removeFilter('update', '')"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- <div v-if="!filters.find((x) => x.name == 'update').options[0].value && filters.find((x) => x.name == 'update').options[1].value" class="pill">
                Before {{dateFormatter(filters.find((x) => x.name == 'update').options[1].value)}}{{filters.find((x) => x.name == 'update').options[3].value != '23:59 PM' ? ', ' + filters.find((x) => x.name == 'update').options[3].value : '' }}
                <div class="close-button" @click="removeFilter('update', 'From')"><font-awesome-icon icon="times" /></div>
              </div> -->

              <!-- <div v-if="filters.find((x) => x.name == 'update').options[0].value && filters.find((x) => x.name == 'update').options[1].value" class="pill">
                {{dateFormatter(filters.find((x) => x.name == 'update').options[0].value)}}{{filters.find((x) => x.name == 'update').options[2].value != '00:00 AM' ? ', ' + filters.find((x) => x.name == 'update').options[2].value : '' }} - {{dateFormatter(filters.find((x) => x.name == 'update').options[1].value)}}{{filters.find((x) => x.name == 'update').options[3].value != '23:59 PM' ? ', ' + filters.find((x) => x.name == 'update').options[3].value : '' }}
                <div class="close-button" @click="removeFilter('update')"><font-awesome-icon icon="times" /></div>
              </div> -->

              <!-- TOPIC -->
              <div class="pill" v-for="filter in getFiltersChecked('topic')" :key="filter.name">
                <span>{{filter.pillLabel}}</span>
                <div class="close-button" @click="removeFilter('topic', filter.name)"><font-awesome-icon icon="times" /></div>
              </div>

              <!-- FORMAT -->
              <div class="pill" v-for="filter in getFiltersChecked('format')" :key="filter.name">
                <span>{{filter.name}}</span>
                <div class="close-button" @click="removeFilter('format', filter.name)"><font-awesome-icon icon="times" /></div>
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
              <!-- <div v-if="countrySelected && !mapCoverageSelectionBBox" class="pill">
                {{ countries.find((x) => x.code == countrySelected).name }}
                <div class="close-button" @click="removeFilter('coverage')"><font-awesome-icon icon="times" /></div>
              </div> -->

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
              <!-- <div class="pill" v-if="priceValues[0] != priceMin || priceValues[1] != priceMax">
                {{priceValues[0]}}€ - {{priceValues[1]}}€
                <div class="close-button" @click="removeFilter('price')"><font-awesome-icon icon="times" /></div>
              </div> -->
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
// import 'leaflet-editable';
import 'leaflet-shades';
// import 'leaflet-easybutton';
// import 'leaflet-easybutton/src/easy-button.css';
import { dom } from '@fortawesome/fontawesome-svg-core';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import epsgList from '../service/lists/epsg';
import countries from '../service/lists/countries';
import nuts from '../service/lists/nuts';

interface filterOption {
  name: string,
  isChecked?: boolean
  value?: string | number
  pillLabel?: string
}

interface filterCategory {
  name: string,
  options: filterOption[]
}

interface crs {
  code: string,
  description: string,
  isChecked?: boolean
}

@Component({
  components: {
    CatalogueCard,
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

  loading = false;

  // filterMenuItems: string[];
  filterMenuItems: {id: string, name: string}[];

  filterMoreSubmenuItems: {id: string, name: string}[];

  filterMenuItemSelected: string;

  filterMoreSubmenuItemSelected: string;

  filters: filterCategory[];

  filterUpdated: {dateFrom: string, dateTo: string, timeFrom: string, timeTo: string};

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

  // scaleStep: number;

  // priceValues: number|null[];

  priceMin: number|null;

  priceMax: number|null;

  epsgAll: crs[];

  crsList: crs[];

  crsSearchString: string;

  crsSearchList: crs[];

  countries: { code: string, name: string, bbox: number[] }[];

  areas: { code: string, name: string }[];

  countrySelected: string;

  vendors: string[];

  attributes: string[];

  constructor() {
    super();

    dom.watch();

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

    this.filters = [
      {
        name: 'type',
        options: [{ name: 'Vector dataset', pillLabel: 'Vector', isChecked: false }, { name: 'Raster dataset', pillLabel: 'Raster', isChecked: false }, { name: 'API', pillLabel: 'API', isChecked: false }],
      },
      // {
      //   name: 'update',
      //   options: [{ name: 'From', value: '' }, { name: 'To', value: '' }, { name: 'timeFrom', value: '00:00 AM' }, { name: 'timeTo', value: '23:59 PM' }],
      // },
      {
        name: 'topic',
        options: [{ name: 'Biota', pillLabel: 'Biota', isChecked: false }, { name: 'Boundaries', pillLabel: 'Boundaries', isChecked: false }, { name: 'Clima', pillLabel: 'Clima', isChecked: false }, { name: 'Economy', pillLabel: 'Economy', isChecked: false }, { name: 'Elevation', pillLabel: 'Elevation', isChecked: false }, { name: 'Environment', pillLabel: 'Environment', isChecked: false }, { name: 'Farming', pillLabel: 'Farming', isChecked: false }, { name: 'Geo-Scientific', pillLabel: 'Geo-Scientific', isChecked: false }, { name: 'Health', pillLabel: 'Health', isChecked: false }, { name: 'Imagery', pillLabel: 'Imagery', isChecked: false }, { name: 'Inland Waters', pillLabel: 'Inland Waters', isChecked: false }, { name: 'Military Intelligence', pillLabel: 'Military Intelligence', isChecked: false }, { name: 'Location', pillLabel: 'Location', isChecked: false }, { name: 'Oceans', pillLabel: 'Oceans', isChecked: false }, { name: 'Planning Cadastre', pillLabel: 'Planning Cadastre', isChecked: false }, { name: 'Society', pillLabel: 'Society', isChecked: false }, { name: 'Structure', pillLabel: 'Structure', isChecked: false }, { name: 'Transportation', pillLabel: 'Transportation', isChecked: false }, { name: 'Utilities Communication', pillLabel: 'Utilities Communication', isChecked: false }],
      },
    ];

    this.filterUpdated = {
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

    // this.priceValues = [null, null];
    this.priceMin = null;
    this.priceMax = null;
    // this.priceStep = 1;

    this.epsgAll = epsgList;
    this.crsList = [{ code: '4326', description: 'EPSG:4326, WGS84', isChecked: false }, { code: '3857', description: 'EPSG:3857, Pseudo-Mercator WGS84', isChecked: false }];
    this.crsSearchString = '';
    this.crsSearchList = [];

    this.countries = countries;
    this.areas = nuts;
    this.countrySelected = '';

    this.vendors = [''];
    this.attributes = [''];
  }

  @Watch('filterMenuItemSelected')
  onFilterItemChanged(menuItem: string): void {
    if (menuItem === 'coverage') {
      setTimeout(() => {
        this.initMapCoverage();
      }, 0);
    } else {
      if (this.mapCoverage) {
        this.onClearArea();
        this.mapCoverage.remove();
      }
      this.mapCoverage = null;
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

  selectFilterMoreSubmenuItem(filterItem: string): void {
    this.filterMoreSubmenuItemSelected = filterItem;
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
      case 'crs': {
        this.crsList.find((x) => x.code === filterName)!.isChecked = false;
        break;
      }
      case 'update': {
        switch (filterName) {
          case 'date_from': {
            this.filterUpdated.dateFrom = '';
            this.filterUpdated.timeFrom = '00:00 AM';
            break;
          }
          case 'date_to': {
            this.filterUpdated.dateTo = '';
            this.filterUpdated.timeTo = '23:59 PM';
            break;
          }
          case 'time_from': {
            this.filterUpdated.timeFrom = '00:00 AM';
            break;
          }
          case 'time_to': {
            this.filterUpdated.timeTo = '23:59 PM';
            break;
          }
          default: {
            this.filterUpdated.dateFrom = '';
            this.filterUpdated.dateTo = '';
            this.filterUpdated.timeFrom = '00:00 AM';
            this.filterUpdated.timeTo = '23:59 PM';
          }
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
        // this.countrySelected = '';
        // // this.areaSelected = '';

        // this.mapCoverageSelectionBBox = '';
        // this.mapCoverageDrawMode = false;
        // this.mapCoverageSelectionIsDrawn = false;
        // // this.mapShades.removeFrom(this.mapCoverage);
        // // this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
        // this.mapCoverageSelectionRectangle = null;
        // this.mapShades = null;
        // this.mapCoverage.off();
        // this.mapCoverage.remove();
        // this.initMapCoverage();

        this.onClearArea();
        break;
      }
      case 'price': {
        // this.priceValues = [this.priceMin, this.priceMax];
        this.priceMin = null;
        this.priceMax = null;
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

      case 'crs':
        result = this.crsList
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
    this.mapCoverage = (L as any).map('mapCoverage', { editable: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapCoverage);

    this.initMapView();

    // const selectionLayerOptions = { fillColor: 'transparent', color: '#190AFF', dashArray: '20 20' };

    // this.mapCoverageSelectionRectangle = L.rectangle([[latMin, lonMin], [latMin, lonMax], [latMax, lonMax], [latMax, lonMin], [latMin, lonMin]], selectionLayerOptions).addTo(this.mapCoverage);
    // this.mapCoverageSelectionRectangle.enableEdit();

    // this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());

    // L.easyButton('<i class="fas fa-vector-square"></i>', () => {
    //   // this.mapExtendToSelection();
    //   this.mapCoverageSelectionRectangle = this.mapCoverage.editTools.startRectangle();
    //   this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
    //     this.mapCoverageSelectionIsDrawn = true;
    //   });
    // }, 'Zoom to Selection').addTo(this.mapCoverage);
  }

  initMapView() {
    const latMin = 28.647719;
    const latMax = 73.426841;
    const lonMin = -32.519531;
    const lonMax = 58.359375;

    this.mapCoverage.fitBounds([[latMin, lonMin], [latMax, lonMax]]);
  }

  onCountrySelected(country) {
    if (!country) {
      if (this.mapCoverageSelectionRectangle) {
        this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
        this.mapCoverageSelectionRectangle = null;
      }
      this.initMapView();
      return;
    }

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

  onSetArea() {
    this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
    this.mapShades = new (L as any).LeafletShades({ bounds: this.mapCoverageSelectionRectangle.getBounds() });
    this.mapShades.addTo(this.mapCoverage);
    this.mapCoverageSelectionRectangle.disableEdit();
  }

  onClearArea() {
    console.log(this.mapShades);
    if (this.mapShades) {
      this.mapShades.onRemove(this.mapCoverage);
    }
    if (this.mapCoverageSelectionRectangle) {
      this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
    }
    // this.mapShades.removeFrom(this.mapCoverage);
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

  // onCountrySelectChange() {
  //   this.areaSelected = '';
  // }

  // onDrawArea() {
  //   this.mapCoverageDrawMode = true;
  //   this.mapCoverageSelectionRectangle = this.mapCoverage.editTools.startRectangle();
  //   this.mapCoverageSelectionRectangle.on('editable:vertex:dragend', () => {
  //     this.mapCoverageSelectionIsDrawn = true;
  //     this.countrySelected = '';
  //   });
  // }

  // onSetArea() {
  //   this.mapShades = new (L as any).LeafletShades({ bounds: this.mapCoverageSelectionRectangle.getBounds() });
  //   this.mapShades.addTo(this.mapCoverage);
  //   this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
  // }

  // onClearArea() {
  //   // this.removeFilter('coverage', '');
  //   this.countrySelected = '';
  //   // this.areaSelected = '';

  //   this.mapCoverageSelectionBBox = '';
  //   this.mapCoverageDrawMode = false;
  //   this.mapCoverageSelectionIsDrawn = false;
  //   // this.mapShades.removeFrom(this.mapCoverage);
  //   // this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
  //   this.mapCoverageSelectionRectangle = null;
  //   this.mapShades = null;
  //   this.mapCoverage.off();
  //   this.mapCoverage.remove();
  //   this.initMapCoverage();
  // }

  // mapExtendToSelection(): void {
  //   this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());
  //   this.mapCoverageSelectionBBox = this.mapCoverageSelectionRectangle.getBounds().toBBoxString();
  // }

  // @Watch('countrySelected')
  // onCountrySelected(country: string): void {
  //   if (!country) {
  //     this.onClearArea();
  //     return;
  //   }

  //   const coords = this.countries
  //     .find((x) => x.code === country)!
  //     .bbox;

  //   if (this.mapCoverageSelectionRectangle) {
  //     this.mapCoverageSelectionRectangle.removeFrom(this.mapCoverage);
  //   }
  //   this.mapCoverageSelectionRectangle = L.rectangle([[coords[1], coords[0]], [coords[3], coords[2]]])
  //     // .on('editable:vertex:dragend', () => {
  //     //   this.mapCoverageSelectionIsDrawn = true;
  //     //   this.countrySelected = '';
  //     // })
  //     .addTo(this.mapCoverage);
  //   this.mapCoverageSelectionRectangle.enableEdit();
  //   this.mapCoverageSelectionIsDrawn = true;
  //   this.mapCoverage.fitBounds(this.mapCoverageSelectionRectangle.getBounds());
  // }

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

  addVendor() {
    this.vendors.push('');
  }

  addAttribute() {
    this.attributes.push('');
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
      /*
      // case 'minPrice': {
        // let min = Number(value);
          // min = min > this.priceValues[1] ? this.priceValues[1] : min;
        // min = min < this.priceMin ? this.priceMin : min;
        // this.priceValues = [min, this.priceValues[1]];
        // this.priceValues = [minPrice > this.priceValues[1] ? this.priceValues[1] : minPrice, this.priceValues[1]];
        // (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        // break;
      // }
      // case 'maxPrice': {
        // let max = Number(value);
        // max = max < this.priceValues[0] ? this.priceValues[0] : max;
        // max = max > this.priceMax ? this.priceMax : max;
        // this.priceValues = [this.priceValues[0], max];
        // this.priceValues = [this.priceValues[0], maxPrice < this.priceValues[0] ? this.priceValues[0] : maxPrice];
        // (this as any).$refs.priceRangeSlider.setValue(this.priceValues);
        // break;
      // }
      */
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
