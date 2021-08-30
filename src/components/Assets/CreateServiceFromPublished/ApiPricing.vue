<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--pricing">
      <div class="dashboard__form__step__title">
        <h3>Pricing model</h3>
        <p>Assign one or more pricing models to your asset. If there are multiple, select one as default. Some options may be disabled based on the previous steps. All prices must not include VAT.</p>
      </div>
      <div class="dashboard__form__step__pricing__">
        <div class="dashboard__form__step__pricing__inner">
          <div class="row">
            <div class="col-md-4">
              <button class="btn btn--std btn--blue" @click="addPricingModel" :disabled="selectedPricingModelForEditingLocal !== null">Add Pricing Model</button>
              <!-- a dummy hidden input to be cathced by validation observer if no pricing model is selected -->
              <div v-if="!pricingModelsLocal.length">
                <validation-provider v-slot="{ errors }" name="pricing models" rules="required">
                  <div class="form-group mt-xs-20">
                    <!-- <input :value="pricingModels.length ? 'x' : ''" type="text"> -->
                    <input type="text" hidden>
                    <div class="errors" v-if="errors.length"><span class="mt-xs-20">At least one pricing model is required</span></div>
                  </div>
                </validation-provider>
              </div>

              <div class="mt-xs-20">
                <button class="card card--clickable" :class="i == selectedPricingModelForEditingLocal ? 'card--selected' : ''" @click="selectedPricingModelForEditingLocal = i" v-for="(pricingModel, i) in pricingModelsLocal" :key="i">Pricing Model {{ i + 1 }}</button>
              </div>
            </div>
            <div class="col-md-3">
              <div v-if="selectedPricingModelForEditingLocal !== null">
                <validation-provider v-slot="{ errors }" name="Pricing model" rules="required">
                <div class="form-group">
                  <form>
                    <div v-for="model in pricingModelTypes" :key="model.priceModel">
                      <label class="control control-radio" :for="`model_option_${model.priceModel}`">
                        <!-- <input @change="onChangePricingModelType(model.priceModel)" v-model="tempSelectedType" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel"> -->
                        <input @change="onChangePricingModelType(model.priceModel)" v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].type" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel">
                        {{ model.name }}
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </form>
                  <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                </div>
                </validation-provider>
                <button class="btn btn--std btn--outlineblue" @click="removePricingModel">discard</button>
              </div>
            </div>
            <div class="col-md-5">
              <div v-if="selectedPricingModelForEditingLocal !== null && pricingModelsLocal[selectedPricingModelForEditingLocal].type">
                <validation-observer ref="refPricingModelDetails">
                  <!-- free -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'FREE'">
                  </div>
                  <!-- per call with prepaid -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_CALL_WITH_PREPAID'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="pcwp_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="pcwp_price" name="pcwp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(prePaidTier, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required">
                          <div class="form-group">
                            <label for="pcwp_count">Count</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].count" type="number" class="form-group__text" id="pcwp_count" name="pcwp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required">
                          <div class="form-group">
                            <label for="pcwp_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].discount" type="number" class="form-group__text" id="pcwp_discount" name="pcwp_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="onRemoveDiscount(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- per call with block rate -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_CALL_WITH_BLOCK_RATE'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="pcwbr_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="pcwbr_price" name="pcwbr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required">
                          <div class="form-group">
                            <label for="pcwbr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="pcwbr_count" name="pcwbr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required">
                          <div class="form-group">
                            <label for="pcwbr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="pcwbr_discount" name="pcwbr_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="onRemoveDiscount(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- per row with prepaid -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_ROW_WITH_PREPAID'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="prwp_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="prwp_price" name="prwp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(prePaidTier, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required">
                          <div class="form-group">
                            <label for="prwp_count">Count</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].count" type="number" class="form-group__text" id="prwp_count" name="prwp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required">
                          <div class="form-group">
                            <label for="prwp_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].discount" type="number" class="form-group__text" id="prwp_discount" name="prwp_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="onRemoveDiscount(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- per row with block rate -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_ROW_WITH_BLOCK_RATE'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="prwbr_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="prwbr_price" name="prwbr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required">
                          <div class="form-group">
                            <label for="prwbr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="prwbr_count" name="prwbr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required">
                          <div class="form-group">
                            <label for="prwbr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="prwbr_discount" name="prwbr_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="onRemoveDiscount(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- common fields for all pricing models -->
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].includeDomainRestrictions" type="checkbox" id="include_domain_restrictions" name="include_domain_restrictions">
                    <label for="include_domain_restrictions">Include domain restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].includeDomainRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Domain Restrictions</label>
                      <!-- <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].domainRestrictions" track-by="code" placeholder="Search domain" label="name" :options="menusData.domainRestrictions" :multiple="true">
                      </multiselect> -->
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].domainRestrictions" placeholder="Select domains" :options="menusData.domainRestrictions" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].includeCoverageRestrictions" type="checkbox" id="include_coverage_restrictions" name="include_coverage_restrictions">
                    <label for="include_coverage_restrictions">Include coverage restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].includeCoverageRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Coverage Restrictions</label>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].coverageRestrictionContinents" track-by="code" placeholder="Restrict coverage by continents" label="name" :options="menusData.continents" :multiple="true">
                      </multiselect>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].coverageRestrictionCountries" track-by="code" placeholder="Restrict coverage by countries" label="name" :options="menusData.countries" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].includeConsumerRestrictions" type="checkbox" id="include_consumer_restrictions" name="include_consumer_restrictions">
                    <label for="include_consumer_restrictions">Include consumer restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].includeConsumerRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Consumer Restrictions</label>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].consumerRestrictionContinents" track-by="code" placeholder="Restrict consumers by continents" label="name" :options="menusData.continents" :multiple="true">
                      </multiselect>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].consumerRestrictionCountries" track-by="code" placeholder="Restrict consumers by countries" label="name" :options="menusData.countries" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                </validation-observer>
                <button class="btn btn--std btn--blue mt-xs-20" @click="setPricingModel">Set Pricing Model</button>
              </div>

              <!-- a dummy hidden input to be cathced by validation observer if pricing model editing is open -->
              <div v-if="selectedPricingModelForEditingLocal !== null && pricingModelsLocal[selectedPricingModelForEditingLocal].type">
                <validation-provider v-slot="{ errors }" name="pricing models" rules="required">
                  <div class="form-group mt-xs-20">
                    <input type="text" hidden>
                    <div class="errors" v-if="errors.length"><span class="mt-xs-20">Set or discard pricing model to continue.</span></div>
                  </div>
                </validation-provider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import {
  BasePricingModelCommand,
  DiscountRate,
  EnumPricingModel,
  FreePricingModelCommand,
  CallPrePaidPricingModelCommand,
  CallBlockRatePricingModelCommand,
  RowPrePaidPricingModelCommand,
  RowBlockRatePricingModelCommand,
  PrePaidTier,
} from '@/model/pricing-model';
import store from '@/store';
import { EnumContinent } from '@/model/enum';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class ApiPricing extends Vue {
  @Prop({ required: true }) private pricingModels!: BasePricingModelCommand[];

  @Prop({ required: true }) private selectedPricingModelForEditing!: number | null;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
    refPricingModelDetails: InstanceType<typeof ValidationObserver>,
  }

  pricingModelsLocal: BasePricingModelCommand[];

  selectedPricingModelForEditingLocal: number | null;

  pricingModelTypes: { name: string, priceModel: EnumPricingModel }[];

  menusData: {
    domainRestrictions: string[],
    continents: any[],
    countries: any[],
  };

  constructor() {
    super();

    this.menusData = { domainRestrictions: [], continents: [], countries: [] };

    this.menusData.domainRestrictions = store.getters.getConfig.configuration.asset.domains;

    this.menusData.continents = [
      {
        name: 'Europe',
        code: EnumContinent.EUROPE,
      },
      {
        name: 'Africa',
        code: EnumContinent.AFRICA,
      },
      {
        name: 'Asia',
        code: EnumContinent.ASIA,
      },
      {
        name: 'North America',
        code: EnumContinent.NORTH_AMERICA,
      },
      {
        name: 'South America',
        code: EnumContinent.SOUTH_AMERICA,
      },
      {
        name: 'Oceania',
        code: EnumContinent.OCEANIA,
      },
      {
        name: 'Antarctica',
        code: EnumContinent.ANTARCTICA,
      },
    ];

    this.menusData.countries = store.getters.getConfig.configuration.europeCountries;

    this.pricingModelsLocal = [];

    this.selectedPricingModelForEditingLocal = this.selectedPricingModelForEditing;

    this.pricingModelTypes = [
      { name: 'Free', priceModel: EnumPricingModel.FREE },
      { name: 'Per call with prepaid', priceModel: EnumPricingModel.PER_CALL_WITH_PREPAID },
      { name: 'Per call with block rate', priceModel: EnumPricingModel.PER_CALL_WITH_BLOCK_RATE },
      { name: 'Per row with prepaid', priceModel: EnumPricingModel.PER_ROW_WITH_PREPAID },
      { name: 'Per row with block rate', priceModel: EnumPricingModel.PER_ROW_WITH_BLOCK_RATE },
    ];

    console.log('constructor');
  }

  @Watch('pricingModels', { immediate: true, deep: true })
  onPricingModelsChange(): void {
    this.fixPricingModelsFormatFromParent();
  }

  @Watch('selectedPricingModelForEditingLocal')
  onPricingModelChange(selectedPricingModelForEditing: number | null): void {
    this.$emit('update:selectedPricingModelForEditing', selectedPricingModelForEditing);
  }

  created(): void {
    this.fixPricingModelsFormatFromParent();
  }

  fixPricingModelsFormatFromParent(): void {
    this.pricingModelsLocal = [];
    this.pricingModels.forEach((x) => {
      console.log('foreach');
      const pricingModel = {
        ...x,
        ...{
          includeDomainRestrictions: !!x.domainRestrictions.length,
          includeCoverageRestrictions: !!x.coverageRestrictionContinents.length || !!x.coverageRestrictionCountries.length,
          includeConsumerRestrictions: !!x.consumerRestrictionContinents.length || !!x.consumerRestrictionCountries.length,
        },
      };
      this.pricingModelsLocal.push(pricingModel);
    });
    this.pricingModelsLocal.forEach((model) => {
      /* eslint-disable no-param-reassign */
      console.log('m', this.menusData);
      // model.domainRestrictions = model.domainRestrictions.map((x) => this.menusData.domainRestrictions.find((y) => y.code === x));
      model.coverageRestrictionContinents = model.coverageRestrictionContinents.map((x) => this.menusData.continents.find((y) => y.code === x));
      model.coverageRestrictionCountries = model.coverageRestrictionCountries.map((x) => this.menusData.countries.find((y) => y.code === x));
      model.consumerRestrictionContinents = model.consumerRestrictionContinents.map((x) => this.menusData.continents.find((y) => y.code === x));
      model.consumerRestrictionCountries = model.consumerRestrictionCountries.map((x) => this.menusData.countries.find((y) => y.code === x));
      /* eslint-enable no-param-reassign */
    });
  }

  fixPricingModelsFormatForParent(): void {
    this.pricingModelsLocal.forEach((x) => {
      /* eslint-disable no-param-reassign */
      // x.domainRestrictions = x.domainRestrictions.map((c: any) => c.code);
      x.consumerRestrictionContinents = x.consumerRestrictionContinents.map((c: any) => c.code);
      x.coverageRestrictionContinents = x.coverageRestrictionContinents.map((c: any) => c.code);
      x.consumerRestrictionCountries = x.consumerRestrictionCountries.map((c: any) => c.code);
      x.coverageRestrictionCountries = x.coverageRestrictionCountries.map((c: any) => c.code);
      delete (x as any).includeDomainRestrictions;
      delete (x as any).includeCoverageRestrictions;
      delete (x as any).includeConsumerRestrictions;
      /* eslint-enable no-param-reassign */
    });
  }

  addPricingModel():void {
    this.pricingModelsLocal.push({} as BasePricingModelCommand);
    this.selectedPricingModelForEditingLocal = this.pricingModelsLocal.length - 1;
  }

  removePricingModel(): void {
    const i = this.selectedPricingModelForEditingLocal;
    this.selectedPricingModelForEditingLocal = null;
    // eslint-disable-next-line
    this.pricingModelsLocal.splice(i!, 1);
    this.$emit('update:pricingModels', this.pricingModelsLocal);
  }

  onChangePricingModelType(model: EnumPricingModel): void {
    console.log(model);
    const pricingModel = {
      type: '' as EnumPricingModel,
      domainRestrictions: [],
      coverageRestrictionContinents: [],
      consumerRestrictionContinents: [],
      coverageRestrictionCountries: [],
      consumerRestrictionCountries: [],
      includeDomainRestrictions: false,
      includeCoverageRestrictions: false,
      includeConsumerRestrictions: false,
    } as BasePricingModelCommand;
    switch (model) {
      case EnumPricingModel.FREE: {
        (pricingModel as FreePricingModelCommand).type = EnumPricingModel.FREE;
        break;
      }
      case EnumPricingModel.PER_CALL_WITH_PREPAID: {
        (pricingModel as CallPrePaidPricingModelCommand).type = EnumPricingModel.PER_CALL_WITH_PREPAID;
        (pricingModel as CallPrePaidPricingModelCommand).prePaidTiers = [{}] as PrePaidTier[];
        break;
      }
      case EnumPricingModel.PER_CALL_WITH_BLOCK_RATE: {
        (pricingModel as CallBlockRatePricingModelCommand).type = EnumPricingModel.PER_CALL_WITH_BLOCK_RATE;
        (pricingModel as CallBlockRatePricingModelCommand).discountRates = [{}] as DiscountRate[];
        break;
      }
      case EnumPricingModel.PER_ROW_WITH_PREPAID: {
        (pricingModel as RowPrePaidPricingModelCommand).type = EnumPricingModel.PER_ROW_WITH_PREPAID;
        (pricingModel as RowPrePaidPricingModelCommand).prePaidTiers = [{}] as PrePaidTier[];
        break;
      }
      case EnumPricingModel.PER_ROW_WITH_BLOCK_RATE: {
        (pricingModel as RowBlockRatePricingModelCommand).type = EnumPricingModel.PER_ROW_WITH_BLOCK_RATE;
        (pricingModel as RowBlockRatePricingModelCommand).discountRates = [{}] as DiscountRate[];
        break;
      }
      default:
    }
    // eslint-disable-next-line
    Vue.set(this.pricingModelsLocal, this.selectedPricingModelForEditingLocal!, pricingModel);
  }

  addDiscountRate(): void {
    // eslint-disable-next-line
    if ('discountRates' in this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!]) (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as CallBlockRatePricingModelCommand | RowBlockRatePricingModelCommand).discountRates.push({} as DiscountRate);
    // eslint-disable-next-line
    if ('prePaidTiers' in this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!]) (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as CallPrePaidPricingModelCommand | RowPrePaidPricingModelCommand).prePaidTiers.push({} as DiscountRate);
  }

  onRemoveDiscount(i: number): void {
    // eslint-disable-next-line
    if ('discountRates' in this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!]) (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as CallBlockRatePricingModelCommand | RowBlockRatePricingModelCommand).discountRates.splice(i, 1);
    // eslint-disable-next-line
    if ('prePaidTiers' in this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!]) (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as CallPrePaidPricingModelCommand | RowPrePaidPricingModelCommand).prePaidTiers.splice(i, 1);
  }

  async setPricingModel(): Promise<void> {
    const isValid = await this.$refs.refPricingModelDetails.validate();
    if (!isValid) {
      return;
    }
    this.selectedPricingModelForEditingLocal = null;

    this.fixPricingModelsFormatForParent();

    this.$emit('update:pricingModels', this.pricingModelsLocal);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
