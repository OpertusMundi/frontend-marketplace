<template>
  <div class="assets">
    <div class="m_container">
      <div class="assets__head">
        <h1>Checkout</h1>
      </div>
        <div class="dashboard__form">
          <ul class="dashboard__form__nav">
            <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Personal Info</a></li>
            <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Contract Review</a></li>
            <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Summary</a></li>
          </ul>
          <div class="dashboard__form__steps">
            <div class="dashboard__form__steps__inner">

            <!-- STEP 1 - Company -->
            <validation-observer ref="step1">
              <div class="dashboard__form__step dashboard__form__step--full-width" v-if="currentStep == 1">
                <div class="row">
                  <div class="col-md-4">
                    <!-- BILLING -->
                    <h3>Billing</h3>
                    <hr>
                    <div class="checkout__billing_table">
                      <span><strong>First name:</strong></span><span>sth</span>
                      <span><strong>Last name:</strong></span><span>sth</span>
                      <span><strong>Email:</strong></span><span>sth</span>
                      <span><strong>Company:</strong></span><span>sth</span>
                      <span><strong>VAT number:</strong></span><span>sth</span>
                      <span><strong>Address:</strong></span><span>sth</span>
                      <span><strong>City:</strong></span><span>sth</span>
                      <span><strong>Country:</strong></span><span>sth</span>
                      <span><strong>ZIP code:</strong></span><span>sth</span>
                      <span><strong>Phone number:</strong></span><span>sth</span>
                    </div>
                    <hr>
                    <div class="form-group-checkbox">
                      <input type="checkbox" v-model="useDifferentShippingInfo" id="terms">
                      <label class="checkout__billing_checkbox_label" for="terms">Use different information for shipping</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <!-- SHIPPING -->
                    <h3>Shipping</h3>
                    <hr>
                    <!-- <validation-provider v-slot="{ errors }" name="First name" rules="required"> -->
                      <div class="form-group">
                        <label for="first_name">First name *</label>
                        <input type="text" class="form-group__text" name="first_name" id="first_name">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Last name" rules="required"> -->
                      <div class="form-group">
                        <label for="last_name">Last name *</label>
                        <input type="text" class="form-group__text" name="last_name" id="last_name">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Email" rules="required|email"> -->
                      <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="text" class="form-group__text" name="email" id="email">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Company" rules="required"> -->
                      <div class="form-group">
                        <label for="company">Company *</label>
                        <input type="text" class="form-group__text" name="comapny" id="company">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Address" rules="required"> -->
                      <div class="form-group">
                        <label for="address">Address *</label>
                        <input type="text" class="form-group__text" name="address" id="address">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="City" rules="required"> -->
                      <div class="form-group">
                        <label for="city">City *</label>
                        <input type="text" class="form-group__text" name="city" id="city">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Country" rules="required"> -->
                      <div class="form-group">
                        <label for="country">Country *</label>
                        <select class="form-group__select" name="country" id="country">
                          <option v-for="country in countries" :key="country"> {{country}} </option>
                        </select>
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="ZIP code" rules="required"> -->
                      <div class="form-group">
                        <label for="zip_code">ZIP code *</label>
                        <input type="text" class="form-group__text" name="zip_code" id="zip_code">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                    <!-- <validation-provider v-slot="{ errors }" name="Phone number" rules="required"> -->
                      <div class="form-group">
                        <label for="phone_number">Phone number *</label>
                        <input type="text" class="form-group__text" name="phone_number" id="phone_number">
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                      </div>
                    <!-- </validation-provider> -->
                  </div>
                  <div class="col-md-4">
                    <!-- PAYMENT -->
                    <h3>Payment</h3>
                    <hr>
                    <validation-provider v-slot="{ errors }" name="Card" rules="required">
                      <div class="form-group">
                        <div v-for="card in availableCards" :key="card.id">
                          <label class="control control-radio">
                            {{ card.alias }}
                            <input type="radio" name="asset_type" :value="card.id" v-model="selectedCard" />
                            <div class="control_indicator"></div>
                          </label>
                        </div>
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>
                  </div>
                </div>
              </div>
            </validation-observer>

            <!-- STEP 2 - Legal Representative -->
            <validation-observer ref="step2">
              <div class="dashboard__form__step" v-if="currentStep == 2">
                <h3>step 2</h3>
              </div>
            </validation-observer>

            <!-- STEP 3 - Bank account -->
            <validation-observer ref="step3">
              <div class="dashboard__form__step" v-if="currentStep == 3">
                <h3>step 3</h3>
              </div>
            </validation-observer>

          </div>
        </div>
        <div class="dashboard__form__navbuttons">
          <button class="btn--std btn--blue" @click.prevent="previousStep()" v-if="currentStep > 1">previous</button>
          <button class="btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm order' : 'next' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  required,
  email,
} from 'vee-validate/dist/rules';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  // localize,
} from 'vee-validate';
import ConsumerPayInApi from '@/service/consumer-payin';
import { Card, CardDirectPayInCommand } from '@/model/payin';

extend('required', required);
extend('email', email);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Checkout extends Vue {
  consumerPayInApi: ConsumerPayInApi;

  totalSteps: number;

  currentStep: number;

  useDifferentShippingInfo: boolean;

  countries: string[];

  availableCards: Card[] | null;

  selectedCard: string | null;

  constructor() {
    super();

    this.consumerPayInApi = new ConsumerPayInApi();
    this.totalSteps = 3;
    this.currentStep = 1;
    this.useDifferentShippingInfo = false;
    this.countries = ['Greece', 'Spain', 'Germany'];
    this.availableCards = null;
    this.selectedCard = null;
  }

  mounted(): void {
    this.consumerPayInApi.getCards().then((cardsResponse) => {
      this.availableCards = cardsResponse.result.filter((x) => x.active);
    });
  }

  nextStep(): void {
    if (this.currentStep === this.totalSteps) {
      this.submitCheckout();
      return;
    }
    (this.$refs[`step${this.currentStep}`] as any).validate().then((success) => {
      // TODO
      if (success) {
        console.log(success);
        this.currentStep += 1;
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  previousStep(): void {
    if (this.currentStep >= 1) {
      this.currentStep -= 1;
    }
  }

  submitCheckout(): void {
    this.consumerPayInApi.checkout().then((checkoutResponse) => {
      console.log('checkout response', checkoutResponse);
      if (checkoutResponse.success) {
        const orderKey = checkoutResponse.result.key;
        const cardPayIn: CardDirectPayInCommand = {
          // eslint-disable-next-line
          cardId: this.selectedCard!,
        };
        this.consumerPayInApi.createCardDirectPayIn(orderKey, cardPayIn).then((payInResponse) => {
          console.log('payin response', payInResponse);
          if (payInResponse.success) {
            console.log('successfull payin!');
            this.$router.push('/order-thankyou');
          } else {
            console.log('payin error');
          }
        });
      }
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_checkout.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
