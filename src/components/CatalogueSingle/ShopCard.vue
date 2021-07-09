<template>
  <div class="asset__shopcard">
    <!-- <button @click="toggleSelectAreaModal" class="mb-xs-20">show 'select areas' dummy button</button> -->
    <div class="asset__shopcard__variations">
      <!-- <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.id">
        <input type="radio" name="variations" :id="`p_variation_${pr_model.id}`" v-model="selectedPricingModel" :value="pr_model.id">
        <label :for="`p_variation_${pr_model.id}`">{{ pr_model.totalPrice === 0 ? 'FREE' : pr_model.totalPrice + prModelCurrencyFormat(pr_model.currency) }} <span v-if="pr_model.includesUpdates">({{ pr_model.yearsOfUpdates }} year{{pr_model.yearsOfUpdates > 1 ? 's' : ''}} of updates)</span><span v-else>(no updates)</span></label>
      </div> -->

      <div class="asset__shopcard__variations__row" v-for="pr_model in catalogueItem.pricingModels" :key="pr_model.model.key">
        <input type="radio" name="variations" :id="`p_variation_${pr_model.model.key}`" v-model="selectedPricingModel" :value="pr_model.model">
        <label :for="`p_variation_${pr_model.model.key}`">{{ pr_model.model.type }} <span v-if="pr_model.includesUpdates">({{ pr_model.yearsOfUpdates }} year{{pr_model.yearsOfUpdates > 1 ? 's' : ''}} of updates)</span><span v-else>(no updates)</span></label>
      </div>
    </div>
    <ul class="asset__shopcard__priceoptions">
      <li>+ 24% VAT (DUMMY)</li>
      <li>+ 5,99€ delivery to Poland (DUMMY)</li>
    </ul>
    <ul class="asset__shopcard__buyinfo pt-sm-10">
      <li><strong>Asset application restrictions</strong></li>
      <li><strong>Domain: </strong> Geomarketing (DUMMY)</li>
      <li><strong>Coverage: </strong> Albania, Algeria (DUMMY)</li>
    </ul>

    <div v-if="selectedPricingModel && (selectedPricingModel.type == 'FIXED_PER_ROWS' || selectedPricingModel.type == 'FIXED_FOR_POPULATION')" class="asset__shopcard__addtocart"><a href="#" @click.prevent="openSelectAreaModal" class="btn btn--std btn--blue">SELECT AREAS</a></div>
    <div v-else class="asset__shopcard__addtocart"><a href="#" @click.prevent="addToCart" class="btn btn--std btn--blue">ADD TO CART</a></div>

    <transition name="fade" mode="out-in"><div class="asset__shopcard__errors" v-if="cartErrors">{{ cartErrors }}</div></transition>
    <ul class="asset__shopcard__buyinfo">
      <li><strong>Delivery type: </strong> From topio / vendor (DUMMY)</li>
      <li><strong>Delivery format: </strong> digital / physical (DUMMY)</li>
      <li><strong>Payment methods:</strong> <img src="@/assets/images/icons/cc_icon.svg" alt="credit card icon"><img src="@/assets/images/icons/bank_transfer.svg" alt="bank transfer icon"> </li>
    </ul>
    <div class="asset-owner">
      <div class="asset-owner__inner">
        <div class="asset-owner__inner__logo">
          <!-- <img :src="catalogueItem.logoImage" :alt="catalogueItem.publisher.name"> -->
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

    <!-- MODALS -->
    <!-- <select-areas v-if="isSelectAreasModalOn" @close="toggleSelectAreaModal" :assetId="catalogueItem.id" :pricingModelKey="selectedPricingModel.key"></select-areas> -->
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
import { CatalogueItem } from '@/model';
import { BasePricingModelCommand } from '@/model/pricing-model';

@Component({
  components: {
    SelectAreas,
  },
})
export default class ShopCard extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  selectedPricingModel: BasePricingModelCommand | null;

  isSelectAreasModalOn: boolean;

  cartErrors: string;

  constructor() {
    super();

    this.selectedPricingModel = null;
    this.isSelectAreasModalOn = false;
    this.cartErrors = '';
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

    // const cartItem:CartAddItemCommand = {
    //   assetId: this.catalogueItem.id,
    //   pricingModelKey: this.selectedPricingModel.key,
    //   parameters: {},
    // };
    // this.cartApi.addItem(cartItem)
    //   .then((cartResponse: ServerResponse<Cart>) => {
    //     if (cartResponse.success) {
    //       store.commit('setCartItems', cartResponse.result);
    //     } else {
    //       // TODO: Handle error
    //       console.error('cannot add item to cart!');
    //     }
    //   });
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

  openSelectAreaModal(): void {
    // eslint-disable-next-line
    this.$emit('openSelectAreaModal', this.selectedPricingModel!.key);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
