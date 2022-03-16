<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step">
      <div class="dashboard__form__step__title">
        <h3>Select asset type</h3>
        <p>Select the type of your asset. <br />Note that the next steps will be optimised based on this type.</p>
      </div>
      <validation-provider v-slot="{ errors }" name="Asset Type" rules="required">
        <div class="form-group">
          <label class="control control-radio">
            Data File
            <input :disabled="disabled" type="radio" name="asset_type" v-model="assetMainTypeLocal" value="DATA_FILE" />
            <div class="control_indicator"></div>
          </label>
          <label class="control control-radio">
            API
            <input :disabled="disabled" type="radio" name="asset_type" v-model="assetMainTypeLocal" value="API" />
            <div class="control_indicator"></div>
          </label>
          <label class="control control-radio">
            Collection
            <input :disabled="disabled" type="radio" name="asset_type" v-model="assetMainTypeLocal" value="COLLECTION" />
            <div class="control_indicator"></div>
          </label>
          <label class="control control-radio" v-if="$store.getters.hasRole(['ROLE_SENTINEL_HUB'])">
            Sentinel Hub
            <input :disabled="disabled" type="radio" name="asset_type" v-model="assetMainTypeLocal" value="SENTINEL_HUB" />
            <div class="control_indicator"></div>
          </label>
          <div class="errors" v-if="errors">
            <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
          </div>
        </div>
      </validation-provider>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component, Vue, Watch, Prop,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Type extends Vue {
  @Prop({ required: true }) private assetMainType!: string;

  @Prop({ default: false }) private disabled!: boolean;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  assetMainTypeLocal: string;

  constructor() {
    super();

    this.assetMainTypeLocal = this.assetMainType;
  }

  @Watch('assetMainType', { immediate: true })
  onAssetMainTypeChange(assetMainType: string): void {
    this.assetMainTypeLocal = assetMainType;
  }

  @Watch('assetMainTypeLocal')
  onAssetMainTypeChangeLocal(assetMainType: string): void {
    this.$emit('update:assetMainType', assetMainType);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
</style>
