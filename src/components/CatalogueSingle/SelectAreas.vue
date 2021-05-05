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
                  <span v-if="selectedNutsCountry !== country.properties.id"> + </span>
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
              <div class="select-area-modal__col-map__add-area" v-if="selectedNutsCountry && subAreasGeoJson && !areasSelectedForPurchase.includes(selectedNutsCountry)">
                <h3>{{ europeGeoJson.features.find((x) => x.properties.id === selectedNutsCountry).properties.NAME_ENGL }}</h3>
                <span>130,000 rows</span>
                <button @click="addCountry()" class="btn--std btn--blue">ADD COUNTRY</button>
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
            <button @click="addToCart" :disabled="!areasSelectedForPurchase.length" class="btn btn--std btn--blue">ADD TO CART</button>
            <div class="asset__shopcard">
              <ul class="asset__shopcard__priceoptions">
                <li>+ 24% VAT (DUMMY)</li>
                <li>+ 5,99€ delivery to Poland (DUMMY)</li>
              </ul>
              <ul class="asset__shopcard__buyinfo pt-sm-10">
                <li><strong>Asset application restrictions</strong></li>
                <li><strong>Domain: </strong> Geomarketing (DUMMY)</li>
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
                    <!-- <img :src="catalogueItem.logoImage" :alt="catalogueItem.publisher.name"> -->
                  </div>
                  <div class="asset-owner__inner__info">
                    <div class="asset-owner__inner__info__name">
                      <!-- <a href="#">{{ catalogueItem.publisher.name }}</a> -->
                      <a href="#">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 33 31" style="enable-background:new 0 0 33 31;" xml:space="preserve">
                          <path style="fill:#FFFFFF;"
                          d="M16.5,30.7l-3.2-2.9C5.6,20.8,0.4,16.1,0.4,9.9c0-5.2,4.1-9.3,9.3-9.3c2.5,0,4.9,1,6.8,2.7c1.8-1.7,4.2-2.7,6.8-2.7c5.2,0,9.3,4.1,9.3,9.3c0,6.1-5.1,10.8-12.9,18L16.5,30.7z M9.7,2.6c-4.1,0-7.3,3.2-7.3,7.3c0,5.2,4.9,9.7,12.2,16.5l1.8,1.6l1.8-1.6c7.4-6.8,12.2-11.2,12.2-16.5c0-4.1-3.2-7.3-7.3-7.3c-2.3,0-4.5,1.1-6,2.8l-0.8,0.9l-0.8-0.9C14.2,3.7,12,2.6,9.7,2.6z"/>
                          <path style="fill:#FFFFFF;" d="M16.5,29.4l-2.2-2C6.6,20.3,1.4,15.7,1.4,9.9c0-4.7,3.6-8.3,8.3-8.3c2.6,0,5.1,1.2,6.8,3.2c1.7-2,4.1-3.2,6.8-3.2c4.7,0,8.3,3.6,8.3,8.3c0,5.8-5.1,10.4-12.9,17.5L16.5,29.4z"/>
                        </svg>
                      </a>
                    </div>
                    <!-- <div class="rating rating--dark">
                      <span v-for="index in 5" v-bind:key="`${index}_rating`" :class="{ 'active' : index <= catalogueItem.publisher.rating }">★</span>
                      <i>{{catalogueItem.publisher.rating ? catalogueItem.publisher.rating : '- '}}/5</i>
                    </div> -->
                    <!-- <div class="asset-owner__inner__info__country">{{ catalogueItem.publisher.city }}, {{ catalogueItem.publisher.country }}</div> -->
                    <!-- <div class="asset-owner__inner__info__date">Joined {{ catalogueItem.publisher.joinedAt | format_date }}</div> -->
                  </div>
                </div>
              </div>
            </div>

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
import L, { latLng } from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { CartAddItemCommand } from '../../model/cart';
import CartApi from '../../service/cart';
import SpatialApi from '../../service/spatial';
import europeGeoJSON from '../../service/lists/europe-geojson';

@Component({
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
})
export default class SelectAreas extends Vue {
  @Prop() private assetId!: string;

  @Prop() private pricingModelKey!: string;

  show: boolean;

  cartApi: CartApi;

  spatialApi: SpatialApi;

  isAreasLoading: boolean;

  isMapStateCountryLevel: boolean;

  minZoom: number;

  maxZoom: number;

  europeGeoJson: any;

  subAreasGeoJson: any;

  areasSelectedForPurchase: string[];

  fitBoundsCountryZoom: number;

  selectedNutsCountry: string;

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
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          this.selectCountry(feature);
        });
      },
    },
    subAreasGeoJsonOptions: {
      filter: (feature) => feature.properties?.code?.length === 4,
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

    this.cartApi = new CartApi();

    this.spatialApi = new SpatialApi();

    this.isAreasLoading = false;

    this.isMapStateCountryLevel = false;

    this.minZoom = 0;

    this.maxZoom = 4;

    this.europeGeoJson = europeGeoJSON;

    this.subAreasGeoJson = null;

    this.areasSelectedForPurchase = [];

    this.fitBoundsCountryZoom = -1;

    this.selectedNutsCountry = '';
  }

  mounted() {
    this.show = true;
  }

  beforeDestroy() {
    this.show = false;
  }

  onCloseModal(): void {
    this.subAreasGeoJson = null;
    this.areasSelectedForPurchase = [];
    this.selectedNutsCountry = '';
    this.$emit('close');
  }

  addCountry() {
    // remove child-areas OR parent-areas that may have been selected before
    this.areasSelectedForPurchase.forEach((areaAlreadySelected) => {
      if (areaAlreadySelected.startsWith(this.selectedNutsCountry) || this.selectedNutsCountry.startsWith(areaAlreadySelected)) {
        this.areasSelectedForPurchase = this.areasSelectedForPurchase.filter((x) => x !== areaAlreadySelected);
      }
    });

    this.areasSelectedForPurchase.push(this.selectedNutsCountry);
    this.updateMapSelectionsStyle();
  }

  selectCountry(countryGeoJson) {
    const bounds = L.geoJSON(countryGeoJson).getBounds();
    // increase max zoom level so that user can zoom into country sub-areas
    this.maxZoom = 13;

    setTimeout(() => {
      this.fitBoundsCountryZoom = (this as any).$refs.mapSelectAreas.mapObject.getBoundsZoom(bounds);
      (this as any).$refs.mapSelectAreas.fitBounds(bounds);
    }, 0);

    const countryId = countryGeoJson.properties.id;
    this.selectedNutsCountry = countryId;
    console.log(countryId);

    this.isAreasLoading = true;
    this.subAreasGeoJson = null;

    this.spatialApi.findAllByPrefix(countryId).then((resp) => {
      if (resp.success) {
        // the following (SORT) should be avoided by fixing the API
        (resp as any).result.features.sort((a, b) => (a.properties.code > b.properties.code ? 1 : -1));
        // the following (REMOVE DUPLICATES) should be avoided by fixing the API
        // eslint-disable-next-line
        (resp as any).result.features = (resp as any).result.features.filter((val,ind,arr)=>arr.findIndex(t=>(t.properties.code === val.properties.code))===ind);
        // the following (REMOVE NUTS-3) should be avoided by fixing the API
        // eslint-disable-next-line
        (resp as any).result.features = (resp as any).result.features.filter((item) => item.properties.code.length !== 5);

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
  updateMapSelectionsStyle() {
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

  onZoomEnd() {
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

  addToCart() {
    console.log(this.areasSelectedForPurchase);

    const item: CartAddItemCommand = {
      assetId: this.assetId,
      parameters: {
        nuts: this.areasSelectedForPurchase,
        prePaidTier: 0,
        systemParams: {
          population: 0,
          populationPercent: 0,
          rows: 0,
        },
      },
      pricingModelKey: this.pricingModelKey,
    };

    this.cartApi.addItem(item).then((addItemResp) => {
      if (addItemResp.success) {
        console.log('item added successfully');
        store.commit('setCartItems', addItemResp.result);
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

.select-area-modal {
  height: 100%;
  width: 100%;
  background: $lightBgColor;
  border: solid 2px $secondColor;
  border-radius: 13px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  .loader {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    z-index: 9999;
  }

  &__wrapper {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    padding: 20px;
  }

  &__btn-close {
    cursor: pointer;
  }

  &__header {
    width: 100%;
    display: flex;

    h3 {
      flex-grow: 1;
    }
  }

  &__body {
    height: 100%;
    display: flex;
    flex-grow: 1;
  }

  &__body > div {
    height: 100%;
  }

  &__col-areas {
    // min-width: 290px;
    width: 290px;
    padding: 0 20px 0 0;
    display: flex;
    flex-direction: column;

    h4 {
      margin-bottom: 20px;
    }

    &__scroll-wrapper {
      height: 0;
      flex-grow: 1;
      overflow-y: scroll;
    }

    &__area > div {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 0 10px 0 0;
    }

    .selected {
      background: $secondColor;
      color: #fff;
    }

    &__sub-areas {
      display: flex;
      flex-direction: column;

      .nuts-1 {
        font-size: 1.1em;
      }
      .nuts-2 {
        font-size: 1em;
        margin-left: 15px;
      }
      .nuts-3 {
        font-size: .9em;
        margin-left: 30px;
      }

      .selected {
        background: $secondColor;
        color: #fff;
        padding: 5px;
      }

      &__area {
        // margin: 5px 0 0 0;
        padding: 5px 0 5px 0;
        border-radius: 5px;
      }
    }
  }

  &__col-map {
    flex-grow: 1;

    &__add-area {
      background: white;
      z-index: 2000;
      position: relative;
      float: right;
      margin: 20px;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
    }
  }

  &__col-submit {
    width: 290px;
    padding: 0 0 0 20px;

    &__area-label {
      // background: $secondColor;
      // color: #fff;
      background: #fff;
      color: $secondColor;
      border: solid 2px $secondColor;
      border-radius: 5px;
      margin: 0 5px 5px 5px;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      button {
        background: transparent;
        // color: #fff;
        color: $secondColor;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__wrapper {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
    }

    // .card {
    //   background: #fff;
    //   border-radius: 10px;
    //   min-width: 200px;
    //   padding: 20px;

    //   &__pricing-model-title {
    //     color: $secondColor;
    //   }
    // }
  }
}
</style>
