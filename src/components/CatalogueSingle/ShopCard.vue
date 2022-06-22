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
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'SENTINEL_HUB_IMAGES'">-</span>
        <div v-if="selectedPricingModel && selectedPricingModel.type === 'SENTINEL_HUB_SUBSCRIPTION'">
          <div class="mb-xs-20"><span></span>monthly<span></span><span>{{ selectedPricingModel.monthlyPriceExcludingTax }}</span><span>€</span></div>
          <div class="mb-xs-20"><span></span>annually<span></span><span>{{ selectedPricingModel.annualPriceExcludingTax }}</span><span>€</span></div>
        </div>
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
            <!-- <div v-if="pr_model.model.type === 'PER_CALL_WITH_PREPAID'">
              Subscription, fixed price per call<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table" v-if="pr_model.model.prePaidTiers.length === 1">
                  <span>{{ pr_model.model.prePaidTiers[0].count }} calls</span><span>{{ pr_model.model.prePaidTiers[0].discount }}% discount</span>
                </div>
                <div v-if="pr_model.model.prePaidTiers.length > 1" class="asset__shopcard__variations__row__discounts__radio_selections">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <label :for="`prepaid_tier_pcwp_${i}`">
                      <input v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL_WITH_PREPAID'" type="radio" :value="i" v-model="selectedPrepaidTierIndex" :id="`prepaid_tier_pcwp_${i}`">
                      <span>{{ prePaidTier.count }} calls, </span><span>{{ prePaidTier.discount }}% discount</span>
                    </label>
                  </div>
                </div>
              </div>
            </div> -->
            <div v-if="pr_model.model.type === 'PER_CALL'">
              Subscription, price per call<br>
              <!-- TODO: to be checked -->
              <div class="asset__shopcard__variations__row__discounts" v-if="pr_model.model.discountRates && pr_model.model.discountRates.length">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} calls</span><span>{{ discount.discount }}% discount</span>
                  </div>
                </div>
              </div>
              <div class="asset__shopcard__variations__row__discounts" v-if="pr_model.model.prePaidTiers && pr_model.model.prePaidTiers.length">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table" v-if="pr_model.model.prePaidTiers.length === 1">
                  <span>{{ pr_model.model.prePaidTiers[0].count }} calls</span><span>{{ pr_model.model.prePaidTiers[0].discount }}% discount</span>
                </div>
                <div v-if="pr_model.model.prePaidTiers.length > 1" class="asset__shopcard__variations__row__discounts__radio_selections">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <label :for="`prepaid_tier_pcwp_${i}`">
                      <input v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL'" type="radio" :value="i" v-model="selectedPrepaidTierIndex" :id="`prepaid_tier_pcwp_${i}`">
                      <span>{{ prePaidTier.count }} calls, </span><span>{{ prePaidTier.discount }}% discount</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-if="pr_model.model.type === 'PER_ROW_WITH_PREPAID'">
              Subscription, fixed price per row<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table" v-if="pr_model.model.prePaidTiers.length === 1">
                  <span>{{ pr_model.model.prePaidTiers[0].count }} calls</span><span>{{ pr_model.model.prePaidTiers[0].discount }}% discount</span>
                </div>
                <div v-if="pr_model.model.prePaidTiers.length > 1" class="asset__shopcard__variations__row__discounts__radio_selections">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <label :for="`prepaid_tier_prwp_${i}`">
                      <input v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW_WITH_PREPAID'" type="radio" :value="i" v-model="selectedPrepaidTierIndex" :id="`prepaid_tier_prwp_${i}`">
                      <span>{{ prePaidTier.count }} calls</span><span>{{ prePaidTier.discount }}% discount</span>
                    </label>
                  </div>
                </div>
              </div>
            </div> -->
            <div v-if="pr_model.model.type === 'PER_ROW'">
              Subscription, price per row<br>
              <!-- TODO: to be checked -->
              <div class="asset__shopcard__variations__row__discounts" v-if="pr_model.model.discountRates && pr_model.model.discountRates.length">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }}% discount</span>
                  </div>
                </div>
              </div>
              <div class="asset__shopcard__variations__row__discounts" v-if="pr_model.model.prePaidTiers && pr_model.model.prePaidTiers.length">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table" v-if="pr_model.model.prePaidTiers.length === 1">
                  <span>{{ pr_model.model.prePaidTiers[0].count }} calls</span><span>{{ pr_model.model.prePaidTiers[0].discount }}% discount</span>
                </div>
                <div v-if="pr_model.model.prePaidTiers.length > 1" class="asset__shopcard__variations__row__discounts__radio_selections">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.model.prePaidTiers" :key="i">
                    <label :for="`prepaid_tier_prwp_${i}`">
                      <input v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW'" type="radio" :value="i" v-model="selectedPrepaidTierIndex" :id="`prepaid_tier_prwp_${i}`">
                      <span>{{ prePaidTier.count }} calls</span><span>{{ prePaidTier.discount }}% discount</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div v-if="['SENTINEL_HUB_OPEN_DATA', 'SENTINEL_HUB_COMMERCIAL_DATA'].includes(catalogueItem.type)"><a href="#" @click.prevent="$store.getters.isAuthenticated ? openSelectSentinelHubPlanModal() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">SUBSCRIBE</a></div>
    <div v-else-if="selectedPricingModel && (selectedPricingModel.type == 'FIXED_PER_ROWS' || selectedPricingModel.type == 'FIXED_FOR_POPULATION')" class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? openSelectAreaModal() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">SELECT AREAS</a></div>
    <div v-else class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? addToCart() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">ADD TO CART</a></div>

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
import {
  BasePricingModelCommand,
  EnumPricingModel,
  PerCallQuotationParameters,
  PerRowQuotationParameters,
} from '@/model/pricing-model';
import { CartAddItemCommand } from '@/model/cart';
import store from '@/store';

@Component({
  components: {
    // todo: check if needed
    SelectAreas,
  },
})
export default class ShopCard extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  cartApi: CartApi;

  selectedPricingModel: BasePricingModelCommand | null;

  selectedPrepaidTierIndex: number;

  isSelectAreasModalOn: boolean;

  cartErrors: string;

  constructor() {
    super();

    this.cartApi = new CartApi();

    console.log('shopcard item', this.catalogueItem);

    this.selectedPricingModel = null;
    this.selectedPrepaidTierIndex = 0;
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

    const cartItem:CartAddItemCommand = {
      assetId: this.catalogueItem.id,
      // eslint-disable-next-line
      pricingModelKey: this.selectedPricingModel.key!,
      parameters: {
        type: this.selectedPricingModel.type as EnumPricingModel.UNDEFINED, // TODO: CHECK
      },
    };

    if ([EnumPricingModel.PER_CALL, EnumPricingModel.PER_ROW].includes(this.selectedPricingModel.type)) {
      (cartItem.parameters as PerCallQuotationParameters | PerRowQuotationParameters).prePaidTier = this.selectedPrepaidTierIndex;
    }

    this.cartApi.addItem(cartItem)
      // .then((cartResponse: ServerResponse<Cart>) => {
      .then((cartResponse) => {
        console.log('add item to cart');
        if (cartResponse.success) {
          console.log('successfully added item to cart');
          store.commit('setCartItems', cartResponse.result);
        } else {
          // TODO: Handle error
          console.log('cannot add item to cart!', cartResponse);
          console.log('cart item', cartItem);
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
      PER_CALL: 'PER CALL',
      PER_ROW: 'PER ROW',
      SENTINEL_HUB_IMAGES: 'SENTINEL HUB IMAGES',
      SENTINEL_HUB_SUBSCRIPTION: 'SENTINEL HUB SUBSCRIPTION',
    };
    return labels[t];
  }

  openSelectAreaModal(): void {
    // eslint-disable-next-line
    this.$emit('openSelectAreaModal', this.selectedPricingModel);
    // this.$emit('openSelectAreaModal', this.selectedPricingModel!.key);
  }

  openSelectSentinelHubPlanModal(): void {
    this.$emit('openSelectSentinelHubPlanModal');
  }

  getDomainRestrictions(): string[] {
    if (!this.selectedPricingModel?.domainRestrictions) return [];
    return this.selectedPricingModel?.domainRestrictions as string[];
  }

  getCoverageRestrictions(): string[] {
    const continents = Array.isArray(this.selectedPricingModel?.coverageRestrictionContinents) ? this.selectedPricingModel?.coverageRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(this.selectedPricingModel?.coverageRestrictionCountries) ? this.selectedPricingModel?.coverageRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }

  getConsumerRestrictions(): string[] {
    const continents = Array.isArray(this.selectedPricingModel?.consumerRestrictionContinents) ? this.selectedPricingModel?.consumerRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(this.selectedPricingModel?.consumerRestrictionCountries) ? this.selectedPricingModel?.consumerRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
