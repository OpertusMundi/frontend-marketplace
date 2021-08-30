<template>
  <div class="assets checkout">

    <!-- MODALS -->
    <modal :withSlots="true" :show="modalToShow == 'modalDeclineContract'" @dismiss="modalToShow = ''" :modalId="'modalDeclineContract'">
      <template v-slot:body>
        <h1>Disagree with the contract terms?</h1>
        <p>The corresponding asset will automatically be removed from your cart</p>
      </template>

      <template v-slot:footer>
        <button class="btn--std btn--blue ml-xs-20" @click="onSubmitDeclineContract">submit</button>
      </template>
    </modal>
    <!-- END OF MODALS -->

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
                    <div class="checkout__info_table">
                      <span><strong>First name:</strong></span><span>{{ profile.firstName }}</span>
                      <span><strong>Last name:</strong></span><span>{{ profile.lastName }}</span>
                      <span><strong>Email:</strong></span><span>{{ profile.consumer.current.email }}</span>
                      <!-- <span><strong>Company:</strong></span><span>company (dummy)</span> -->
                      <!-- <span><strong>VAT number:</strong></span><span>sth</span> -->
                      <span v-if="profile.consumer.current.address.line1"><strong>Address:</strong></span><span>{{ profile.consumer.current.address.line2 ? `${profile.consumer.current.address.line1}, ${profile.consumer.current.address.line2}` : profile.consumer.current.address.line1 }}</span>
                      <span v-if="profile.consumer.current.address.city"><strong>City:</strong></span><span>{{ profile.consumer.current.address.city }}</span>
                      <span v-if="profile.consumer.current.address.country"><strong>Country:</strong></span><span>{{ profile.consumer.current.address.country }}</span>
                      <span v-if="profile.consumer.current.address.postalCode"><strong>ZIP code:</strong></span><span>{{ profile.consumer.current.address.postalCode }}</span>
                      <span v-if="profile.mobile"><strong>Phone number:</strong></span><span>{{ profile.mobile }}</span>
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
                    <ul v-if="!useDifferentShippingInfo"><li>Same information as billing</li></ul>
                    <transition name="fade" mode="out-in">
                      <div v-if="useDifferentShippingInfo">
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
                            <!-- <select class="form-group__select" name="country" id="country">
                              <option v-for="country in countries" :key="country"> {{country}} </option>
                            </select> -->
                            <multiselect id="multiselect_country" v-model="selectedShippingCountry" @input="onCountrySelection($event)" :options="$store.getters.getConfig.configuration.countries" label="name" track-by="code" :searchable="true" :close-on-select="true" :show-labels="false" placeholder="Select country"></multiselect>
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
                    </transition>
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
              <div class="dashboard__form__step dashboard__form__step--full-width" v-if="currentStep == 2">
                <div class="row">
                  <div class="col-md-5">
                    <h3>Contracts list</h3>
                    <hr>
                    <div v-if="cart">
                      <div v-for="(cartItem, i) in cart.items" :key="cartItem.id">
                        <div class="checkout__info_table" :class="{'checkout__info_table--text-blue': currentItemToReviewContract === i}">
                          <span><strong>Asset: </strong></span><span>{{ cartItem.asset.title }}</span>
                          <span><strong>Vendor: </strong></span><span>{{ cartItem.asset.publisherName }}</span>
                          <span><strong>Date of purchase: </strong></span><span>{{ formatDate(cartItem.addedAt) }}</span>
                          <span><strong>Price: </strong></span><span>{{ cartItem.pricingModel.quotation.totalPrice === 0 ? 'FREE' : `${cartItem.pricingModel.quotation.totalPrice}€` }}</span>
                        </div>
                        <div class="d-flex justify-content-end" v-if="i < currentItemToReviewContract">&#10003; Contract accepted</div>
                        <hr>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7">
                    <div v-if="!isAllContractsAccepted()">
                      <h3>Contract review</h3>
                      <hr>
                      <button class="btn btn--std btn--blue">download contract</button>
                      <div class="d-flex justify-content-end mt-xs-50">
                        <button class="btn btn--std btn--outlinedark" @click="onDeclineContract">decline</button>
                        <button class="btn btn--std btn--dark ml-xs-20" @click="onContractAccept">accept</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </validation-observer>

            <!-- STEP 3 - Bank account -->
            <validation-observer ref="step3">
              <div class="dashboard__form__step dashboard__form__step--full-width" v-if="currentStep == 3">
                <div class="row">
                  <div class="col-md-4">
                    <h3>Personal Info</h3>
                    <hr>
                    <div class="checkout__info_table">
                      <span><strong>First name:</strong></span><span>{{ profile.firstName }}</span>
                      <span><strong>Last name:</strong></span><span>{{ profile.lastName }}</span>
                      <span><strong>Email:</strong></span><span>{{ profile.consumer.current.email }}</span>
                      <!-- <span><strong>Company:</strong></span><span>company (dummy)</span> -->
                      <!-- <span><strong>VAT number:</strong></span><span>sth</span> -->
                      <span v-if="profile.consumer.current.address.line1"><strong>Address:</strong></span><span>{{ profile.consumer.current.address.line2 ? `${profile.consumer.current.address.line1}, ${profile.consumer.current.address.line2}` : profile.consumer.current.address.line1 }}</span>
                      <span v-if="profile.consumer.current.address.city"><strong>City:</strong></span><span>{{ profile.consumer.current.address.city }}</span>
                      <span v-if="profile.consumer.current.address.country"><strong>Country:</strong></span><span>{{ profile.consumer.current.address.country }}</span>
                      <span v-if="profile.consumer.current.address.postalCode"><strong>ZIP code:</strong></span><span>{{ profile.consumer.current.address.postalCode }}</span>
                      <span v-if="profile.mobile"><strong>Phone number:</strong></span><span>{{ profile.mobile }}</span>
                      <span v-if="selectedCard"><strong>Payment method:</strong></span><span>{{ availableCards.find((x) => x.id === selectedCard).alias }}</span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <h3>Contract's terms</h3>
                    <hr>
                  </div>
                  <div class="col-md-4">
                    <h3>Payment</h3>
                    <hr>
                    <div v-for="cartItem in cart.items" :key="cartItem.id" class="checkout__payment__payment_card">
                      <div class="checkout__payment__payment_card__top">
                        <h4>{{ cartItem.asset.title }}</h4>
                        <h4>{{ cartItem.pricingModel.quotation.totalPrice === 0 ? 'FREE' : `${cartItem.pricingModel.quotation.totalPrice}€` }}</h4>
                      </div>
                      <p><span><strong>Version:</strong> {{ cartItem.asset.version }}</span> <span><strong>Vendor:</strong> {{ cartItem.asset.publisherName }}</span></p>
                      <p>
                        <img src="@/assets/images/icons/vector_icon.svg" alt="" v-if="cartItem.asset.type === 'VECTOR'">
                        <img src="@/assets/images/icons/raster_icon.svg" alt="" v-if="cartItem.asset.type === 'RASTER'">
                        <img src="@/assets/images/icons/api_icon.svg" alt="" v-if="cartItem.asset.type === 'SERVICE'">
                        <span v-if="cartItem.asset.type === 'VECTOR'">Vector dataset</span>
                        <span v-if="cartItem.asset.type === 'RASTER'">Raster dataset</span>
                        <span v-if="cartItem.asset.type === 'SERVICE'">API dataset</span>
                      </p>
                    </div>
                    <div class="checkout__payment__bottom_fields">
                      <div>
                        <span>Subtotal:</span><span>{{ `${cart.totalPrice}€` }}</span>
                      </div>
                      <div>
                        <span>Discount coupon:</span><input type="text" class="form-group__text" name="discount_coupon" id="discount_coupon">
                      </div>
                      <div>
                        <span><strong>Total:</strong></span><h3>{{ `${cart.totalPrice}€` }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </validation-observer>

          </div>
        </div>
        <div class="dashboard__form__navbuttons">
          <button class="btn--std btn--blue" @click.prevent="previousStep()" v-if="currentStep > 1">previous</button>
          <button class="btn btn--std btn--blue" :disabled="currentStep === 2 && !isAllContractsAccepted()" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'place order' : 'next' }}</button>
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
import Multiselect from 'vue-multiselect';
import moment from 'moment';
import Modal from '@/components/Modal.vue';
import ConsumerPayInApi from '@/service/consumer-payin';
import CartApi from '@/service/cart';
import ConsumerContractsApi from '@/service/consumer-contracts';
import { Card, CardDirectPayInCommand } from '@/model/payin';
import { Profile } from '@/model/account';
import { Cart } from '@/model/cart';
import store from '@/store';

extend('required', required);
extend('email', email);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
    Modal,
  },
})
export default class Checkout extends Vue {
  consumerPayInApi: ConsumerPayInApi;

  cartApi: CartApi;

  consumerContractsApi: ConsumerContractsApi;

  totalSteps: number;

  currentStep: number;

  modalToShow: string;

  profile: Profile;

  useDifferentShippingInfo: boolean;

  // countries: string[];

  orderKey: string;

  availableCards: Card[] | null;

  selectedCard: string | null;

  selectedShippingCountry: string;

  cart: Cart | null;

  currentItemToReviewContract: number;

  constructor() {
    super();

    this.consumerPayInApi = new ConsumerPayInApi();
    this.cartApi = new CartApi();
    this.consumerContractsApi = new ConsumerContractsApi();

    this.totalSteps = 3;
    this.currentStep = 1;
    this.modalToShow = '';
    this.profile = store.getters.getProfile;
    this.useDifferentShippingInfo = false;
    // this.countries = ['Greece', 'Spain', 'Germany'];
    this.orderKey = '';
    this.availableCards = null;
    this.selectedCard = null;
    this.selectedShippingCountry = '';
    this.cart = null;
    this.currentItemToReviewContract = 0;
  }

  mounted(): void {
    this.consumerPayInApi.getCards().then((cardsResponse) => {
      this.availableCards = cardsResponse.result.filter((x) => x.active);
    });
  }

  onCountrySelection(country: {code: string, name: string}): void {
    console.log(country);
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  onContractAccept(): void {
    this.currentItemToReviewContract += 1;
  }

  onDeclineContract(): void {
    this.modalToShow = 'modalDeclineContract';
  }

  onSubmitDeclineContract(): void {
    store.commit('setLoading', true);
    this.modalToShow = '';
    const itemId = this.cart ? this.cart.items[this.currentItemToReviewContract].id : '';
    this.cartApi.removeItem(itemId).then((removeItemResponse) => {
      this.cart = removeItemResponse.result;
      store.commit('setLoading', false);
    });
  }

  isAllContractsAccepted(): boolean {
    if (this.cart && this.currentItemToReviewContract < this.cart.items.length) return false;
    return true;
  }

  nextStep(): void {
    if (this.currentStep === this.totalSteps) {
      this.submitCheckout();
      return;
    }

    (this.$refs[`step${this.currentStep}`] as any).validate().then((success) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      if (!success) return;

      this.currentStep += 1;

      if (this.currentStep === 2) {
        store.commit('setLoading', true);
        // this.cartApi.getCart().then((cartResponse) => {
        //   this.cart = cartResponse.result;
        //   store.commit('setLoading', false);
        // });
        Promise.all([
          this.cartApi.getCart(),
          this.consumerPayInApi.checkout().then((checkoutResponse) => {
            this.orderKey = checkoutResponse.result.key;
            return this.consumerContractsApi.printContract(this.orderKey, 1);
          }),
        ]).then((responses) => {
          const [cartResponse] = responses;
          const { 1: printContractResponse } = responses;

          this.cart = cartResponse.result;
          const pdf = printContractResponse;
          console.log('pdf', pdf);

          store.commit('setLoading', false);
        });
      }
    });
  }

  previousStep(): void {
    if (this.currentStep >= 1) {
      this.currentStep -= 1;
    }
  }

  submitCheckout(): void {
    store.commit('setLoading', true);
    const cardPayIn: CardDirectPayInCommand = {
      // eslint-disable-next-line
      cardId: this.selectedCard!,
    };
    this.consumerPayInApi.createCardDirectPayIn(this.orderKey, cardPayIn).then((payInResponse) => {
      console.log('payin response', payInResponse);
      if (payInResponse.success) {
        console.log('successful payin!');
        this.$router.push('/order-thankyou');
      } else {
        console.log('payin error');
      }
      store.commit('setLoading', false);
    });
    // this.consumerPayInApi.checkout().then((checkoutResponse) => {
    //   console.log('checkout response', checkoutResponse);
    //   if (checkoutResponse.success) {
    //     const orderKey = checkoutResponse.result.key;
    //     const cardPayIn: CardDirectPayInCommand = {
    //       // eslint-disable-next-line
    //       cardId: this.selectedCard!,
    //     };
    //     this.consumerPayInApi.createCardDirectPayIn(orderKey, cardPayIn).then((payInResponse) => {
    //       console.log('payin response', payInResponse);
    //       if (payInResponse.success) {
    //         console.log('successfull payin!');
    //         this.$router.push('/order-thankyou');
    //       } else {
    //         console.log('payin error');
    //       }
    //     });
    //   }
    // });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_checkout.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";

  .multiselect__option {
    &--selected {
      background: $secondColor !important;
    }
    &--highlight {
      background: $lightBgColor;
    }
  }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
