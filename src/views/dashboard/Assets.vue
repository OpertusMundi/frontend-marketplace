<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">

        <h1>Assets</h1>
        <router-link to="/dashboard/assets/create" class="btn--std btn--blue">ADD AN ASSET</router-link>

        <catalogue-card v-for="asset, i in unpublishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-20': i==0}"></catalogue-card>

        <pagination :currentPage="unpublishedCurrentPage" :itemsPerPage="unpublishedItemsPerPage" :itemsTotal="unpublishedItemsTotal" @pageSelection="onUnpublishedPageSelect"></pagination>

        <div v-if="isLoading" class="dummy-loader" style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; z-index: 9999;"><h1>LOADER</h1></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DraftAssetApi from '@/service/draft';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import Pagination from '@/components/Pagination.vue';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';

@Component({
  components: {
    CatalogueCard,
    Pagination,
  },
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  unpublishedAssets: AssetDraft[];

  unpublishedCurrentPage: number;

  unpublishedItemsPerPage: number;

  unpublishedItemsTotal: number;

  publishedCurrentPage: number;

  publishedItemsPerPage: number;

  publishedItemsTotal: number;

  isLoading: boolean;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.unpublishedAssets = [];

    this.unpublishedCurrentPage = 0;
    this.unpublishedItemsPerPage = 5;
    this.unpublishedItemsTotal = 0;

    this.publishedCurrentPage = 0;
    this.publishedItemsPerPage = 10;
    this.publishedItemsTotal = 0;

    this.isLoading = false;
  }

  mounted(): void {
    this.searchUnpublishedAssets(0);
  }

  searchUnpublishedAssets(page: number): void {
    this.isLoading = true;

    const query = {
      status: [
        EnumDraftStatus.DRAFT,
        EnumDraftStatus.SUBMITTED,
        EnumDraftStatus.PENDING_HELPDESK_REVIEW,
        EnumDraftStatus.HELPDESK_REJECTED,
        EnumDraftStatus.PENDING_PROVIDER_REVIEW,
        EnumDraftStatus.PROVIDER_REJECTED,
        EnumDraftStatus.POST_PROCESSING,
      ],
    };
    const pageRequest = {
      page,
      size: this.unpublishedItemsPerPage,
    };
    const sort = {
      id: EnumSortField.CREATED_ON,
      order: 'ASC' as Order,
    };
    this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
      if (resp.data.success) {
        this.unpublishedAssets = resp.data.result.items;
        this.unpublishedItemsTotal = resp.data.result.count;
        this.unpublishedCurrentPage = resp.data.result.pageRequest.page;
        this.isLoading = false;
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        console.log(this.unpublishedAssets);
      } else {
        console.log('error', resp.data);
      }
    });
  }

  onUnpublishedPageSelect(page: number): void {
    this.searchUnpublishedAssets(page);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
