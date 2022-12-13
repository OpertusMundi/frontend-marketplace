<template>
  <div>
    <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="asset.type === 'VECTOR'">
    <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="asset.type === 'RASTER'">
    <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="asset.type === 'TABULAR'">
    <img src="@/assets/images/icons/types/bundle.svg" alt="" v-if="asset.type === 'BUNDLE'">
    <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="asset.spatialDataServiceType === 'WMS' || asset.serviceType === 'WMS'">
    <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="asset.spatialDataServiceType === 'WFS' || asset.serviceType === 'WFS'">
    <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="asset.spatialDataServiceType === 'DATA_API' || asset.serviceType === 'DATA_API'">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class CardIcon extends Vue {
  @Prop({ required: true }) asset!: CatalogueItem;
}
</script>
<style lang="scss" scoped>
</style>
