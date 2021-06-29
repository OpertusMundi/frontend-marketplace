<template>
  <div class="asset__otheroptions">
    <h5>Asset also available as:</h5>
    <a href="#" class="asset_card asset_card--sm">
      <div class="asset_card__view"><span>VIEW</span></div>
        <div class="asset_card__inner">
        <div class="asset_card__top">
          <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>Vector Dataset</span></div>
          <div class="asset_card__top__right"><span>@provider</span></div>
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">Lakes of Greece</div>
          <div class="asset_card__price">300€</div>
        </div>
        <div class="asset_card__bottom">
          <div class="asset_card__bottom__left">
            <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          </div>
        </div>
      </div>
    </a>
    <a href="#" class="asset_card asset_card--sm">
      <div class="asset_card__view"><span>VIEW</span></div>
        <div class="asset_card__inner">
        <div class="asset_card__top">
          <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>Vector Dataset</span></div>
          <div class="asset_card__top__right"><span>@provider</span></div>
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">Lakes of Greece lsadfasdjhf lasdkjfh </div>
          <div class="asset_card__price">300€</div>
        </div>
        <div class="asset_card__bottom">
          <div class="asset_card__bottom__left">
            <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          </div>
        </div>
      </div>
    </a>
    <a href="#" class="asset_card asset_card--sm">
      <div class="asset_card__view"><span>VIEW</span></div>
        <div class="asset_card__inner">
        <div class="asset_card__top">
          <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>Vector Dataset</span></div>
          <div class="asset_card__top__right"><span>@provider</span></div>
        </div>
        <div class="asset_card__center">
          <div class="asset_card__title">Lakes of Greece lsadfasdjhf lasdkjfh </div>
          <div class="asset_card__price">300€</div>
        </div>
        <div class="asset_card__bottom">
          <div class="asset_card__bottom__left">
            <div class="rating rating--dark"><span class="active">★</span><span class="active">★</span><span class="active">★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class OtherAvailableOptions extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
