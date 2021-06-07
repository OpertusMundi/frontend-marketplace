<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">

        <h1>Assets</h1>
        <router-link to="/dashboard/assets/create" class="btn--std btn--blue">ADD AN ASSET</router-link>

        <catalogue-card v-for="asset, i in nonPublishedAssets" v-bind:key="asset.id" :asset="asset" :class="{'mt-xs-20': i==0}"></catalogue-card>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DraftAssetApi from '@/service/draft';
import CatalogueCard from '@/components/Catalogue/Card.vue';
import { AssetDraft, EnumDraftStatus, EnumSortField } from '@/model/draft';
import { Order } from '@/model/request';

@Component({
  components: {
    CatalogueCard,
  },
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  nonPublishedAssets: AssetDraft[];

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.nonPublishedAssets = [];
  }

  mounted(): void {
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
      page: 0,
      size: 5,
    };
    const sort = {
      id: EnumSortField.CREATED_ON,
      order: 'ASC' as Order,
    };
    this.draftAssetApi.find(query, pageRequest, sort).then((resp) => {
      if (resp.data.success) {
        this.nonPublishedAssets = resp.data.result.items;
        console.log(this.nonPublishedAssets);
      } else {
        console.log('error', resp.data);
      }
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
