<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__left">
        <h1>Favorites</h1>
      </div>
    </div>

    <div class="collection">
      <div class="collection__menu">
        <ul>
          <li :class="{'active': selectedTab === 'ASSET'}"><a href="#" @click.prevent="selectTab('ASSET')">Assets</a></li>
          <li :class="{'active': selectedTab === 'PROVIDER'}"><a href="#" @click.prevent="selectTab('PROVIDER')">Vendors</a></li>
        </ul>
      </div>

      <!-- ASSETS -->
      <div v-if="selectedTab === 'ASSET'">
        <div class="collection__total"><p>{{ assetsPagination.itemsTotal }} {{ assetsPagination.itemsTotal === 1? 'asset' : 'assets' }}</p></div>

        <asset-favorite-card v-for="asset in assets" :key="asset.key" :asset="asset" @reload="onTabSelection('ASSET')"></asset-favorite-card>

        <div class="collection__main">
          <pagination :currentPage="assetsPagination.currentPage" :itemsPerPage="assetsPagination.itemsPerPage" :itemsTotal="assetsPagination.itemsTotal" @pageSelection="onSelectPage('ASSET', $event)" class="mt-xs-30"></pagination>
        </div>
      </div>

      <!-- VENDORS -->
      <div v-if="selectedTab === 'PROVIDER'">
        <div class="collection__total"><p>{{ providersPagination.itemsTotal }} {{ providersPagination.itemsTotal === 1 ? 'vendor' : 'vendors' }}</p></div>

        <vendor-favorite-card v-for="provider in providers" :key="provider.key" :provider="provider" @reload="onTabSelection('PROVIDER')"></vendor-favorite-card>

        <div class="collection__main">
          <pagination :currentPage="providersPagination.currentPage" :itemsPerPage="providersPagination.itemsPerPage" :itemsTotal="providersPagination.itemsTotal" @pageSelection="onSelectPage('PROVIDER', $event)" class="mt-xs-30"></pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator';
import AssetFavoriteCard from '@/components/Favorites/AssetFavoriteCard.vue';
import VendorFavoriteCard from '@/components/Favorites/VendorFavoriteCard.vue';
import Pagination from '@/components/Pagination.vue';
import {
  EnumFavoriteSortField,
  EnumFavoriteType,
  FavoriteAsset,
  FavoriteProvider,
} from '@/model/favorite';
import FavoriteApi from '@/service/favorite';
import { Sorting } from '@/model/request';
import store from '@/store';

interface PaginationData {
  currentPage: number,
  itemsPerPage: number,
  itemsTotal: number,
}

@Component({
  components: { AssetFavoriteCard, VendorFavoriteCard, Pagination },
})
export default class DashboardFavorites extends Vue {
  favoriteApi: FavoriteApi;

  selectedTab: EnumFavoriteType;

  assets: FavoriteAsset[];

  providers: FavoriteProvider[];

  assetsPagination: PaginationData = {
    currentPage: 0,
    itemsPerPage: 10,
    itemsTotal: 0,
  };

  providersPagination: PaginationData = {
    currentPage: 0,
    itemsPerPage: 10,
    itemsTotal: 0,
  }

  constructor() {
    super();

    this.favoriteApi = new FavoriteApi();

    this.selectedTab = EnumFavoriteType.ASSET;

    this.assets = [];

    this.providers = [];
  }

  @Watch('selectedTab', { immediate: true })
  onTabSelection(selectedTab: EnumFavoriteType): void {
    switch (selectedTab) {
      case EnumFavoriteType.ASSET: {
        this.loadFavorites(selectedTab, this.assetsPagination.currentPage, this.assetsPagination.itemsPerPage);
        break;
      }
      case EnumFavoriteType.PROVIDER: {
        this.loadFavorites(selectedTab, this.providersPagination.currentPage, this.providersPagination.itemsPerPage);
        break;
      }
      default:
    }
  }

  selectTab(tab: EnumFavoriteType): void {
    this.selectedTab = tab;
  }

  onSelectPage(tab: EnumFavoriteType, page: number): void {
    const itemsPerPage = {
      ASSET: this.assetsPagination.itemsPerPage,
      PROVIDER: this.providersPagination.itemsPerPage,
    };
    this.loadFavorites(tab, page, itemsPerPage[tab]);
  }

  loadFavorites(type: EnumFavoriteType, page: number, size: number): void {
    store.commit('setLoading', true);

    const sorting: Sorting<EnumFavoriteSortField> = { id: EnumFavoriteSortField.TITLE, order: 'ASC' };

    this.favoriteApi.find(type, page, size, sorting).then((response) => {
      const { data } = response;

      // check if should navigate to previous page due to item removal
      if (data.result.items.length === 0 && data.result.pageRequest.page > 0) {
        this.loadFavorites(type, page - 1, size);
        return;
      }

      switch (type) {
        case EnumFavoriteType.ASSET: {
          this.assets = data.result.items as FavoriteAsset[];
          Vue.set(this.assetsPagination, 'currentPage', data.result.pageRequest.page);
          Vue.set(this.assetsPagination, 'itemsTotal', data.result.count);
          break;
        }
        case EnumFavoriteType.PROVIDER: {
          this.providers = data.result.items as FavoriteProvider[];
          Vue.set(this.providersPagination, 'currentPage', data.result.pageRequest.page);
          Vue.set(this.providersPagination, 'itemsTotal', data.result.count);
          break;
        }
        default:
      }
      store.commit('setLoading', false);
    }).catch((err) => {
      console.log('error fetching favorite assets', err);
      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_collection.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
