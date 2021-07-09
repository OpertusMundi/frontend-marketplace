<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step">
      <div class="dashboard__form__step__title">
        <h3>Contract template</h3>
        <p>Assign a contract template to your asset</p>
      </div>
      <div class="dashboard__form__step__contract">
        <div class="dashboard__form__step__contract__inner">
          <h5>Existing templates</h5>
          <p>Assign a contract template to your asset</p>
            <validation-provider v-slot="{ errors }" name="Contract Tamplate" rules="required">
              <div class="form-group">
                <multiselect v-model="contractLocal" :options="['Contract template #1','Contract template #2','Contract template #3']" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select a contract template"></multiselect>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
              </div>
            </validation-provider>
        </div>
        <div class="dashboard__form__step__contract__seperator">or</div>
        <div class="dashboard__form__step__contract__inner">
          <h5>Create a new one</h5>
          <p>By creating a new contract, you will exit this wizard, the asset will be saved as draft and you can continue editing it afterwards.</p>
          <a href="#">Create a new contract</a>
        </div>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop,
} from 'vue-property-decorator';
import Multiselect from 'vue-multiselect';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class Contract extends Vue {
  @Prop({ required: true }) private contract!: string;

  contractLocal: string;

  constructor() {
    super();

    this.contractLocal = this.contract;
  }

  @Watch('contractLocal')
  onContractChange(contract: string): void {
    this.$emit('update:contract', contract);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
