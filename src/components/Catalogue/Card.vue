<template>
  <router-link :to="`/catalogue/${asset.id}`" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>{{asset.type}}</span><span>Environment, Natural resources</span></div>
        <div class="asset_card__top__right"><span>@provider</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price">300€</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>1.2</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
          </div>
        </div>
        <div class="asset_card__bottom__right">
          <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  CatalogueItem,
} from '@/model';

@Component
export default class CatalogueCard extends Vue {
  @Prop({ required: true }) readonly asset!: CatalogueItem;

  getColor(): string {
    let color = '#358F8B';
    if (this.asset.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.type === 'RASTER') {
      color = '#197196';
    }
    return color;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
