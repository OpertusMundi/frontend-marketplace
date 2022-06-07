<template>
  <div>
    <!-- sentinel-1-grd -->
    <template v-if="collectionId === 'sentinel-1-grd'">
      <div class="form-group">
        <label for="multiselect_acquisition">Acquisition mode</label>
        <multiselect v-model="inputValues['acquisition']" @input="query = {...query, 'sar:instrument_mode': { eq: $event.value }}" id="multiselect_acquisition" :options="sentinel1GRD.acquisitionModes" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select acquisition mode"></multiselect>
      </div>
      <div class="form-group">
        <label for="multiselect_polarization">Polarization</label>
        <multiselect :disabled="!query['sar:instrument_mode']" v-model="inputValues['polarization']" @input="query = {...query, polarization: { eq: $event.value }}" id="multiselect_polarization" :options="getSentinel1GRDPolarizationOptions" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select polarization"></multiselect>
      </div>
      <div class="form-group">
        <label for="multiselect_orbit">Orbit Direction</label>
        <multiselect v-model="inputValues['orbit']" @input="query = {...query, 'sat:orbit_state': { eq: $event.value }}" id="multiselect_orbit" :options="sentinel1GRD.orbitDirectionModes" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select orbit direction"></multiselect>
      </div>
      <div class="form-group">
        <label for="multiselect_resolution">Resolution</label>
        <multiselect v-model="inputValues['resolution']" @input="query = {...query, resolution: { eq: $event.value }}" id="multiselect_resolution" :options="sentinel1GRD.resolutionModes" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select resolution"></multiselect>
      </div>
    </template>
    <!-- end of sentinel-1-grd -->

    <!-- sentinel-2-l1c, sentinel-2-l2a -->
    <template v-if="['sentinel-2-l1c', 'sentinel-2-l2a'].includes(collectionId)">
      <div class="form-group">
        <label for="multiselect_resolution">Max cloud coverage</label>
        <div class="d-flex">
          <div class="flex-grow-1 mr-xs-20">
            <vue-slider @change="query = {...query, 'eo:cloud_cover': { lte: $event }}" v-model="sentinel2L1C.cloudCoverPercentage" tooltip="none"></vue-slider>
          </div>
          <span>{{ sentinel2L1C.cloudCoverPercentage }}%</span>
        </div>
      </div>
    </template>
    <!-- end of sentinel-2-l1c -->

    <!-- sentinel-5p-l2 -->
    <template v-if="collectionId === 'sentinel-5p-l2'">
      <div class="form-group">
        <label for="multiselect_type">Type</label>
        <multiselect v-model="inputValues['type']" @input="query = {...query, type: { eq: $event.value }}" id="multiselect_type" :options="sentinel5PL2.types" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select type"></multiselect>
      </div>
    </template>
    <!-- end of sentinel-5p-l2 -->
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Watch,
  Vue,
} from 'vue-property-decorator';
import Multiselect from 'vue-multiselect';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

interface LabelValue {
  label: string,
  value: string,
}

@Component({
  components: { Multiselect, VueSlider },
})
export default class AdvancedFiltersExtension extends Vue {
  @Prop({ required: true }) collectionId!: string;

  query = {};

  inputValues = {};

  @Watch('query', { deep: true })
  onQueryChange(): void {
    this.$emit('querychange', this.query);
  }

  sentinel1GRD: {
    acquisitionModes: LabelValue[],
    orbitDirectionModes: LabelValue[],
    resolutionModes: LabelValue[],
  } = {
    acquisitionModes: [
      { label: 'Stripmap mode', value: 'SM' },
      { label: 'Interferometric Wide (IW) swath mode', value: 'IW' },
      { label: 'Extra Wide (EW) swath mode', value: 'EW' },
      { label: 'Wave mode', value: 'WV' },
    ],
    orbitDirectionModes: [
      { label: 'Ascending', value: 'ASCENDING' },
      { label: 'Descending', value: 'DESCENDING' },
    ],
    resolutionModes: [
      { label: 'High (10m/px for IW and 25m/px for EW)', value: 'HIGH' },
      { label: 'Medium (40m/px for IW and EW)', value: 'MEDIUM' },
    ],
  }

  sentinel2L1C = {
    cloudCoverPercentage: null,
  }

  sentinel5PL2: { types: LabelValue[] } = {
    types: [
      { label: 'Carbon monoxide (CO)', value: 'CO' },
      { label: 'Formaldehyde (HCHO)', value: 'HCHO' },
      { label: 'Nitrogen oxide (NO2)', value: 'NO2' },
      { label: 'Ozone (O3)', value: 'O3' },
      { label: 'Sulphur dioxide (SO2)', value: 'SO2' },
      { label: 'Methane (CH4)', value: 'CH4' },
      { label: 'UV (Ultraviolet) Aerosol Index calculated based on wavelengths of 340 nm and 380 nm', value: 'AER_AI_340_380' },
      { label: 'UV (Ultraviolet) Aerosol Index calculated based on wavelengths of 354 nm and 388 nm', value: 'AER_AI_354_388' },
      { label: 'Cloud base pressure', value: 'CLOUD_BASE_PRESSURE' },
      { label: 'Cloud top pressure', value: 'CLOUD_TOP_PRESSURE' },
      { label: 'Cloud base height', value: 'CLOUD_BASE_HEIGHT' },
      { label: 'Cloud top height', value: 'CLOUD_TOP_HEIGHT' },
      { label: 'Cloud optical thickness', value: 'CLOUD_OPTICAL_THICKNESS' },
      { label: 'Effective radiometric cloud fraction', value: 'CLOUD_FRACTION' },
      { label: 'The mask of data/no data pixels', value: 'dataMask' },
    ],
  }

  get getSentinel1GRDPolarizationOptions(): LabelValue[] {
    const options = [
      { label: 'HH', value: 'SH' },
      { label: 'VV', value: 'SV' },
      { label: 'HH+HV', value: 'DH' },
      { label: 'VV+VH', value: 'DV' },
    ];

    if (!this.query['sar:instrument_mode']) return [];
    if (this.query['sar:instrument_mode'] === 'WV') return options.filter((x) => x.value === 'SH' || x.value === 'SV');
    return options;
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/_eo-explorer.scss";
</style>
