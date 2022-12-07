<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">

      <div class="row">
        <div class="col-md-7">
          <div class="dashboard__form__step__title overflow-y">
            <h3>Select Assets</h3>
            <p>Select two or more from your published assets to use for the collection</p>
            <hr>
            <div class="asset_search asset_search--sm asset_search--grey-border mt-xs-20">
              <div class="asset_search__upper asset_search__upper--no-z-index asset_search__upper--no-functional-search-button">
                <input type="text" name="" id="" placeholder="Search in your assets" class="asset_search__upper__input" @input="onPublishedAssetsSearchTextChange($event.target.value)" />
                <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt="" /></div>
              </div>
            </div>

            <div class="filters filters--no-left-spacing mt-xs-20">
              <div class="filters__block">
                <div class="filters__block__select">
                  <label for="filter">TYPE </label>
                  <select v-model="publishedAssetsTypeFilter" name="filter">
                    <option v-for="filterOption in publishedAssetsTypeFilterOptions" :key="filterOption.value" :value="filterOption.value">{{ filterOption.label }}</option>
                  </select>
                </div>
                <div class="filters__block__select">
                  <label for="filter">&uarr;&darr;</label>
                  <select v-model="publishedAssetsOrder" name="filter">
                    <option v-for="filterOption in publishedAssetsOrderOptions" :key="filterOption.label" :value="filterOption.label">{{ filterOption.label }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-for="asset in publishedAssets" :key="asset.id">
              <asset-api-details-card @click.native="onSelectPublishedAsset(asset)" :selected="assetLocal.resources.map(x => x.id).includes(asset.id)" :asset="asset"></asset-api-details-card>
            </div>
            <pagination class="mt-xs-20" :currentPage="publishedAssetsPaginationData.currentPage" :itemsPerPage="publishedAssetsPaginationData.itemsPerPage" :itemsTotal="publishedAssetsPaginationData.itemsTotal" @pageSelection="onPageSelect"></pagination>

          </div>

        </div>

        <div class="col-md-5">
          <div class="dashboard__form__step__title">
            <p>Selected</p>
            <div v-for="asset in assetLocal.resources" :key="asset.id">
              <a target="_blank" :href="`/catalogue/${asset.id}`">
                <asset-api-details-card :selected="false" :asset="asset"></asset-api-details-card>
              </a>
            </div>

            <!-- a dummy hidden input to be cathced by validation observer if no pricing model is selected -->
            <div v-if="assetLocal.resources.length < 2">
              <validation-provider v-slot="{ errors }" name="pricing models" rules="required">
                <div class="form-group mt-xs-20">
                  <input type="text" hidden>
                  <div class="errors" v-if="errors.length"><span class="mt-xs-20">Select at least 2 assets</span></div>
                </div>
              </validation-provider>
            </div>
          </div>
        </div>
      </div>

    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { Debounce } from 'vue-debounce-decorator';
import AssetApiDetailsCard from '@/components/Assets/AssetApiDetailsCard.vue';
import Pagination from '@/components/Pagination.vue';
import ProviderAssetsApi from '@/service/provider-assets';
import { EnumAssetType } from '@/model/enum';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { Order } from '@/model/request';
import { CatalogueItem, CatalogueItemCommand } from '@/model';
import store from '@/store';

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    AssetApiDetailsCard,
    Pagination,
  },
})
export default class SelectedAssets extends Vue {
  @Prop({ required: true }) asset!: CatalogueItemCommand;

  assetLocal = { ...this.asset };

  providerAssetsApi = new ProviderAssetsApi();

  publishedAssets: CatalogueItem[] = [];

  publishedAssetsSearchText = '';

  publishedAssetsTypeFilter: EnumAssetType | null = null;

  publishedAssetsTypeFilterOptions: { value: EnumAssetType | null, label: string }[] = [
    { value: null, label: 'ALL' },
    { value: EnumAssetType.VECTOR, label: 'VECTOR' },
    { value: EnumAssetType.RASTER, label: 'RASTER' },
    { value: EnumAssetType.BUNDLE, label: 'BUNDLE' },
  ];

  publishedAssetsOrder = 'NEWEST';

  publishedAssetsOrderOptions: { label: string, orderBy: EnumProviderAssetSortField, orderType: Order }[] = [
    { label: 'NEWEST', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, orderType: 'DESC' },
    { label: 'OLDEST', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, orderType: 'ASC' },
    { label: 'TITLE ASCENDING', orderBy: EnumProviderAssetSortField.TITLE, orderType: 'ASC' },
    { label: 'TITLE DESCENDING', orderBy: EnumProviderAssetSortField.TITLE, orderType: 'DESC' },
    { label: 'TYPE ASCENDING', orderBy: EnumProviderAssetSortField.TYPE, orderType: 'ASC' },
    { label: 'TYPE DESCENDING', orderBy: EnumProviderAssetSortField.TYPE, orderType: 'DESC' },
  ];

  publishedAssetsPaginationData: {
    currentPage: number,
    itemsPerPage: number,
    itemsTotal: number,
  } = {
    currentPage: 0,
    itemsPerPage: 10,
    itemsTotal: 0,
  };

  created(): void {
    this.loadPublishedAssets();
  }

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    this.$emit('update:asset', asset);
  }

  @Watch('publishedAssetsSearchText')
  onDebouncedSearch(): void {
    this.loadPublishedAssets();
  }

  @Watch('publishedAssetsTypeFilter')
  onPublishedAssetsTypeFilterChange(): void {
    this.loadPublishedAssets();
  }

  @Watch('publishedAssetsOrder')
  onPublishedAssetsOrderChange(): void {
    this.loadPublishedAssets();
  }

  @Debounce(400)
  onPublishedAssetsSearchTextChange(searchText: string): void {
    this.publishedAssetsSearchText = searchText;
  }

  onPageSelect(page: number): void {
    const elem = document.querySelector('.overflow-y');

    if (!elem) return;
    elem.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.loadPublishedAssets(page);
  }

  loadPublishedAssets(page = 0): void {
    store.commit('setLoading', true);

    const query: ProviderDraftQuery = {
      q: this.publishedAssetsSearchText,
      type: this.publishedAssetsTypeFilter || [EnumAssetType.BUNDLE, EnumAssetType.VECTOR, EnumAssetType.RASTER],
      // ...(this.publishedAssetsTypeFilter && { type: this.publishedAssetsTypeFilter }),
      pageRequest: { page, size: this.publishedAssetsPaginationData.itemsPerPage },
      sorting: {
        id: this.publishedAssetsOrderOptions.find((x) => x.label === this.publishedAssetsOrder)?.orderBy || '' as EnumProviderAssetSortField,
        order: this.publishedAssetsOrderOptions.find((x) => x.label === this.publishedAssetsOrder)?.orderType || '' as Order,
      },
    };

    this.providerAssetsApi
      .find(query)
      .then((response) => {
        if (response.success) {
          this.publishedAssets = response.result.items;

          this.publishedAssetsPaginationData = {
            ...this.publishedAssetsPaginationData,
            currentPage: response.result.pageRequest.page,
            itemsTotal: response.result.count,
          };
        } else {
          console.log('error fetching provider assets', response);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        store.commit('setLoading', false);
      });
  }

  onSelectPublishedAsset(asset: CatalogueItem): void {
    if (this.assetLocal.resources.map((x) => x.id).includes(asset.id)) {
      this.assetLocal.resources = this.assetLocal.resources.filter((x) => x.id !== asset.id);
      return;
    }
    this.assetLocal.resources.push(asset);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";

  .overflow-y {
    max-height: 470px;
    overflow-y: auto;
  }
</style>
