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
          <button v-if="!contract.defaultContract" href="#" class="btn btn--outlinedark" @click="deactivateContract()">DEACTIVATE</button>
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
    <div class="dashboard__form">
      <div class="dashboard__form__header">
        <h3>
          {{ contract.masterContract.title }}
        </h3>
        <a class="contract-link" href="" @click.prevent="exportPdf()">
          <span
            ><svg xmlns="http://www.w3.org/2000/svg" width="13.714" height="12" viewBox="0 0 13.714 12">
              <g id="Group_4257" data-name="Group 4257" transform="translate(-0.002 -32)">
                <path id="Path_10069" data-name="Path 10069" d="M9.431,73.432H1.716V65.717H4.288V64H.859A.857.857,0,0,0,0,64.86v9.429a.857.857,0,0,0,.857.857h9.428a.856.856,0,0,0,.857-.857V70.03H9.431Z" transform="translate(0 -31.145)" fill="#333" />
                <path id="Path_10070" data-name="Path 10070" d="M138.115,34.658l-3.429-2.571a.429.429,0,0,0-.686.343v1.286h-1.286A4.719,4.719,0,0,0,128,38.429a.429.429,0,0,0,.812.192l.1-.2a3.836,3.836,0,0,1,3.45-2.133H134v1.286a.429.429,0,0,0,.686.343l3.429-2.571a.429.429,0,0,0,0-.686Z" transform="translate(-124.57)" fill="#333" />
              </g></svg></span
          >Export to PDF</a
        >
      </div>
      <div class="dashboard__form__steps">
        <transition name="fade" mode="out-in">
          <div class="dashboard__form__steps__inner">
            <contract-viewer :selectedMasterContract.sync="selectedMasterContract" :draftTemplateContract="draftTemplateContract" :templateContract.sync="templateContract" v-if="contract"></contract-viewer>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProviderContractApi from '@/service/provider-contract';
import { ProviderTemplateContract, MasterContract, ProviderTemplateContractCommand } from '@/model/provider-contract';
import ContractViewer from '@/components/Contracts/ContractViewer.vue';
import store from '@/store';
import moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  components: {
    ContractViewer,
  },
})
export default class ContractSingle extends Vue {
  contractKey: string | null;

  providerContractApi: ProviderContractApi;

  contract: ProviderTemplateContract | null;

  draftTemplateContract: ProviderTemplateContract | null;

  selectedMasterContract: MasterContract | null;

  templateContractFilled: boolean;

  templateContract: ProviderTemplateContractCommand;

  constructor() {
    super();

    this.contractKey = null;
    this.providerContractApi = new ProviderContractApi();
    this.contract = null;
    this.selectedMasterContract = null;
    this.draftTemplateContract = null;
    this.templateContractFilled = false;
    this.templateContract = {
      templateKey: '',
      title: '',
      subtitle: '',
      sections: [],
    };
  }

  mounted(): void {
    this.contractKey = this.$route.params.key;
    store.commit('setLoading', true);
    this.providerContractApi.findOneTemplate(this.contractKey).then((response) => {
      store.commit('setLoading', false);
      if (response.success) {
        this.contract = response.result;
        this.draftTemplateContract = response.result;
        if (this.draftTemplateContract.masterContract) {
          this.selectedMasterContract = this.draftTemplateContract.masterContract;
        }
      } else {
        // TODO: handle error
        console.log('error fetching contract info');
      }
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }

  exportPdf(): void {
    store.commit('setLoading', true);
    this.providerContractApi.printTemplate(this.$route.params.key).then((response) => {
      const blob = new Blob([(response as any).data], { type: 'application/pdf' });
      saveAs(blob, this.$route.params.key);
      store.commit('setLoading', false);
    });
  }

  deactivateContract(): void {
    store.commit('setLoading', true);
    this.providerContractApi.deactivate(this.$route.params.key).then((response) => {
      if (response.success) {
        store.commit('setLoading', false);
        this.$router.push('/dashboard/contracts');
      }
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
@import '@/assets/styles/_contracts.scss';
@import '@/assets/styles/_forms.scss';
</style>
