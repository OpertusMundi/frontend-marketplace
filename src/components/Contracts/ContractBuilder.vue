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

  masterContract1: MasterContract | null;

  templateContractC: any | null;

  selectedSection: any | null;

  keepCurrentSection: boolean;

  selectedSectionValue: any | null;

  currentSelectionValid: boolean;

  templateFilled: boolean | null;

  constructor() {
    super();

    this.providerContractApi = new ProviderContractApi();
    this.masterContract = null;
    this.masterContract1 = null;
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
      option: null,
      subOption: null,
    };
    console.log(this.selectedSectionValue, this.selectedSection, 'SELECTED DECTION VALUE');
    if (this.selectedSection.dynamic && this.selectedSection.variable) {
      selectedOptions.optional = false;
      selectedOptions.option = this.selectedSectionValue;
    } else if (this.selectedSection.optional && this.selectedSection.variable) {
      selectedOptions.optional = true;
      const value = this.convertBoolean(this.selectedSectionValue);
      console.log(value, 'METHOD BOOLENA');
      selectedOptions.option = this.convertBoolean(this.selectedSectionValue);
      // if (this.selectedSectionValue !== null) {
      //   selectedOptions.optional = true;
      //   selectedOptions.option = this.selectedSectionValue ? 1 : 0;
      //   console.log('INSIDE IF TO POST is NULLLLLLLLL', this.selectedSectionValue);
      // } else {
      //   selectedOptions.optional = true;
      //   selectedOptions.option = null;
      //   this.selectedSectionValue = null;
      //   console.log('IS NULLLLLLLLL V MODEL');
      // }
      // selectedOptions.option = this.convertBoolean(this.selectedSectionValue);

      console.log('if optional', selectedOptions.option, this.selectedSectionValue ? 1 : 0, this.convertBoolean(this.selectedSectionValue));
    }
    this.selectedSectionValue = null;
    const selectionExists = this.templateContractC.sections.find((o) => o.masterSectionId === this.selectedSection.id);
    if (selectionExists) {
      this.templateContractC.sections = this.templateContractC.sections.filter((item) => item.masterSectionId !== this.selectedSection.id);
    }
    this.templateContractC.sections.push(selectedOptions);
    console.log(this.templateContract, 'PUSHED');
  }

  convertBoolean(value: boolean): number | null {
    switch (value) {
      case null:
        return null;
      case true:
        return 1;
      case false:
        return 0;
      default:
        return null;
    }
  }

  loadSelectedSectionValue(): void {
    const selectionExists = this.templateContractC.sections.find((o) => o.masterSectionId === this.selectedSection.id);
    if (selectionExists) {
      if (this.selectedSection.dynamic && this.selectedSection.variable) {
        this.selectedSectionValue = selectionExists.option;
        console.log(this.selectedSectionValue, 'EXIST OPTION IF IF IF IF');
      } else if (this.selectedSection.optional && this.selectedSection.variable) {
        this.selectedSectionValue = this.convertValue(selectionExists.option);
        console.log(this.selectedSectionValue, selectionExists.option, 'EXIST OPTION INSIDE ELSE IF');
      }
    }
  }

  convertValue(value: number): boolean | null {
    switch (value) {
      case null:
        return null;
      case 0:
        return false;
      case 1:
        return true;
      default:
        return null;
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
      // Draft contract
      if (this.draftTemplateContract.masterContract) {
        this.masterContract = this.draftTemplateContract.masterContract;
        console.log(this.masterContract, 'is draft bri');
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index));
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
        console.log(this.masterContract, 'is draft bri AFTER SORTING');

        this.initTemplateContract();
        [this.selectedSection] = this.masterContract.sections;
        this.templateContractC.sections = this.draftTemplateContract.sections;
        console.log(this.masterContract, this.templateContractC, 'MASTER CONTRACT DRAFT');
      }
    } else {
      // New contract
      this.providerContractApi.findOneMasterContract(this.selectedMasterContract.key).then((response) => {
        if (response.success) {
          this.masterContract = response.result;
          console.log(this.masterContract, 'MASTER CONTRACT NEW');

          this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index));
          this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
          this.$emit('update:selectedMasterContract', this.masterContract);
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
