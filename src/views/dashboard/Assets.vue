<template>
  <div class="dashboard__inner">
    <!-- MODALS -->
    <modal :withSlots="true" :show="modalToShow === 'modalDeleteAsset'" @dismiss="modalToShow = ''" :modalId="'modalDeleteAsset'">
      <template v-slot:body>
        <h2>Are you sure you want to delete asset?</h2>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="onConfirmDeleteAsset">Delete</button>
      </template>
    </modal>
    <!-- END OF MODALS -->

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

    <asset-draft-card v-for="asset, i in unpublishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-20': i==0}"></asset-draft-card>
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
            <option v-for="orderOption in ['TITLE ASCENDING', 'TITLE DESCENDING', 'TYPE ASCENDING', 'TYPE DESCENDING', 'VERSION ASCENDING', 'VERSION DESCENDING']" :key="orderOption">{{ orderOption }}</option>
          </select>
        </div>
      </div>
    </div>

    <asset-published-card @delete="onDeleteAsset" v-for="asset, i in publishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'asset_card__published--first': i==0}"></asset-published-card>
    <pagination :currentPage="publishedCurrentPage" :itemsPerPage="publishedItemsPerPage" :itemsTotal="publishedItemsTotal" @pageSelection="onPageSelect(true, $event)"></pagination>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';
import DraftAssetApi from '@/service/draft';
import ProviderAssetsApi from '@/service/provider-assets';
import AssetDraftCard from '@/components/Assets/AssetDraftCard.vue';
import AssetPublishedCard from '@/components/Assets/AssetPublishedCard.vue';
import Pagination from '@/components/Pagination.vue';
import {
  AssetDraft,
  AssetDraftQuery,
  EnumDraftStatus,
  EnumSortField,
} from '@/model/draft';
import { Order } from '@/model/request';
import { EnumAssetType } from '@/model/enum';
import Modal from '@/components/Modal.vue';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { CatalogueItem } from '@/model';

@Component({
  components: {
    AssetDraftCard,
    AssetPublishedCard,
    Pagination,
    Modal,
  },
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  providerAssetsApi: ProviderAssetsApi;

  unpublishedAssets: AssetDraft[];

  // publishedAssets: AssetDraft[];
  publishedAssets: CatalogueItem[];

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

  modalToShow: string;

  idOfAssetToDelete: string;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();
    this.providerAssetsApi = new ProviderAssetsApi();

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

    this.selectedOrderOptionPublished = 'TITLE ASCENDING';
    this.selectedOrderOptionUnpublished = 'MODIFIED DESCENDING';

    this.selectedTab = 'ALL_ASSETS';

    this.modalToShow = '';
    this.idOfAssetToDelete = '';
  }

  @Watch('selectedStatus')
  onSelectedStatusChange(): void {
    // this.searchAssets(false, 0);
    this.searchUnpublishedAssets(0);
  }

  @Watch('selectedOrderOptionPublished')
  onSelectedOrderOptionPublished(): void {
    // this.searchAssets(true, 0);
    this.searchPublishedAssets(0);
  }

  @Watch('selectedOrderOptionUnpublished')
  onSelectedOrderOptionUnpublished(): void {
    // this.searchAssets(false, 0);
    this.searchUnpublishedAssets(0);
  }

  @Watch('selectedTab')
  onSelectedTabChange(): void {
    // this.searchAssets(true, 0, true);
    this.searchPublishedAssets(0, true);
  }

  mounted(): void {
    // this.searchAssets(false, 0);
    // this.searchAssets(true, 0);
    this.searchUnpublishedAssets(0);
    this.searchPublishedAssets(0);
  }

  searchUnpublishedAssets(page: number, scrollBehavior = false): void {
    this.isLoadingUnpublished = true;

    const query: Partial<AssetDraftQuery> = {};

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

    const pageRequest = {
      page,
      size: this.unpublishedItemsPerPage,
    };

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
      id: orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.orderBy,
      // eslint-disable-next-line
      order: orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.order as Order,
    };

    this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
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
    });
  }

  searchPublishedAssets(page: number, scrollBehavior = false): void {
    this.isLoadingPublished = true;

    // TODO: api should support arrays so that DATA_FILES is [EnumAssetType.VECTOR, EnumAssetType.RASTER]. Currently RASTER is not supported.
    // TODO: just a dummy value for YOUR_APIS as it should currently return no value
    const assetTypes = {
      DATA_FILES: EnumAssetType.VECTOR,
      YOUR_APIS: EnumAssetType.RASTER,
      TOPIO_APIS: EnumAssetType.SERVICE,
    };

    const orderOptions = [
      { option: 'TITLE ASCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'ASC' },
      { option: 'TITLE DESCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'DESC' },
      { option: 'TYPE ASCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'ASC' },
      { option: 'TYPE DESCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'DESC' },
      { option: 'VERSION ASCENDING', orderBy: EnumProviderAssetSortField.VERSION, order: 'ASC' },
      { option: 'VERSION DESCENDING', orderBy: EnumProviderAssetSortField.VERSION, order: 'DESC' },
    ];

    const query: ProviderDraftQuery = {
      q: '',
      type: this.selectedTab === 'ALL_ASSETS' ? '' : assetTypes[this.selectedTab],
      pageRequest: {
        page,
        size: this.publishedItemsPerPage,
      },
      sorting: {
        // eslint-disable-next-line
        id: orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.orderBy,
        // eslint-disable-next-line
        order: orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.order as Order,
      },
    };

    this.providerAssetsApi.find(query).then((resp) => {
      console.log('published', resp.result);
      this.publishedAssets = resp.result.items;
      this.publishedItemsTotal = resp.result.count;
      this.publishedCurrentPage = resp.result.pageRequest.page;
      this.isLoadingPublished = false;
      console.log('scroll', scrollBehavior);
      this.$nextTick(() => {
        if (scrollBehavior) {
          window.scrollTo({
            top: (document.querySelector('.seperator-published-unpublished') as HTMLElement).offsetTop - (document.querySelector('.header') as HTMLElement).clientHeight,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // searchAssets(published: boolean, page: number, scrollBehavior = false): void {
  //   this.isLoadingPublished = published ? true : this.isLoadingPublished;
  //   this.isLoadingUnpublished = published ? this.isLoadingUnpublished : true;

  //   const query: Partial<AssetDraftQuery> = {};
  //   if (published) {
  //     query.status = [EnumDraftStatus.PUBLISHED];
  //     const assetTypes = {
  //       DATA_FILES: [EnumAssetType.RASTER, EnumAssetType.VECTOR],
  //       YOUR_APIS: [],
  //       TOPIO_APIS: [EnumAssetType.SERVICE],
  //     };
  //     if (this.selectedTab !== 'ALL_ASSETS') query.type = assetTypes[this.selectedTab];
  //     // TODO: Your APIs should currently return no results.The following assignment (TMS) is just a dummy value. To be removed in the future when YOUR_APIS is supported.
  //     if (this.selectedTab === 'YOUR_APIS') query.serviceType = [EnumSpatialDataServiceType.TMS];
  //   } else {
  //     query.status = this.selectedStatus === 'ALL' ? [
  //       EnumDraftStatus.DRAFT,
  //       EnumDraftStatus.SUBMITTED,
  //       EnumDraftStatus.PENDING_HELPDESK_REVIEW,
  //       EnumDraftStatus.HELPDESK_REJECTED,
  //       EnumDraftStatus.PENDING_PROVIDER_REVIEW,
  //       EnumDraftStatus.PROVIDER_REJECTED,
  //       EnumDraftStatus.POST_PROCESSING,
  //     ] : [
  //       this.selectedStatus as EnumDraftStatus,
  //     ];
  //   }

  //   const pageRequest = {
  //     page,
  //     size: published ? this.publishedItemsPerPage : this.unpublishedItemsPerPage,
  //   };
  //   // const sort = {
  //   //   id: EnumSortField.CREATED_ON,
  //   //   order: 'ASC' as Order,
  //   // };
  //   const orderOptions = [
  //     { option: 'CREATED ASCENDING', orderBy: EnumSortField.CREATED_ON, order: 'ASC' },
  //     { option: 'CREATED DESCENDING', orderBy: EnumSortField.CREATED_ON, order: 'DESC' },
  //     { option: 'MODIFIED ASCENDING', orderBy: EnumSortField.MODIFIED_ON, order: 'ASC' },
  //     { option: 'MODIFIED DESCENDING', orderBy: EnumSortField.MODIFIED_ON, order: 'DESC' },
  //     { option: 'TITLE ASCENDING', orderBy: EnumSortField.TITLE, order: 'ASC' },
  //     { option: 'TITLE DESCENDING', orderBy: EnumSortField.TITLE, order: 'DESC' },
  //     { option: 'VERSION ASCENDING', orderBy: EnumSortField.VERSION, order: 'ASC' },
  //     { option: 'VERSION DESCENDING', orderBy: EnumSortField.VERSION, order: 'DESC' },
  //     { option: 'STATUS ASCENDING', orderBy: EnumSortField.STATUS, order: 'ASC' },
  //     { option: 'STATUS DESCENDING', orderBy: EnumSortField.STATUS, order: 'DESC' },
  //   ];

  //   const sort = {
  //     // eslint-disable-next-line
  //     id: published ? orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.orderBy : orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.orderBy,
  //     // eslint-disable-next-line
  //     order: published ? orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.order as Order : orderOptions.find((x) => x.option === this.selectedOrderOptionUnpublished)!.order as Order,
  //   };

  //   this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
  //     if (resp.data.success) {
  //       if (published) {
  //         this.publishedAssets = resp.data.result.items;
  //         this.publishedItemsTotal = resp.data.result.count;
  //         this.publishedCurrentPage = resp.data.result.pageRequest.page;
  //         this.isLoadingPublished = false;
  //         if (scrollBehavior) {
  //           Vue.nextTick(() => {
  //             window.scrollTo({
  //               // top: document.querySelector('.asset_card__published--first') ? (document.querySelector('.asset_card__published--first') as HTMLElement).offsetTop : 0,
  //               top: (document.querySelector('.seperator-published-unpublished') as HTMLElement).offsetTop - (document.querySelector('.header') as HTMLElement).clientHeight,
  //               behavior: 'smooth',
  //             });
  //           });
  //         }
  //       } else {
  //         this.unpublishedAssets = resp.data.result.items;
  //         this.unpublishedItemsTotal = resp.data.result.count;
  //         this.unpublishedCurrentPage = resp.data.result.pageRequest.page;
  //         console.log(resp.data.result);
  //         this.isLoadingUnpublished = false;
  //         if (scrollBehavior) {
  //           window.scrollTo({
  //             top: 0,
  //             behavior: 'smooth',
  //           });
  //         }
  //       }
  //     } else {
  //       console.log('error', resp.data);
  //     }
  //   });
  // }

  onPageSelect(published: boolean, page: number): void {
    // this.searchAssets(published, page, true);
    if (published) {
      this.searchPublishedAssets(page, true);
    } else {
      this.searchUnpublishedAssets(page, true);
    }
  }

  get isLoading(): boolean {
    if (this.isLoadingUnpublished || this.isLoadingPublished) {
      return true;
    }
    return false;
  }

  onDeleteAsset(id: string): void {
    console.log('delete asset: ', id);
    this.idOfAssetToDelete = id;
    this.modalToShow = 'modalDeleteAsset';
  }

  onConfirmDeleteAsset(): void {
    store.commit('setLoading', true);
    this.providerAssetsApi.deleteAsset(this.idOfAssetToDelete).then((deleteResponse) => {
      if (deleteResponse.data.success) {
        console.log('asset deleted successfully', deleteResponse);
        this.modalToShow = '';
        store.commit('setLoading', false);
        // this.searchAssets(true, this.publishedCurrentPage);
        this.searchPublishedAssets(this.publishedCurrentPage);
      } else {
        console.log('error deleting asset', deleteResponse);
      }
    });
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
