<template>
    <div class="dashboard__inner">
        <div class="dashboard__inner__steps">
        <div class="dashboard__head">
            <h1>Create contract template</h1>
            <div class="dashboard__head__helpers">
                <button href="#" class="btn btn--outlineblue" @click="saveDraft">SAVE DRAFT</button>
            </div>
        </div>

        <div class="dashboard__form">
            <ul class="dashboard__form__nav">
                <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Select master contract</a></li>
                <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Build your contract</a></li>
                <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Save</a></li>
            </ul>
            <div class="dashboard__form__steps">
            <transition name="fade" mode="out-in">
            <div class="dashboard__form__steps__inner">
                <!-- steps here -->
                <contract-type-select ref="step1" v-show="currentStep == 1" :contractType.sync='contractType'></contract-type-select>
                <contract-builder ref="step2" :masterContractType="contractType" :templateContractFilled.sync="templateContractFilled" :templateContract.sync="templateContract" v-show="currentStep == 2"></contract-builder>
                <contract-details ref="step3" :templateContract.sync="templateContract" v-show="currentStep == 3"></contract-details>
            </div>
            </transition>
            </div>
            <div class="dashboard__form__navbuttons" v-if="showHideButtons()">
              <button class="btn btn--std btn--blue" v-if="this.currentStep !== 1" @click.prevent="previousStep()">PREVIOUS</button>
              <button class="btn btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and save' : 'NEXT' }}</button>
            </div>
        </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import ProviderContractApi from '@/service/provider-contract';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import {
  EnumMasterContractSortField,
  MasterContract,
  ProviderTemplateContractCommand,
} from '@/model/provider-contract';
import { Sorting } from '@/model/request';
import ContractBuilder from '@/components/Contracts/ContractBuilder.vue';
import ContractTypeSelect from '@/components/Contracts/ContractTypeSelect.vue';
import ContractDetails from '@/components/Contracts/ContractDetails.vue';
import store from '@/store';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
    ContractBuilder,
    ContractTypeSelect,
    ContractDetails,
  },
})
export default class ContractCreateTemplate extends Vue {
  $refs!: {
    step1: InstanceType<typeof ValidationObserver>,
    step2: InstanceType<typeof ValidationObserver>,
    step3: InstanceType<typeof ValidationObserver>,
    refObserver: InstanceType<typeof ValidationObserver>,
  };

  totalSteps: number;

  currentStep: number;

  providerContractApi: ProviderContractApi;

  masterContracts: MasterContract[];

  templateContract: ProviderTemplateContractCommand;

  contractType: MasterContract | null;

  templateContractFilled: boolean;

  constructor() {
    super();

    this.totalSteps = 3;
    this.currentStep = 1;
    this.contractType = null;
    this.masterContracts = [];
    this.providerContractApi = new ProviderContractApi();
    this.templateContractFilled = false;
    this.templateContract = {
      templateKey: '',
      title: '',
      subtitle: '',
      sections: [],
    };
  }

  created(): void {
    this.getMasterContracts();
  }

  getMasterContracts(): void {
    const sortOrder: Sorting <EnumMasterContractSortField> = {
      id: EnumMasterContractSortField.TITLE,
      order: 'DESC',
    };
    this.providerContractApi.findAllMasterContracts(null, 0, 50, sortOrder).then((response) => {
      this.masterContracts = response.data.result.items;
    });
  }

  goToStep(step:number):void {
    this.currentStep = step;
  }

  previousStep():void {
    if (this.currentStep <= 1) return;
    this.currentStep -= 1;
  }

  nextStep():void {
    this.$refs[`step${this.currentStep}`].$refs.refObserver.validate().then((isValid) => {
      if (isValid) {
        if (this.currentStep === this.totalSteps) {
          console.log('submit');
          this.saveDraft();
        } else {
          this.currentStep += 1;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    });
  }

  saveDraft(): void {
    store.commit('setLoading', true);
    this.providerContractApi.createDraft(this.templateContract).then((response) => {
      store.commit('setLoading', false);
      if (response.success) {
        store.commit('setLoading', true);
        this.providerContractApi.publishDraft(response.result.key).then((responsePublish) => {
          store.commit('setLoading', false);
          if (responsePublish.success) {
            this.$router.push('/dashboard/contracts');
          }
        });
      }
    });
  }

  showHideButtons(): boolean {
    if (this.currentStep === 2 && !this.templateContractFilled) {
      return false;
    }
    return true;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_forms.scss";
</style>
