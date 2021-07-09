<template>
  <validation-observer ref="refObserver">
    <!-- <div class="dashboard__form__step" v-if="currentStep == 6">
        <div class="dashboard__form__step__title">
          <h3>Payout method</h3>
          <p>Select where your profits will be transferred</p>
        </div>
        <validation-provider v-slot="{ errors }" name="Asset Type" rules="required">
          <div class="form-group">
            <label class="control control-radio">
              Through the platform
              <input type="radio" name="asset_type" v-model="asset.paymentMethod" value="platform" />
              <div class="control_indicator"></div>
            </label>
            <label class="control control-radio">
              External means
              <input type="radio" name="asset_type" v-model="asset.paymentMethod" value="external" />
              <div class="control_indicator"></div>
            </label>
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
          </div>
        </validation-provider>
        <div class="dashboard__form__step__payment" v-if="asset.paymentMethod === 'external'">
          <validation-provider v-slot="{ errors }" name="Contract Tamplate" rules="required">
          <div class="form-group">
            <multiselect v-model="asset.paymentType" :options="['Paypal', 'Credit/Debit Card', 'Direct bank transfer']" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select a payment method"></multiselect>
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
          </div>
          </validation-provider>
          <div class="dashboard__form__step__payment__form" v-if="asset.paymentType === 'Paypal'">
            <div class="form-group-double">
              <validation-provider v-slot="{ errors }" name="Holder first name" rules="required" tag="div" class="form-group">
                <label for="paypalFirstName">Holder first name</label>
                <input type="text" class="form-group__text" id="paypalFirstName" v-model="asset.paypalFirstName">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Holder last name" rules="required" tag="div" class="form-group">
                <label for="paypalLastName">Holder last name</label>
                <input type="text" class="form-group__text" id="paypalLastName" v-model="asset.paypalLastName">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
            </div>
            <validation-provider v-slot="{ errors }" name="Paypal account" rules="required" tag="div" class="form-group">
              <label for="paypalAccount">Paypal account</label>
              <input type="text" class="form-group__text" id="paypalAccount" v-model="asset.paypalAccount">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </validation-provider>
          </div>
          <div class="dashboard__form__step__payment__form" v-if="asset.paymentType === 'Credit/Debit Card'">
            <validation-provider v-slot="{ errors }" name="Holder name" rules="required" tag="div" class="form-group">
              <label for="creditCardholder">Holder name</label>
              <input type="text" class="form-group__text" id="creditCardholder" v-model="asset.creditCardHolder">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </validation-provider>
            <div class="form-group-multiple">
              <validation-provider v-slot="{ errors }" name="Card number" mode="lazy" rules="required|credit_card" tag="div" class="form-group form-group--full">
                <label for="creditCardNumber">Card number</label>
                <input type="text" class="form-group__text form-group__text--card" id="creditCardNumber" v-model="asset.creditCardNumber" v-cardformat:formatCardNumber>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Exp. date" mode="lazy" rules="required|credit_card_exp" tag="div" class="form-group">
                <label for="creditCardDate">Exp. date</label>
                <input type="text" class="form-group__text form-group__text--expdate" id="creditCardDate|credit_card_cvc" v-model="asset.creditCardDate" v-cardformat:formatCardExpiry>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Card CVC" mode="lazy" rules="required" tag="div" class="form-group">
                <label for="creditCardCvc">CVC</label>
                <input type="text" class="form-group__text form-group__text--cvc" id="creditCardCvc" v-model="asset.creditCardCvc" v-cardformat:formatCardCVC>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
            </div>
          </div>
          <!- - <div class="dashboard__form__step__payment__form" v-if="asset.paymentType === 'Direct bank transfer'">direct</div> - ->
        </div>
    </div> -->
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Payout extends Vue {
  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
