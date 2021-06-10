<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step">
        <div class="dashboard__form__step__title">
          <h3>Select asset type</h3>
          <p>Select the type of your asset. <br>Note that the next steps will be optimised based on this type.</p>
        </div>
        <validation-provider v-slot="{ errors }" name="Asset Type" rules="required">
          <div class="form-group">
            <label class="control control-radio">
              Data File
              <input type="radio" name="asset_type" v-model="assetMainType" value="datafile" />
              <div class="control_indicator"></div>
            </label>
            <label class="control control-radio">
              API
              <input type="radio" name="asset_type" v-model="assetMainType" value="API" />
              <div class="control_indicator"></div>
            </label>
            <label class="control control-radio">
              Collection
              <input type="radio" name="asset_type" v-model="assetMainType" value="collection" />
              <div class="control_indicator"></div>
            </label>
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
          </div>
        </validation-provider>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
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
  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
  }

  assetMainType: string;

  constructor() {
    super();

    this.assetMainType = '';
  }

  @Watch('assetMainType')
  onAssetMainTypeChange(assetMainType: string): void {
    this.$emit('update:assetMainType', assetMainType);
  }

  // validate(): Promise<boolean> {
  //   return this.$refs.refObserver.validate();
  // }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
