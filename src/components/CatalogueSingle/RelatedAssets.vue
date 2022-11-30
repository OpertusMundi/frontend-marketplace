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
import { EnumTopicCategory } from '@/model/catalogue';

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

    const relatedAssetsByTopicCategoryResponse = await this.catalogueApi.find({ topic: this.catalogueItem.topicCategory, size: relatedAssetsAmmount + 1 }); // fetch one more to exclude current asset
    if (relatedAssetsByTopicCategoryResponse.success) {
      relatedAssets = [...relatedAssets, ...relatedAssetsByTopicCategoryResponse.result.items];

      // exclude current asset if fetched
      relatedAssets = relatedAssets.filter((x) => x.id !== this.catalogueItem.id);
      if (relatedAssets.length > relatedAssetsAmmount) relatedAssets = relatedAssets.filter((x, i) => i < relatedAssetsAmmount);

      if (relatedAssets.length >= relatedAssetsAmmount) {
        this.relatedAssets = relatedAssets;
        return;
      }
    }

    const allTopics = Object.keys(EnumTopicCategory);
    const allTopicsExcludingCurrent = allTopics.filter((x) => !this.catalogueItem.topicCategory.includes(x as EnumTopicCategory)) as EnumTopicCategory[];

    const otherAssetsResponse = await this.catalogueApi.find({ topic: allTopicsExcludingCurrent, size: (relatedAssetsAmmount - relatedAssets.length) });
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
