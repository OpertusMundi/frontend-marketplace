<template>
  <div class="card-counter-icon">
    <img src="@/assets/images/icons/card_counter/downloads.svg" alt="" v-if="asset.openDataset">
    <img src="@/assets/images/icons/card_counter/purchases.svg" alt="" v-else-if="asset.type && ['VECTOR', 'RASTER', 'TABULAR', 'NETCDF', 'BUNDLE'].includes(asset.type)">
    <img src="@/assets/images/icons/card_counter/subscriptions.svg" alt="" v-else-if="asset.type && ['SENTINEL_HUB_OPEN_DATA', 'SERVICE'].includes(asset.type)">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class CardCounterIcon extends Vue {
  @Prop({ required: true }) asset!: CatalogueItem;
}
</script>
<style lang="scss" scoped>
  .card-counter-icon {
    img {
      margin-top: 2px;
    }
  }
</style>
