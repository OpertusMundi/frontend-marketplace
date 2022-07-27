<template>
  <div class="asset_card asset_card--sm asset_card--nohover">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left"><span>Segment: </span>
        </div>
        <div class="asset_card__top__right"></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ formatStatus(segment)}}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { EnumTopicCategory } from '@/model/catalogue';

@Component
export default class AssetSegmentCard extends Vue {
  @Prop({ required: true }) readonly segment!: EnumTopicCategory;

  // TODO: api must return asset type
  getColor(): string {
    // color = '#358F8B';
    // color = '#6F43B5';
    const color = '#197196';
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
