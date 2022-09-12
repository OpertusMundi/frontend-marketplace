<template>
  <div class="eo_layer_card d-flex" :class="{'active': isActive}">
    <div class="img-container" :style="`height: ${imgSize}px;`">
      <img :src="`/assets/img/sentinel-hub/${thumbnailMappings[layer.name]}`" alt="">
    </div>
    <div>
      <h3>{{ layer.title }}</h3>
      <small>{{ layer.abstract }}</small>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WMSLayer } from '@/model/sentinel-hub';

@Component({
})
export default class EOExplorerLayerCard extends Vue {
  @Prop({ required: true }) private layer!: WMSLayer;

  @Prop({ required: true }) private isActive!: boolean;

  imgSize = 0;

  /* eslint-disable quote-props */
  thumbnailMappings = {
    /* sentinel-1-grd */
    'EW_HH_DB': 'EW-HH-DB.png',
    'EW_HH': 'EW-HH.png',
    'EW_HV_DB': 'EW-HV-DB.png',
    'EW_HV': 'EW-HV.png',
    'IW-VH-DB': 'IW-VH-DB.png',
    'IW_VH': 'IW-VH.png',
    'IW_VV_DB': 'IW-VV-DB.png',
    'IW_VV': 'IW-VV.png',
    /* sentinel-2-l1c */
    '2_FALSE_COLOR': 'FALSE-COLOR.png',
    '3_NDVI': 'NDVI.png',
    '1_TRUE_COLOR': 'TRUE-COLOR.png',
    /* sentinel-2-l2a */
    'COLOR_INFRARED__URBAN_': 'FALSE-COLOR.png',
    'MOISTURE_INDEX': 'MOISTURE-INDEX.png',
    'TRUE_COLOR': 'TRUE-COLOR.png',
    'SWIR': 'SWIR.png',
    'VEGETATION_INDEX': 'NDVI.png',
    /* sentinel-5p-l2 */
    'AER-AI-340-AND-380': 'AER_AI_340_AND_380.png',
    'AER-AI-354-AND-388': 'AER_AI_354_AND_388.png',
    'AER_AI_340_380': 'AER_AI_340_AND_380.png',
    'AER_AI_354_388': 'AER_AI_354_AND_388.png',
    'BASE-HEIGHT': 'BASE-HEIGHT.png',
    'BASE-PRESSURE': 'BASE-PRESSURE.png',
    'CARBON-MONOXIDE': 'CARBON-MONOXIDE.png',
    'CH4': 'CH4.png',
    'CLOUD_BASE_HEIGHT': 'CLOUD_BASE_HEIGHT.png',
    'CLOUD_BASE_PRESSURE': 'CLOUD_BASE_PRESSURE.png',
    'CLOUD_FRACTION': 'CLOUD_FRACTION.png',
    'CLOUD_OPTICAL_THICKNESS': 'CLOUD_OPTICAL_THICKNESS.png',
    'CLOUD_TOP_HEIGHT': 'CLOUD_TOP_HEIGHT.png',
    'CLOUD_TOP_PRESSURE': 'CLOUD_TOP_PRESSURE.png',
    'CO': 'CARBON-MONOXIDE.png',
    'EFFECTIVE-RADIOMETRIC-CLOUD-FRACTION': 'CLOUD_FRACTION.png',
    'FORMALDEHYDE': 'FORMALDEHYDE.png',
    'HCHO': 'FORMALDEHYDE.png',
    'METHANE': 'CH4.png',
    'NITROGEN-DIOXIDE': 'NITROGEN-DIOXIDE.png',
    'NO2': 'NITROGEN-DIOXIDE.png',
    'O3': 'OZONE.png',
    'OPTICAL-THICKNESS': 'CLOUD_OPTICAL_THICKNESS.png',
    'OZONE': 'OZONE.png',
    'SO2': 'SO2.png',
    'SULFUR-DIOXIDE': 'SO2.png',
    'TOP-HEIGHT': 'CLOUD_TOP_HEIGHT.png',
    'TOP-PRESSURE': 'CLOUD_TOP_PRESSURE.png',
    /* landsat-8-l1c */
    'FALSE-COLOR': 'FALSE-COLOR.png',
    'NDVI': 'NDVI.png',
    'THERMAL': 'THERMAL.png',
    'TRUE-COLOR': 'TRUE-COLOR.png',
  };
  /* eslint-enable quote-props */

  mounted(): void {
    this.imgSize = (document.getElementsByClassName('eo_layer_card')[0] as HTMLElement).clientHeight - 40;
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_eo-explorer.scss";

  .eo_layer_card {
    background: #fff;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 10px;
    cursor: pointer;
    border: solid 1px transparent;

    &.active {
      border: solid 1px $secondColor;

      h3, small {
        color: $secondColor;
      }
    }

    .img-container {
      height: 100%;
      aspect-ratio: 1 / 1;
      margin-right: 10px;
      border-radius: 7px;
      overflow: hidden;
      background: $labelColor;
    }
  }
</style>
