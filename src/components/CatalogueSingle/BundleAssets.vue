<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Assets in Bundle</h4>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <div class="assets_items">
          <a v-for="asset in assets" :key="asset.id" @click.stop="" :href="`/catalogue/${asset.id}`" target="_blank" style="text-decoration: none; display: block; margin-bottom: 1em;">
            <catalogue-card :asset="asset" style="color: #333; text-decoration: none" :openInNewTab="true"></catalogue-card>
          </a>
        </div>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import CatalogueApi from '@/service/catalogue';
import { CatalogueItemDetails } from '@/model/catalogue';

@Component({
  components: { CatalogueCard },
})
export default class BundleAssets extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItemDetails;

  catalogueApi = new CatalogueApi();

  assets: CatalogueItemDetails[] = [];

  created(): void {
    const promises = this.catalogueItem.resources.map((x) => this.catalogueApi.findOne(x.id));

    Promise.all(promises).then((response) => {
      this.assets = response.map((x) => x.result as CatalogueItemDetails);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
