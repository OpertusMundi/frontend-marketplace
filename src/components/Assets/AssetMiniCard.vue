<template>
  <a :to="`/dashboard/assets/preview/${asset.key}`"
     class="asset_card asset_card--sm asset_card--nohover">
    <div class="asset_card__inner" :style="{'--color': getColor()}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <card-icon :asset="asset"></card-icon>
          <span>{{ `${asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type}` }}</span><span>{{ asset.publisher.name }}}</span>
        </div>
        <div class="asset_card__top__right"><span>{{ formatStatus(asset.status) }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ asset.title }}</div>
        <div class="asset_card__price">€</div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{
                asset.version
              }}</span><span><strong>Last updated: </strong>{{
              formatDate(asset.modifiedOn)
            }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right">
          <!-- <span>26</span><img src="@/assets/images/icons/bag-icon.svg" alt=""> -->
        </div>
      </div>
    </div>
  </a>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import { AssetDraft } from '@/model/draft';
import moment from 'moment';
import { EnumAssetType } from '@/model/enum';
import { getAssetCardColor } from '@/helper/cards';

@Component({
  components: { CardIcon },
})
export default class AssetMiniCard extends Vue {
  @Prop({ required: true }) readonly asset!: AssetDraft;

  getColor = (): string => getAssetCardColor(this.asset.type as EnumAssetType);

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  formatDate(date: string): string {
    return moment(date)
      .format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
</style>
