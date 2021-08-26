<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers dashboard__head__helpers--full-width">
        <h1>Assets</h1>
        <router-link to="/dashboard/assets/create" class="btn--std btn--blue">ADD AN ASSET</router-link>
      </div>
    </div>
    <div class="filters">
      <div class="filters__block">
        <p class="filters__title">
          <template v-if="!$store.getters.isLoading">
            {{ unpublishedItemsTotal }} {{ selectedStatus === 'ALL' ? 'UNPUBLISHED ASSETS' : `UNPUBLISHED ASSETS OF STATUS "${selectedStatus}"` }}
          </template>
        </p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">STATUS: </label>
          <select v-model="selectedStatus" name="filter" id="filter">
            <option v-for="status in statusFilterOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
        <div class="filters__block__select">
          <label for="filter">&uarr;&darr;</label>
          <select v-model="selectedOrderOptionUnpublished" name="filter" id="filter">
            <option v-for="orderOption in ['CREATED ASCENDING', 'CREATED DESCENDING', 'MODIFIED ASCENDING', 'MODIFIED DESCENDING', 'TITLE ASCENDING', 'TITLE DESCENDING', 'VERSION ASCENDING', 'VERSION DESCENDING', 'STATUS ASCENDING', 'STATUS DESCENDING']" :key="orderOption">{{ orderOption }}</option>
          </select>
        </div>
      </div>
    </div>

    <asset-card v-for="asset, i in unpublishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-20': i==0}"></asset-card>
    <pagination :currentPage="unpublishedCurrentPage" :itemsPerPage="unpublishedItemsPerPage" :itemsTotal="unpublishedItemsTotal" @pageSelection="onPageSelect(false, $event)"></pagination>

    <hr class="mt-xs-50 mb-xs-50 seperator-published-unpublished">

    <div class="collection__menu">
      <ul>
        <li @click="selectedTab = 'ALL_ASSETS'" :class="{ 'active': selectedTab==='ALL_ASSETS' }"><a href="#" @click.prevent="">All assets</a></li>
        <li @click="selectedTab = 'DATA_FILES'" :class="{ 'active': selectedTab==='DATA_FILES' }"><a href="#" @click.prevent="">Data files</a></li>
        <li @click="selectedTab = 'YOUR_APIS'" :class="{ 'active': selectedTab==='YOUR_APIS' }"><a href="#" @click.prevent="">Your APIs</a></li>
        <li @click="selectedTab = 'TOPIO_APIS'" :class="{ 'active': selectedTab==='TOPIO_APIS' }"><a href="#" @click.prevent="">Topio APIs</a></li>
      </ul>
    </div>

    <div class="filters mt-xs-30">
      <div class="filters__block">
        <p class="filters__title">
          <template v-if="!$store.getters.isLoading">
            {{ publishedItemsTotal }} PUBLISHED ASSETS
          </template>
        </p>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">&uarr;&darr;</label>
          <select v-model="selectedOrderOptionPublished" name="filter" id="filter">
            <option v-for="orderOption in ['CREATED ASCENDING', 'CREATED DESCENDING', 'MODIFIED ASCENDING', 'MODIFIED DESCENDING', 'TITLE ASCENDING', 'TITLE DESCENDING', 'VERSION ASCENDING', 'VERSION DESCENDING']" :key="orderOption">{{ orderOption }}</option>
          </select>
        </div>
      </div>
    </div>

    <asset-card v-for="asset, i in publishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'asset_card__published--first': i==0}"></asset-card>
    <pagination :currentPage="publishedCurrentPage" :itemsPerPage="publishedItemsPerPage" :itemsTotal="publishedItemsTotal" @pageSelection="onPageSelect(true, $event)"></pagination>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
import DraftAssetApi from '@/service/draft';
import AssetCard from '@/components/Assets/AssetCard.vue';
import Pagination from '@/components/Pagination.vue';
import {
  AssetDraft,
  AssetDraftQuery,
  EnumDraftStatus,
  EnumSortField,
} from '@/model/draft';
import { Order } from '@/model/request';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';

@Component({
  components: {
    AssetCard,
    Pagination,
  },
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  unpublishedAssets: AssetDraft[];

  publishedAssets: AssetDraft[];

  statusFilterOptions: Array<EnumDraftStatus | string>;

  selectedStatus: EnumDraftStatus | string;

  unpublishedCurrentPage: number;

  unpublishedItemsPerPage: number;

  unpublishedItemsTotal: number;

  publishedCurrentPage: number;

  publishedItemsPerPage: number;

  publishedItemsTotal: number;

  isLoadingUnpublished: boolean;

  isLoadingPublished: boolean;

  selectedOrderOptionPublished: string;

  selectedOrderOptionUnpublished: string;

  selectedTab: string;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.unpublishedAssets = [];
    this.publishedAssets = [];

    this.unpublishedCurrentPage = 0;
    this.unpublishedItemsPerPage = 5;
    this.unpublishedItemsTotal = 0;

    this.publishedCurrentPage = 0;
    this.publishedItemsPerPage = 10;
    this.publishedItemsTotal = 0;

    this.isLoadingUnpublished = false;
    this.isLoadingPublished = false;

    this.statusFilterOptions = [
      'ALL',
      EnumDraftStatus.DRAFT,
      EnumDraftStatus.SUBMITTED,
      EnumDraftStatus.PENDING_HELPDESK_REVIEW,
      EnumDraftStatus.HELPDESK_REJECTED,
      EnumDraftStatus.PENDING_PROVIDER_REVIEW,
      EnumDraftStatus.PROVIDER_REJECTED,
      EnumDraftStatus.POST_PROCESSING,
    ];
    const [selectedStatus] = this.statusFilterOptions;
    this.selectedStatus = selectedStatus;

    this.selectedOrderOptionPublished = 'MODIFIED DESCENDING';
    this.selectedOrderOptionUnpublished = 'MODIFIED DESCENDING';

    this.selectedTab = 'ALL_ASSETS';
  }

  @Watch('selectedStatus')
  onSelectedStatusChange(): void {
    this.searchAssets(false, 0);
  }

  @Watch('selectedOrderOptionPublished')
  onSelectedOrderOptionPublished(): void {
    this.searchAssets(true, 0);
  }

  @Watch('selectedOrderOptionUnpublished')
  onSelectedOrderOptionUnpublished(): void {
    this.searchAssets(false, 0);
  }

  @Watch('selectedTab')
  onSelectedTabChange(): void {
    this.searchAssets(true, 0, true);
  }

  mounted(): void {
    this.searchAssets(false, 0);
    this.searchAssets(true, 0);
  }

  searchAssets(published: boolean, page: number, scrollBehavior = false): void {
    this.isLoadingPublished = published ? true : this.isLoadingPublished;
    this.isLoadingUnpublished = published ? this.isLoadingUnpublished : true;

    const query: Partial<AssetDraftQuery> = {};
    if (published) {
      query.status = [EnumDraftStatus.PUBLISHED];
      const assetTypes = {
        DATA_FILES: [EnumAssetType.RASTER, EnumAssetType.VECTOR],
        YOUR_APIS: [],
        TOPIO_APIS: [EnumAssetType.SERVICE],
      };
      if (this.selectedTab !== 'ALL_ASSETS') query.type = assetTypes[this.selectedTab];
      // TODO: Your APIs should currently return no results.The following assignment (TMS) is just a dummy value. To be removed in the future when YOUR_APIS is supported.
      if (this.selectedTab === 'YOUR_APIS') query.serviceType = [EnumSpatialDataServiceType.TMS];
    } else {
      query.status = this.selectedStatus === 'ALL' ? [
        EnumDraftStatus.DRAFT,
        EnumDraftStatus.SUBMITTED,
        EnumDraftStatus.PENDING_HELPDESK_REVIEW,
        EnumDraftStatus.HELPDESK_REJECTED,
        EnumDraftStatus.PENDING_PROVIDER_REVIEW,
        EnumDraftStatus.PROVIDER_REJECTED,
        EnumDraftStatus.POST_PROCESSING,
      ] : [
        this.selectedStatus as EnumDraftStatus,
      ];
    }

    const pageRequest = {
      page,
      size: published ? this.publishedItemsPerPage : this.unpublishedItemsPerPage,
    };
    // const sort = {
    //   id: EnumSortField.CREATED_ON,
    //   order: 'ASC' as Order,
    // };
    const orderOptions = [
      { option: 'CREATED ASCENDING', orderBy: EnumSortField.CREATED_ON, order: 'ASC' },
      { option: 'CREATED DESCENDING', orderBy: EnumSortField.CREATED_ON, order: 'DESC' },
      { option: 'MODIFIED ASCENDING', orderBy: EnumSortField.MODIFIED_ON, order: 'ASC' },
      { option: 'MODIFIED DESCENDING', orderBy: EnumSortField.MODIFIED_ON, order: 'DESC' },
      { option: 'TITLE ASCENDING', orderBy: EnumSortField.TITLE, order: 'ASC' },
      { option: 'TITLE DESCENDING', orderBy: EnumSortField.TITLE, order: 'DESC' },
      { option: 'VERSION ASCENDING', orderBy: EnumSortField.VERSION, order: 'ASC' },
      { option: 'VERSION DESCENDING', orderBy: EnumSortField.VERSION, order: 'DESC' },
      { option: 'STATUS ASCENDING', orderBy: EnumSortField.STATUS, order: 'ASC' },
      { option: 'STATUS DESCENDING', orderBy: EnumSortField.STATUS, order: 'DESC' },
    ];

    const sort = {
      // eslint-disable-next-line
      id: published ? orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.orderBy : orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.orderBy,
      // eslint-disable-next-line
      order: published ? orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.order as Order : orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.order as Order,
    };

    this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
      if (resp.data.success) {
        if (published) {
          this.publishedAssets = resp.data.result.items;
          this.publishedItemsTotal = resp.data.result.count;
          this.publishedCurrentPage = resp.data.result.pageRequest.page;
          this.isLoadingPublished = false;
          if (scrollBehavior) {
            Vue.nextTick(() => {
              window.scrollTo({
                // top: document.querySelector('.asset_card__published--first') ? (document.querySelector('.asset_card__published--first') as HTMLElement).offsetTop : 0,
                top: (document.querySelector('.seperator-published-unpublished') as HTMLElement).offsetTop - (document.querySelector('.header') as HTMLElement).clientHeight,
                behavior: 'smooth',
              });
            });
          }
        } else {
          this.unpublishedAssets = resp.data.result.items;
          this.unpublishedItemsTotal = resp.data.result.count;
          this.unpublishedCurrentPage = resp.data.result.pageRequest.page;
          console.log(resp.data.result);
          this.isLoadingUnpublished = false;
          if (scrollBehavior) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        }
      } else {
        console.log('error', resp.data);
      }
    });
  }

  onPageSelect(published: boolean, page: number): void {
    this.searchAssets(published, page, true);
  }

  get isLoading(): boolean {
    if (this.isLoadingUnpublished || this.isLoadingPublished) {
      return true;
    }
    return false;
  }

  @Watch('isLoading')
  onLoadingStatusChange(): void {
    store.commit('setLoading', this.isLoading);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/_filters.scss";
  @import "@/assets/styles/_collection.scss";
</style>
