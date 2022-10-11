<template>
  <div class="asset__related">
    <template v-if="relatedAssets.length">
      <div class="s_container">
        <h5 id="asset__related__heading">Related Assets</h5>
      </div>
      <assets-carousel :assets="relatedAssets"></assets-carousel>
    </template>
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
        // this.dummyCall();
      });
  }

  // dummyCall(): void {
  //   fetch('http://localhost:4200/action/catalogue?page=0&size=5&orderBy=REVISION_DATE&order=DESC&text=&type=SERVICE')
  //     .then((response) => response.json())
  //     .then((response) => {
  //       console.log('aaa', response);
  //       this.relatedAssets = response.result.items;
  //     });
  // }

  formatDate(date: string): string {
    return moment(date)
      .format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
</style>
