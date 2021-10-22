<template>
  <div class="dashboard__form__step dashboard__form__step--full-width" style="padding:0">
    <div class="contract-builder" v-if="masterContract">
      <div class="contract-builder__index">
        <h4>Document Outline</h4>
        <ul>
          <li v-for="section in masterContract.sections" v-bind:key="section.id" :style="{ paddingLeft: 0.1 * section.indent + 'em' }" class="contract-builder__index__item" :class="{ active: selectedSection.id == section.id }">
            <a href="#" @click.prevent>Section {{ section.index }} {{ section.title }}</a>
          </li>
        </ul>
      </div>
      <div class="contract-builder__main" v-if="selectedSection">
        <div class="contract-builder__main__inner">
          <div class="contract-builder__main__content">
            <div v-for="section in masterContract.sections" :key="section.id">
              <h2>{{ section.index }} - {{ section.title }}</h2>
              <div v-if="section.dynamic && section.variable">
                <div v-for="(options, index) in section.options" :key="options.id">
                  <div v-if="section.option === index">
                    <span>{{ index }}</span>
                    <div :class="section.option === index ? 'active' : ''" v-html="options.bodyHtml"></div>
                    <div>{{ section.option }}</div>
                  </div>
                </div>
              </div>
              <div v-else-if="!section.dynamic && section.variable">
                <div v-for="(options, index) in section.options" :key="options.id">
                  <span>{{ index }}</span>
                  <div v-html="options.bodyHtml"></div>
                  <div class="active">
                    <p v-if="section.optional">DISCARD</p>
                    <p v-else>KEEP</p>
                  </div>
                </div>
              </div>
              <div v-else>
                <div v-for="options in section.options" :key="options.id">
                  <div v-html="options.bodyHtml"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Watch, Prop,
} from 'vue-property-decorator';
import { MasterContract, ProviderTemplateContract } from '@/model/provider-contract';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import ProviderContractApi from '@/service/provider-contract';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class ContractBuilder extends Vue {
  @Prop({ required: true }) readonly selectedMasterContract!: MasterContract;

  @Prop({ default: null }) readonly draftTemplateContract!: ProviderTemplateContract;

  @Prop({ required: true }) readonly templateContract!: any;

  providerContractApi: ProviderContractApi;

  masterContract: MasterContract | null;

  masterContract1: MasterContract | null;

  selectedSection: any | null;

  keepCurrentSection: boolean;

  selectedSectionValue: any | null;

  contractSelectedSections: any | null;

  constructor() {
    super();

    this.providerContractApi = new ProviderContractApi();
    this.masterContract = null;
    this.masterContract1 = null;
    this.selectedSection = null;
    this.keepCurrentSection = true;
    this.selectedSectionValue = null;
    this.contractSelectedSections = null;
  }

  created(): void {
    if (this.selectedMasterContract) {
      this.getMasterContract();
    }
  }

  getMasterContract(): void {
    if (this.draftTemplateContract) {
      // Draft contract
      if (this.draftTemplateContract.masterContract) {
        this.masterContract = this.draftTemplateContract.masterContract;
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index));
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
        [this.selectedSection] = this.masterContract.sections;

        this.contractSelectedSections = this.masterContract.sections.map((item, i) => ({ ...item, ...this.draftTemplateContract.sections![i] }));
        this.masterContract.sections = this.contractSelectedSections;
        console.log(this.draftTemplateContract, this.masterContract, 'MASTER CONTRACT DRAFT');
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_contract-builder.scss';
.active > p {
  font-weight: bold;
  text-decoration: underline;
  color: blue;
}
</style>
