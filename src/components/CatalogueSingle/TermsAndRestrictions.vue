<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Terms & Restrictions</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs" v-show="!isSectionMinified">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Core terms</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }" v-if="!catalogueItem.contract.type || catalogueItem.contract.type !== 'UPLOADED_CONTRACT'">Countries</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }" v-if="!catalogueItem.contract.type || catalogueItem.contract.type !== 'UPLOADED_CONTRACT'">Use restricted for</a></li>
      </ul>
    </div>
    <div class="asset__section__content" v-show="!isSectionMinified">
      <div class="asset__section__content__inner">
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1">
            <template v-if="catalogueItem.contract.type === 'UPLOADED_CONTRACT'">
              <div class="row">
                <div class="col-sm-3">
                  <div class="asset__section__tabs__term_container">
                    <svg data-name="Group 7702" xmlns="http://www.w3.org/2000/svg" width="45" height="54" viewBox="0 0 45 54"><defs><clipPath id="a"><path data-name="Rectangle 5688" fill="none" d="M0 0h45v54H0z"/></clipPath></defs><g data-name="Group 7701" clip-path="url(#a)" fill="#333"><path data-name="Path 14403" d="M24.629 3v14.054a3.1 3.1 0 0 0 3.1 3.1H42V51H3V3Zm1-3H2a2 2 0 0 0-2 2v50a2 2 0 0 0 2 2h41a2 2 0 0 0 2-2V19.154a2 2 0 0 0-2-2H27.729a.1.1 0 0 1-.1-.1V2a2 2 0 0 0-2-2"/><path data-name="Path 14404" d="M30.721 1.231v12.524a.524.524 0 0 0 .524.523h12.523a.524.524 0 0 0 .371-.895L31.616.861a.524.524 0 0 0-.895.37"/><path data-name="Path 14405" d="M11.52 37.341a2.393 2.393 0 1 1 0 4.785H9.7v2.916H8.429v-7.7Zm-1.82 3.63h1.683a1.24 1.24 0 1 0 0-2.475H9.7Z"/><path data-name="Path 14406" d="M17.372 37.341c2.058 0 3.169 1.046 3.169 3.136v1.43c0 2.09-1.111 3.135-3.169 3.135h-2.53v-7.7Zm-1.254 6.546h1.265a1.688 1.688 0 0 0 1.893-1.936v-1.519a1.693 1.693 0 0 0-1.893-1.932h-1.265Z"/><path data-name="Path 14407" d="M26.5 37.341V38.5h-3.574v2.113h3.356v1.144h-3.356v3.289H21.65v-7.7Z"/><path data-name="Path 14408" d="M34.718 40.694a.269.269 0 0 0-.241-.155h-1.062v-3.453a.266.266 0 0 0-.266-.265h-1.062a.266.266 0 0 0-.266.265v3.453h-1.062a.267.267 0 0 0-.266.266.27.27 0 0 0 .066.175l1.859 2.12a.265.265 0 0 0 .375.023.134.134 0 0 0 .025-.023l1.859-2.125a.269.269 0 0 0 .041-.286"/><path data-name="Path 14409" d="M35.539 42.664v1.594h-5.844v-1.594h-1.062v2.125a.531.531 0 0 0 .531.531h6.906a.531.531 0 0 0 .531-.531v-2.125Z"/></g></svg>
                    <p class="mt-xs-10">The supplier provided their own terms for this asset. You can download the file <a href="" @click.prevent="downloadCustomContract" style="font-size: inherit">here.</a></p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-for="(row, i) in termsChunked" :key="i" class="row">
                <div class="col-sm-3" v-for="j in 4" :key="j">
                  <div v-if="row[j - 1]" class="asset__section__tabs__term_container">
                    <img style="width: 35%" :src="`data:image/svg+xml;base64,${ row[j - 1].image }`" alt="restriction_icon">
                    <p>{{ row[j - 1].description }}</p>
                  </div>
                </div>
              </div>
              <h4 v-if="termsChunked.length === 0">No core terms</h4>
            </template>
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
    <a @click.prevent="isSectionMinified = !isSectionMinified" href="#" class="asset__section__toggle" :class="{'asset__section__toggle--upside-down': !isSectionMinified}"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ProviderAssetsApi from '@/service/provider-assets';
import { EnumContractIconCategory } from '@/model/contract';
import { CatalogueItemDetails, ContractTerm, TemplateContract } from '@/model/catalogue';
import { chunk as lodashChunk } from 'lodash';

@Component
export default class TermsAndRestrictions extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItemDetails;

  providerAssetsApi: ProviderAssetsApi;

  activeTab: number;

  termsChunked: ContractTerm[][];

  countriesChunked: ContractTerm[][];

  restrictionsChunked: ContractTerm[][];

  isSectionMinified = false;

  constructor() {
    super();

    this.providerAssetsApi = new ProviderAssetsApi();

    this.activeTab = 1;

    // TODO: Update code for handling UploadedContract
    const contract = this.catalogueItem.contract as TemplateContract;

    if (!contract.terms) {
      this.termsChunked = [];
      this.countriesChunked = [];
      this.restrictionsChunked = [];
      return;
    }

    const terms = contract.terms.filter((x) => x.category === EnumContractIconCategory.Terms);
    const countries = contract.terms.filter((x) => x.category === EnumContractIconCategory.Countries);
    const restrictions = contract.terms.filter((x) => x.category === EnumContractIconCategory.Restrictions);

    this.termsChunked = lodashChunk(terms, 4);
    this.countriesChunked = lodashChunk(countries, 4);
    this.restrictionsChunked = lodashChunk(restrictions, 4);
  }

  downloadCustomContract(): void {
    console.log(this.$route.params.id);
    this.providerAssetsApi.downloadContract(this.$route.params.id);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
