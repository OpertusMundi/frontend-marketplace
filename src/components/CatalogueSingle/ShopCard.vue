<template>
  <div class="asset__shopcard">
    <div class="asset__shopcard__variations">
      <!-- <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.id">
        <input type="radio" name="variations" :id="`p_variation_${pr_model.id}`" v-model="selectedPricingModel" :value="pr_model.id">
        <label :for="`p_variation_${pr_model.id}`">{{ pr_model.totalPrice === 0 ? 'FREE' : pr_model.totalPrice + prModelCurrencyFormat(pr_model.currency) }} <span v-if="pr_model.includesUpdates">({{ pr_model.yearsOfUpdates }} year{{pr_model.yearsOfUpdates > 1 ? 's' : ''}} of updates)</span><span v-else>(no updates)</span></label>
      </div> -->
      <div class="asset__shopcard__price">
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FREE'" class="asset__shopcard__price"><span>FREE</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED'"><span>{{ selectedPricingModel.totalPriceExcludingTax }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_PER_ROWS'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_FOR_POPULATION'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL_WITH_PREPAID'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL_WITH_BLOCK_RATE'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW_WITH_PREPAID'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW_WITH_BLOCK_RATE'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
      </div>

      <div class="mt-xs-20" v-if="catalogueItem.pricingModels.length !== 1 || catalogueItem.pricingModels[0].model.type !== 'FREE'">
        <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.model.key">
          <input :hidden="catalogueItem.pricingModels.length === 1" type="radio" name="variations" :id="`p_variation_${pr_model.model.key}`" v-model="selectedPricingModel" :value="pr_model.model">
          <label :for="`p_variation_${pr_model.model.key}`">{{ formatPricingModelType(pr_model.model.type) }}
            <span v-if="pr_model.model.type === 'FIXED' && pr_model.model.yearsOfUpdates">+ {{ pr_model.model.yearsOfUpdates }} {{ pr_model.model.yearsOfUpdates > 1 ? 'years' : 'year' }} of updates</span>
            <div v-if="pr_model.model.type === 'FIXED_PER_ROWS'">
              Price per 1,000 rows<br><strong>Minimum rows:</strong> {{ pr_model.model.minRows ? pr_model.model.minRows : 'not specified' }}
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.model.type === 'FIXED_FOR_POPULATION'">
              Price per 10,000 people<br><strong>Minimum population percentage:</strong> {{ pr_model.model.minPercent ? pr_model.model.minPercent : 'not specified' }} %
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.model.type === 'PER_CALL_WITH_PREPAID'">
              Subscription, fixed price per call<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <span>{{ prePaidTier.count }} calls</span><span>{{ prePaidTier.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.model.type === 'PER_CALL_WITH_BLOCK_RATE'">
              Subscription, blocking rates per call<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} calls</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.model.type === 'PER_ROW_WITH_PREPAID'">
              Subscription, fixed price per row<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <span>{{ prePaidTier.count }} rows</span><span>{{ prePaidTier.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.model.type === 'PER_ROW_WITH_BLOCK_RATE'">
              Subscription, blocking rates per row<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div v-if="selectedPricingModel && (selectedPricingModel.type == 'FIXED_PER_ROWS' || selectedPricingModel.type == 'FIXED_FOR_POPULATION')" class="asset__shopcard__addtocart"><a href="#" @click.prevent="openSelectAreaModal" class="btn btn--std btn--blue">SELECT AREAS</a></div>
    <div v-else class="asset__shopcard__addtocart"><a href="#" @click.prevent="addToCart" class="btn btn--std btn--blue">ADD TO CART</a></div>

    <ul v-if="selectedPricingModel" class="asset__shopcard__buyinfo pt-sm-10">
      <li><strong>Asset application restrictions</strong></li>
      <li>
        <strong>Use restricted for: </strong>
        <span v-if="getDomainRestrictions().length">
          <span v-for="(domain, i) in getDomainRestrictions()" :key="domain">{{ domain }}<span v-if="i !== getDomainRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Any domain</span>
      </li>
      <li>
        <strong>Coverage: </strong>
        <span v-if="getCoverageRestrictions().length">
          <span v-for="(area, i) in getCoverageRestrictions()" :key="area">{{ area }}<span v-if="i !== getCoverageRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Worldwide</span>
      </li>
      <li>
        <strong>Consumers: </strong>
        <span v-if="getConsumerRestrictions().length">
          <span v-for="(area, i) in getConsumerRestrictions()" :key="area">{{ area }}<span v-if="i !== getConsumerRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Worldwide</span>
      </li>
    </ul>

    <hr>

    <transition name="fade" mode="out-in"><div class="asset__shopcard__errors" v-if="cartErrors">{{ cartErrors }}</div></transition>
    <ul class="asset__shopcard__buyinfo">
      <li><strong>Delivery type: </strong> {{ catalogueItem.deliveryMethod }}</li>
      <!-- <li><strong>Delivery format: </strong> digital / physical (DUMMY)</li> -->
      <!-- <li><strong>Payment methods:</strong> <img src="@/assets/images/icons/cc_icon.svg" alt="credit card icon"><img src="@/assets/images/icons/bank_transfer.svg" alt="bank transfer icon"> </li> -->
      <li><strong>Delivered from: </strong>{{ catalogueItem.publisher.name }}</li>
    </ul>
    <div class="asset-owner">
      <div class="asset-owner__inner">
        <div class="asset-owner__inner__logo" v-if="catalogueItem.publisher.logoImageMimeType && catalogueItem.publisher.logoImage">
          <img :src="'data:' + catalogueItem.publisher.logoImageMimeType + ';base64, ' + catalogueItem.publisher.logoImage" :alt="`image for ${catalogueItem.publisher.name}`">
        </div>
        <div class="asset-owner__inner__info">
          <div class="asset-owner__inner__info__name">
            <!-- <a href="#">{{ catalogueItem.publisher.name }}</a> -->
            <a href="#">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 33 31" style="enable-background:new 0 0 33 31;" xml:space="preserve">
                <path style="fill:#FFFFFF;"
                d="M16.5,30.7l-3.2-2.9C5.6,20.8,0.4,16.1,0.4,9.9c0-5.2,4.1-9.3,9.3-9.3c2.5,0,4.9,1,6.8,2.7c1.8-1.7,4.2-2.7,6.8-2.7c5.2,0,9.3,4.1,9.3,9.3c0,6.1-5.1,10.8-12.9,18L16.5,30.7z M9.7,2.6c-4.1,0-7.3,3.2-7.3,7.3c0,5.2,4.9,9.7,12.2,16.5l1.8,1.6l1.8-1.6c7.4-6.8,12.2-11.2,12.2-16.5c0-4.1-3.2-7.3-7.3-7.3c-2.3,0-4.5,1.1-6,2.8l-0.8,0.9l-0.8-0.9C14.2,3.7,12,2.6,9.7,2.6z"/>
                <path style="fill:#FFFFFF;" d="M16.5,29.4l-2.2-2C6.6,20.3,1.4,15.7,1.4,9.9c0-4.7,3.6-8.3,8.3-8.3c2.6,0,5.1,1.2,6.8,3.2c1.7-2,4.1-3.2,6.8-3.2c4.7,0,8.3,3.6,8.3,8.3c0,5.8-5.1,10.4-12.9,17.5L16.5,29.4z"/>
              </svg>
            </a>
          </div>
          <!-- <div class="rating rating--dark">
            <span v-for="index in 5" v-bind:key="`${index}_rating`" :class="{ 'active' : index <= catalogueItem.publisher.rating }">★</span>
            <i>{{catalogueItem.publisher.rating ? catalogueItem.publisher.rating : '- '}}/5</i>
          </div> -->
          <!-- <div class="asset-owner__inner__info__country">{{ catalogueItem.publisher.city }}, {{ catalogueItem.publisher.country }}</div> -->
          <!-- <div class="asset-owner__inner__info__date">Joined {{ catalogueItem.publisher.joinedAt | format_date }}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';
import SelectAreas from '@/components/CatalogueSingle/SelectAreas.vue';
import CartApi from '@/service/cart';
import { CatalogueItem } from '@/model';
import { BasePricingModelCommand } from '@/model/pricing-model';
import { CartAddItemCommand } from '@/model/cart';
import store from '@/store';

@Component({
  components: {
    SelectAreas,
  },
})
export default class ShopCard extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  cartApi: CartApi;

  selectedPricingModel: BasePricingModelCommand | null;

  isSelectAreasModalOn: boolean;

  cartErrors: string;

  constructor() {
    super();

    this.cartApi = new CartApi();

    console.log('shopcard item', this.catalogueItem);

    this.selectedPricingModel = null;
    this.isSelectAreasModalOn = false;
    this.cartErrors = '';
    this.selectedPricingModel = this.catalogueItem.pricingModels[0].model;
  }

  @Watch('selectedPricingModel')
  selectedPricingModelChanged(newVal: string):void {
    if (newVal !== '') {
      this.cartErrors = '';
    }
  }

  addToCart():void {
    if (!this.selectedPricingModel) {
      this.cartErrors = 'Please select a pricing model!';
      return;
    }
    this.cartErrors = '';
    console.log('TODO: add to cart');
    // TODO: add to cart functions

    const cartItem:CartAddItemCommand = {
      assetId: this.catalogueItem.id,
      // eslint-disable-next-line
      pricingModelKey: this.selectedPricingModel.key!,
      parameters: {},
    };
    this.cartApi.addItem(cartItem)
      // .then((cartResponse: ServerResponse<Cart>) => {
      .then((cartResponse) => {
        console.log('add item to cart');
        if (cartResponse.success) {
          console.log('successfully added item to cart');
          store.commit('setCartItems', cartResponse.result);
        } else {
          // TODO: Handle error
          console.error('cannot add item to cart!');
        }
      });
  }

  // todo: not used currently
  prModelCurrencyFormat(currency:string): string {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';

      default:
        return '';
    }
  }

  formatPricingModelType(t: string): string {
    const labels = {
      FREE: 'FREE',
      FIXED: 'FIXED',
      FIXED_PER_ROWS: 'FIXED PER ROWS',
      FIXED_FOR_POPULATION: 'FIXED FOR POPULATION',
      PER_CALL_WITH_PREPAID: 'PER CALL',
      PER_CALL_WITH_BLOCK_RATE: 'PER CALL',
      PER_ROW_WITH_PREPAID: 'PER ROW',
      PER_ROW_WITH_BLOCK_RATE: 'PER ROW',
    };
    return labels[t];
  }

  openSelectAreaModal(): void {
    // eslint-disable-next-line
    this.$emit('openSelectAreaModal', this.selectedPricingModel!.key);
  }

  getDomainRestrictions(): string[] {
    if (!this.selectedPricingModel?.domainRestrictions) return [];
    return this.selectedPricingModel?.domainRestrictions as string[];
  }

  getCoverageRestrictions(): string[] {
    if (!this.selectedPricingModel?.coverageRestrictionContinents && !this.selectedPricingModel?.coverageRestrictionCountries) return [];
    if (!this.selectedPricingModel.coverageRestrictionContinents) return this.selectedPricingModel.coverageRestrictionCountries;
    if (!this.selectedPricingModel.coverageRestrictionCountries) return this.selectedPricingModel.coverageRestrictionContinents;
    return (this.selectedPricingModel?.coverageRestrictionContinents as string[]).concat(this.selectedPricingModel?.coverageRestrictionCountries as string[]);
  }

  getConsumerRestrictions(): string[] {
    if (!this.selectedPricingModel?.consumerRestrictionContinents && !this.selectedPricingModel?.consumerRestrictionCountries) return [];
    if (!this.selectedPricingModel.consumerRestrictionContinents) return this.selectedPricingModel.consumerRestrictionCountries;
    if (!this.selectedPricingModel.consumerRestrictionCountries) return this.selectedPricingModel.consumerRestrictionContinents;
    return (this.selectedPricingModel?.consumerRestrictionContinents as string[]).concat(this.selectedPricingModel?.consumerRestrictionCountries as string[]);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
