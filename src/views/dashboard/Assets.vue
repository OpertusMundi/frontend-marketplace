<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers dashboard__head__helpers--full-width">

        <h1>Assets</h1>
        <router-link to="/dashboard/assets/create" class="btn--std btn--blue">ADD AN ASSET</router-link>

        <asset-card v-for="asset, i in unpublishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-20': i==0}"></asset-card>
        <pagination :currentPage="unpublishedCurrentPage" :itemsPerPage="unpublishedItemsPerPage" :itemsTotal="unpublishedItemsTotal" @pageSelection="onPageSelect(false, $event)"></pagination>

        <asset-card v-for="asset, i in publishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-60 asset_card__published--first': i==0}"></asset-card>
        <pagination :currentPage="publishedCurrentPage" :itemsPerPage="publishedItemsPerPage" :itemsTotal="publishedItemsTotal" @pageSelection="onPageSelect(true, $event)"></pagination>

        <loader v-if="isLoading()"></loader>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DraftAssetApi from '@/service/draft';
import AssetCard from '@/components/Assets/AssetCard.vue';
import Pagination from '@/components/Pagination.vue';
import Loader from '@/components/Loader.vue';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';

@Component({
  components: {
    AssetCard,
    Pagination,
    Loader,
  },
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  unpublishedAssets: AssetDraft[];

  publishedAssets: AssetDraft[];

  unpublishedCurrentPage: number;

  unpublishedItemsPerPage: number;

  unpublishedItemsTotal: number;

  publishedCurrentPage: number;

  publishedItemsPerPage: number;

  publishedItemsTotal: number;

  isLoadingUnpublished: boolean;

  isLoadingPublished: boolean;

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
  }

  mounted(): void {
    this.searchAssets(false, 0);
    this.searchAssets(true, 0);
  }

  searchAssets(published: boolean, page: number, scrollBehavior = false): void {
    this.isLoadingPublished = published ? true : this.isLoadingPublished;
    this.isLoadingUnpublished = published ? this.isLoadingUnpublished : true;

    const query = {
      status: published ? [
        EnumDraftStatus.PUBLISHED,
      ] : [
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
      size: published ? this.publishedItemsPerPage : this.unpublishedItemsPerPage,
    };
    const sort = {
      id: EnumSortField.CREATED_ON,
      order: 'ASC' as Order,
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
                top: document.querySelector('.asset_card__published--first') ? (document.querySelector('.asset_card__published--first') as HTMLElement).offsetTop : 0,
                behavior: 'smooth',
              });
            });
          }
        } else {
          this.unpublishedAssets = resp.data.result.items;
          this.unpublishedItemsTotal = resp.data.result.count;
          this.unpublishedCurrentPage = resp.data.result.pageRequest.page;
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

  isLoading(): boolean {
    if (this.isLoadingUnpublished || this.isLoadingPublished) {
      return true;
    }
    return false;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
