<template>
  <transition name="fade">
    <div class="select-area-modal__wrapper" v-if="show">
      <div class="select-area-modal">
        <div class="select-area-modal__header">
          <h3>Select areas</h3>
          <div @click="onCloseModal" class="select-area-modal__btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
              <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
                <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
                <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
              </g>
            </svg>
          </div>
        </div>
        <div class="select-area-modal__body">
          <div class="select-area-modal__col-areas">
            <h4>Europe NUTS 1 & 2</h4>
            <div class="select-area-modal__col-areas__scroll-wrapper">
              <div class="select-area-modal__col-areas__area" v-for="country in europeGeoJson.features" :key="country.properties.id" ref="country">
                <!-- TODO: (have written CSS .selected class for countries in list)-->
                <!-- <div @click="selectCountry(country)" :class="{'selected': areasSelectedForPurchase.includes(country.properties.CNTR_ID)}"> -->
                <div @click="selectCountry(country)">
                  <span> {{ country.properties.NAME_ENGL }} </span>
                  <span v-if="selectedNutsCountry !== country.properties.id || !isMapStateCountryLevel"> + </span>
                </div>
                <div v-if="selectedNutsCountry == country.properties.id">
                  <div v-if="!subAreasGeoJson && isMapStateCountryLevel">loading</div>
                  <div v-if="subAreasGeoJson" class="select-area-modal__col-areas__sub-areas">
                    <span @click="selectSubArea(area.properties.code)" :class="{'nuts-1': area.properties.code.length == 3, 'nuts-2': area.properties.code.length == 4, 'nuts-3': area.properties.code.length == 5, 'selected': isAreaSelected(area.properties.code)}" class="select-area-modal__col-areas__sub-areas__area" v-for="area in subAreasGeoJson.features" :key="area.properties.code">{{ area.properties.code }}: {{ area.properties.name }}</span>
                  </div>
                  <div></div>
                </div>
                <hr>
              </div>
            </div>
          </div>
          <div class="select-area-modal__col-map">
            <l-map ref="mapSelectAreas" :maxZoom="maxZoom" :minZoom="minZoom" :bounds="mapOptions.bounds" @zoomend="onZoomEnd" v-if="mapOptions">
              <div class="loader" v-if="isAreasLoading"><h2>LOADING</h2></div>

              <transition name="fade" mode="out-in">
                <div v-if="isMapStateCountryLevel" class="select-area-modal__col-map__map-msg select-area-modal__col-map__map-msg--blue">
                  <h2> Click on an area to add to cart </h2>
                </div>
              </transition>
              <transition name="fade" mode="out-in">
                <div v-if="!isMapStateCountryLevel" class="select-area-modal__col-map__map-msg">
                  <h2> Click on a country to select areas </h2>
                </div>
              </transition>

              <div class="select-area-modal__col-map__add-area" v-if="selectedNutsCountry && subAreasGeoJson && !areasSelectedForPurchase.includes(selectedNutsCountry)">
                <h3>{{ europeGeoJson.features.find((x) => x.properties.id === selectedNutsCountry).properties.NAME_ENGL }}</h3>
                <!-- <span>130,000 rows</span> -->
                <button @click="addCountry()" class="btn--std btn--blue mt-xs-10">ADD COUNTRY</button>
              </div>
              <l-tile-layer :url="mapOptions.tileUrl"></l-tile-layer>
              <!-- <l-geo-json ref="europeGeoJsonLayer" v-if="!isMapStateCountryLevel" :geojson="europeGeoJson" :optionsStyle="mapOptions.europeGeoJsonStyle" :options="mapOptions.europeGeoJsonOptions"></l-geo-json> -->
              <l-geo-json ref="europeGeoJsonLayer" :visible="!isMapStateCountryLevel" :geojson="europeGeoJson" :optionsStyle="mapOptions.europeGeoJsonStyle" :options="mapOptions.europeGeoJsonOptions"></l-geo-json>
              <!-- in order to have 'ref' of the layer, v-show instead of v-if is required. therefore, a dummy linestring is used as geojson, when subAreasGeoJson is null -->
              <!-- <l-geo-json ref="subAreasGeoJsonLayer" v-show="isMapStateCountryLevel" :geojson="subAreasGeoJson? subAreasGeoJson : {type: 'Feature', geometry: {type: 'LineString', coordinates: []}}" :optionsStyle="subAreasGeoJson? mapOptions.subAreasGeoJsonStyle : {}" :options="subAreasGeoJson? mapOptions.subAreasGeoJsonOptions : {}"></l-geo-json> -->
              <l-geo-json ref="subAreasGeoJsonLayer" :visible="isMapStateCountryLevel" :geojson="subAreasGeoJson? subAreasGeoJson : {type: 'Feature', geometry: {type: 'LineString', coordinates: []}}" :optionsStyle="mapOptions.subAreasGeoJsonStyle" :options="mapOptions.subAreasGeoJsonOptions"></l-geo-json>
            </l-map>
          </div>
          <div class="select-area-modal__col-submit">
            <div class="select-area-modal__col-submit__area-label__wrapper">
              <div v-for="area in areasSelectedForPurchase" :key="area" class="select-area-modal__col-submit__area-label">
                {{ area }}
                <button @click="onRemoveAreaFromList(area)">X</button>
              </div>
            </div>
            <span class="select-area-modal__col-submit__message" v-if="!areasSelectedForPurchase.length">Please, select areas to calculate price.</span>
            <button @click="getQuotation" v-if="!quotationResult" :disabled="!areasSelectedForPurchase.length || isQuotationLoading" class="btn btn--std btn--white mb-xs-20">{{ isQuotationLoading ? 'Please Wait...' : 'Calculate Price' }}</button>

            <!-- ********************************************************************************  -->

            <div class="asset__shopcard" v-if="quotationResult">
              <div class="asset__shopcard__variations">

                <div class="asset__shopcard__rows-data mb-xs-20" v-if="'selectedPopulation' in quotationResult.systemParameters || 'selectedRows' in quotationResult.systemParameters">
                  <template v-if="'selectedPopulation' in quotationResult.systemParameters">
                    <div>
                      <span>Population in select areas</span>
                      <span>{{ quotationResult.systemParameters.selectedPopulation }}</span>
                    </div>
                  </template>
                  <hr v-if="'selectedPopulation' in quotationResult.systemParameters && 'selectedRows' in quotationResult.systemParameters">
                  <template v-if="'selectedRows' in quotationResult.systemParameters">
                    <div>
                      <span>Rows to be charged</span>
                      <span>{{ quotationResult.systemParameters.selectedRows }}</span>
                    </div>
                  </template>
                </div>

                <div class="asset__shopcard__price">
                  <template>
                    <span class="asset__shopcard__price__text--main">{{ quotationResult.quotation.totalPriceExcludingTax }}</span>
                    <span class="asset__shopcard__price__text--top">€</span>
                  </template>
                </div>

                <span class="asset__shopcard__vat">+ VAT {{ quotationResult.quotation.taxPercent }}%</span>

                <!-- <div class="asset__shopcard__variations__container mt-xs-20" v-if="((catalogueItem.pricingModels.length !== 1 || catalogueItem.pricingModels[0].model.type !== 'FREE') && catalogueItem.type !== 'SENTINEL_HUB_OPEN_DATA')">
                  <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.model.key">
                    <input :hidden="catalogueItem.pricingModels.length === 1" type="radio" name="variations" :id="`p_variation_${pr_model.model.key}`" v-model="selectedPricingModel" :value="pr_model.model">
                    <label :for="`p_variation_${pr_model.model.key}`" :class="{'label--centered': catalogueItem.pricingModels.length === 1}">{{ formatPricingModelType(pr_model.model.type) }}

                      <div v-if="pr_model.model.type === 'FIXED_PER_ROWS' && selectedPricingModel && selectedPricingModel.type === 'FIXED_PER_ROWS'">
                        <p class="asset__shopcard__variations__row__description mb-xs-10">Buy only a subset of the asset for the areas you need. Select the areas you are interested in and get a real-time quotation based on the number of rows included in your selection</p>
                        <strong>Minimum rows:</strong> {{ pr_model.model.minRows ? pr_model.model.minRows : 'not specified' }}
                        <div class="asset__shopcard__variations__row__discounts">
                          <div><strong>Discounts:</strong></div>
                          <div class="asset__shopcard__variations__row__discounts__table">
                            <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                              <span>{{ discount.count }} rows, {{ discount.discount }}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="pr_model.model.type === 'FIXED_FOR_POPULATION' && selectedPricingModel && selectedPricingModel.type === 'FIXED_FOR_POPULATION'">
                        <p class="asset__shopcard__variations__row__description mb-xs-10">Buy only a subset of the asset with the areas you need. Select the areas you are interested in and get a real-time quotation based on the human population withn your selection</p>

                        <strong>Minimum population percentage:</strong> {{ pr_model.model.minPercent ? pr_model.model.minPercent : 'not specified' }} %
                        <div class="asset__shopcard__variations__row__discounts">
                          <div><strong>Discounts:</strong></div>
                          <div class="asset__shopcard__variations__row__discounts__table">
                            <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                              <span>{{ discount.count }} rows, {{ discount.discount }}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </label>
                  </div>
                </div> -->
              </div>

              <div class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? addToCart() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">ADD TO CART</a></div>

              <ul class="asset__shopcard__buyinfo pt-sm-10">
                <li>
                  <strong>Domains: <tooltip :text="'In which application domains can this asset be used?'"></tooltip> </strong>
                  <span v-if="getDomainRestrictions().length">
                    <span v-for="(domain, i) in getDomainRestrictions()" :key="domain">{{ domain }}<span v-if="i !== getDomainRestrictions().length - 1">, </span></span>
                  </span>
                  <span v-else>Any domain</span>
                </li>
                <li>
                  <strong>Coverage: <tooltip :text="'In which areas of the world can this asset be used?'"></tooltip> </strong>
                  <span v-if="getCoverageRestrictions().length">
                    <span v-for="(area, i) in getCoverageRestrictions()" :key="area">{{ area }}<span v-if="i !== getCoverageRestrictions().length - 1">, </span></span>
                  </span>
                  <span v-else>Worldwide</span>
                </li>
                <li>
                  <strong>Consumers: <tooltip :text="'Sales restricted to consumers from specific areas of the world.'"></tooltip> </strong>
                  <span v-if="getConsumerRestrictions().length">
                    <span v-for="(area, i) in getConsumerRestrictions()" :key="area">{{ area }}<span v-if="i !== getConsumerRestrictions().length - 1">, </span></span>
                  </span>
                  <span v-else>Worldwide</span>
                </li>
              </ul>
            </div>

            <!-- <div class="asset__shopcard" v-if="quotationResult">
              <div class="asset__shopcard__price">
                <span>{{ quotationResult.quotation.totalPriceExcludingTax }}</span>
                <span>{{ quotationResult.quotation.currency }}</span>
              </div>
              <ul class="asset__shopcard__priceoptions mt-xs-20">
                <li>+ {{ quotationResult.quotation.taxPercent }}% VAT</li>
                <li>Total Price: {{ quotationResult.quotation.totalPrice }} {{ quotationResult.quotation.currency }}</li>
                <li>
                  <strong>Domain: </strong>
                  <span v-if="!quotationResult.model.domainRestrictions.length">no restrictions</span>
                  <span v-for="(domain, i) in quotationResult.model.domainRestrictions" :key="domain">{{ domain }}{{i !== quotationResult.model.domainRestrictions.length - 1 ? ', ' : ''}}</span>
                </li>
                <li>
                  <strong>Coverager restriction: </strong>
                  <span v-if="!quotationResult.model.coverageRestrictionContinents.length && !quotationResult.model.coverageRestrictionCountries.length">no restriction</span>
                  <span v-for="(coverage, i) in quotationResult.model.coverageRestrictionContinents.concat(quotationResult.model.coverageRestrictionCountries)" :key="i">{{ coverage }}{{i !== quotationResult.model.coverageRestrictionContinents.concat(quotationResult.model.coverageRestrictionCountries).length - 1 ? ', ' : ''}}</span>
                </li>
                <li>
                  <strong>Consumers restriction: </strong>
                  <span v-if="!quotationResult.model.consumerRestrictionContinents.length && !quotationResult.model.consumerRestrictionCountries.length">no restriction</span>
                  <span v-for="(coverage, i) in quotationResult.model.consumerRestrictionContinents.concat(quotationResult.model.consumerRestrictionCountries)" :key="i">{{ coverage }}{{i !== quotationResult.model.consumerRestrictionContinents.concat(quotationResult.model.consumerRestrictionCountries).length - 1 ? ', ' : ''}}</span>
                </li>
              </ul>
            </div>

            <button @click="addToCart" v-if="quotationResult" class="btn btn--std btn--blue mt-xs-20">ADD TO CART</button> -->

            <!-- ********************************************************************************  -->

            <!-- <div class="asset__shopcard">
              <ul class="asset__shopcard__priceoptions">
                <li>+ 24% VAT (DUMMY)</li>
                <li>+ 5,99€ delivery to Poland (DUMMY)</li>
              </ul>
              <ul class="asset__shopcard__buyinfo pt-sm-10">
                <li><strong>Asset application restrictions</strong></li>
                <li>
                  <strong>Domain: </strong> dummy domain
                </li>
                <li><strong>Coverage: </strong> Albania, Algeria (DUMMY)</li>
              </ul>
              <ul class="asset__shopcard__buyinfo">
                <li><strong>Delivery type: </strong> From topio / vendor (DUMMY)</li>
                <li><strong>Delivery format: </strong> digital / physical (DUMMY)</li>
                <li><strong>Payment methods:</strong> <img src="@/assets/images/icons/cc_icon.svg" alt="credit card icon"><img src="@/assets/images/icons/bank_transfer.svg" alt="bank transfer icon"> </li>
              </ul>
              <div class="asset-owner">
                <div class="asset-owner__inner">
                  <div class="asset-owner__inner__logo">
                  </div>
                  <div class="asset-owner__inner__info">
                    <div class="asset-owner__inner__info__name">
                      <a href="#">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 33 31" style="enable-background:new 0 0 33 31;" xml:space="preserve">
                          <path style="fill:#FFFFFF;"
                          d="M16.5,30.7l-3.2-2.9C5.6,20.8,0.4,16.1,0.4,9.9c0-5.2,4.1-9.3,9.3-9.3c2.5,0,4.9,1,6.8,2.7c1.8-1.7,4.2-2.7,6.8-2.7c5.2,0,9.3,4.1,9.3,9.3c0,6.1-5.1,10.8-12.9,18L16.5,30.7z M9.7,2.6c-4.1,0-7.3,3.2-7.3,7.3c0,5.2,4.9,9.7,12.2,16.5l1.8,1.6l1.8-1.6c7.4-6.8,12.2-11.2,12.2-16.5c0-4.1-3.2-7.3-7.3-7.3c-2.3,0-4.5,1.1-6,2.8l-0.8,0.9l-0.8-0.9C14.2,3.7,12,2.6,9.7,2.6z"/>
                          <path style="fill:#FFFFFF;" d="M16.5,29.4l-2.2-2C6.6,20.3,1.4,15.7,1.4,9.9c0-4.7,3.6-8.3,8.3-8.3c2.6,0,5.1,1.2,6.8,3.2c1.7-2,4.1-3.2,6.8-3.2c4.7,0,8.3,3.6,8.3,8.3c0,5.8-5.1,10.4-12.9,17.5L16.5,29.4z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
} from 'vue-property-decorator';
import store from '@/store';
import L from 'leaflet';
import {
  LMap, LTileLayer, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line
import { GeoJsonObject } from 'geojson';
import Tooltip from '@/components/Tooltip.vue';
import { CartAddItemCommand } from '../../model/cart';
import QuotationApi from '../../service/quotation';
import CartApi from '../../service/cart';
import SpatialApi from '../../service/spatial';
import europeGeoJSON from '../../service/lists/europe-geojson';
import {
  EffectivePricingModel,
  FixedPopulationPricingModelCommand,
  FixedRowPricingModelCommand,
  QuotationCommand,
} from '../../model/pricing-model';

@Component({
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    Tooltip,
  },
})
export default class SelectAreas extends Vue {
  @Prop() private assetId!: string;

  @Prop() private pricingModel!: FixedRowPricingModelCommand | FixedPopulationPricingModelCommand;

  show: boolean;

  quotationApi: QuotationApi;

  cartApi: CartApi;

  spatialApi: SpatialApi;

  isAreasLoading: boolean;

  isQuotationLoading: boolean;

  isMapStateCountryLevel: boolean;

  minZoom: number;

  maxZoom: number;

  europeGeoJson: any;

  subAreasGeoJson: any;

  areasSelectedForPurchase: string[];

  fitBoundsCountryZoom: number;

  selectedNutsCountry: string;

  quotationResult: EffectivePricingModel | null;

  mapOptions: any = {
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    bounds: [[28.647719, -32.519531], [73.426841, 58.359375]],
    europeGeoJsonStyle: {
      fillColor: 'transparent',
      color: 'orangered',
    },
    subAreasGeoJsonStyle: {
      color: 'blue',
      fillOpacity: 0,
    },
    europeGeoJsonOptions: {
      // eslint-disable-next-line
      onEachFeature: (feature, layer) => {
        layer.on('click', (): void => {
          // eslint-disable-next-line
          this.selectCountry(feature);
        });
      },
    },
    subAreasGeoJsonOptions: {
      // eslint-disable-next-line
      filter: (feature) => feature.properties?.code?.length === 4,
      // eslint-disable-next-line
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          this.selectSubArea(feature.properties.code);
        });
      },
    },
  };

  constructor() {
    super();

    this.show = false;
    this.quotationApi = new QuotationApi();
    this.cartApi = new CartApi();
    this.spatialApi = new SpatialApi();
    this.isAreasLoading = false;
    this.isQuotationLoading = false;
    this.isMapStateCountryLevel = false;
    this.minZoom = 0;
    this.maxZoom = 4;
    this.europeGeoJson = europeGeoJSON;
    this.subAreasGeoJson = null;
    this.areasSelectedForPurchase = [];
    this.fitBoundsCountryZoom = -1;
    this.selectedNutsCountry = '';
    this.quotationResult = null;
  }

  mounted(): void {
    this.show = true;
  }

  beforeDestroy(): void {
    this.show = false;
  }

  onCloseModal(): void {
    this.$emit('close');
  }

  @Watch('areasSelectedForPurchase', { immediate: true }) onAreasSelectedForPurchaseChange(): void {
    this.quotationResult = null;
  }

  addCountry(): void {
    // remove child-areas OR parent-areas that may have been selected before
    this.areasSelectedForPurchase.forEach((areaAlreadySelected) => {
      if (areaAlreadySelected.startsWith(this.selectedNutsCountry) || this.selectedNutsCountry.startsWith(areaAlreadySelected)) {
        this.areasSelectedForPurchase = this.areasSelectedForPurchase.filter((x) => x !== areaAlreadySelected);
      }
    });

    this.areasSelectedForPurchase.push(this.selectedNutsCountry);
    this.updateMapSelectionsStyle();
  }

  selectCountry(countryGeoJson: GeoJsonObject): void {
    const bounds = L.geoJSON(countryGeoJson).getBounds();
    // increase max zoom level so that user can zoom into country sub-areas
    this.maxZoom = 13;

    setTimeout(() => {
      this.fitBoundsCountryZoom = (this as any).$refs.mapSelectAreas.mapObject.getBoundsZoom(bounds);
      (this as any).$refs.mapSelectAreas.fitBounds(bounds);
    }, 0);

    const countryId = (countryGeoJson as any).properties.id;
    this.selectedNutsCountry = countryId;
    console.log(countryId);

    this.isAreasLoading = true;
    this.subAreasGeoJson = null;

    this.spatialApi.findAllByPrefix(countryId, 2).then((resp) => {
      if (resp.success) {
        // TODO: the following (SORT) should be avoided by fixing the API
        (resp as any).result.features.sort((a, b) => (a.properties.code > b.properties.code ? 1 : -1));
        // the following (REMOVE DUPLICATES) should be avoided by fixing the API
        // eslint-disable-next-line
        (resp as any).result.features = (resp as any).result.features.filter((val,ind,arr)=>arr.findIndex(t=>(t.properties.code === val.properties.code))===ind);

        this.subAreasGeoJson = resp.result;
        this.isMapStateCountryLevel = true;
        this.updateMapSelectionsStyle();
      } else {
        console.log('error fetching sub-areas');
      }
      this.isAreasLoading = false;
    });

    const countryIndex = this.europeGeoJson.features.findIndex((x) => x.properties.id === countryId);
    this.$refs.country[countryIndex].scrollIntoView();
  }

  selectSubArea(code: string): void {
    // remove child-areas OR parent-areas that may have been selected before
    this.areasSelectedForPurchase.forEach((areaAlreadySelected) => {
      if (areaAlreadySelected.startsWith(code) || code.startsWith(areaAlreadySelected)) {
        this.areasSelectedForPurchase = this.areasSelectedForPurchase.filter((x) => x !== areaAlreadySelected);
      }
    });

    // check if all child-nuts of parent area are selected
    const selectedAreaCodeLength = code.length;
    const parentArea = code.slice(0, -1);
    // check how many areas of same nuts level AND with the same parent, exist
    const counterNuts2 = this.subAreasGeoJson.features.filter((x) => x.properties.code.length === selectedAreaCodeLength && x.properties.code.startsWith(parentArea)).length;
    // check how many of these are selected
    const counterNuts2selected = this.areasSelectedForPurchase.filter((x) => x.length === selectedAreaCodeLength && x.startsWith(parentArea)).length;

    // if all child-nuts of parent area are selected
    if (counterNuts2selected === (counterNuts2 - 1)) {
      this.areasSelectedForPurchase = this.areasSelectedForPurchase.filter((x) => !x.startsWith(parentArea));
      this.selectSubArea(parentArea);
      return;
    }
    // else
    this.areasSelectedForPurchase.push(code);
    this.updateMapSelectionsStyle();
  }

  isAreaSelected(code: string): boolean {
    for (let i = 0; i < this.areasSelectedForPurchase.length; i += 1) {
      if (code.startsWith(this.areasSelectedForPurchase[i])) {
        return true;
      }
    }
    return false;
  }

  onRemoveAreaFromList(area: string): void {
    this.areasSelectedForPurchase = this.areasSelectedForPurchase.filter((x) => x !== area);
    this.updateMapSelectionsStyle();
  }

  // vue-leaflet style is not responsive. thus, each time area selection changes, the following method must be called so that map will be styled accordingly.
  updateMapSelectionsStyle(): void {
    // COUNTRIES styling
    setTimeout(() => {
      (this as any).$refs.europeGeoJsonLayer.mapObject.setStyle((feature) => {
        for (let i = 0; i < this.areasSelectedForPurchase.length; i += 1) {
          // if country is selected, paint it blue
          if (this.areasSelectedForPurchase[i] === feature.properties.CNTR_ID) {
            return { color: 'orangered', fillOpacity: 0.7, fillColor: 'blue' };
          }
          // if area(s) of country is/are selected, painted light blue (lower opacity)
          if (this.areasSelectedForPurchase[i].startsWith(feature.properties.CNTR_ID)) {
            return { color: 'orangered', fillOpacity: 0.3, fillColor: 'blue' };
          }
        }
        // if no selection relative to this country, leave it transparent (zero opacity)
        return { color: 'orangered', fillOpacity: 0 };
      });
    }, 0);

    // SUB-AREAS styling
    setTimeout(() => {
      // if area is selected OR its parent area is selected, paint it blue
      (this as any).$refs.subAreasGeoJsonLayer.mapObject.setStyle((feature) => {
        for (let i = 0; i < this.areasSelectedForPurchase.length; i += 1) {
          if (feature.properties.code.startsWith(this.areasSelectedForPurchase[i])) {
            return { color: 'blue', fillOpacity: 0.7, fillColor: 'blue' };
          }
        }
        return { color: 'blue', fillOpacity: 0 };
      });
    }, 0);
  }

  onZoomEnd(): void {
    const currentZoom = (this as any).$refs.mapSelectAreas.mapObject.getZoom();
    console.log(currentZoom);

    // if zoomed-out from country fit-bounds, then show Europe, not country
    if (currentZoom < this.fitBoundsCountryZoom && this.subAreasGeoJson) {
      this.subAreasGeoJson = null;
      this.isMapStateCountryLevel = false;
      // this.maxZoom = 4;
      this.maxZoom = currentZoom;
    }
  }

  getQuotation(): void {
    this.isQuotationLoading = true;

    const quotation: QuotationCommand = {
      assetId: this.assetId,
      // eslint-disable-next-line
      pricingModelKey: this.pricingModel.key!,
      parameters: {
        type: this.pricingModel.type,
        nuts: this.areasSelectedForPurchase,
      },
    };
    this.quotationApi.create(quotation).then((quotationResponse) => {
      if (quotationResponse.success) {
        this.quotationResult = quotationResponse.result;
        console.log('quot', this.quotationResult);
      } else {
        // todo: handle error
        console.log('error getting quotation', quotationResponse);
      }
      this.isQuotationLoading = false;
    });
  }

  getDomainRestrictions(): string[] {
    if (!this.quotationResult) return [];
    if (!this.quotationResult.model.domainRestrictions) return [];
    return this.quotationResult.model.domainRestrictions as string[];
  }

  getCoverageRestrictions(): string[] {
    if (!this.quotationResult) return [];
    const continents = Array.isArray(this.quotationResult.model.coverageRestrictionContinents) ? this.quotationResult.model.coverageRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(this.quotationResult.model.coverageRestrictionCountries) ? this.quotationResult.model.coverageRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }

  getConsumerRestrictions(): string[] {
    if (!this.quotationResult) return [];
    const continents = Array.isArray(this.quotationResult.model.consumerRestrictionContinents) ? this.quotationResult.model.consumerRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(this.quotationResult.model.consumerRestrictionCountries) ? this.quotationResult.model.consumerRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }

  addToCart(): void {
    console.log(this.areasSelectedForPurchase);

    const item: CartAddItemCommand = {
      assetId: this.assetId,
      parameters: {
        type: this.pricingModel.type,
        nuts: this.areasSelectedForPurchase,
        prePaidTier: 0,
        // systemParams: {
        //   population: 0,
        //   populationPercent: 0,
        //   rows: 0,
        // },
      },
      // eslint-disable-next-line
      pricingModelKey: this.pricingModel.key!,
    };

    this.cartApi.addItem(item).then((addItemResp) => {
      if (addItemResp.success) {
        console.log('item added successfully');
        store.commit('setCartItems', addItemResp.result);
        this.$router.push('/');
      } else {
        console.log('error adding item');
      }
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_cataloguesingle-selectareas.scss";
</style>
