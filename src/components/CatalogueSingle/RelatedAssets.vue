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
import moment from 'moment/moment';

@Component({
  components: { AssetsCarousel },
})
export default class RelatedAssets extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  relatedAssets: CatalogueItem[];

  catalogueApi: CatalogueApi;

  constructor() {
    super();
    this.relatedAssets = [];
    this.catalogueApi = new CatalogueApi();
  }

  async mounted(): Promise<void> {
    console.log('catalogue item => ', this.catalogueItem.topicCategory);

    const relatedAssetsAmmount = 8;

    let relatedAssets: CatalogueItem[] = [];

    const relatedAssetsByTopicCategoryResponse = await this.catalogueApi.find({ topic: this.catalogueItem.topicCategory, size: relatedAssetsAmmount });
    if (relatedAssetsByTopicCategoryResponse.success) {
      relatedAssets = [...relatedAssets, ...relatedAssetsByTopicCategoryResponse.result.items];

      if (relatedAssets.length >= relatedAssetsAmmount) {
        this.relatedAssets = relatedAssets;
        return;
      }
    }

    const otherAssetsResponse = await this.catalogueApi.find({ size: (relatedAssetsAmmount - relatedAssets.length) });
    if (otherAssetsResponse.success) {
      relatedAssets = [...relatedAssets, ...otherAssetsResponse.result.items];
      this.relatedAssets = relatedAssets;
    }
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
