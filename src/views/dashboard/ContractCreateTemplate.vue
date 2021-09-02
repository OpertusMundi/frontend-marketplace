<template>
    <div class="dashboard__inner">
        <div class="dashboard__inner__steps">
        <div class="dashboard__head">
            <h1>Add an asset</h1>
            <div class="dashboard__head__helpers">
                <button href="#" class="btn btn--outlineblue" @click="onSaveDraft">SAVE DRAFT</button>
            </div>
        </div>

        <div class="dashboard__form">
            <ul class="dashboard__form__nav">
                <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Select master contract</a></li>
                <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Build your contract</a></li>
                <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Review and save</a></li>
            </ul>
            <div class="dashboard__form__steps">
            <transition name="fade" mode="out-in">
            <div class="dashboard__form__steps__inner">
                <!-- steps here -->
                <div class="dashboard__form__step dashboard__form__step--cente" v-if="currentStep == 1">
                  <validation-observer ref="step1">
                    <validation-provider v-slot="{ errors }" name="ContractType" rules="required">
                      <div class="form-group">
                        <label for="multiselect_type">Master Contract</label>
                        <multiselect id="multiselect_type" v-model="contractType" :options="masterContracts" label="title" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select contract type"></multiselect>
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                      </div>
                    </validation-provider>
                  </validation-observer>
                </div>
                <contract-builder :masterContractType="contractType" v-if="currentStep == 2"></contract-builder>
                <div class="dashboard__form__step dashboard__form__step--cente" v-if="currentStep == 3">
                  <validation-observer ref="step3">
                    zdf
                  </validation-observer>
                </div>
                <!-- <div class="dashboard__form__errors" v-if="errors.length">
                    <ul>
                        <li>desc</li>
                    </ul>
                </div> -->

            </div>
            </transition>
            </div>
            <div class="dashboard__form__navbuttons">
            <button class="btn btn--std btn--blue" v-if="this.currentStep !== 1" @click.prevent="previousStep()">PREVIOUS</button>
            <button class="btn btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and submit for review' : 'NEXT' }}</button>
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
import { EnumMasterContractSortField, MasterContract } from '@/model/provider-contract';
import { Sorting } from '@/model/request';
import ContractBuilder from '@/components/Contracts/ContractBuilder.vue';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
    ContractBuilder,
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

  contractType: MasterContract | null;

  constructor() {
    super();

    this.totalSteps = 3;
    this.currentStep = 1;
    this.contractType = null;
    this.masterContracts = [];
    this.providerContractApi = new ProviderContractApi();
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
    this.$refs[`step${this.currentStep}`].validate().then((isValid) => {
      if (isValid) {
        if (this.currentStep === this.totalSteps) {
          console.log('submit');
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

  onSaveDraft(): void {
    console.log('save draft');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_forms.scss";
</style>
