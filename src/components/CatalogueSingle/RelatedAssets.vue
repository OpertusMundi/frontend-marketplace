<template>
  <div class="asset__related">
    <div class="s_container">
      <h5>Related Assets</h5>
      <assets-carousel :assets="relatedAssets"></assets-carousel>
      <!-- <router-link v-for="asset in relatedAssets" :key="asset.id" :to="{name: 'CatalogueSingle', params: {id: asset.id}}" class="asset_card">
        <div class="asset_card__view"><span>VIEW</span></div>
        <div class="asset_card__inner">
          <div class="asset_card__top">
            <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg"
              alt=""><span>{{ asset.type }}</span><span>{{ asset.format }}</span>
            </div>
            <div class="asset_card__top__right"><span>@{{ asset.publisherName }}</span></div>
          </div>
          <div class="asset_card__center">
            <div class="asset_card__title">{{ asset.title }}</div>
            <div class="asset_card__price">{{ asset.priceRendered }}</div>
          </div>
          <div class="asset_card__bottom">
            <div class="asset_card__bottom__left">
              <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i>
              </div>
              <div class="asset_card__bottom__left__info">
                <span><strong>Version: </strong>{{ asset.version }}</span><span><strong>Last updated: </strong>{{ formatDate(asset.publicationDate) }}</span>
              </div>
            </div>
            <div class="asset_card__bottom__right">
              <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
            </div>
          </div>
        </div>
      </router-link> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';
import AssetsCarousel from '@/components/AssetsCarousel.vue';
import CatalogueApi from '@/service/catalogue';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';
import moment from 'moment/moment';

interface CatalogueItemWithPrice extends CatalogueItem {
  priceRendered: string;
}

@Component({
  components: { AssetsCarousel },
})
export default class RelatedAssets extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  relatedAssets: CatalogueItemWithPrice[];

  CatalogueApi: CatalogueApi;

  constructor() {
    super();
    this.relatedAssets = [];
    this.CatalogueApi = new CatalogueApi();
  }

  mounted(): void {
    console.log('catalogue item => ', this.catalogueItem);
    this.CatalogueApi.findRelated(this.catalogueItem.id)
      .then((response) => {
        if (response.success) {
          this.relatedAssets = response.result.items.map((item) => ({
            ...item,
            price: getPriceOrMinimumPrice(item),
            priceRendered: renderedPriceAsString(getPriceOrMinimumPrice(item)),
          }));
        }
        this.dummyCall();
      });
  }

  dummyCall(): void {
    fetch('http://localhost:4200/action/catalogue?page=0&size=5&orderBy=REVISION_DATE&order=DESC&text=&type=SERVICE')
      .then((response) => response.json())
      .then((response) => {
        console.log('aaa', response);
        this.relatedAssets = response.result.items;
      });
  }

  formatDate(date: string): string {
    return moment(date)
      .format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
</style>
