<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">
      <div class="dashboard__form__step__title mb-xs-5">
        <h3>Payout method</h3>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="dashboard__form__step__title">
            <p class="mt-xs-5">Select where your profits will be transfered</p>
            <validation-provider v-slot="{ errors }" name="Payout method" rules="required">
            <div class="form-group mt-xs-20">
              <label class="control control-radio">
                Through the platform
                <input type="radio" name="payout_method" v-model="selectedPayoutMethodLocal" value="through_platform" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                External means
                <input type="radio" name="payout_method" v-model="selectedPayoutMethodLocal" value="external_means" />
                <div class="control_indicator"></div>
              </label>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
            </validation-provider>
          </div>
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div class="dashboard__form__step__title mb-xs-20">
                <p v-if="selectedPayoutMethodLocal === 'through_platform'">Payout methods defined in your Settings.</p>
                <p v-if="selectedPayoutMethodLocal === 'external_means'">Please select how you want to receive payments and provide information for each. Please be careful, this information will be presented to prospective consumers in order to pay you for an asset.</p>
              </div>
            </div>
            <div class="col-md-6"></div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div v-if="selectedPayoutMethodLocal === 'through_platform'">
                <div class="form-group">
                  <label class="control control-radio">
                    {{ iban }}
                    <input selected type="radio" name="payout_card" v-model="selectedIban" :value="iban" />
                    <div class="control_indicator"></div>
                  </label>
                </div>
              </div>
              <div v-if="selectedPayoutMethodLocal === 'external_means'">
                <div class="form-group">
                  <label class="control control-radio">
                    Credit / Debit card
                    <input type="radio" name="payout_method_external" v-model="selectedExternalPayoutMethod" value="credit_debit" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    PayPal
                    <input type="radio" name="payout_method_external" v-model="selectedExternalPayoutMethod" value="paypal" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Direct bank transfer
                    <input type="radio" name="payout_method_external" v-model="selectedExternalPayoutMethod" value="bank_transfer" />
                    <div class="control_indicator"></div>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div v-if="selectedExternalPayoutMethod === 'credit_debit'">
                <validation-provider>
                  <div class="form-group">
                    <label for="metadata_holder_name">Holder name</label>
                    <input type="text" class="form-group__text" name="metadata_holder_name" id="metadata_holder_name">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider>
                  <div class="form-group">
                    <label for="metadata_card_number">Card number</label>
                    <input type="text" class="form-group__text" name="metadata_card_number" id="metadata_card_number">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <div class="d-flex space-between">
                  <validation-provider class="flex-grow-1 mr-xs-20">
                    <div class="form-group">
                      <label for="metadata_expiration_date">Expiration date</label>
                      <input type="text" class="form-group__text" name="metadata_expiration_date" id="metadata_expiration_date">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                  <validation-provider>
                    <div class="form-group" style="max-width: 100px;">
                      <label for="metadata_cvv">CVV</label>
                      <input type="text" class="form-group__text" name="metadata_expiration_cvv" id="metadata_cvv">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>
              </div>
            </div>
          </div>
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
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import store from '@/store';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Payout extends Vue {
  @Prop({ required: true }) readonly selectedPayoutMethod!: string;

  selectedPayoutMethodLocal: string;

  selectedExternalPayoutMethod: string;

  iban: string;

  selectedIban: string;

  constructor() {
    super();

    this.selectedPayoutMethodLocal = this.selectedPayoutMethod;

    this.selectedExternalPayoutMethod = '';

    this.iban = '';

    this.selectedIban = '';
  }

  created(): void {
    this.iban = store.getters.getProfile.provider.current.bankAccount.iban;
    this.selectedIban = store.getters.getProfile.provider.current.bankAccount.iban;
  }

  @Watch('selectedPayoutMethodLocal')
  onSelectedPayoutMethodChange(payoutMethod: string): void {
    if (payoutMethod === 'through_platform') this.selectedExternalPayoutMethod = '';

    this.$emit('update:selectedPayoutMethod', payoutMethod);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
