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
                        <template v-if="availableCards && !availableCards.length">
                          <router-link :to="{ name: 'Settings', params: { initialTab: 'paymentMethods' } }" class="btn btn--std btn--blue">Add Payment Method</router-link>
                        </template>
                        <template v-else>
                          <div v-for="card in availableCards" :key="card.id">
                            <label class="control control-radio">
                              {{ card.alias }}
                              <input type="radio" name="asset_type" :value="card.id" v-model="selectedCard" />
                              <div class="control_indicator"></div>
                            </label>
                          </div>
                        </template>
                        <!-- <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div> -->
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">Card is required</span></div>
                      </div>
                    </validation-provider>
                  </div>
                </div>
              </div>
            </validation-observer>

            <!-- STEP 2 - Legal Representative -->
            <validation-observer ref="step2">
              <div class="dashboard__form__step dashboard__form__step--full-width" v-if="currentStep == 2">
                <div v-if="isVettingRequired" class="row flex align-items-center justify-content-center">
                  <div class="flex justify-content-center" style="text-align: center;">
                    <h4>In order for the transaction to proceed, the supplier must first approve your purchase.</h4>
                    <h4 class="mt-xs-20">If the supplier approves your request, your order will be processed automatically.</h4>
                  </div>
                </div>
                <div v-else class="row">
                  <div class="col-md-5">
                    <h3>Contracts list</h3>
                    <hr>
                    <div v-if="mode === 'CART_CHECKOUT' && cart">
                      <div v-for="(cartItem, i) in cart.items" :key="cartItem.id">
                        <div class="checkout__info_table" :class="{'checkout__info_table--text-blue': currentItemToReviewContract === i}">
                          <span><strong>Asset: </strong></span><span>{{ cartItem.asset.title }}</span>
                          <!-- <span><strong>Vendor: </strong></span><span>{{ cartItem.asset.publisherName }}</span> -->
                          <span><strong>Date of purchase: </strong></span><span>{{ formatDate(cartItem.addedAt) }}</span>
                          <span><strong>Price: </strong></span><span>{{ cartItem.pricingModel.quotation.totalPrice === 0 ? 'FREE' : `${cartItem.pricingModel.quotation.totalPrice}€` }}</span>
                        </div>
                        <div class="d-flex justify-content-end" v-if="i < currentItemToReviewContract">&#10003; Contract accepted</div>
                        <hr>
                      </div>
                    </div>
                    <div v-if="mode === 'ACCEPTED_ORDER_CHECKOUT' && order">
                      <div v-for="(item, i) in order.items" :key="item.item">
                        <div class="checkout__info_table" :class="{'checkout__info_table--text-blue': currentItemToReviewContract === i}">
                          <span><strong>Asset: </strong></span><span>{{ item.description }}</span>
                          <!-- <span><strong>Vendor: </strong></span><span>{{ cartItem.asset.publisherName }}</span> -->
                          <span><strong>Date of purchase: </strong></span><span>{{ formatDate(order.createdOn) }}</span>
                          <span><strong>Price: </strong></span><span>{{ item.totalPrice === 0 ? 'FREE' : `${item.totalPrice}€` }}</span>
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
                      <button class="btn btn--std btn--blue" @click="onDownloadContract">download contract</button>
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
                    <!-- <h5 v-for="contract in contracts" :key="contract.key">asd</h5> -->
                    <div class="checkout__info_table mb-xs-20" v-for="contract in contracts" :key="contract.key">
                      <span><strong>Key:</strong></span><span>{{ contract.key }}</span>
                      <span><strong>Title:</strong></span><span>{{ contract.title }}</span>
                      <span><strong>Version:</strong></span><span>{{ contract.version }}</span>
                      <span><strong>Terms:</strong></span><span>{{ contract.terms.map((x) => x.description).join(', ') }}</span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <h3>Payment</h3>
                    <hr>
                    <template v-if="mode === 'CART_CHECKOUT'">
                      <div v-for="cartItem in cart.items" :key="cartItem.id" class="checkout__payment__payment_card">
                        <div class="checkout__payment__payment_card__top">
                          <h4>{{ cartItem.asset.title }}</h4>
                          <h4>{{ cartItem.pricingModel.quotation.totalPrice === 0 ? 'FREE' : `${cartItem.pricingModel.quotation.totalPrice}€` }}</h4>
                        </div>
                        <p><span><strong>Version:</strong> {{ cartItem.asset.version }}</span> <span><strong>Vendor:</strong> {{ cartItem.asset.publisherName }}</span></p>
                        <p class="d-flex align-items-center">
                          <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="cartItem.asset.type === 'VECTOR'">
                          <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="cartItem.asset.type === 'RASTER'">
                          <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="cartItem.asset.type === 'TABULAR'">
                          <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'WMS'">
                          <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'WFS'">
                          <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'DATA_API'">
                          <span v-if="cartItem.asset.type === 'VECTOR'">Vector dataset</span>
                          <span v-if="cartItem.asset.type === 'RASTER'">Raster dataset</span>
                          <span v-if="cartItem.asset.type === 'TABULAR'">Tabular dataset</span>
                          <span v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'WMS'">WMS</span>
                          <span v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'WFS'">WFS</span>
                          <span v-if="cartItem.asset.type === 'SERVICE' && cartItem.asset.spatialDataServiceType === 'DATA_API'">Data API</span>
                        </p>
                      </div>
                    </template>

                    <template v-if="mode === 'ACCEPTED_ORDER_CHECKOUT'">
                      <div v-for="item in order.items" :key="item.item" class="checkout__payment__payment_card">
                        <div class="checkout__payment__payment_card__top">
                          <h4>{{ item.description }}</h4>
                          <h4>{{ item.totalPrice === 0 ? 'FREE' : `${item.totalPrice}€` }}</h4>
                        </div>
                        <p><span><strong>Version:</strong> {{ item.assetVersion }}</span> <span><strong>Vendor:</strong> {{ item.provider.name }}</span></p>
                        <p class="d-flex align-items-center">
                          <img src="@/assets/images/icons/types/vector.svg" alt="" v-if="item.type === 'VECTOR'">
                          <img src="@/assets/images/icons/types/raster.svg" alt="" v-if="item.type === 'RASTER'">
                          <img src="@/assets/images/icons/types/tabular.svg" alt="" v-if="item.type === 'TABULAR'">
                          <!-- todo: bug, spatialDataServiceType is not returned from API -->
                          <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'WMS'">
                          <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'WFS'">
                          <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'DATA_API'">
                          <span v-if="item.type === 'VECTOR'">Vector dataset</span>
                          <span v-if="item.type === 'RASTER'">Raster dataset</span>
                          <span v-if="item.type === 'TABULAR'">Tabular dataset</span>
                          <!-- todo: bug, spatialDataServiceType is not returned from API -->
                          <span v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'WMS'">WMS</span>
                          <span v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'WFS'">WFS</span>
                          <span v-if="item.type === 'SERVICE' && item.spatialDataServiceType === 'DATA_API'">Data API</span>
                        </p>
                      </div>
                    </template>

                    <div class="checkout__payment__bottom_fields">
                      <div>
                        <span>Subtotal:</span>
                        <span v-if="mode === 'CART_CHECKOUT'">{{ `${cart.totalPrice}€` }}</span>
                        <span v-if="mode === 'ACCEPTED_ORDER_CHECKOUT'">{{ `${order.totalPrice}€` }}</span>
                      </div>
                      <div>
                        <span>Discount coupon:</span><input type="text" class="form-group__text" name="discount_coupon" id="discount_coupon">
                      </div>
                      <div>
                        <span><strong>Total:</strong></span>
                        <h3 v-if="mode === 'CART_CHECKOUT'">{{ `${cart.totalPrice}€` }}</h3>
                        <h3 v-if="mode === 'ACCEPTED_ORDER_CHECKOUT'">{{ `${order.totalPrice}€` }}</h3>
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

          <router-link v-if="mode === 'CART_CHECKOUT' && currentStep === 2 && isVettingRequired" to="/dashboard/purchases" class="btn btn--std btn--blue">VIEW PURCHASES</router-link>
          <button v-else class="btn btn--std btn--blue" :disabled="isBtnNextDisabled()" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'place order' : 'next' }}</button>
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
import ConsumerOrderApi from '@/service/consumer-order';
import CartApi from '@/service/cart';
import ConsumerContractsApi from '@/service/consumer-contracts';
import CatalogueApi from '@/service/catalogue';
import { Card, CardDirectPayInCommand } from '@/model/payin';
import { Profile } from '@/model/account';
import { Cart } from '@/model/cart';
import store from '@/store';
import { ServerResponse } from '@/model';
import { CatalogueItem, CatalogueItemDetails, Contract } from '@/model/catalogue';
import { ConsumerOrder } from '@/model/order';
import { saveAs } from 'file-saver';

extend('required', required);
extend('email', email);

enum EnumMode {
  CART_CHECKOUT = 'CART_CHECKOUT',
  ACCEPTED_ORDER_CHECKOUT = 'ACCEPTED_ORDER_CHECKOUT',
}

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

  consumerOrderApi: ConsumerOrderApi;

  catalogueApi: CatalogueApi;

  mode: EnumMode;

  totalSteps: number;

  currentStep: number;

  modalToShow: string;

  profile: Profile;

  useDifferentShippingInfo: boolean;

  // countries: string[];

  orderKey: string;

  order: ConsumerOrder | null;

  availableCards: Card[] | null;

  selectedCard: string | null;

  selectedShippingCountry: string;

  cart: Cart | null;

  isVettingRequired: boolean;

  currentItemToReviewContract: number;

  contracts: Contract[];

  constructor() {
    super();

    this.consumerPayInApi = new ConsumerPayInApi();
    this.consumerOrderApi = new ConsumerOrderApi();
    this.cartApi = new CartApi();
    this.consumerContractsApi = new ConsumerContractsApi();
    this.catalogueApi = new CatalogueApi();

    this.mode = {} as EnumMode;

    this.totalSteps = 3;
    this.currentStep = 1;
    this.modalToShow = '';
    this.profile = store.getters.getProfile;
    this.useDifferentShippingInfo = false;
    // this.countries = ['Greece', 'Spain', 'Germany'];
    this.orderKey = '';
    this.order = null;
    this.availableCards = null;
    this.selectedCard = null;
    this.selectedShippingCountry = '';
    this.cart = null;
    this.isVettingRequired = false;
    this.currentItemToReviewContract = 0;
    this.contracts = [];
  }

  created(): void {
    store.commit('setLoading', true);

    this.mode = this.$route.params.orderKey ? EnumMode.ACCEPTED_ORDER_CHECKOUT : EnumMode.CART_CHECKOUT;
    this.orderKey = this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT ? this.$route.params.orderKey : '';

    if (this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT) {
      Promise.all([
        this.consumerPayInApi.getCards(),
        this.consumerOrderApi.getOrder(this.orderKey),
      ]).then((responses) => {
        const [cardsResponse] = responses;
        const { 1: orderResponse } = responses;

        if (!orderResponse.success) {
          this.$router.push('/errors/404');
          return;
        }

        this.availableCards = cardsResponse.result.filter((x) => x.active);
        this.order = orderResponse.result;
      }).catch((err) => {
        console.log('err', err);
      }).finally(() => {
        store.commit('setLoading', false);
      });
    }

    if (this.mode === EnumMode.CART_CHECKOUT) {
      Promise.all([
        this.consumerPayInApi.getCards(),
        this.cartApi.getCart(),
      ]).then((responses) => {
        const [cardsResponse] = responses;
        const { 1: cartResponse } = responses;

        this.availableCards = cardsResponse.result.filter((x) => x.active);
        this.cart = cartResponse.result;

        // todo: in the future, should follow a different approach for multiple items in cart (currently, checkout works for one item only)
        if (this.cart.items.some((x) => x.asset.vettingRequired)) this.isVettingRequired = true;
      }).catch((err) => {
        console.log('err', err);
      }).finally(() => {
        store.commit('setLoading', false);
      });
    }
  }

  onCountrySelection(country: {code: string, name: string}): void {
    console.log(country);
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  isBtnNextDisabled(): boolean {
    if (this.availableCards && !this.availableCards.length) return true;
    if (this.currentStep === 2 && !this.isAllContractsAccepted()) return true;
    return false;
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
    if (this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT && this.order && this.currentItemToReviewContract < this.order.items.length) return false;
    if (this.mode === EnumMode.CART_CHECKOUT && this.cart && this.currentItemToReviewContract < this.cart.items.length) return false;
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
        if (this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT) return;

        store.commit('setLoading', true);

        this.consumerPayInApi.checkout().then((response) => {
          this.orderKey = response.result.key;
        }).catch((err) => {
          console.log('err', err);
        }).finally(() => {
          store.commit('setLoading', false);
        });
      }

      if (this.currentStep === 3) {
        store.commit('setLoading', true);
        let itemsPromises: Promise<ServerResponse<CatalogueItem | CatalogueItemDetails>>[] = [];
        console.log(this.cart?.items);
        if (this.cart) itemsPromises = this.cart.items.map((x) => this.catalogueApi.findOne(x.asset.id));
        console.log('pr', itemsPromises);
        Promise.all(itemsPromises).then((responses) => {
          console.log('itp', responses);
          this.contracts = responses.map((x) => (x.result as CatalogueItemDetails).contract);
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

  onDownloadContract(): void {
    store.commit('setLoading', true);
    this.consumerContractsApi.printContract(this.orderKey, this.currentItemToReviewContract + 1).then((response) => {
      console.log('pdf', response.data);
      const blob = new Blob([(response as any).data], { type: 'application/pdf' });

      const assetId = this.cart ? this.cart.items[this.currentItemToReviewContract].asset.id : '';
      this.catalogueApi.findOne(assetId).then((assetResponse) => {
        const title = (assetResponse.result as CatalogueItemDetails).contract.title.replaceAll(' ', '_');
        saveAs(blob, title);
        store.commit('setLoading', false);
      }).catch((err) => {
        console.log('err', err);
        store.commit('setLoading', false);
      });
    });

    // this.consumerContractsApi.printContract(this.orderKey, 1).then((response) => {
    //   console.log('pdf', response.data);
    //   const blob = new Blob([(response as any).data], {type: "application/pdf"});
    //   FileSaver.saveAs(blob, "filename");
    // });
  }

  // TODO: refactoring
  submitCheckout(): void {
    store.commit('setLoading', true);
    const cardPayIn: CardDirectPayInCommand = {
      // eslint-disable-next-line
      cardId: this.selectedCard!,
    };
    if ((this.cart && this.cart.totalPrice === 0) || (this.order && this.order.totalPrice === 0)) { // FREE PAYIN
      this.consumerPayInApi.createFreePayIn(this.orderKey).then((payInResponse) => {
        console.log('payin response', payInResponse);
        if (payInResponse.success) {
          console.log('successful free payin!');

          if (this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT) {
            this.$router.push(`/order-thankyou/${this.orderKey}`);
            return;
          }

          this.cartApi.clear().then((clearCartResponse) => {
            if (clearCartResponse.success) {
              store.commit('setCartItems', []);
              console.log('cleared items from cart');
              this.$router.push(`/order-thankyou/${this.orderKey}`);
            } else {
              console.log('error clearing cart', clearCartResponse);
            }
          });
        } else {
          console.log('payin error');
        }
        store.commit('setLoading', false);
      });
    } else { // ORDINARY PAYIN (MANGOPAY)
      this.consumerPayInApi.createCardDirectPayIn(this.orderKey, cardPayIn).then((payInResponse) => {
        console.log('payin response', payInResponse);
        if (payInResponse.success) {
          console.log('successful payin!');

          if (this.mode === EnumMode.ACCEPTED_ORDER_CHECKOUT) {
            store.commit('setCartItems', []);
            console.log('cleared items from cart');

            const redirectUrl = payInResponse.result.secureModeRedirectURL;
            if (redirectUrl) {
              console.log('redirecting to secure mode url', redirectUrl);
              window.location.href = redirectUrl;
            } else {
              this.$router.push(`/order-thankyou/${this.orderKey}`);
            }
          }

          if (this.mode === EnumMode.CART_CHECKOUT) {
            this.cartApi.clear().then((clearCartResponse) => {
              if (clearCartResponse.success) {
                store.commit('setCartItems', []);
                console.log('cleared items from cart');

                const redirectUrl = payInResponse.result.secureModeRedirectURL;
                if (redirectUrl) {
                  console.log('redirecting to secure mode url', redirectUrl);
                  window.location.href = redirectUrl;
                } else {
                  this.$router.push(`/order-thankyou/${this.orderKey}`);
                }
              } else {
                console.log('error clearing cart', clearCartResponse);
              }
            });
          }
        } else {
          console.log('payin error');
        }
        store.commit('setLoading', false);
      });
    }
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
