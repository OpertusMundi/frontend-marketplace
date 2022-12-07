<template>
  <div class="asset__head__type">
    <div>
      <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="type === 'VECTOR'">
      <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="type === 'RASTER'">
      <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="type === 'TABULAR'">
      <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="type === 'WMS'">
      <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="type === 'WFS'">
      <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="type === 'DATA_API'">
    </div>
    {{ `${getTypeLabel(type)} Dataset` }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class TopicCategoryIcon extends Vue {
  @Prop({ required: true }) readonly type!: 'VECTOR' | 'RASTER' | 'TABULAR' | 'WMS' | 'WFS' | 'DATA_API' | 'SENTINEL_HUB_OPEN_DATA' | 'NETCDF' | 'BUNDLE';

  getTypeLabel(type: 'VECTOR' | 'RASTER' | 'TABULAR' | 'WMS' | 'WFS' | 'DATA_API' | 'SENTINEL_HUB_OPEN_DATA' | 'NETCDF' | 'BUNDLE'): string {
    const mappings = {
      VECTOR: 'Vector',
      RASTER: 'Raster',
      TABULAR: 'Tabular',
      WMS: 'WMS',
      WFS: 'WFS',
      DATA_API: 'Data API',
      SENTINEL_HUB_OPEN_DATA: 'Sentinel Hub Open',
      NETCDF: 'netCDF',
      BUNDLE: 'Collection',
    };

    return mappings[type];
  }
}
</script>
<style lang="scss" scoped>
.asset__head__type {
  margin: 30px 0 20px 0;
  padding: 7px 8px;
  letter-spacing: .2px;
  color: $darkColor;
  background: $lightBgColor;
  border-radius: 5px;
  font-family: 'Roboto';
  display: flex;
  align-items: center;

  img {
    filter: none;
    height: 22px;
  }
}
</style>
