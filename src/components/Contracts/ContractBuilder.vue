<template>
  <validation-observer ref="refObserver">
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
            <div class="contract-builder__main__top">
              <button class="btn btn--std btn--dark" @click="previousSection" v-if="!firstSection()">PREV</button>
              <h3>{{ selectedSection.index }} {{ selectedSection.title }}</h3>
              <button class="btn btn--std btn--dark" :disabled="!isValid()" @click="nextSection" v-if="!lastSection()">NEXT</button>
              <button class="btn btn--std btn--dark" :disabled="!isValid()" @click="finish" v-if="lastSection()">FINISH</button>
            </div>
            <div class="contract-builder__main__content">
              <div class="contract-builder__options" v-if="this.selectedSection.dynamic && this.selectedSection.variable">
                <label class="control control-radio" v-for="(option, index) in selectedSection.options" v-bind:key="`option_${index}`">
                  <strong v-html="option.bodyHtml"></strong>
                  <input type="radio" v-model="selectedSectionValue" :value="index" />
                  <div class="control_indicator"></div>
                </label>
              </div>
              <div class="contract-builder__options" v-else-if="this.selectedSection.optional && this.selectedSection.variable">
                <div class="contract-builder__option" v-for="(option, index) in selectedSection.options" v-bind:key="`option_${index}`" v-html="option.bodyHtml"></div>
                <label class="control control-radio">
                  DISCART
                  <input type="radio" v-model="selectedSectionValue" :value="true" />
                  <div class="control_indicator"></div>
                </label>
                <label class="control control-radio">
                  KEEP
                  <input type="radio" v-model="selectedSectionValue" :value="false" />
                  <div class="control_indicator"></div>
                </label>
              </div>
              <div v-else class="contract-builder__options" v-for="(option, index) in selectedSection.options" v-bind:key="`option_${index}`">
                <div class="contract-builder__option" v-html="option.bodyHtml"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <validation-provider name="Contract Template data" rules="required">
        <input type="hidden" v-model="templateFilled" />
      </validation-provider>
    </div>
  </validation-observer>
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

  @Prop({ required: true }) readonly templateContractFilled!: boolean;

  @Prop({ default: false }) readonly isDraft!: boolean;

  @Prop({ required: true }) readonly templateContract!: any;

  providerContractApi: ProviderContractApi;

  masterContract: MasterContract | null;

  templateContractC: any | null;

  selectedSection: any | null;

  keepCurrentSection: boolean;

  selectedSectionValue: number | null;

  currentSelectionValid: boolean;

  templateFilled: boolean | null;

  constructor() {
    super();

    this.providerContractApi = new ProviderContractApi();
    this.masterContract = null;
    this.selectedSection = null;
    this.keepCurrentSection = true;
    this.selectedSectionValue = null;
    this.currentSelectionValid = false;
    this.templateFilled = null;
    this.templateContractC = {};
  }

  created(): void {
    if (this.selectedMasterContract) {
      this.getMasterContract();
    }
  }

  @Watch('selectedMasterContract')
  selectedMasterContractChange(): void {
    this.getMasterContract();
  }

  @Watch('templateContractC', { immediate: true, deep: true })
  templateContractChange(): void {
    this.$emit('update:templateContract', this.templateContractC);
  }

  previousSection(): void {
    const currentSectionIndex = this.masterContract?.sections.map((e) => e.id).indexOf(this.selectedSection.id);
    if (!this.firstSection() && this.masterContract && currentSectionIndex !== undefined) {
      this.saveSection();
      this.selectedSection = this.masterContract?.sections[currentSectionIndex - 1];
      this.loadSelectedSectionValue();
      this.scrollToActive();
    }
  }

  nextSection(): void {
    const currentSectionIndex = this.masterContract?.sections.map((e) => e.id).indexOf(this.selectedSection.id);
    if (!this.lastSection() && this.masterContract && currentSectionIndex !== undefined) {
      this.saveSection();
      this.selectedSection = this.masterContract?.sections[currentSectionIndex + 1];
      this.loadSelectedSectionValue();
      this.scrollToActive();
    }
  }

  finish(): void {
    if (this.lastSection() && this.isValid()) {
      const currentSectionIndex = this.masterContract?.sections.map((e) => e.id).indexOf(this.selectedSection.id);
      if (this.masterContract && currentSectionIndex !== undefined) {
        this.saveSection();
      }
      this.templateFilled = true;
      this.$emit('update:templateContractFilled', this.templateFilled);
    }
  }

  scrollToActive(): void {
    const activeIndex = document.getElementsByClassName('contract-builder__index__item active')[0];
    activeIndex.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  isValid(): boolean {
    if ((this.selectedSection.dynamic && this.selectedSection.variable) || (this.selectedSection.optional && this.selectedSection.variable)) {
      if (this.selectedSectionValue === null) return false;
    }
    return true;
  }

  saveSection(): void {
    const selectedOptions: any = {
      masterSectionId: this.selectedSection.id,
      optional: this.selectedSection.optional,
      option: 0,
      subOption: null,
    };
    if (this.selectedSection.dynamic && this.selectedSection.variable) {
      selectedOptions.optional = false;
      selectedOptions.option = this.selectedSectionValue;
    } else if (this.selectedSection.optional && this.selectedSection.variable) {
      selectedOptions.optional = this.selectedSectionValue;
      selectedOptions.option = 0;
    }
    this.selectedSectionValue = null;
    const selectionExists = this.templateContractC.sections.find((o) => o.masterSectionId === this.selectedSection.id);
    if (selectionExists) {
      this.templateContractC.sections = this.templateContractC.sections.filter((item) => item.masterSectionId !== this.selectedSection.id);
    }
    this.templateContractC.sections.push(selectedOptions);
  }

  loadSelectedSectionValue(): void {
    const selectionExists = this.templateContractC.sections.find((o) => o.masterSectionId === this.selectedSection.id);
    if (selectionExists) {
      if (this.selectedSection.dynamic && this.selectedSection.variable) {
        this.selectedSectionValue = selectionExists.option;
      } else if (this.selectedSection.optional && this.selectedSection.variable) {
        this.selectedSectionValue = selectionExists.optional;
      }
    }
  }

  firstSection(): boolean {
    const currentSectionIndex = this.masterContract?.sections.map((e) => e.id).indexOf(this.selectedSection.id);
    if (currentSectionIndex === 0) {
      return true;
    }
    return false;
  }

  lastSection(): boolean {
    const currentSectionIndex = this.masterContract?.sections.map((e) => e.id).indexOf(this.selectedSection.id);
    if (currentSectionIndex) {
      if (currentSectionIndex + 1 === this.masterContract?.sections.length) {
        return true;
      }
    }
    return false;
  }

  getMasterContract(): void {
    if (this.draftTemplateContract) {
      if (this.draftTemplateContract.masterContract) {
        this.masterContract = this.draftTemplateContract.masterContract;
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
        this.initTemplateContract();
        [this.selectedSection] = this.masterContract.sections;
      }
    } else {
      this.providerContractApi.findOneMasterContract(this.selectedMasterContract.key).then((response) => {
        if (response.success) {
          this.masterContract = response.result;
          this.$emit('update:selectedMasterContract', this.masterContract);
          // this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index));
          this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
          this.initTemplateContract();
          [this.selectedSection] = this.masterContract.sections;
        } else {
          // TODO: handle error
        }
      });
    }
  }

  initTemplateContract(): void {
    this.templateContractC = {
      templateKey: this.masterContract?.key,
      title: this.masterContract?.title,
      subtitle: '',
      sections: [],
    };
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_contract-builder.scss';
</style>
