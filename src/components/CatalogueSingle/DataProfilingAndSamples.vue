<template>
  <section class="asset__section" :class="{ 'asset__section--expanded': isExpanded }">
    <!-- MODALS -->
    <modal :show="modalToShow == 'modalUploadSample'" @dismiss="modalToShow = ''" @submit="onDisplaySample" :title="'Upload sample'" :modalId="'modalSample'" :inputs="[{ id: 'sample', name: 'Sample', type: 'file', returnType: 'blob' }]"></modal>
    <!-- END OF MODALS -->

    <div class="asset__section__head">
      <div class="d-flex space-between">
        <h4>Data Profiling and Samples</h4>
        <div @click="toggleExpansion" style="cursor: pointer">
          <svg data-name="Full screen icon" xmlns="http://www.w3.org/2000/svg" width="15.989" height="16">
            <path data-name="Path 9453" d="m15.187 0 .8.8v3.763h-1.346v-1.73l.093-.453-.1-.058-.29.372-3.24 3.24L10.07 4.9l3.229-3.252.372-.29-.058-.1-.453.093h-1.73V0z" fill="#333" />
            <path data-name="Path 9452" d="m.801 0-.8.8v3.765h1.346v-1.73l-.093-.453.1-.058.29.372 3.245 3.239 1.034-1.034-3.229-3.252-.372-.29.058-.1.453.093h1.731V0z" fill="#333" />
            <path data-name="Path 9451" d="m.801 16-.8-.8v-3.764h1.346v1.73l-.093.453.1.058.29-.372 3.24-3.24L5.923 11.1l-3.229 3.251-.372.29.058.1.453-.093h1.731V16z" fill="#333" />
            <path data-name="Path 9450" d="m15.187 16 .8-.8v-3.76h-1.346v1.73l.093.453-.1.058-.29-.372-3.24-3.24-1.034 1.034 3.229 3.252.372.29-.058.1-.453-.093h-1.73v1.347z" fill="#333" />
          </svg>
        </div>
      </div>

      <div class="asset__section__head__sample_download" v-if="isUserAuthenticated && metadata.samples">
        <span><strong>Download metadata:</strong></span>
        <multiselect v-model="metadataDownloadFileSelection" :options="['file_1']" :allowEmpty="false" :preselectFirst="true" :searchable="false" :openDirection="'bottom'" :close-on-select="true" :show-labels="false" placeholder="Select a sample to download"></multiselect>
        <div v-if="metadataDownloadFileSelection" @click="onDownloadAutomatedMetadata" class="asset__section__head__sample_download__btn">
          <svg data-name="Group 2342" xmlns="http://www.w3.org/2000/svg" width="15" height="16">
            <g data-name="Group 753">
              <g data-name="Group 752"><path data-name="Path 2224" d="M11.455 7.293A.5.5 0 0 0 11.002 7h-2V.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7h-2a.5.5 0 0 0-.376.829l3.5 4a.5.5 0 0 0 .752 0l3.5-4a.5.5 0 0 0 .077-.536z" fill="#333" /></g>
            </g>
            <g data-name="Group 755">
              <g data-name="Group 754"><path data-name="Path 2225" d="M13 11v3H2v-3H0v4a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4z" fill="#333" /></g>
            </g>
          </svg>
        </div>
      </div>

      <div class="asset__section__head__main_information" v-if="isUserAuthenticated">
        <p v-if="'featureCount' in metadata"><strong>FEATURE COUNT:</strong> {{ metadata.featureCount }} <small class="ml-xs-20">Number of records in the dataset</small></p>
        <p><strong>NATIVE CRS:</strong> {{ metadata.crs }} <small class="ml-xs-20">Coordinate reference system (SRID/EPSG) of the original dataset</small></p>
        <p v-if="metadata.attributes">
          <strong>ATTRIBUTE NAMES:</strong> <span v-for="(attribute, i) in metadata.attributes" :key="attribute">{{ attribute }}<span v-if="i !== metadata.attributes.length - 1">, </span></span>
        </p>
        <p v-if="'cog' in metadata"><strong>CLOUD OPTIMISED GeoTIFF:</strong> {{ metadata.cog ? 'YES' : 'NO' }}</p>
        <p v-if="metadata.info && metadata.info.bands"><strong>NUMBER OF BANDS:</strong> {{ metadata.info.bands.length }}</p>

        <div class="asset__section__tabs__attribute-info mt-xs-15 mb-xs-15" v-if="metadata.resolution">
          <div class="grid-ignore-wrapper">
            <strong>RESOLUTION:</strong>
            <div class="asset__section__tabs__attribute-info__statistics">
              <span>[x]</span> <span>{{ metadata.resolution.x }} {{ metadata.resolution.unit === 'metre' ? 'm' : metadata.resolution.unit }}</span>
              <span>[y]</span> <span>{{ metadata.resolution.y }} {{ metadata.resolution.unit === 'metre' ? 'm' : metadata.resolution.unit }}</span>
            </div>
          </div>
        </div>

        <div class="asset__section__tabs__attribute-info" v-if="metadata.resolution">
          <div class="grid-ignore-wrapper">
            <strong>SIZE:</strong>
            <div class="asset__section__tabs__attribute-info__statistics">
              <span>[width]</span> <span>{{ metadata.info.width }} px</span>
              <span>[height]</span> <span>{{ metadata.info.height }} px</span>
            </div>
          </div>
        </div>
      </div>

      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""/></a>
      <div class="asset__section__head__tab-container">
        <ul class="asset__section__head__tabs asset__section__head__tabs" v-if="isUserAuthenticated">
          <li class="nowrap"><a href="#" @click.prevent="activeTab = 1" :class="{ active: activeTab == 1 }">{{ catalogueItem.type === 'RASTER' ? 'BANDS' : catalogueItem.type === 'NETCDF' ? 'VARIABLES' : 'ATTRIBUTES' }}</a></li>
          <li class="nowrap"><a href="#" @click.prevent="activeTab = 2" :class="{ active: activeTab == 2 }">Maps</a></li>
          <li class="nowrap"><a href="#" @click.prevent="activeTab = 3" :class="{ active: activeTab == 3 }">Correlation Matrix</a></li>
          <li class="nowrap" v-for="(sample, i) in samples" :key="i">
            <a href="#" @click.prevent="activeTab = i + 4" :class="{ active: activeTab == i + 4 }">Sample {{ i + 1 }}</a>
          </li>
        </ul>
        <ul class="asset__section__head__tabs asset__section__head__tabs" v-if="isUserAuthenticated && activeTab == 1 && catalogueItem.type !== 'RASTER'">
          <li>
            <a href="#" @click.prevent="changeLayout('VERTICAL')"
              ><svg :class="isVertical ? 'active' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g id="Group_2232" data-name="Group 2232" transform="translate(-609.144 -183.805)">
                  <g id="Group_2230" data-name="Group 2230" transform="translate(598.956 176.867)">
                    <path id="Path_9406" data-name="Path 9406" d="M10.552,6.938a.363.363,0,0,0-.364.364V22.574a.364.364,0,0,0,.727,0V7.3A.363.363,0,0,0,10.552,6.938Z" transform="translate(0 0)" fill="#333" />
                    <path id="Path_9407" data-name="Path 9407" d="M16.986,9.847h9.205a1.455,1.455,0,1,0,0-2.909H16.986a1.455,1.455,0,0,0,0,2.909Z" transform="translate(-1.457 0)" fill="#333" />
                    <path id="Path_9408" data-name="Path 9408" d="M26.191,15.938H16.986a1.455,1.455,0,0,0,0,2.909h9.205a1.455,1.455,0,1,0,0-2.909Z" transform="translate(-1.457 -2.455)" fill="#333" />
                    <path id="Path_9409" data-name="Path 9409" d="M26.191,24.938H16.986a1.455,1.455,0,1,0,0,2.909h9.205a1.455,1.455,0,1,0,0-2.909Z" transform="translate(-1.457 -4.909)" fill="#333" />
                  </g>
                </g>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="changeLayout('HORIZONTAL')"
              ><svg :class="!isVertical ? 'active' : ''" class="horizontal" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g id="Group_2232" data-name="Group 2232" transform="translate(-609.144 -183.805)">
                  <g id="Group_2230" data-name="Group 2230" transform="translate(598.956 176.867)">
                    <path id="Path_9406" data-name="Path 9406" d="M10.552,6.938a.363.363,0,0,0-.364.364V22.574a.364.364,0,0,0,.727,0V7.3A.363.363,0,0,0,10.552,6.938Z" transform="translate(0 0)" fill="#333" />
                    <path id="Path_9407" data-name="Path 9407" d="M16.986,9.847h9.205a1.455,1.455,0,1,0,0-2.909H16.986a1.455,1.455,0,0,0,0,2.909Z" transform="translate(-1.457 0)" fill="#333" />
                    <path id="Path_9408" data-name="Path 9408" d="M26.191,15.938H16.986a1.455,1.455,0,0,0,0,2.909h9.205a1.455,1.455,0,1,0,0-2.909Z" transform="translate(-1.457 -2.455)" fill="#333" />
                    <path id="Path_9409" data-name="Path 9409" d="M26.191,24.938H16.986a1.455,1.455,0,1,0,0,2.909h9.205a1.455,1.455,0,1,0,0-2.909Z" transform="translate(-1.457 -4.909)" fill="#333" />
                  </g>
                </g>
              </svg>
            </a>
          </li>
          <!-- DROPDOWN BUTTON -->
          <li :class="toggleDropdownContainer ? 'active' : ''" class="dropdown-item">
            <a v-if="metadata.attributes" class="no-underline" href="#" @click.prevent="toggleDropdownContainer = !toggleDropdownContainer">Viewing {{ selectedAttribute.length }} of {{ metadata.attributes.length }} attributes </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="10.29" height="7.492" viewBox="0 0 10.29 7.492">
              <path id="Path_2045" data-name="Path 2045" d="M-1105.012-7721.223l4.3,5.28,4.45-5.28" transform="translate(1105.787 7721.867)" fill="none" stroke="#333" stroke-width="2" />
            </svg>
            <!-- DROPDOWN CONTAINER -->
            <div v-if="toggleDropdownContainer" class="dropdown-container">
              <div class="dropdown-container__inner">
                <ul class="dropdown-container__list" v-if="metadata.attributes">
                  <li v-for="(attribute, i) in metadata.attributes" :key="attribute" class="dropdown-container__list__item">
                    <input type="checkbox" class="mr-xs-10 mb-xs-10" :id="`${attribute}-${i}`" v-model="selectedAttribute" :value="attribute" />
                    <label :for="`${attribute}-${i}`">{{ attribute }} </label>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner asset__section__content__inner--centered" v-if="!isUserAuthenticated">
        <div class="m-xs-40">
          <h2>Automated metadata and samples are visible only to registered users</h2>
          <p>Create a topio user account and explore geodata without limitations</p>
          <a href="/register" class="btn--std btn--blue">REGISTER</a>
        </div>
      </div>
      <div class="asset__section__content__inner" v-else>
        <ul class="asset__section__tabs">
          <!-- ATTRIBUTES -->
          <template v-if="!['RASTER', 'NETCDF'].includes(catalogueItem.type)">
            <li v-if="activeTab == 1 && isVertical">
              <template v-if="metadata.attributes">
                <div v-for="(attribute, i) in metadata.attributes" :key="attribute">
                  <template v-if="selectedAttribute.includes(attribute)">
                    <h4 class="mb-xs-20">
                      [<small>{{ metadata.datatypes[attribute] }}</small
                      >] {{ attribute }}

                      <template v-if="metadata.numericalValuePatterns && metadata.numericalValuePatterns[attribute]">
                        <br><small>{{ metadata.numericalValuePatterns[attribute] }}</small>
                      </template>
                    </h4>
                    <div class="row">
                      <!-- <div :class="showDistributionPieChart(attribute) ? 'col-sm-6' : 'col-sm-12'"> -->
                      <div class="col-sm-6">
                        <div class="asset__section__tabs__attribute-info">
                          <strong>Values in total</strong> <span>{{ metadata.count[attribute] }}</span>

                          <strong v-if="metadata.uniqueness && attribute in metadata.uniqueness">Uniqueness</strong> <span>{{ metadata.uniqueness[attribute] }}</span>

                          <div v-if="attribute in metadata.distribution" class="grid-ignore-wrapper">
                            <strong>Most frequent values</strong>
                            <div>
                              <div v-for="attributeValuePair in getMostFrequentValues(metadata.distribution[attribute])" :key="attributeValuePair.attribute">
                                <span
                                  >{{ attributeValuePair.attribute }} [<small>{{ attributeValuePair.amount }}</small
                                  >]</span
                                >
                              </div>
                            </div>
                          </div>

                          <div v-if="attribute in metadata.distinct" class="grid-ignore-wrapper">
                            <strong>Distinct values</strong>
                            <div>
                              <span v-for="(distinctValue, i) in metadata.distinct[attribute]" :key="distinctValue">{{ distinctValue }}<span v-if="i !== metadata.distinct[attribute].length - 1">, </span></span>
                            </div>
                          </div>

                          <div v-if="attribute in metadata.statistics.min" class="grid-ignore-wrapper">
                            <strong>Statistics</strong>
                            <div class="asset__section__tabs__attribute-info__statistics">
                              <span>Min</span> <span>{{ metadata.statistics.min[attribute] }}</span> <span>Max</span> <span>{{ metadata.statistics.max[attribute] }}</span> <span>Mean</span> <span>{{ metadata.statistics.mean[attribute] }}</span> <span>Median</span> <span>{{ metadata.statistics.median[attribute] }}</span> <span>Std</span> <span>{{ metadata.statistics.std[attribute] }}</span> <span>Sum</span> <span>{{ metadata.statistics.sum[attribute] }}</span>
                            </div>
                          </div>

                          <div v-if="attribute in metadata.quantiles['5']" class="grid-ignore-wrapper">
                            <strong>Quantiles</strong>
                            <div class="asset__section__tabs__attribute-info__quantiles">
                              <span>5</span> <span>{{ metadata.quantiles['5'][attribute] }}</span> <span>25</span> <span>{{ metadata.quantiles['25'][attribute] }}</span> <span>50</span> <span>{{ metadata.quantiles['50'][attribute] }}</span> <span>75</span> <span>{{ metadata.quantiles['75'][attribute] }}</span> <span>95</span> <span>{{ metadata.quantiles['95'][attribute] }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="asset__section__tabs__pie-chart-container" v-if="showDistributionPieChart(attribute)">
                          <p><strong>Distribution</strong></p>
                          <chart :options="getChartOptions('distribution', { total: metadata.count[attribute], distribution: metadata.distribution[attribute]})"></chart>
                        </div>
                        <div class="asset__section__tabs__pie-chart-container" v-if="showBoxPlot(attribute)">
                          <p><strong>Numerical Statistics</strong></p>
                          <chart :options="getChartOptions('boxplot', { attribute })"></chart>
                        </div>
                      </div>
                    </div>

                    <hr v-if="i !== metadata.attributes.length - 1" />
                  </template>
                </div>
              </template>
            </li>
            <!-- HORIZONTAL RENDER -->
            <li v-else-if="activeTab == 1 && !isVertical">
              <table class="data-table" v-if="metadata.attributes">
                <thead>
                  <tr>
                    <th></th>
                    <template v-for="attribute in metadata.attributes">
                      <th v-if="selectedAttribute.includes(attribute)" :key="attribute" class="align-middle">
                        [<small>{{ metadata.datatypes[attribute] }}</small
                        >] {{ attribute }}

                        <template v-if="metadata.numericalValuePatterns && metadata.numericalValuePatterns[attribute]">
                          <br><small>{{ metadata.numericalValuePatterns[attribute] }}</small>
                        </template>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Values in total</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">{{ metadata.count[attribute] }}</td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Uniqueness</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">{{ metadata.uniqueness && attribute in metadata.uniqueness ? metadata.uniqueness[attribute] : '-' }}</td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Most frequent values</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="attribute in metadata.distribution">
                          <div v-for="attributeValuePair in getMostFrequentValues(metadata.distribution[attribute])" :key="attributeValuePair.attribute">
                            <span
                              >{{ attributeValuePair.attribute }} [<small>{{ attributeValuePair.amount }}</small
                              >]</span
                            >
                          </div>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Distinct values</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="attribute in metadata.distinct">
                          <div v-for="(distinctValue, i) in metadata.distinct[attribute]" :key="distinctValue">{{ distinctValue }}<span v-if="i !== metadata.distinct[attribute].length - 1">, </span></div>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Statistics</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="attribute in metadata.statistics.min">
                          <div class="asset__section__tabs__attribute-info__statistics">
                            <span>Min</span> <span>{{ metadata.statistics.min[attribute] }}</span> <span>Max</span> <span>{{ metadata.statistics.max[attribute] }}</span> <span>Mean</span> <span>{{ metadata.statistics.mean[attribute] }}</span> <span>Median</span> <span>{{ metadata.statistics.median[attribute] }}</span> <span>Std</span> <span>{{ metadata.statistics.std[attribute] }}</span> <span>Sum</span> <span>{{ metadata.statistics.sum[attribute] }}</span>
                          </div>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Quantiles</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="attribute in metadata.quantiles['5']">
                          <div class="asset__section__tabs__attribute-info__statistics">
                            <span>5</span> <span>{{ metadata.quantiles['5'][attribute] }}</span> <span>25</span> <span>{{ metadata.quantiles['25'][attribute] }}</span> <span>50</span> <span>{{ metadata.quantiles['50'][attribute] }}</span> <span>75</span> <span>{{ metadata.quantiles['75'][attribute] }}</span> <span>95</span> <span>{{ metadata.quantiles['95'][attribute] }}</span>
                          </div>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Distribution</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="showDistributionPieChart(attribute)">
                          <chart :options="getChartOptions('distribution', { total: metadata.count[attribute], distribution: metadata.distribution[attribute] })"></chart>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                  <tr>
                    <td><strong>Numerical Statistics</strong></td>
                    <template v-for="attribute in metadata.attributes">
                      <td v-if="selectedAttribute.includes(attribute)" :key="attribute">
                        <template v-if="showBoxPlot(attribute)">
                          <chart :options="getChartOptions('boxplot', { attribute })"></chart>
                        </template>
                        <span v-else> - </span>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </li>
          </template>

          <!-- BANDS (RASTER) -->
          <li v-if="activeTab == 1 && catalogueItem.type === 'RASTER'">
            <template v-if="metadata.info && metadata.info.bands">
              <div v-for="(band, i) in metadata.info.bands" :key="i">
                <h3 class="mb-xs-20">{{ band }}</h3>

                <div class="asset__section__tabs__attribute-info mb-xs-20" v-if="metadata.statistics">
                  <div class="grid-ignore-wrapper">
                    <strong>Statistics</strong>
                    <div class="asset__section__tabs__attribute-info__statistics">
                      <div v-for="[key, value] in Object.entries(metadata.statistics[i])" :key="key" class="grid-ignore-wrapper">
                        <span>[<small>{{ key }}</small>]</span> <span>{{ value }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p :style="metadata.noDataValue[i] !== null ? {'margin-bottom': 0} : {}"><strong>Pixel depth:</strong> {{ metadata.histogram[i][3].length }}</p>
                <p v-if="metadata.noDataValue[i] !== null"><strong>No-date value:</strong> {{ Array.isArray(metadata.noDataValue[i]) ? metadata.noDataValue[i].join(', ') : metadata.noDataValue }}</p>

                <chart :options="getChartOptions('band_histogram', { index: i })"></chart>
                <hr>
              </div>
            </template>
          </li>

          <!-- VARIABLES (NetCDF) -->
          <li v-if="activeTab == 1 && catalogueItem.type === 'NETCDF'">
            <template v-if="metadata.variablesList && metadata.variablesList.length">
              <div v-for="variable in metadata.variablesList" :key="variable">
                <h3 class="mb-xs-20">{{ variable }}</h3>
                <div class="asset__section__tabs__attribute-info asset__section__tabs__attribute-info--small-row-gap">
                  <template v-if="metadata.variablesProperties">
                    <template v-if="metadata.variablesProperties[variable].type"><strong>type</strong> <span>{{ metadata.variablesProperties[variable].type }}</span></template>
                    <template v-if="metadata.variablesProperties[variable].size || metadata.variablesProperties[variable].size === 0"><strong>size</strong> <span>{{ metadata.variablesProperties[variable].size }}</span></template>
                    <template v-if="metadata.variablesProperties[variable].long_name"><strong>long name</strong> <span>{{ metadata.variablesProperties[variable].long_name }}</span></template>
                    <template v-if="metadata.variablesProperties[variable].units"><strong>units</strong> <span>{{ metadata.variablesProperties[variable].units }}</span></template>
                    <template v-if="metadata.variablesProperties[variable].dimensions"><strong>dimensions</strong> <span>{{ metadata.variablesProperties[variable].dimensions.length ? metadata.variablesProperties[variable].dimensions.join(', ') : '-' }}</span></template>
                  </template>
                </div>
                <hr>
              </div>
            </template>
            <template v-else><p>No data</p></template>
          </li>

          <!-- MAPS -->
          <li v-if="activeTab == 2">
            <div v-if="!metadata.mbr && !metadata.convexHull && !metadata.thumbnail && !metadata.heatmap && (!metadata.clusters || !metadata.clusters.features.length)">
              <h5>No maps to show</h5>
            </div>
            <div v-else>
              <p>Contains map images with the geometry of the dataset</p>
              <hr />
              <!-- MBR -->
              <div v-if="metadata.mbr">
                <div class="d-flex space-between mb-xs-5">
                  <span class="map-type">MBR</span>
                  <button v-if="mode === 'review' && !hiddenMetadata.includes('mbr')" class="btn--std btn--outlineblue" @click="onToggleField(true, 'mbr')">HIDE</button>
                  <button v-if="mode === 'review' && hiddenMetadata.includes('mbr')" class="btn--std btn--outlineblue" @click="onToggleField(false, 'mbr')">SHOW</button>
                </div>
                <p>Rectilinear box (Minimum Bounding Rectangle) denoting the spatial extent of all features</p>
                <div class="tab_maps-map" v-if="!hiddenMetadata.includes('mbr')">
                  <l-map ref="mapConfigMbr" :bounds="getMapBoundsFromWKT(metadata.mbr)" :maxBounds="getMapBoundsFromWKT(metadata.mbr)" :options="mapConfig.options">
                    <l-tile-layer :url="mapConfig.tilesUrl" :attribution="mapConfig.attribution" />
                    <l-geo-json :geojson="wktToGeoJson(metadata.mbr)" :optionsStyle="{ color: 'orange' }"> </l-geo-json>
                  </l-map>
                </div>
              </div>
              <!-- CONVEX HULL -->
              <div v-if="metadata.convexHull">
                <div class="d-flex space-between mb-xs-5">
                  <span class="map-type">Convex Hull</span>
                  <button v-if="mode === 'review' && !hiddenMetadata.includes('convexHull')" class="btn--std btn--outlineblue" @click="onToggleField(true, 'convexHull')">HIDE</button>
                  <button v-if="mode === 'review' && hiddenMetadata.includes('convexHull')" class="btn--std btn--outlineblue" @click="onToggleField(false, 'convexHull')">SHOW</button>
                </div>
                <p>Convex polygon enclosing all features</p>
                <div class="tab_maps-map" v-if="!hiddenMetadata.includes('convexHull')">
                  <!-- <l-map
                    ref="mapConfigConvexHull"
                    :bounds="mbrToLeafletBounds(metadata.mbr)"
                    :maxBounds="mbrToLeafletBounds(metadata.mbr)"
                    :options="mapConfig.options"
                  > -->
                  <l-map ref="mapConfigConvexHull" :bounds="getMapBoundsFromWKT(metadata.convexHull)" :maxBounds="getMapBoundsFromWKT(metadata.convexHull)" :options="mapConfig.options">
                    <l-tile-layer :url="mapConfig.tilesUrl" :attribution="mapConfig.attribution" />
                    <l-geo-json :geojson="wktToGeoJson(metadata.convexHull)" :optionsStyle="{ color: 'orange' }"> </l-geo-json>
                  </l-map>
                </div>
              </div>
              <!-- THUMBNAIL -->
              <div v-if="metadata.thumbnail">
                <div class="d-flex space-between mb-xs-5">
                  <span class="map-type">Thumbnail</span>
                  <button v-if="mode === 'review' && !hiddenMetadata.includes('thumbnail')" class="btn--std btn--outlineblue" @click="onToggleField(true, 'thumbnail')">HIDE</button>
                  <button v-if="mode === 'review' && hiddenMetadata.includes('thumbnail')" class="btn--std btn--outlineblue" @click="onToggleField(false, 'thumbnail')">SHOW</button>
                </div>
                <p>Thumbnail image depicting the spatial coverage of the dataset</p>
                <div class="tab_maps-map tab_maps-map-thumbnail" v-if="!hiddenMetadata.includes('thumbnail')">
                  <img v-if="metadata" :src="metadata.thumbnail" alt="thumbnail" />
                </div>
              </div>
              <!-- HEATMAP -->
              <div v-if="metadata.heatmap">
                <div class="d-flex space-between mb-xs-5">
                  <span class="map-type">Heatmap</span>
                  <button v-if="mode === 'review' && !hiddenMetadata.includes('heatmap')" class="btn--std btn--outlineblue" @click="onToggleField(true, 'heatmap')">HIDE</button>
                  <button v-if="mode === 'review' && hiddenMetadata.includes('heatmap')" class="btn--std btn--outlineblue" @click="onToggleField(false, 'heatmap')">SHOW</button>
                </div>
                <p>Colormap with varying intensity according to the density of features</p>
                <div class="tab_maps-map" v-if="!hiddenMetadata.includes('heatmap')">
                  <l-map ref="mapConfigHeatmap" :bounds="getMapBoundsFromGeoJson(heatmapGeoJson)" :maxBounds="getMapBoundsFromGeoJson(heatmapGeoJson)" :options="mapConfig.options">
                    <l-tile-layer :url="mapConfig.tilesUrl" :attribution="mapConfig.attribution" />
                    <l-geo-json :geojson="heatmapGeoJson" :optionsStyle="mapConfig.styleHeatmap" :smoothFactor="0.2" :opacity="0.1" :options="{ smoothFactor: 0.2 }"> </l-geo-json>
                  </l-map>
                </div>
              </div>
              <!-- CLUSTERS -->
              <div v-if="metadata.clusters && metadata.clusters.features.length">
                <div class="d-flex space-between mb-xs-5">
                  <span class="map-type">Clusters</span>
                  <button v-if="mode === 'review' && !hiddenMetadata.includes('clusters')" class="btn--std btn--outlineblue" @click="onToggleField(true, 'clusters')">HIDE</button>
                  <button v-if="mode === 'review' && hiddenMetadata.includes('clusters')" class="btn--std btn--outlineblue" @click="onToggleField(false, 'clusters')">SHOW</button>
                </div>
                <p>Density-based spatial clusters of features</p>
                <div class="tab_maps-map" v-if="!hiddenMetadata.includes('clusters')">
                  <l-map ref="mapClusters" :bounds="getMapBoundsFromGeoJson(metadata.clusters)" :maxBounds="getMapBoundsFromGeoJson(metadata.clusters)" :options="mapConfig.options">
                    <l-tile-layer :url="mapConfig.tilesUrl" :attribution="mapConfig.attribution" />
                    <l-geo-json :geojson="metadata.clusters" :optionsStyle="{ color: 'orange' }"> </l-geo-json>
                  </l-map>
                </div>
              </div>
            </div>
          </li>

          <li v-if="activeTab === 3">
            <div class="asset__section__tabs__pie-chart-container" v-if="showCorrelationMatrix()">
              <p>Contains the correlation matrix of the dataset attributes</p>
              <hr>
              <chart :options="getChartOptions('correlation_matrix', {})"></chart>
            </div>
            <p v-else>No data</p>
          </li>

          <li v-if="activeTab > 3 && samples !== null">
            <div v-for="(sampleTab, i) in tempSamples" :key="i">
              <!-- <button v-if="activeTab === i + 3" style="float: right" @click="onDownloadSample(i)">download {{ i }}</button> -->
              <button v-if="mode === 'review' && activeTab === i + 3 && !indexesOfReplacedSamples.includes(i)" @click="onReplaceSample(i)" class="btn btn--std btn--outlineblue">replace</button>
              <button v-if="mode === 'review' && activeTab === i + 3 && indexesOfReplacedSamples.includes(i)" @click="onRevertSample(i)" class="btn btn--std btn--outlineblue">revert</button>
              <button v-if="mode === 'review' && activeTab === i + 3 && indexesOfReplacedSamples.includes(i)" @click="onSubmitSample(i)" class="btn btn--std btn--blue">save</button>

              <div v-if="activeTab === i + 3" title="download CSV" @click="onDownloadSample(i)" class="asset__section__head__sample_download__btn float-right">
                <svg data-name="Group 2342" xmlns="http://www.w3.org/2000/svg" width="15" height="16">
                  <g data-name="Group 753">
                    <g data-name="Group 752"><path data-name="Path 2224" d="M11.455 7.293A.5.5 0 0 0 11.002 7h-2V.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7h-2a.5.5 0 0 0-.376.829l3.5 4a.5.5 0 0 0 .752 0l3.5-4a.5.5 0 0 0 .077-.536z" fill="#333" /></g>
                  </g>
                  <g data-name="Group 755">
                    <g data-name="Group 754"><path data-name="Path 2225" d="M13 11v3H2v-3H0v4a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4z" fill="#333" /></g>
                  </g>
                </svg>
              </div>
              <div v-if="activeTab === i + 3" class="samples_table__wrapper">
                <table class="samples_table">
                  <tr class="samples_table__header">
                    <th v-for="(attribute, j) in Object.keys(tempSamples[i])" :key="j">{{ attribute }}</th>
                  </tr>
                  <tr class="samples_table__data" v-for="(value, j) in Object.values(tempSamples[i])[0]" :key="j">
                    <td v-for="(attribute, k) in Object.keys(tempSamples[i])" :key="k">
                      {{ tempSamples[i][attribute][j] ? tempSamples[i][attribute][j] : '-' }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""/></a>
  </section>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import store from '@/store';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Heatmap from 'highcharts/modules/heatmap';
import Multiselect from 'vue-multiselect';
import L from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { parse as wktToGeojsonParser } from 'wellknown';
import fileDownload from 'js-file-download';
import { ExportToCsv } from 'export-to-csv';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';
import {
  CatalogueItemMetadataCommand, CatalogueItemDetails, Sample, TabularSample,
} from '@/model/catalogue';
// eslint-disable-next-line
import { GeoJsonObject } from 'geojson';
import Modal from '@/components/Modal.vue';
import csvToSample from '@/helper/file';
import { cloneDeep } from 'lodash';
import { bbox as turfBBox } from '@turf/turf';

HighchartsMore(Highcharts);
Heatmap(Highcharts);

@Component({
  components: {
    Chart,
    Multiselect,
    LMap,
    LTileLayer,
    LPolygon,
    LGeoJson,
    Modal,
  },
})
export default class DataProfilingAndSamples extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItemDetails;

  @Prop() private mode?: string;

  @Prop() private assetKey?: string;

  metadata: any;

  samples: Sample[];

  hiddenMetadata: string[] | undefined;

  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  activeTab: number;

  isUserAuthenticated: boolean;

  mapConfig: any;

  heatmapGeoJson: GeoJsonObject | null;

  // currently, just a dummy property (todo)
  metadataDownloadFileSelection: string;

  isExpanded: boolean;

  modalToShow: string;

  indexOfSampleToReplace: number | null;

  tempSamples: Sample[];

  indexesOfReplacedSamples: number[];

  isVertical: boolean;

  toggleDropdownContainer: boolean;

  selectedAttribute: any;

  constructor() {
    super();

    this.isVertical = true;
    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();
    this.toggleDropdownContainer = false;
    this.selectedAttribute = [];

    this.metadata = {};
    if (this.catalogueItem.automatedMetadata) [this.metadata] = this.catalogueItem.automatedMetadata;
    console.log('met', this.metadata);

    this.hiddenMetadata = this.catalogueItem.visibility;

    this.activeTab = 1;

    this.isExpanded = false;

    this.isUserAuthenticated = store.getters.isAuthenticated;

    this.samples = [];
    this.tempSamples = [];

    this.heatmapGeoJson = null;

    // this.metadataDownloadFileSelection = 'sample 1';
    this.metadataDownloadFileSelection = '';

    this.modalToShow = '';

    this.indexOfSampleToReplace = null;

    this.indexesOfReplacedSamples = [];

    this.mapConfig = {
      options: {
        minZoom: 1,
        maxZoom: 10,
      },
      styleHeatmap: (feature) => ({
        fillColor: feature.properties.fill,
        color: feature.properties.fill,
        fillOpacity: 0.7,
        opacity: 0.4,
        weight: 1,
        stroke: true,
      }),
      tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  }

  mounted(): void {
    this.selectedAttribute = this.metadata.attributes; // todo: check
    console.log('heatmap link', this.metadata.heatmap);
    if (this.metadata.heatmap) {
      this.catalogueApi.getAssetHeatmap(this.metadata.heatmap).then((heatmapResponse) => {
        this.heatmapGeoJson = heatmapResponse;
      });
    }
    if (this.metadata.samples) {
      this.catalogueApi.getAssetSamples(this.metadata.samples).then((samplesResponse) => {
        console.log('samples!', samplesResponse);
        this.samples = samplesResponse;
        this.tempSamples = cloneDeep(samplesResponse);
      });
    }
  }

  @Watch('activeTab')
  onActiveTabChange(activeTab: number): void {
    // if tab is maps-tab
    if (activeTab === 2 && this.isUserAuthenticated) {
      this.setMinMaxZoomLevels();
    }
  }

  @Watch('selectedAttribute')
  // eslint-disable-next-line
  onAttributeChange(v: any): void {
    console.log(v);
  }

  changeLayout(value: string): void {
    if (value === 'VERTICAL') {
      this.isVertical = true;
    } else if (value === 'HORIZONTAL') {
      this.isVertical = false;
    }
    console.log(value);
  }

  toggleExpansion(): void {
    // if (!this.isExpanded) window.scrollTo(0, 0);
    this.isExpanded = !this.isExpanded;
    document.body.style.overflowY = this.isExpanded ? 'hidden' : 'visible';
  }

  showDistributionPieChart(attribute: string): boolean {
    if (attribute in this.metadata.distribution && this.getMostFrequentValues(this.metadata.distribution[attribute]).length > 1) {
      return true;
    }
    return false;
  }

  formatDistributionForChart(total: number, distribution: Record<string, number>): any {
    const vals = Object.keys(distribution).map((x) => ({ name: x, y: (distribution[x] / total) * 100 }));
    const remainingPercentageTo100 = 100 - vals.reduce((sum, obj) => obj.y + sum, 0);
    if (Math.round(remainingPercentageTo100 * 100) / 100) vals.push({ name: 'other', y: remainingPercentageTo100 }); // add 'other' in pie chart if remaining percentage is at least 0.01 (2 decimals)
    return vals;
  }

  getMostFrequentValues(distribution: Record<string, number>): { attribute: string; amount: number }[] {
    return Object.keys(distribution)
      .map((x) => ({ attribute: x, amount: distribution[x] }))
      .sort((a, b) => b.amount - a.amount);
  }

  showBoxPlot(attribute: string): boolean {
    if (
      this.metadata.numericalStatistics && this.metadata.numericalStatistics[attribute]
      && Object.values(this.metadata.numericalStatistics[attribute]).some((x: any) => (x.mean || x.mean === 0))
    ) return true;
    return false;
  }

  getBoxPlotValues(
    attribute: string,
    statistics: {min: Record<string, number>, max: Record<string, number>},
    numericalStatistics: Record<string, Record<string, { mean: number, stdev: number, median: number, variance: number }>>,
  ): {
    categories: string[],
    values: number[][],
  } {
    return {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      categories: Object.entries(numericalStatistics[attribute])
        .filter(([key, value]) => value.mean || value.mean === 0)
        .map(([key, value]) => key),
      values: Object.entries(numericalStatistics[attribute])
        // eslint-disable-next-line
        .filter(([key, value]) => value.mean || value.mean === 0)
        .map(([key, value], i) => {
          const classValues = key.split('-');
          if (classValues.length !== 2) return [];

          const [classMinText, classMaxText] = classValues;
          const classMin = parseFloat(classMinText);
          const classMax = parseFloat(classMaxText);

          return [
            i === 0 ? statistics.min[attribute] : classMin,
            value.mean - value.stdev,
            value.mean,
            value.mean + value.stdev,
            // eslint-disable-next-line
            i === Object.entries(numericalStatistics[attribute]).filter(([k, v]) => v.mean || v.mean === 0).length - 1 ? statistics.max[attribute] : classMax,
          ];
        }),
      /* eslint-enable @typescript-eslint/no-unused-vars */
    };
  }

  showCorrelationMatrix(): boolean {
    if (
      this.metadata.numericalAttributeCorrelation
      && this.metadata.numericalAttributeCorrelation.columns?.length > 1
      && this.metadata.numericalAttributeCorrelation.cor_matrix?.length
      && this.metadata.numericalAttributeCorrelation.cor_matrix[1]
      && Object.values(this.metadata.numericalAttributeCorrelation.cor_matrix[0]).every((x) => x || x === 0)
      && Object.values(this.metadata.numericalAttributeCorrelation.cor_matrix[1]).every((x) => x || x === 0)
    ) return true;
    return false;
  }

  getCorrelationMatrixValues(): { categories: string[], values: number[][] } {
    const data = {
      categories: this.metadata.numericalAttributeCorrelation.columns,
      values: this.metadata.numericalAttributeCorrelation.cor_matrix
        .reduce((p, c, i) => {
          const line: number[][] = [];
          c.forEach((x, j) => {
            line.push([i, j, Math.round(x * 100) / 100]);
          });

          return [...p, ...line];
        }, []),
    };

    console.log('d', data);
    return data;
  }

  onDownloadAutomatedMetadata(): void {
    fileDownload(JSON.stringify(this.metadata), 'metadata.json');
  }

  onDownloadSample(index: number): void {
    // eslint-disable-next-line
    // const index = parseInt(this.metadataDownloadFileSelection.split('_')!.pop()!.split('.')[0]) - 1;

    const csvArr: Record<string, string>[] = [];
    Object.values<Array<any>>(this.samples[index] as TabularSample)[0].forEach((v, i) => {
      const obj: Record<string, string> = {};
      Object.keys(this.samples[index]).forEach((x) => {
        obj[x] = `${this.samples[index][x][i]}`;
      });
      csvArr.push(obj);
    });

    const options = {
      filename: `sample_${index + 1}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvArr);
  }

  // eslint-disable-next-line
  getChartOptions(type: string, data: any): any {
    switch (type) {
      case 'correlation_matrix': {
        const chartOptions = {
          chart: {
            backgroundColor: 'transparent',
            plotBorderWidth: 1,
          },
          title: {
            text: null,
          },
          xAxis: {
            categories: this.getCorrelationMatrixValues().categories,
          },
          yAxis: {
            categories: this.getCorrelationMatrixValues().categories,
            title: null,
            reversed: true,
          },
          colorAxis: {
            min: 0,
            minColor: '#fff',
            maxColor: '#2a6d8f',
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280,
          },
          tooltip: {
            /* eslint-disable */
            formatter: function() {
              return `Attributes: <span><b>${(this as any).series.xAxis.categories[(this as any).point.x]}</b></span> | <span><b>${(this as any).series.yAxis.categories[(this as any).point.y]}</b></span> <br>Correlation: <b>${(this as any).point.value}</b>`;
            },
            /* eslint-enable */
          },
          series: [{
            type: 'heatmap',
            borderWidth: 1,
            data: this.getCorrelationMatrixValues().values,
            dataLabels: {
              enabled: true,
              color: '#000000',
            },
          }],
        };

        return chartOptions;
      }

      case 'boxplot': {
        const chartOptions = {
          chart: {
            type: 'boxplot',
            backgroundColor: 'transparent',
            marginTop: 20,
          },
          title: {
            text: null,
          },
          legend: {
            enabled: false,
          },
          xAxis: {
            categories: this.getBoxPlotValues(data.attribute, this.metadata.statistics, this.metadata.numericalStatistics).categories,
            title: {
              text: 'Classes',
            },
          },
          yAxis: {
            title: {
              text: 'Values',
            },
          },
          series: [{
            name: 'Numerical Statistics',
            data: this.getBoxPlotValues(data.attribute, this.metadata.statistics, this.metadata.numericalStatistics).values,
            color: '#2a6d8f',
            fillColor: 'rgba(42, 109, 143, 0.3)',
          }],
        };

        return chartOptions;
      }

      case 'distribution': {
        const chartOptions = {
          chart: {
            type: 'pie',
            backgroundColor: 'transparent',
          },
          colorByPoint: true,
          credits: {
            enabled: false,
          },
          navigation: {
            buttonOptions: {
              enabled: false,
            },
          },
          // colors: this.pieColor,
          title: {
            text: '',
          },
          subtitle: {
            text: '',
          },

          accessibility: {
            announceNewData: {
              enabled: true,
            },
            point: {
              valueSuffix: '%',
            },
          },

          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                // format: '{point.name}: {point.y:.1f}%',
                format: '{point.name}',
              },
            },
          },

          tooltip: {
            // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
          },

          series: [
            {
              // name: 'Browsers',
              colorByPoint: true,
              dataLabels: {
                connectorShape: 'straight',
                style: {
                  fontSize: 8,
                },
              },
              data: this.formatDistributionForChart(data.total, data.distribution),
            },
          ],
        };

        return chartOptions;
      }
      case 'band_histogram': {
        return {
          chart: {
            type: 'column',
            spacingTop: 16,
          },
          title: {
            style: {
              fontSize: '15px',
              fontWeight: 600,
            },
            text: 'Histogram',
          },
          xAxis: {
            title: {
              style: {
                fontWeight: 700,
              },
              text: 'Pixel Value',
            },
          },
          yAxis: {
            title: {
              style: {
                fontWeight: 700,
              },
              text: 'Frequency',
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            column: {
              pointPadding: 0,
              padding: 0,
              borderWidth: 0,
              groupPadding: 0,
            },
          },
          tooltip: {
            headerFormat: 'Pixel Value: <b>{point.x}</b> <br/>',
            pointFormat: 'Frequency: <span style="color:{point.color}"><b>{point.y}</b></span>',
          },
          series: [{
            color: '#190AFF',
            data: this.metadata.histogram[data.index][3],
          }],
        };
      }
      default: return null;
    }
  }

  setMinMaxZoomLevels(): void {
    this.$nextTick(() => {
      let fitBoundsZoomLevel;
      ['mapConfigMbr', 'mapConfigConvexHull', 'mapConfigHeatmap', 'mapConfigClusters'].every((map) => {
        if (this.$refs[map]) {
          fitBoundsZoomLevel = (this as any).$refs[map].mapObject.getBoundsZoom(L.geoJSON(this.wktToGeoJson(this.metadata.mbr)).getBounds());

          const zoomOffset = 2;

          const minZoom = fitBoundsZoomLevel - zoomOffset < 0 ? 0 : fitBoundsZoomLevel - zoomOffset;
          const maxZoom = fitBoundsZoomLevel + zoomOffset;

          Vue.set(this.mapConfig.options, 'minZoom', minZoom);
          Vue.set(this.mapConfig.options, 'maxZoom', maxZoom);

          return false;
        }
        return true;
      });
    });
  }

  wktToGeoJson(wkt: string): any {
    return wktToGeojsonParser(wkt);
  }

  // mbrToLeafletBounds(wkt: string): number[][] {
  //   const geoJson = wktToGeojsonParser(wkt);
  //   const bounds = geoJson.coordinates[0]
  //     .map((x) => [x[1], x[0]]);
  //   return bounds;
  // }

  getMapBoundsFromWKT(wkt: string): number[][] {
    const geoJson = wktToGeojsonParser(wkt);
    const bbox = turfBBox(geoJson);
    return [
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]],
    ];
  }

  getMapBoundsFromGeoJson(geoJson: GeoJsonObject): number[][] {
    const bbox = turfBBox(geoJson);
    return [
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]],
    ];
  }

  onToggleField(hide: boolean, field: string): void {
    store.commit('setLoading', true);
    const key = this.assetKey ? this.assetKey : '';
    let fieldsToHide: string[] = [];
    if (hide) {
      fieldsToHide = this.hiddenMetadata && this.hiddenMetadata.length ? this.hiddenMetadata.concat([field]) : [field];
    } else {
      fieldsToHide = this.hiddenMetadata && this.hiddenMetadata.length ? this.hiddenMetadata.filter((x) => x !== field) : [];
    }
    const visibility: CatalogueItemMetadataCommand = {
      // TODO: handle multiple resources
      resourceKey: this.metadata.key,
      visibility: fieldsToHide,
    };
    this.draftAssetApi.updateDraftMetadata(key, visibility).then((hideFieldResponse) => {
      console.log('hfr', hideFieldResponse);
      this.hiddenMetadata = hideFieldResponse.data.result.command.visibility;
      store.commit('setLoading', false);
      this.$nextTick(() => {
        ['mapConfigMbr', 'mapConfigConvexHull', 'mapConfigHeatmap', 'mapConfigClusters'].forEach((x) => {
          try {
            (this as any).$refs[x].mapObject.invalidateSize();
            this.setMinMaxZoomLevels();
          } catch (err) {
            console.log('err');
          }
        });
      });
      // this.$nextTick(() => {
      //   (this as any).$refs.mapConfigMbr.mapObject.invalidateSize();
      //   (this as any).$refs.mapConfigConvexHull.mapObject.invalidateSize();
      //   (this as any).$refs.mapConfigHeatmap.mapObject.invalidateSize();
      //   (this as any).$refs.mapConfigClusters.mapObject.invalidateSize();
      // });
    });
  }

  onReplaceSample(i: number): void {
    console.log('replace', i);
    this.indexOfSampleToReplace = i;
    this.modalToShow = 'modalUploadSample';
  }

  // eslint-disable-next-line
  onDisplaySample(v): void {
    store.commit('setLoading', true);
    console.log('f', v.inputValues[0].value);
    const f = v.inputValues[0].value;
    csvToSample(f).then((r) => {
      console.log('r', r);
      if (this.indexOfSampleToReplace !== null && r?.samples[0]) [this.tempSamples[this.indexOfSampleToReplace]] = r.samples;
      if (this.indexOfSampleToReplace !== null) this.indexesOfReplacedSamples.push(this.indexOfSampleToReplace);
      console.log(this.tempSamples);
      this.modalToShow = '';
      store.commit('setLoading', false);
    });
  }

  onRevertSample(i: number): void {
    // this.tempSamples[i] = this.metadata.samples[i];
    console.log(i, this.samples[i]);
    Vue.set(this.tempSamples, i, this.samples[i]);
    this.indexesOfReplacedSamples = this.indexesOfReplacedSamples.filter((x) => x !== i);
  }

  onSubmitSample(i: number): void {
    store.commit('setLoading', true);
    const key = this.assetKey ? this.assetKey : '';
    const samplesData = cloneDeep(this.samples);
    samplesData[i] = this.tempSamples[i];
    console.log('k', key);
    console.log(samplesData);
    const samples: CatalogueItemMetadataCommand = {
      resourceKey: this.metadata.key,
      samples: samplesData,
    };
    this.draftAssetApi.updateDraftMetadata(key, samples).then((updateSamplesResponse) => {
      if (updateSamplesResponse.data.success) {
        console.log('successfully updated samples!', updateSamplesResponse);
        this.indexesOfReplacedSamples = this.indexesOfReplacedSamples.filter((x) => x !== i);
        this.samples = samplesData;
        store.commit('setLoading', false);
      } else {
        console.log('error updating samples...');
      }
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
@import '~vue-multiselect/dist/vue-multiselect.min.css';
@import '@/assets/styles/graphs/_table.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';

// LEAFLET FIXES DUE TO STYLE OVERRIDE
.leaflet-container a {
  -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4) !important;
}
.leaflet-container a {
  color: #0078a8 !important;
}
.leaflet-touch .leaflet-bar a {
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
}
.leaflet-control-attribution,
.leaflet-control-attribution a {
  font-size: 11px !important;
}
.leaflet-control-attribution a {
  text-decoration: none !important;
}
.leaflet-bar > a:link {
  color: black !important;
  text-decoration: none !important;
  font-size: 22px !important;
  width: 30px;
  height: 30px;
  line-height: 30px;
}
</style>
