<template>
  <div>
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/vector.svg" alt="" v-if="asset.type === 'VECTOR'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/raster.svg" alt="" v-if="asset.type === 'RASTER'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/tabular.svg" alt="" v-if="asset.type === 'TABULAR'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/netcdf.svg" alt="" v-if="asset.type === 'NETCDF'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/eo.svg" alt="" v-if="asset.type === 'SENTINEL_HUB_OPEN_DATA'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/bundle.svg" alt="" v-if="asset.type === 'BUNDLE'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/wms.svg" alt="" v-if="asset.spatialDataServiceType === 'WMS' || asset.serviceType === 'WMS'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/wfs.svg" alt="" v-if="asset.spatialDataServiceType === 'WFS' || asset.serviceType === 'WFS'">
    <img :height="imgHeight || ''" src="@/assets/images/icons/types/data_api.svg" alt="" v-if="asset.spatialDataServiceType === 'DATA_API' || asset.serviceType === 'DATA_API'">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class CardIcon extends Vue {
  @Prop({ required: true }) asset!: CatalogueItem;

  @Prop({ required: false }) imgHeight?: number;
}
</script>
<style lang="scss" scoped>
</style>
