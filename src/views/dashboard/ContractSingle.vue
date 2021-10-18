<template>
  <div class="dashboard__inner" v-if="contract">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/contracts" class="asset__head__breadcrumps"
        ><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5" /></svg>BACK</router-link
      >
      <div class="dashboard__head__helpers dashboard__head__helpers--justify-center mt-xs-30">
        <h1>{{ contract.title }}</h1>
        <div class="dashboard__head__settings">
          <!-- <a href="#">ok</a> -->
        </div>
      </div>
    </div>
    <div class="contract-single">
      <ul class="contract-single__info">
        <li>
          <strong>Description</strong>
          <p>{{ contract.subtitle }}</p>
        </li>
        <li>
          <strong>Master Contract</strong>
          <p>{{ contract.masterContract.title }}</p>
        </li>
        <li>
          <strong>Date Created</strong>
          <p>{{ formatDate(contract.createdAt) }}</p>
        </li>
        <li>
          <strong>Last update</strong>
          <p>{{ formatDate(contract.modifiedAt) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProviderContractApi from '@/service/provider-contract';
import { ProviderTemplateContract } from '@/model/provider-contract';
import store from '@/store';
import moment from 'moment';

@Component
export default class ContractSingle extends Vue {
  contractKey: string | null;

  providerContractApi: ProviderContractApi;

  contract: ProviderTemplateContract | null;

  constructor() {
    super();

    this.contractKey = null;
    this.providerContractApi = new ProviderContractApi();
    this.contract = null;
  }

  mounted(): void {
    console.log(this.$route);
    this.contractKey = this.$route.params.key;
    store.commit('setLoading', true);
    this.providerContractApi.findOneTemplate(this.contractKey).then((response) => {
      store.commit('setLoading', false);
      if (response.success) {
        this.contract = response.result;
        console.log(response);
      } else {
        // TODO: handle error
        console.log('error fetching contract info');
      }
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
@import '@/assets/styles/_contracts.scss';
</style>
