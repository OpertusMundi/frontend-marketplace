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

    <modal :withSlots="true" :show="modalToShow === 'modalDeleteDraft'" @dismiss="modalToShow = ''" :modalId="'modalDeleteDraft'">
      <template v-slot:body>
        <h2>Are you sure you want to delete draft?</h2>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="onConfirmDeleteDraft">Delete</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'modalCreatedServiceFromPublished'" @dismiss="modalToShow = ''" :modalId="'modalCreatedServiceFromPublished'" :showCancelButton="false" :showCloseButton="false" :closeOnClickOutside="false">
      <template v-slot:body>
        <div class="p-xs-30">
          <h2>A draft {{ serviceDraftCreatedData.serviceType }} service was created</h2>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="onRedirectToDraftService">OK</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'modalAssetIsLocked'" @dismiss="modalToShow = ''" :modalId="'modalAssetIsLocked'" :showCancelButton="false" :showCloseButton="false" :closeOnClickOutside="false">
      <template v-slot:body>
        <div class="p-xs-30">
          <h2>Asset is currently locked by another user.</h2>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="modalToShow = ''">OK</button>
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
          <template v-if="!$store.getters.isLoading"> {{ unpublishedItemsTotal }} {{ selectedStatus === 'ALL' ? 'UNPUBLISHED ASSETS' : `UNPUBLISHED ASSETS OF STATUS "${selectedStatus}"` }} </template>
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

    <asset-draft-card
      @delete="onDeleteDraft"
      @assetLocked="modalToShow = 'modalAssetIsLocked'"
      v-for="(asset, i) in unpublishedAssets"
      v-bind:key="asset.id"
      :asset="asset"
      :class="{ 'mt-xs-20': i == 0 }"
    ></asset-draft-card>

    <pagination :currentPage="unpublishedCurrentPage" :itemsPerPage="unpublishedItemsPerPage" :itemsTotal="unpublishedItemsTotal" @pageSelection="onPageSelect(false, $event)"></pagination>

    <hr class="mt-xs-50 mb-xs-50 seperator-published-unpublished" />

    <div class="collection__menu">
      <ul>
        <li @click="selectedTab = 'ALL_ASSETS'" :class="{ active: selectedTab === 'ALL_ASSETS' }"><a href="#" @click.prevent="">All assets</a></li>
        <li @click="selectedTab = 'DATA_FILES'" :class="{ active: selectedTab === 'DATA_FILES' }"><a href="#" @click.prevent="">Data files</a></li>
        <li @click="selectedTab = 'YOUR_APIS'" :class="{ active: selectedTab === 'YOUR_APIS' }"><a href="#" @click.prevent="">Your APIs</a></li>
        <li @click="selectedTab = 'TOPIO_APIS'" :class="{ active: selectedTab === 'TOPIO_APIS' }"><a href="#" @click.prevent="">Topio APIs</a></li>
      </ul>
    </div>

    <div class="filters mt-xs-30">
      <div class="filters__block">
        <p class="filters__title">
          <template v-if="!$store.getters.isLoading"> {{ publishedItemsTotal }} PUBLISHED ASSETS </template>
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

    <asset-published-card
      @serviceDraftCreated="onServiceDraftCreated"
      @delete="onDeleteAsset"
      @createNewDraft="onCreateNewDraft"
      v-for="(asset, i) in publishedAssets"
      v-bind:key="asset.id"
      :asset="asset"
      :class="{ 'asset_card__published--first': i == 0 }"
    ></asset-published-card>

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
  AssetDraft, AssetDraftQuery, EnumDraftStatus, EnumSortField,
} from '@/model/draft';
import { Order } from '@/model/request';
import { EnumAssetType } from '@/model/enum';
import Modal from '@/components/Modal.vue';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { CatalogueItem } from '@/model';
import { chunk as lodashChunk } from 'lodash';

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

  idOfDraftToDelete: string;

  serviceDraftCreatedData: { key: string; serviceType: string };

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

    this.statusFilterOptions = ['ALL', EnumDraftStatus.DRAFT, EnumDraftStatus.SUBMITTED, EnumDraftStatus.PENDING_HELPDESK_REVIEW, EnumDraftStatus.HELPDESK_REJECTED, EnumDraftStatus.PENDING_PROVIDER_REVIEW, EnumDraftStatus.PROVIDER_REJECTED, EnumDraftStatus.POST_PROCESSING];
    const [selectedStatus] = this.statusFilterOptions;
    this.selectedStatus = selectedStatus;

    this.selectedOrderOptionPublished = 'TITLE ASCENDING';
    this.selectedOrderOptionUnpublished = 'MODIFIED DESCENDING';

    this.selectedTab = 'ALL_ASSETS';

    this.modalToShow = '';
    this.idOfAssetToDelete = '';
    this.idOfDraftToDelete = '';
    this.serviceDraftCreatedData = { key: '', serviceType: '' };
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

    query.status = this.selectedStatus === 'ALL' ? [EnumDraftStatus.DRAFT, EnumDraftStatus.SUBMITTED, EnumDraftStatus.PENDING_HELPDESK_REVIEW, EnumDraftStatus.HELPDESK_REJECTED, EnumDraftStatus.PENDING_PROVIDER_REVIEW, EnumDraftStatus.PROVIDER_REJECTED, EnumDraftStatus.POST_PROCESSING] : [this.selectedStatus as EnumDraftStatus];

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

    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.VECTOR,
      pageRequest: {
        page: 0,
        size: 100000,
      },
      sorting: {
        id: EnumProviderAssetSortField.TITLE,
        order: 'ASC',
      },
    };

    this.providerAssetsApi.find(query).then((resp) => {
      let assets = resp.result.items;
      console.log('hey there, assets', assets);

      if (this.selectedTab === 'DATA_FILES') {
        assets = assets.filter((x) => x.type === EnumAssetType.VECTOR || x.type === EnumAssetType.RASTER);
      } else if (this.selectedTab === 'YOUR_APIS') {
        assets = [];
      } else if (this.selectedTab === 'TOPIO_APIS') {
        assets = assets.filter((x) => x.type === EnumAssetType.SERVICE);
      }

      const orderOptions = [
        { option: 'TITLE ASCENDING', orderBy: 'title', order: 'ASC' },
        { option: 'TITLE DESCENDING', orderBy: 'title', order: 'DESC' },
        { option: 'TYPE ASCENDING', orderBy: 'type', order: 'ASC' },
        { option: 'TYPE DESCENDING', orderBy: 'type', order: 'DESC' },
        { option: 'VERSION ASCENDING', orderBy: 'version', order: 'ASC' },
        { option: 'VERSION DESCENDING', orderBy: 'version', order: 'DESC' },
      ];
      // eslint-disable-next-line
      const field = orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.orderBy;
      // eslint-disable-next-line
      const order = orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.order;

      if (order === 'ASC') {
        assets.sort((a, b) => (a[field] > b[field] ? 1 : -1));
      } else if (order === 'DESC') {
        assets.sort((a, b) => (a[field] < b[field] ? 1 : -1));
      }

      this.publishedItemsTotal = assets.length;

      const pages = lodashChunk(assets, this.publishedItemsPerPage);
      this.publishedAssets = pages[page];
      this.publishedCurrentPage = page;
      this.isLoadingPublished = false;

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

  // TODO: The following function is the correct one. However, API doesnt work (ignores parameters), therefore, a dummy one is used (which makes pagination in the front-end etc)

  // searchPublishedAssets(page: number, scrollBehavior = false): void {
  //   this.isLoadingPublished = true;

  //   // TODO: api should support arrays so that DATA_FILES is [EnumAssetType.VECTOR, EnumAssetType.RASTER]. Currently RASTER is not supported.
  //   // TODO: just a dummy value for YOUR_APIS as it should currently return no value
  //   const assetTypes = {
  //     DATA_FILES: EnumAssetType.VECTOR,
  //     YOUR_APIS: EnumAssetType.RASTER,
  //     TOPIO_APIS: EnumAssetType.SERVICE,
  //   };

  //   const orderOptions = [
  //     { option: 'TITLE ASCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'ASC' },
  //     { option: 'TITLE DESCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'DESC' },
  //     { option: 'TYPE ASCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'ASC' },
  //     { option: 'TYPE DESCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'DESC' },
  //     { option: 'VERSION ASCENDING', orderBy: EnumProviderAssetSortField.VERSION, order: 'ASC' },
  //     { option: 'VERSION DESCENDING', orderBy: EnumProviderAssetSortField.VERSION, order: 'DESC' },
  //   ];

  //   const query: ProviderDraftQuery = {
  //     q: '',
  //     type: this.selectedTab === 'ALL_ASSETS' ? '' : assetTypes[this.selectedTab],
  //     pageRequest: {
  //       page,
  //       size: this.publishedItemsPerPage,
  //     },
  //     sorting: {
  //       // eslint-disable-next-line
  //       id: orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.orderBy,
  //       // eslint-disable-next-line
  //       order: orderOptions.find((x) => x.option === this.selectedOrderOptionPublished)!.order as Order,
  //     },
  //   };

  //   this.providerAssetsApi.find(query).then((resp) => {
  //     console.log('published', resp.result);
  //     this.publishedAssets = resp.result.items;
  //     this.publishedItemsTotal = resp.result.count;
  //     this.publishedCurrentPage = resp.result.pageRequest.page;
  //     this.isLoadingPublished = false;
  //     console.log('scroll', scrollBehavior);
  //     this.$nextTick(() => {
  //       if (scrollBehavior) {
  //         window.scrollTo({
  //           top: (document.querySelector('.seperator-published-unpublished') as HTMLElement).offsetTop - (document.querySelector('.header') as HTMLElement).clientHeight,
  //           behavior: 'smooth',
  //         });
  //       }
  //     });
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

  onServiceDraftCreated(data: { key: string; serviceType: string }): void {
    this.serviceDraftCreatedData = data;
    this.modalToShow = 'modalCreatedServiceFromPublished';
  }

  onRedirectToDraftService(): void {
    this.$router.push(`/dashboard/assets/create/${this.serviceDraftCreatedData.key}`);
  }

  onDeleteAsset(id: string): void {
    console.log('delete asset: ', id);
    this.idOfAssetToDelete = id;
    this.modalToShow = 'modalDeleteAsset';
  }

  onDeleteDraft(id: string): void {
    console.log('delete draft: ', id);
    this.idOfDraftToDelete = id;
    this.modalToShow = 'modalDeleteDraft';
  }

  onCreateNewDraft(id: string): void {
    store.commit('setLoading', true);
    console.log('create new draft', id);
    this.draftAssetApi.createFromAsset(id).then((createDraftResponse) => {
      if (createDraftResponse.success) {
        console.log('create draft response', createDraftResponse);
        store.commit('setLoading', false);
        this.$router.push(`/dashboard/assets/create/${createDraftResponse.result.key}`);
        // this.selectedOrderOptionUnpublished = 'MODIFIED DESCENDING';
        // this.selectedStatus = 'ALL';
        // this.searchUnpublishedAssets(0, true);
      } else {
        console.log('error creating draft', createDraftResponse);
      }
    });
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

  onConfirmDeleteDraft(): void {
    store.commit('setLoading', true);
    this.draftAssetApi.deleteDraft(this.idOfDraftToDelete).then((deleteResponse) => {
      if (deleteResponse.data.success) {
        console.log('draft deleted successfully', deleteResponse);
        this.modalToShow = '';
        store.commit('setLoading', false);
        //  this.searchAssets(true, this.publishedCurrentPage);
        // this.searchPublishedAssets(this.publishedCurrentPage);
        this.searchUnpublishedAssets(0);
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
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_filters.scss';
@import '@/assets/styles/_collection.scss';
</style>
