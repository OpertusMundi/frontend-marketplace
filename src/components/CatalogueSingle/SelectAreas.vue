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
                <div @click="selectArea(country)">
                  <span> {{ country.properties.NAME_ENGL }} </span>
                  <span> + </span>
                </div>
                <div v-if="selectedNutsCountry == country.properties.id">sub-areas</div>
                <hr>
              </div>
            </div>
          </div>
          <div class="select-area-modal__col-map">
            <l-map ref="mapSelectAreas" :bounds="mapOptions.bounds" v-if="mapOptions">
              <div class="select-area-modal__col-map__add-area" v-if="selectedNutsCountry">
                <h3>{{ europeGeoJson.features.find((x) => x.properties.id === selectedNutsCountry).properties.NAME_ENGL }}</h3>
                <span>130,000 rows</span>
                <button class="btn--std btn--blue">ADD AREA</button>
              </div>
              <l-tile-layer :url="mapOptions.tileUrl"></l-tile-layer>
              <l-geo-json :geojson="europeGeoJson" :options="mapOptions.geoJsonOptions"></l-geo-json>
            </l-map>
          </div>
          <div class="select-area-modal__col-submit">
            <!-- <div class="card">
              <div class="card__pricing-model-title">3. Subset priced per row</div>
              <p>Minimum: 10,000</p>
              <hr>
            </div> -->

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
import { Component, Vue, Prop } from 'vue-property-decorator';
import L, { latLng } from 'leaflet';
import {
  LMap, LTileLayer, LPolygon, LGeoJson,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import europeGeoJSON from '../../service/lists/europe-geojson';

@Component({
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
})
export default class SelectAreas extends Vue {
  @Prop() private show!: boolean;

  europeGeoJson: any;

  selectedNutsCountry: string;

  mapOptions: any = {
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    bounds: [[28.647719, -32.519531], [73.426841, 58.359375]],
    geoJsonOptions: {
      onEachFeature: (feature, layer) => {
        // layer.bindPopup(`country: ${feature.properties.NAME_ENGL}`);

        // layer.on('mouseover', () => {
        //   layer.openPopup();
        // });

        layer.on('click', () => {
          (this as any).$refs.mapSelectAreas.fitBounds(layer.getBounds());
          this.changeSelectedNutsCountry(feature.properties.id);
        });
      },
    },
  };

  constructor() {
    super();

    this.europeGeoJson = europeGeoJSON;

    this.selectedNutsCountry = '';
  }

  onCloseModal(): void {
    this.$emit('close');
  }

  changeSelectedNutsCountry(id) {
    this.selectedNutsCountry = id;
    const countryIndex = this.europeGeoJson.features.findIndex((x) => x.properties.id === id);
    this.$refs.country[countryIndex].scrollIntoView();
  }

  selectArea(country) {
    (this as any).$refs.mapSelectAreas.fitBounds(L.geoJSON(country).getBounds());
    this.changeSelectedNutsCountry(country.properties.id);
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
    min-width: 290px;
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
    padding: 0 0 0 20px;

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
