<template>
  <div class="dashboard__form__step dashboard__form__step--full-width" style="padding:0">
    <div class="contract-builder" v-if="masterContract">
      <div class="contract-builder__index">
        <h4>Document Outline</h4>

        <scrollactive ref="scrollactive" v-if="masterContract" v-on:itemchanged="onItemChanged" class="my-nav" active-class="active" :offset="80" :duration="800" bezier-easing-value=".5,0,.35,1" scroll-container-selector="#inhalt">
          <a v-for="(section, index) in masterContract.sections" :style="{ paddingLeft: 0.1 * section.indent + 'em' }" v-bind:key="section.id" :href="`#id-${index}`" class="scrollactive-item">Section {{ section.index }} {{ section.title }}</a>
        </scrollactive>
      </div>
      <div class="contract-builder__main" v-if="masterContract">
        <div class="contract-builder__main__inner contract-builder__main__inner--no-border">
          <div id="inhalt" class="contract-builder__main__content">
            <div v-for="(section, index) in masterContract.sections" :key="section.id">
              <h2 :id="`id-${index}`">{{ section.index }} {{ section.title }}</h2>
              <div v-if="section.dynamic && section.variable">
                <div v-for="(options, index) in section.options" :key="options.id">
                  <div v-if="section.option === index">
                    <div v-html="options.bodyHtml"></div>
                  </div>
                </div>
              </div>
              <div v-else-if="!section.dynamic && section.variable">
                <div v-for="options in section.options" :key="options.id">
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { MasterContract, ProviderTemplateContract } from '@/model/provider-contract';

@Component({
  components: {},
})
export default class ContractViewer extends Vue {
  @Prop({ required: true }) readonly selectedMasterContract!: MasterContract;

  @Prop({ default: null }) readonly draftTemplateContract!: ProviderTemplateContract;

  @Prop({ required: true }) readonly templateContract!: any;

  masterContract: MasterContract | null;

  contractSelectedSections: any | null;

  timer: any | null;

  constructor() {
    super();

    this.masterContract = null;
    this.contractSelectedSections = null;
    this.timer = null;
  }

  created(): void {
    if (this.selectedMasterContract) {
      this.getMasterContract();
    }
  }

  onItemChanged(event: any | null, currentItem: any, lastActiveItem: any): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.scrollToActive(currentItem);
    }, 200);
  }

  scrollToActive(activeIndex: any): void {
    setTimeout(() => {
      activeIndex.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }, 1000);
  }

  getMasterContract(): void {
    if (this.draftTemplateContract) {
      // Draft contract
      if (this.draftTemplateContract.masterContract) {
        this.masterContract = this.draftTemplateContract.masterContract;
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index));
        this.masterContract.sections.sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
        this.contractSelectedSections = this.masterContract.sections.map((item, i) => ({ ...item, ...this.draftTemplateContract.sections![i] }));
        this.masterContract.sections = this.contractSelectedSections;
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
.my-nav {
  .scrollactive-item {
    display: block;
    font-size: 0.8em;
    margin-bottom: 5px;
    color: #6c6c6c;
    &.active {
      color: #190aff;
    }
  }
}
</style>
