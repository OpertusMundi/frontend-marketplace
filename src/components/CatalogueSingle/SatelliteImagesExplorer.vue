<template>
  <section class="asset__section asset__section__overview">
    <div class="asset__section__head">
      <h4>Satellite images explorer</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner asset__section__content__inner--no_min_height d-flex justify-content-center">
        <button
          @click="$store.getters.isAuthenticated ? openEOExplorer() : $emit('showModalLoginToOpenEOExplorer')"
          class="btn btn--std btn--blue"
        >
          open explorer
        </button>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SatelliteImagesExplorer extends Vue {
  @Prop({ required: true }) assetId!: string;

  @Prop({ required: true }) assetTitle!: string;

  @Prop({ required: true }) collectionId!: string;

  openEOExplorer(): void {
    this.$router.push(`/eo-explorer?assetId=${this.assetId}&assetTitle=${this.assetTitle}&collectionId=${this.collectionId}`);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
