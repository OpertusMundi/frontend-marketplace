<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Contracts</h1>
        <router-link to="/dashboard/contracts/create-template" class="btn--std btn--blue">CREATE CONTRACT TEMPLATE</router-link>
      </div>
    </div>
    <horizontal-card
      v-for="contractTemplate in contractTemplates"
      v-bind:key="contractTemplate.key"
      :title="`Template #${contractTemplate.templateKey}`"
      :subtitle="contractTemplate.title"
      :link="`/dashboard/contracts/${contractTemplate.templateKey}`"
      linkText="VIEW CONTRACT"
      :infoText="`<strong>Last updated</strong>: ${formatDate(contractTemplate.modifiedAt)} • <strong>Version</strong>: ${contractTemplate.version}`"
      topRight="ACTIVE"
    />
    <pagination :currentPage="currentPage" :itemsPerPage="itemsPerPage" :itemsTotal="totalContracts" @pageSelection="getContracts($event)"></pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import HorizontalCard from '@/components/HorizontalCard.vue';
import Pagination from '@/components/Pagination.vue';
import ProviderContractApi from '@/service/provider-contract';
import { EnumProviderContractSortField, ProviderTemplateContract } from '@/model/provider-contract';
import { Sorting } from '@/model/request';
import moment from 'moment';

@Component({
  components: {
    HorizontalCard,
    Pagination,
  },
})
export default class Contracts extends Vue {
  providerContractApi: ProviderContractApi;

  contractTemplates: ProviderTemplateContract[];

  itemsPerPage: number;

  currentPage: number;

  totalContracts: number | null;

  sortOrder: Sorting<EnumProviderContractSortField>;

  constructor() {
    super();

    this.contractTemplates = [];
    this.providerContractApi = new ProviderContractApi();
    this.itemsPerPage = 10;
    this.currentPage = 0;
    this.totalContracts = null;
    this.sortOrder = {
      id: EnumProviderContractSortField.CREATED_ON,
      order: 'DESC',
    };
  }

  mounted(): void {
    this.getContracts(0);
  }

  getContracts(page: number): void {
    store.commit('setLoading', true);
    this.providerContractApi.findAllTemplates(page, this.itemsPerPage, this.sortOrder).then((response) => {
      const { data } = response;
      store.commit('setLoading', false);
      if (data.success) {
        this.contractTemplates = data.result.items;
        this.totalContracts = data.result.count;
        this.currentPage = data.result.pageRequest.page;
      } else {
        // TODO: handle error
      }
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_dashboard.scss";
</style>