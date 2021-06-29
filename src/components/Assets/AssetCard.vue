<template>
  <!-- <router-link :to="`/dashboard/assets/preview/${asset.key}`" class="asset_card"> -->
  <!-- <router-link :to="asset.status === 'DRAFT' ? `/dashboard/assets/create/${asset.key}` : `/dashboard/assets/preview/${asset.key}`" class="asset_card"> -->
  <router-link :to="getRouterLink(asset.status, asset.key)" class="asset_card">
    <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>{{asset.type}}</span><span>Environment, Natural resources</span></div>
        <div class="asset_card__top__right"><span>{{ formatStatus(asset.status) }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price">300€</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.version }}</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
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
import { AssetDraft } from '@/model/draft';

@Component
export default class AssetCard extends Vue {
  @Prop({ required: true }) readonly asset!: AssetDraft;

  // TODO: api must return asset type
  getColor(): string {
    let color = '#358F8B';
    if (this.asset.command && this.asset.command.type === 'VECTOR') {
      color = '#358F8B';
    } else if (this.asset.command && this.asset.command.type === 'SERVICE') {
      color = '#6F43B5';
    } else if (this.asset.command && this.asset.command.type === 'RASTER') {
      color = '#197196';
    }
    return color;
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  getRouterLink(assetStatus: string, assetKey: string): string {
    const links = {
      DRAFT: `/dashboard/assets/create/${assetKey}`,
      PENDING_PROVIDER_REVIEW: `/review/${assetKey}`,
    };
    return links[assetStatus] ? links[assetStatus] : `/catalogue/${assetKey}`;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
