<template>
  <div class="asset__shopcard">
    <div class="asset__shopcard__variations">

      <div class="asset__shopcard__price">
        <!-- FREE -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'FREE'" class="asset__shopcard__price">
          <span>FREE</span>
        </template>

        <!-- FIXED -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED'">
          <span class="asset__shopcard__price__text--main">{{ selectedPricingModel.totalPriceExcludingTax }}</span>
          <span class="asset__shopcard__price__text--top">€</span>
        </template>

        <!-- FIXED PER ROWS -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_PER_ROWS'">
          <span class="asset__shopcard__price__text--main">{{ selectedPricingModel.price }}</span>
          <span class="asset__shopcard__price__text--top">€</span>
        </template>

        <!-- FIXED FOR POPULATION -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_FOR_POPULATION'">
          <span class="asset__shopcard__price__text--main">{{ selectedPricingModel.price }}</span>
          <span class="asset__shopcard__price__text--top">€</span>
        </template>

        <!-- PER CALL -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL'">
          <span class="asset__shopcard__price__text--main">{{ selectedPricingModel.price }}</span>
          <span class="asset__shopcard__price__text--top">€</span>
        </template>

        <!-- PER ROW -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW'">
          <span class="asset__shopcard__price__text--main">{{ selectedPricingModel.price }}</span>
          <span class="asset__shopcard__price__text--top">€</span>
        </template>

        <!-- SH IMAGES -->
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'SENTINEL_HUB_IMAGES'">-</span>

        <!-- SH SUBSCRIPTION -->
        <template v-if="selectedPricingModel && selectedPricingModel.type === 'SENTINEL_HUB_SUBSCRIPTION'">
          <span class="asset__shopcard__price__text--bottom">from</span>
          <span class="asset__shopcard__price__text--main">25</span>
          <span class="asset__shopcard__price__text--top">€/month</span>
          <!-- <div class="mb-xs-20"><span></span>monthly<span></span><span>{{ selectedPricingModel.monthlyPriceExcludingTax }}</span><span>€</span></div> -->
          <!-- <div class="mb-xs-20"><span></span>annually<span></span><span>{{ selectedPricingModel.annualPriceExcludingTax }}</span><span>€</span></div> -->
        </template>
      </div>

      <span class="asset__shopcard__vat" v-if="selectedPricingModel.type !== 'SENTINEL_HUB_SUBSCRIPTION'">+ VAT 24%</span>

      <div class="asset__shopcard__variations__container mt-xs-20" v-if="((catalogueItem.pricingModels.length !== 1 || catalogueItem.pricingModels[0].model.type !== 'FREE') && catalogueItem.type !== 'SENTINEL_HUB_OPEN_DATA')">
        <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.model.key">
          <input :hidden="catalogueItem.pricingModels.length === 1" type="radio" name="variations" :id="`p_variation_${pr_model.model.key}`" v-model="selectedPricingModel" :value="pr_model.model">
          <label :for="`p_variation_${pr_model.model.key}`">{{ formatPricingModelType(pr_model.model.type) }}
            <span v-if="pr_model.model.type === 'FIXED' && pr_model.model.yearsOfUpdates">+ {{ pr_model.model.yearsOfUpdates }} {{ pr_model.model.yearsOfUpdates > 1 ? 'years' : 'year' }} of updates</span>
            <div v-if="pr_model.model.type === 'FIXED_PER_ROWS'">
              <!-- Price per 1,000 rows<br> -->
              <strong>Minimum rows:</strong> {{ pr_model.model.minRows ? pr_model.model.minRows : 'not specified' }}
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
              <!-- Price per 10,000 people<br> -->
              <strong>Minimum population percentage:</strong> {{ pr_model.model.minPercent ? pr_model.model.minPercent : 'not specified' }} %
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="pr_model.model.type === 'PER_CALL'">
              <!-- Subscription, price per call<br> -->
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

            <div v-if="pr_model.model.type === 'PER_ROW'">
              <!-- Subscription, price per row<br> -->
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

    <div v-if="!catalogueItem.availableToPurchase" class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? addToWishlist() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">ADD TO WISHLIST</a></div>
    <div v-else-if="['SENTINEL_HUB_OPEN_DATA', 'SENTINEL_HUB_COMMERCIAL_DATA'].includes(catalogueItem.type)" class="d-flex justify-content-center"><a href="#" @click.prevent="$store.getters.isAuthenticated ? openSelectSentinelHubPlanModal() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue mt-xs-10 mb-xs-10" style="display: block; width: 100%; text-align: center;">SUBSCRIBE</a></div>
    <div v-else-if="selectedPricingModel && (selectedPricingModel.type == 'FIXED_PER_ROWS' || selectedPricingModel.type == 'FIXED_FOR_POPULATION')" class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? openSelectAreaModal() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">SELECT AREAS</a></div>
    <div v-else class="asset__shopcard__addtocart"><a href="#" @click.prevent="$store.getters.isAuthenticated ? addToCart() : $emit('showModalLoginToAddToCart')" class="btn btn--std btn--blue">ADD TO CART</a></div>

    <ul v-if="selectedPricingModel && catalogueItem.type !== 'SENTINEL_HUB_OPEN_DATA'" class="asset__shopcard__buyinfo pt-sm-10">
      <!-- <li><strong>Asset application restrictions</strong></li> -->
      <li>
        <strong>Use restricted for: <tooltip :text="'In which application domains can this asset be used?'"></tooltip> </strong>
        <span v-if="getDomainRestrictions().length">
          <span v-for="(domain, i) in getDomainRestrictions()" :key="domain">{{ domain }}<span v-if="i !== getDomainRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Any domain</span>
      </li>
      <li>
        <strong>Coverage: <tooltip :text="'In which areas of the world can this asset be used?'"></tooltip> </strong>
        <span v-if="getCoverageRestrictions().length">
          <span v-for="(area, i) in getCoverageRestrictions()" :key="area">{{ area }}<span v-if="i !== getCoverageRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Worldwide</span>
      </li>
      <li>
        <strong>Consumers: <tooltip :text="'Sales restricted to consumers from specific areas of the world.'"></tooltip> </strong>
        <span v-if="getConsumerRestrictions().length">
          <span v-for="(area, i) in getConsumerRestrictions()" :key="area">{{ area }}<span v-if="i !== getConsumerRestrictions().length - 1">, </span></span>
        </span>
        <span v-else>Worldwide</span>
      </li>

      <hr><hr>

    <!-- <transition name="fade" mode="out-in"><div class="asset__shopcard__errors" v-if="cartErrors">{{ cartErrors }}</div></transition> -->
      <li>
        <strong>Delivery type: </strong>
        <span> {{ labelize(catalogueItem.deliveryMethod) }}</span>
      </li>

      <li v-if="catalogueItem.deliveryMethodOptions && catalogueItem.deliveryMethodOptions.mediaType">
        <strong>Media type: </strong>
        <span>{{ catalogueItem.deliveryMethodOptions.mediaType }}</span>
      </li>
      <li v-if="catalogueItem.deliveryMethodOptions && catalogueItem.deliveryMethodOptions.numberOfItems">
        <strong>Number of items: </strong>
        <span>{{ catalogueItem.deliveryMethodOptions.numberOfItems }}</span>
      </li>
      <li v-if="catalogueItem.deliveryMethodOptions && catalogueItem.deliveryMethodOptions.notes">
        <strong>Notes: </strong>
        <span>{{ catalogueItem.deliveryMethodOptions.notes }}</span>
      </li>

      <li>
        <strong>Delivered by: </strong>
        <span>{{ catalogueItem.publisher.name }}</span>
      </li>
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
import Tooltip from '@/components/Tooltip.vue';
import CartApi from '@/service/cart';
import FavoriteApi from '@/service/favorite';
import { CatalogueItem } from '@/model';
import {
  BasePricingModelCommand,
  EnumPricingModel,
  PerCallQuotationParameters,
  PerRowQuotationParameters,
} from '@/model/pricing-model';
import { CartAddItemCommand } from '@/model/cart';
import { EnumFavoriteAction, EnumFavoriteType } from '@/model/favorite';
import labelize from '@/helper/labels';
import store from '@/store';

@Component({
  components: {
    // todo: check if needed
    SelectAreas,
    Tooltip,
  },
})
export default class ShopCard extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  cartApi: CartApi;

  favoriteApi: FavoriteApi;

  selectedPricingModel: BasePricingModelCommand | null;

  selectedPrepaidTierIndex: number;

  isSelectAreasModalOn: boolean;

  cartErrors: string;

  labelize: typeof labelize;

  constructor() {
    super();

    this.cartApi = new CartApi();
    this.favoriteApi = new FavoriteApi();

    console.log('shopcard item', this.catalogueItem);

    this.selectedPricingModel = null;
    this.selectedPrepaidTierIndex = 0;
    this.isSelectAreasModalOn = false;
    this.cartErrors = '';
    this.selectedPricingModel = this.catalogueItem.pricingModels[0].model;
    this.labelize = labelize;
  }

  @Watch('selectedPricingModel')
  selectedPricingModelChanged(newVal: string):void {
    if (newVal !== '') {
      this.cartErrors = '';
    }
  }

  addToWishlist(): void {
    store.commit('setLoading', true);

    this.favoriteApi.add({
      pid: this.catalogueItem.id,
      action: EnumFavoriteAction.PURCHASE,
      type: EnumFavoriteType.ASSET,
    }).then(() => {
      store.commit('setLoading', false);
      this.$router.push('/dashboard/favorites');
    });
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
      FIXED_PER_ROWS: 'Price per 1,000 rows',
      FIXED_FOR_POPULATION: 'Price per 10,000 people',
      PER_CALL: 'Subscription, price per call',
      PER_ROW: 'Subscription, price per row',
      SENTINEL_HUB_IMAGES: 'Sentinel Hub Images',
      SENTINEL_HUB_SUBSCRIPTION: 'Sentinel Hub Subscription',
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

  .asset__shopcard {
    ul {
      display: grid;
      grid-template-columns: min-content 1fr;

      li {
        display: contents;

        strong {
          white-space: nowrap;
        }

        > span:nth-child(2) {
          margin-left: 10px;
        }
      }

      hr {
        width: 100%;
      }
    }

    &__variations {
      text-align: center;

      &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    &__vat {
      display: block;
      margin: 1.3em 0;
      font-size: em(12);
      color: $labelColor;
    }

    // &__price {
    //   width: 100%;

    //   > span {
    //     display: flex;
    //     justify-content: center;
    //     width: 100%;

    //     > span {
    //       font-weight: 500 !important;
    //     }
    //   }

    //   span:nth-child(2) {
    //     align-self: flex-start;
    //     margin-left: 0 !important;
    //   }
    // }
  }
</style>
