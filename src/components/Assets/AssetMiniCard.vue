<template>
  <a :to="`/dashboard/assets/preview/${asset.key}`" class="asset_card asset_card--sm asset_card--nohover">
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
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ asset.version }}</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
          </div>
        </div>
        <div class="asset_card__bottom__right">
          <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </a>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { AssetDraft } from '@/model/draft';

@Component
export default class AssetMiniCard extends Vue {
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
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
