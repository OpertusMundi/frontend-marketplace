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
              <button class="btn btn--std btn--blue" @click="addPricingModel" :disabled="selectedPricingModelForEditing !== null">Add Pricing Model</button>
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
                <button class="card card--clickable" :class="i == selectedPricingModelForEditing ? 'card--selected' : ''" @click="selectedPricingModelForEditing = i" v-for="(pricingModel, i) in pricingModelsLocal" :key="i">Pricing Model {{ i + 1 }}</button>
              </div>
            </div>
            <div class="col-md-3">
              <div v-if="selectedPricingModelForEditing !== null">
                <validation-provider v-slot="{ errors }" name="Asset Type" rules="required">
                <div class="form-group">
                  <form>
                    <div v-for="model in pricingModelTypes" :key="model.priceModel">
                      <label class="control control-radio" :for="`model_option_${model.priceModel}`">
                        <!-- <input @change="onChangePricingModelType(model.priceModel)" v-model="tempSelectedType" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel"> -->
                        <input @change="onChangePricingModelType(model.priceModel)" v-model="pricingModelsLocal[selectedPricingModelForEditing].type" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel">
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
              <div v-if="selectedPricingModelForEditing !== null && pricingModelsLocal[selectedPricingModelForEditing].type">
                <validation-observer ref="refPricingModelDetails">
                  <!-- free -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].type === 'FREE'">
                  </div>
                  <!-- fixed -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].type === 'FIXED'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="fixed_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].totalPriceExcludingTax" type="number" class="form-group__text" id="fixed_price" name="fixed_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Number of years" rules="required">
                    <div class="form-group">
                      <label for="number_of_years">Number of years</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].yearsOfUpdates" type="number" class="form-group__text" id="number_of_years" name="number_of_years">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                  </div>
                  <!-- fixed per rows -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].type === 'FIXED_PER_ROWS'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="fpr_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].totalPriceExcludingTax" type="number" class="form-group__text" id="fpr_price" name="fpr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Minimum rows" rules="required">
                    <div class="form-group">
                      <label for="min_rows">Minimum rows</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].minRows" type="number" class="form-group__text" id="min_rows" name="min_rows">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditing].discountRates" :key="i" class="row">
                      <div class="col-xs-6">
                        <validation-provider mode="lazy" v-slot="{ errors }" name="Discount threshold" rules="required">
                        <div class="form-group">
                          <label for="fpr_count">Threshold</label>
                          <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].discountRates[i].count" type="number" class="form-group__text" id="fpr_count" name="fpr_count">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                        </validation-provider>
                      </div>
                      <div class="col-xs-6">
                        <validation-provider mode="lazy" v-slot="{ errors }" name="Discount percent" rules="required">
                        <div class="form-group">
                          <label for="fpr_discount">Discount %</label>
                          <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].discountRates[i].discount" type="number" class="form-group__text" id="fpr_discount" name="fpr_discount">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                        </validation-provider>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- fixed for population -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].type === 'FIXED_FOR_POPULATION'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required">
                    <div class="form-group">
                      <label for="ffp_price">Price</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].totalPriceExcludingTax" type="number" class="form-group__text" id="ffp_price" name="ffp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Minimum percentage" rules="required">
                    <div class="form-group">
                      <label for="min_percentage">Minimum population percentage</label>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].minPercent" type="number" class="form-group__text" id="min_percentage" name="min_percentage">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditing].discountRates" :key="i" class="row">
                      <div class="col-md-6">
                        <validation-provider mode="lazy" v-slot="{ errors }" name="Discount threshold" rules="required">
                        <div class="form-group">
                          <label for="ffp_count">Threshold</label>
                          <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].discountRates[i].count" type="number" class="form-group__text" id="ffp_count" name="ffp_count">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                        </validation-provider>
                      </div>
                      <div class="col-md-6">
                        <validation-provider mode="lazy" v-slot="{ errors }" name="Discount percent" rules="required">
                        <div class="form-group">
                          <label for="ffp_discount">Discount percent %</label>
                          <input v-model.number="pricingModelsLocal[selectedPricingModelForEditing].discountRates[i].discount" type="number" class="form-group__text" id="ffp_discount" name="ffp_discount">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                        </validation-provider>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Discount Rate</button>
                  </div>
                  <!-- common fields for all pricing models -->
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditing].includeDomainRestrictions" type="checkbox" id="include_domain_restrictions" name="include_domain_restrictions">
                    <label for="include_domain_restrictions">Include domain restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].includeDomainRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Domain Restrictions</label>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditing].domainRestrictions" track-by="code" placeholder="Search domain" label="name" :options="menusData.domainRestrictions" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditing].includeCoverageRestrictions" type="checkbox" id="include_coverage_restrictions" name="include_coverage_restrictions">
                    <label for="include_coverage_restrictions">Include coverage restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].includeCoverageRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Coverage Restrictions</label>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditing].coverageRestrictionContinents" track-by="code" placeholder="Restrict coverage by continents" label="name" :options="menusData.continents" :multiple="true">
                      </multiselect>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditing].coverageRestrictionCountries" track-by="code" placeholder="Restrict coverage by countries" label="name" :options="menusData.countries" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                  <div class="form-group-checkbox">
                    <input v-model="pricingModelsLocal[selectedPricingModelForEditing].includeConsumerRestrictions" type="checkbox" id="include_consumer_restrictions" name="include_consumer_restrictions">
                    <label for="include_consumer_restrictions">Include consumer restrictions?</label>
                  </div>
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditing].includeConsumerRestrictions">
                    <validation-provider>
                    <div class="form-group">
                      <label class="typo__label">Consumer Restrictions</label>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditing].consumerRestrictionContinents" track-by="code" placeholder="Restrict consumers by continents" label="name" :options="menusData.continents" :multiple="true">
                      </multiselect>
                      <multiselect
                        v-model="pricingModelsLocal[selectedPricingModelForEditing].consumerRestrictionCountries" track-by="code" placeholder="Restrict consumers by countries" label="name" :options="menusData.countries" :multiple="true">
                      </multiselect>
                    </div>
                    </validation-provider>
                  </div>
                </validation-observer>
                <button class="btn btn--std btn--blue mt-xs-20" @click="setPricingModel">Set Pricing Model</button>
              </div>

              <!-- a dummy hidden input to be cathced by validation observer if pricing model editing is open -->
              <div v-if="selectedPricingModelForEditing !== null && pricingModelsLocal[selectedPricingModelForEditing].type">
                <validation-provider v-slot="{ errors }" name="pricing models" rules="required">
                  <div class="form-group mt-xs-20">
                    <input type="text" hidden>
                    <div class="errors" v-if="errors.length"><span class="mt-xs-20">Set or discard pricing model to continue</span></div>
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
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import {
  BasePricingModelCommand,
  DiscountRate,
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
  FreePricingModelCommand,
} from '@/model/pricing-model';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class Pricing extends Vue {
  @Prop({ required: true }) private pricingModels!: BasePricingModelCommand[];

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
    refPricingModelDetails: InstanceType<typeof ValidationObserver>,
  }

  pricingModelsLocal: BasePricingModelCommand[];

  selectedPricingModelForEditing: number | null;

  pricingModelTypes: { name: string, priceModel: EnumPricingModel }[];

  menusData: {
    domainRestrictions: any[],
    continents: any[],
    countries: any[],
  };

  constructor() {
    super();

    this.pricingModelsLocal = this.pricingModels;

    this.selectedPricingModelForEditing = null;

    this.pricingModelTypes = [
      { name: 'Free', priceModel: EnumPricingModel.FREE },
      { name: 'Fixed', priceModel: EnumPricingModel.FIXED },
      { name: 'Fixed per rows', priceModel: EnumPricingModel.FIXED_PER_ROWS },
      { name: 'Fixed per population', priceModel: EnumPricingModel.FIXED_FOR_POPULATION },
    ];

    this.menusData = { domainRestrictions: [], continents: [], countries: [] };
    this.menusData.domainRestrictions = [
      {
        name: 'Photogrammetry',
        code: 'PH',
      },
      {
        name: 'Geography',
        code: 'GE',
      },
      {
        name: 'Elevation',
        code: 'EL',
      },
      {
        name: 'Pharming',
        code: 'PA',
      },
      {
        name: 'Health',
        code: 'HE',
      },
    ];

    this.menusData.continents = [
      {
        name: 'Europe',
        code: 'EUROPE',
      },
      {
        name: 'Africa',
        code: 'AFRICA',
      },
      {
        name: 'Asia',
        code: 'ASIA',
      },
      {
        name: 'North America',
        code: 'NORTH_AMERICA',
      },
      {
        name: 'South America',
        code: 'SOUTH_AMERICA',
      },
      {
        name: 'Oceania',
        code: 'OCEANIA',
      },
      {
        name: 'Antarctica',
        code: 'ANTARCTICA',
      },
    ];

    this.menusData.countries = [
      {
        name: 'France',
        code: 'FRA',
      },
      {
        name: 'Spain',
        code: 'ESP',
      },
    ];
  }

  addPricingModel():void {
    this.pricingModelsLocal.push({} as BasePricingModelCommand);
    this.selectedPricingModelForEditing = this.pricingModelsLocal.length - 1;
  }

  removePricingModel(): void {
    const i = this.selectedPricingModelForEditing;
    this.selectedPricingModelForEditing = null;
    // eslint-disable-next-line
    this.pricingModelsLocal.splice(i!, 1);
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
      case EnumPricingModel.FIXED: {
        (pricingModel as FixedPricingModelCommand).type = EnumPricingModel.FIXED;
        break;
      }
      case EnumPricingModel.FIXED_PER_ROWS: {
        (pricingModel as FixedRowPricingModelCommand).type = EnumPricingModel.FIXED_PER_ROWS;
        (pricingModel as FixedRowPricingModelCommand).discountRates = [{}] as DiscountRate[];
        break;
      }
      case EnumPricingModel.FIXED_FOR_POPULATION: {
        (pricingModel as FixedPopulationPricingModelCommand).type = EnumPricingModel.FIXED_FOR_POPULATION;
        (pricingModel as FixedPopulationPricingModelCommand).discountRates = [{}] as DiscountRate[];
        break;
      }
      default:
    }
    // eslint-disable-next-line
    Vue.set(this.pricingModelsLocal, this.selectedPricingModelForEditing!, pricingModel);
  }

  addDiscountRate(): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditing!] as FixedRowPricingModelCommand | FixedPopulationPricingModelCommand).discountRates.push({} as DiscountRate);
  }

  // isNonSetPricingModel(): boolean {
  //   if (this.selectedPricingModelForEditing !== null && this.pricingModels[this.selectedPricingModelForEditing].type) {
  //     return true;
  //   }
  //   return false;
  // }

  async setPricingModel(): Promise<void> {
    const isValid = await this.$refs.refPricingModelDetails.validate();
    if (!isValid) {
      return;
    }
    this.selectedPricingModelForEditing = null;
    this.$emit('update:pricingModels', this.pricingModelsLocal);
  }

  // validate(): Promise<boolean> {
  //   return this.$refs.refObserver.validate();
  // }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
