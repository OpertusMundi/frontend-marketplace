<template>
  <div class="assets-select">
    <div class="assets-select__selected">{{ selectedAssetName != '' ? selectedAssetName : 'Select asset' }} <img src="@/assets/images/icons/arrow_down.svg" alt=""></div>
    <ul class="assets-select__items">
      <li><asset-mini-card></asset-mini-card></li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AssetMiniCard from '@/components/Assets/AssetMiniCard.vue';

@Component({
  components: { AssetMiniCard },
})
export default class AssetSelector extends Vue {
  @Prop(Object) readonly assets: any | undefined;

  selectedAssetName: string;

  constructor() {
    super();

    this.selectedAssetName = '';
  }
}
</script>
<style lang="scss">
</style>
