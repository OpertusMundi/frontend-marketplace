<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Terms & Restrictions</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Core terms</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Countries</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Use restricted for</a></li>
      </ul>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1">
            <div v-for="(row, i) in termsChunked" :key="i" class="row">
              <div class="col-sm-3" v-for="j in 4" :key="j">
                <div v-if="row[j - 1]" class="asset__section__tabs__term_container">
                  <img style="width: 35%" :src="`data:image/svg+xml;base64,${ row[j - 1].image }`" alt="restriction_icon">
                  <p>{{ row[j - 1].description }}</p>
                </div>
              </div>
            </div>
            <h4 v-if="termsChunked.length === 0">No core terms</h4>
          </li>
          <li v-if="activeTab == 2">
            <div v-for="(row, i) in countriesChunked" :key="i" class="row">
              <div class="col-sm-3" v-for="j in 4" :key="j">
                <div v-if="row[j - 1]" class="asset__section__tabs__term_container">
                  <img style="width: 35%" :src="`data:image/svg+xml;base64,${ row[j - 1].image }`" alt="restriction_icon">
                  <p>{{ row[j - 1].description }}</p>
                </div>
              </div>
            </div>
            <h4 v-if="countriesChunked.length === 0">No country restrictions</h4>
          </li>
          <li v-if="activeTab == 3">
            <div v-for="(row, i) in restrictionsChunked" :key="i" class="row">
              <div class="col-sm-3" v-for="j in 4" :key="j">
                <div v-if="row[j - 1]" class="asset__section__tabs__term_container">
                  <img style="width: 35%" :src="`data:image/svg+xml;base64,${ row[j - 1].image }`" alt="restriction_icon">
                  <p>{{ row[j - 1].description }}</p>
                </div>
              </div>
            </div>
            <h4 v-if="restrictionsChunked.length === 0">No restrictions</h4>
          </li>
        </ul>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { EnumContractIconCategory } from '@/model/contract';
import { CatalogueItemDetails, ContractTerm } from '@/model/catalogue';
import { chunk as lodashChunk } from 'lodash';

@Component
export default class TermsAndRestrictions extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItemDetails;

  activeTab: number;

  termsChunked: ContractTerm[][];

  countriesChunked: ContractTerm[][];

  restrictionsChunked: ContractTerm[][];

  constructor() {
    super();

    this.activeTab = 1;

    const terms = this.catalogueItem.contract.terms.filter((x) => x.category === EnumContractIconCategory.Terms);
    const countries = this.catalogueItem.contract.terms.filter((x) => x.category === EnumContractIconCategory.Countries);
    const restrictions = this.catalogueItem.contract.terms.filter((x) => x.category === EnumContractIconCategory.Restrictions);

    this.termsChunked = lodashChunk(terms, 4);
    this.countriesChunked = lodashChunk(countries, 4);
    this.restrictionsChunked = lodashChunk(restrictions, 4);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
