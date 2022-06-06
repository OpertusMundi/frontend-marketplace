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
        <multiselect v-model="inputValues['orbit']" @input="query = {...query, 'sat:orbit_state': { eq: $event.value }}" id="multiselect_orbit" :options="sentinel1GRD.orbitDirectionModes" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select polarization"></multiselect>
      </div>
      <div class="form-group">
        <label for="multiselect_resolution">Resolution</label>
        <multiselect v-model="inputValues['resolution']" @input="query = {...query, resolution: { eq: $event.value }}" id="multiselect_resolution" :options="sentinel1GRD.resolutionModes" label="label" track-by="label" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select polarization"></multiselect>
      </div>
    </template>
    <!-- end of sentinel-1-grd -->
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

interface LabelValue {
  label: string,
  value: string,
}

@Component({
  components: { Multiselect },
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
  @import "@/assets/styles/_eo-explorer.scss";
</style>
