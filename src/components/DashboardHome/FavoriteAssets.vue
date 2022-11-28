<template>
  <div>
    <p v-if="assets && !assets.length">No favorites yet</p>
    <template v-else>
      <asset-favorite-card v-for="asset in assets" :key="asset.key" :asset="asset" :hideFavoriteToggleButton="true"></asset-favorite-card>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AssetFavoriteCard from '@/components/Favorites/AssetFavoriteCard.vue';
import FavoriteApi from '@/service/favorite';
import { Sorting } from '@/model/request';
import { EnumFavoriteSortField, EnumFavoriteType, FavoriteAsset } from '@/model/favorite';

@Component({
  components: { AssetFavoriteCard },
})
export default class DashboardHomeFavoriteAssets extends Vue {
  favoriteApi = new FavoriteApi();

  assets: FavoriteAsset[] | null = null;

  created(): void {
    this.loadFavorites(0, 3);
  }

  loadFavorites(page: number, size: number): void {
    const sorting: Sorting<EnumFavoriteSortField> = { id: EnumFavoriteSortField.CREATED_ON, order: 'DESC' };

    this.favoriteApi.find(EnumFavoriteType.ASSET, page, size, sorting).then((response) => {
      const { data } = response;

      this.assets = data.result.items as FavoriteAsset[];
    }).catch((err) => {
      console.log('error fetching favorite assets', err);
    });
  }
}
</script>

<style lang="scss">
</style>
