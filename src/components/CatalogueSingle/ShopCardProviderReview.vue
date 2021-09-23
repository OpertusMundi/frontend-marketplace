<template>
  <div class="asset__shopcard">
    <div class="asset__shopcard__variations">
      <div class="asset__shopcard__price">
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FREE'" class="asset__shopcard__price"><span>FREE</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED'"><span>{{ selectedPricingModel.totalPriceExcludingTax }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_PER_ROWS'">{{ selectedPricingModel.price }} <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'FIXED_FOR_POPULATION'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL_WITH_PREPAID'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_CALL_WITH_BLOCK_RATE'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW_WITH_PREPAID'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
        <span v-if="selectedPricingModel && selectedPricingModel.type === 'PER_ROW_WITH_BLOCK_RATE'"><span>{{ selectedPricingModel.price }}</span> <span>€</span></span>
      </div>

      <!-- <div v-if="catalogueItem.pricingModels.length === 1" class="asset__shopcard__variations__row mt-xs-20">
        <label v-if="catalogueItem.pricingModels[0].type !== 'FREE'">{{ catalogueItem.pricingModels[0].type }}</label>
      </div>
      <div v-else class="mt-xs-20">
        <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.key">
          <input type="radio" name="variations" :id="`p_variation_${pr_model.key}`" v-model="selectedPricingModel" :value="pr_model">
          <label :for="`p_variation_${pr_model.key}`">{{ pr_model.type }} <span v-if="pr_model.includesUpdates">({{ pr_model.yearsOfUpdates }} year{{pr_model.yearsOfUpdates > 1 ? 's' : ''}} of updates)</span><span v-else>(no updates)</span></label>
        </div>
      </div> -->

      <div class="mt-xs-20" v-if="catalogueItem.pricingModels.length !== 1 || catalogueItem.pricingModels[0].type !== 'FREE'">
        <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.key">
          <input :hidden="catalogueItem.pricingModels.length === 1" type="radio" name="variations" :id="`p_variation_${pr_model.key}`" v-model="selectedPricingModel" :value="pr_model">
          <label :for="`p_variation_${pr_model.key}`">{{ formatPricingModelType(pr_model.type) }}
            <span v-if="pr_model.type === 'FIXED' && pr_model.yearsOfUpdates">+ {{ pr_model.yearsOfUpdates }} {{ pr_model.yearsOfUpdates > 1 ? 'years' : 'year' }} of updates</span>
            <div v-if="pr_model.type === 'FIXED_PER_ROWS'">
              Price per 1,000 rows<br><strong>Minimum rows:</strong> {{ pr_model.minRows ? pr_model.minRows : 'not specified' }}
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.type === 'FIXED_FOR_POPULATION'">
              Price per 10,000 people<br><strong>Minimum population percentage:</strong> {{ pr_model.minPercent ? pr_model.minPercent : 'not specified' }} %
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.type === 'PER_CALL_WITH_PREPAID'">
              Subscription, fixed price per call<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.prePaidTiers" :key="i">
                    <span>{{ prePaidTier.count }} rows</span><span>{{ prePaidTier.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.type === 'PER_CALL_WITH_BLOCK_RATE'">
              Subscription, blocking rates per call<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.type === 'PER_ROW_WITH_PREPAID'">
              Subscription, fixed price per row<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Prepaid Tiers:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(prePaidTier, i) in pr_model.prePaidTiers" :key="i">
                    <span>{{ prePaidTier.count }} rows</span><span>{{ prePaidTier.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pr_model.type === 'PER_ROW_WITH_BLOCK_RATE'">
              Subscription, blocking rates per row<br>
              <div class="asset__shopcard__variations__row__discounts">
                <div><strong>Discounts:</strong></div>
                <div class="asset__shopcard__variations__row__discounts__table">
                  <div class="grid-ignore-wrapper" v-for="(discount, i) in pr_model.discountRates" :key="i">
                    <span>{{ discount.count }} rows</span><span>{{ discount.discount }} %</span>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

    </div>

    <hr>

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

    <!-- <hr>

    <transition name="fade" mode="out-in"><div class="asset__shopcard__errors" v-if="cartErrors">{{ cartErrors }}</div></transition>
    <ul class="asset__shopcard__buyinfo">
      <li><strong>Delivery type: </strong> {{ catalogueItem.deliveryMethod }}</li>
      <li><strong>Delivered from: </strong>{{ catalogueItem.publisher.name }}</li>
    </ul>
    <div class="asset-owner">
      <div class="asset-owner__inner">
        <div class="asset-owner__inner__logo" v-if="catalogueItem.publisher.logoImageMimeType && catalogueItem.publisher.logoImage">
          <img :src="'data:' + catalogueItem.publisher.logoImageMimeType + ';base64, ' + catalogueItem.publisher.logoImage" :alt="`image for ${catalogueItem.publisher.name}`">
        </div>
        <div class="asset-owner__inner__info">
          <div class="asset-owner__inner__info__name">
            <a href="#">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 33 31" style="enable-background:new 0 0 33 31;" xml:space="preserve">
                <path style="fill:#FFFFFF;"
                d="M16.5,30.7l-3.2-2.9C5.6,20.8,0.4,16.1,0.4,9.9c0-5.2,4.1-9.3,9.3-9.3c2.5,0,4.9,1,6.8,2.7c1.8-1.7,4.2-2.7,6.8-2.7c5.2,0,9.3,4.1,9.3,9.3c0,6.1-5.1,10.8-12.9,18L16.5,30.7z M9.7,2.6c-4.1,0-7.3,3.2-7.3,7.3c0,5.2,4.9,9.7,12.2,16.5l1.8,1.6l1.8-1.6c7.4-6.8,12.2-11.2,12.2-16.5c0-4.1-3.2-7.3-7.3-7.3c-2.3,0-4.5,1.1-6,2.8l-0.8,0.9l-0.8-0.9C14.2,3.7,12,2.6,9.7,2.6z"/>
                <path style="fill:#FFFFFF;" d="M16.5,29.4l-2.2-2C6.6,20.3,1.4,15.7,1.4,9.9c0-4.7,3.6-8.3,8.3-8.3c2.6,0,5.1,1.2,6.8,3.2c1.7-2,4.1-3.2,6.8-3.2c4.7,0,8.3,3.6,8.3,8.3c0,5.8-5.1,10.4-12.9,17.5L16.5,29.4z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  // Watch,
} from 'vue-property-decorator';
import SelectAreas from '@/components/CatalogueSingle/SelectAreas.vue';
import CartApi from '@/service/cart';
import { CatalogueItemCommand } from '@/model';
import { BasePricingModelCommand } from '@/model/pricing-model';
import store from '@/store';

@Component({
  components: {
    SelectAreas,
  },
})
export default class ShopCardProviderReview extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItemCommand;

  cartApi: CartApi;

  selectedPricingModel: BasePricingModelCommand | null;

  cartErrors: string;

  constructor() {
    super();

    this.cartApi = new CartApi();

    console.log('shopcard item', this.catalogueItem);

    this.selectedPricingModel = null;
    this.cartErrors = '';
    const [selectedPricingModel] = this.catalogueItem.pricingModels;
    this.selectedPricingModel = selectedPricingModel;
  }

  // @Watch('selectedPricingModel')
  // selectedPricingModelChanged(newVal: string):void {
  //   if (newVal !== '') {
  //     this.cartErrors = '';
  //   }
  // }

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

  getDomainRestrictions(): string[] {
    if (!this.selectedPricingModel?.domainRestrictions) return [];
    return this.selectedPricingModel?.domainRestrictions as string[];
  }

  getCoverageRestrictions(): string[] {
    const continents = this.selectedPricingModel?.coverageRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());
    const countries = this.selectedPricingModel?.coverageRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[];

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }

  getConsumerRestrictions(): string[] {
    const continents = this.selectedPricingModel?.consumerRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());
    const countries = this.selectedPricingModel?.consumerRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[];

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
