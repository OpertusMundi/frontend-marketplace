<template>
  <!-- <router-link :to="`/dashboard/assets/preview/${asset.key}`" class="asset_card"> -->
  <!-- <router-link :to="asset.status === 'DRAFT' ? `/dashboard/assets/create/${asset.key}` : `/dashboard/assets/preview/${asset.key}`" class="asset_card"> -->
  <router-link :to="`catalogue/${ item.asset.id }`" class="asset_card asset_card--purchase">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <card-icon :asset="item.asset"></card-icon>
          <span class="asset_card__type">{{ item.asset.type === 'BUNDLE' ? 'COLLECTION' : item.asset.type }}</span>
        </div>
        <!-- <div class="asset_card__top__right"><span>asset status</span></div> -->
      </div>
      <div class="asset_card__center asset_card__center--short">
        <div class="asset_card__title">{{ item.asset.title }}</div>
        <!-- <div v-if="item.pricingModel.model.type === 'PER_CALL_WITH_BLOCK_RATE' || item.pricingModel.model.type === 'PER_CALL_WITH_BLOCK_RATE'" class="asset_card__price"></div> -->
        <div class="asset_card__price">{{ item.pricingModel.quotation ? `${item.pricingModel.quotation.totalPrice}€` : '' }}</div>
        <!-- <div class="asset_card__top__right"><span>PURCHASE STATUS</span></div> -->
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <!-- <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>1.0.1</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
          </div> -->
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ item.asset.version }}</span><span><strong>Supplier: </strong>{{ item.asset.publisherName }}</span>
          </div>
        </div>
        <!-- <div class="asset_card__bottom__right">
          <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
          <div class="asset_card__price">PRICE</div>
        </div> -->
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import { CartItem } from '@/model/cart';
import { EnumAssetType } from '@/model/enum';
import { getAssetCardColor } from '@/helper/cards';
// import moment from 'moment';

@Component({
  components: { CardIcon },
})
export default class CartCard extends Vue {
  @Prop({ required: true }) readonly item!: CartItem;

  getColor = (): string => getAssetCardColor(this.item.asset.type as EnumAssetType);

  // formatDate(date: string): string {
  //   return moment(date).format('MMM Do YY');
  // }
}
</script>
<style lang="scss">
  // @import "@/assets/styles/_purchases.scss";
  @import "@/assets/styles/_assets.scss";
</style>
