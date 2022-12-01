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
                      <template v-if="model.priceModel !== 'FREE' || deliveryMethod === 'DIGITAL_PLATFORM'">
                        <label class="control control-radio" :for="`model_option_${model.priceModel}`">
                          <!-- <input @change="onChangePricingModelType(model.priceModel)" v-model="tempSelectedType" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel"> -->
                          <input @change="onChangePricingModelType(model.priceModel)" v-model="pricingModelsLocal[selectedPricingModelForEditingLocal].type" type="radio" :id="`model_option_${model.priceModel}`" :name="`model_option`" :value="model.priceModel">
                          {{ model.name }}
                          <div class="control_indicator"></div>
                        </label>
                      </template>
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
                    <h3 class="mb-xs-20">Free asset</h3>
                  </div>
                  <!-- fixed -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'FIXED'">
                    <h3>Current and all past versions, as well as new versions for a set period</h3>
                    <p class="mt-xs-20">Your product is available for purchase by prospective clients in its current, past, and future versions. Clients automatically get access to newer versions of the product whenever they become available and for a period you define. This is the preferred option for products updated relatively frequently.</p>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <div class="form-group">
                      <label for="fixed_price">Your price</label>
                      <div class="pricing__subnote">This is the price prospective clients will pay for purchasing your product.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].totalPriceExcludingTax" type="number" class="form-group__text" id="fixed_price" name="fixed_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Number of years" rules="required|integer|min_value:1">
                    <div class="form-group">
                      <label for="number_of_years">Number of years</label>
                      <div class="pricing__subnote">This is the period in years during which prospective clients have access to new versions of your product. After the end of this period, they cannot receive any new versions and must purchase the asset again.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].yearsOfUpdates" type="number" class="form-group__text" id="number_of_years" name="number_of_years">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                  </div>
                  <!-- fixed per rows -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'FIXED_PER_ROWS'">
                    <h3>Asset subset with pricing per rows</h3>
                    <p class="mt-xs-20">Your product is available for purchase by prospective clients in a piecewise manner if it comprises at least 5,000 rows. Clients can select and purchase only a subset of your product by defining the area of interest (e.g., country, city) they are interested in. You will be remunerated based on the number of rows provided, with a guaranteed minimum per purchase.Optionally, you can also define discounts to incentivize consumers in purchasing more rows of your product.</p>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <div class="form-group">
                      <label for="fpr_price">Your price</label>
                      <div class="pricing__subnote">This is the price prospective clients will pay per 1,000 rows of your product.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="fpr_price" name="fpr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Minimum rows" rules="required|integer|min_value:1">
                    <div class="form-group">
                      <label for="min_rows">Minimum rows</label>
                      <div class="pricing__subnote">This is the minimum number of rows a client can purchase per transaction.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].minRows" type="number" class="form-group__text" id="min_rows" name="min_rows">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount threshold" rules="required|min_value:0.00000001">
                          <div class="form-group">
                            <label for="fpr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="fpr_count" name="fpr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount percent" rules="required|min_value:0|max_value:100">
                          <div class="form-group">
                            <label for="fpr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="fpr_discount" name="fpr_discount">
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
                  <!-- fixed for population -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'FIXED_FOR_POPULATION'">
                    <h3>Asset subset with pricing per population</h3>
                    <p class="mt-xs-20"><span>Your product is available for purchase by prospective clients in a piecewise manner. Clients can select and purchase only a subset of your product by defining the area of interest (e.g., country, city) they are interested in. You will be remunerated based on the population coverage in the selected area, with a guaranteed minimum per purchase.</span>
                    <br><br><span class="mt-xs-10">Optionally, you can also define discounts to incentivize consumers in purchasing larger subsets of your product.</span>
                    <br><br><span class="mt-xs-10">The density of the population is calculated based on the most recent Eurostat census data (2011), the geographical coverage of your file, and the geographical area selected by the user. For example, if your asset covers the entire Europe and a user selects an area covering only the cities of London and Paris, the population coverage is calculated by dividing the total population of Europe with the sum of the populations of London and Paris.</span></p>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <div class="form-group">
                      <label for="ffp_price">Your price per 10,000 people</label>
                      <div class="pricing__subnote">This is the price prospective clients in case they purchase the entire asset.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="ffp_price" name="ffp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Minimum percentage" rules="required|min_value:0|max_value:100">
                    <div class="form-group">
                      <label for="min_percentage">Minimum population</label>
                      <div class="pricing__subnote">This is the minimum population percentage of the entire asset clients can purchase per transaction. For example, if a user selects an area with only 5% population coverage, and you have set a minimum of 10%, the price will be calculated based on the minimum of 10%.</div>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].minPercent" type="number" class="form-group__text" id="min_percentage" name="min_percentage">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount threshold" rules="required|min_value:0.00000001">
                          <div class="form-group">
                            <label for="ffp_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="ffp_count" name="ffp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount percent" rules="required|min_value:0|max_value:100">
                          <div class="form-group">
                            <label for="ffp_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="ffp_discount" name="ffp_discount">
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
import {
  required,
  // eslint-disable-next-line
  min_value,
  // eslint-disable-next-line
  max_value,
  integer,
} from 'vee-validate/dist/rules';
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
import { EnumContinent } from '@/model/enum';
import { EnumDeliveryMethod } from '@/model/catalogue';
import store from '@/store';

extend('required', required);
extend('min_value', min_value);
extend('max_value', max_value);
extend('integer', integer);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class Pricing extends Vue {
  @Prop({ required: true }) private pricingModels!: BasePricingModelCommand[];

  @Prop({ required: true }) private selectedPricingModelForEditing!: number | null;

  @Prop({ required: true }) readonly deliveryMethod!: EnumDeliveryMethod;

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

    this.menusData.countries = store.getters.getConfig.configuration.countries;

    this.pricingModelsLocal = [];

    this.selectedPricingModelForEditingLocal = this.selectedPricingModelForEditing;

    this.pricingModelTypes = [
      { name: 'Free', priceModel: EnumPricingModel.FREE },
      { name: 'Fixed', priceModel: EnumPricingModel.FIXED },
      { name: 'Fixed per rows', priceModel: EnumPricingModel.FIXED_PER_ROWS },
      { name: 'Fixed per population', priceModel: EnumPricingModel.FIXED_FOR_POPULATION },
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
    Vue.set(this.pricingModelsLocal, this.selectedPricingModelForEditingLocal!, pricingModel);
  }

  addDiscountRate(): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as FixedRowPricingModelCommand | FixedPopulationPricingModelCommand).discountRates.push({} as DiscountRate);
  }

  onRemoveDiscount(i: number): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as FixedRowPricingModelCommand | FixedPopulationPricingModelCommand).discountRates.splice(i, 1);
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
<style lang="scss">
// todo: refactoring
.pricing__subnote {
  color: #6C6C6C;
  font-size: em(13);
  margin-bottom: 15px;
}
</style>
