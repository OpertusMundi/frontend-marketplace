<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--pricing dashboard__form__step--full-width">
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
                  <!-- <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'FREE'">
                  </div> -->
                  <!-- per call with prepaid -->
                  <!-- <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_CALL_WITH_PREPAID'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <p>Customers subscribe to the service and receive an API key. You simply set the price per individual call of the service.</p>
                    <p>Optionally, you can allow consumers to prepay a given number of calls at a discount. You can define up to three such tiers, with different discounts for each one. Once a consumer is subscribed, they can purchase additional prepaid calls at any point in time. If their prepaid calls are depleted, then they are charged with the standard price.</p>
                    <p>Topio will add a [30%] overhead to the price you set, which covers the costs of service provision according to the Service Level Agreement between Topio and the Consumer.</p>
                    <p>Consumers may cancel their subscription at any point time. If they had any prepaid calls still left, they will not be reimbursed.</p>
                    <p>We will automatically bill your account whenever your total reimbursement for all the services we provide based on your asset has reached [50] Euros. This is to avoid excess processing fees.</p>
                    <div class="form-group form-group--paragraph-small-margin">
                      <label for="pcwp_price">Your price per call</label>
                      <p>This is the reimbursement you will receive per service call</p>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="pcwp_price" name="pcwp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(prePaidTier, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|integer|min_value:1">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwp_count">Number of calls</label>
                            <p>Number of prepaid service calls offered for this tier</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].count" type="number" class="form-group__text" id="pcwp_count" name="pcwp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwp_discount">Discount %</label>
                            <p>This is the discount you provide for the prepaid calls</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[i].discount" type="number" class="form-group__text" id="pcwp_discount" name="pcwp_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removeDiscountRate(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Prepaid Tier</button>
                  </div> -->
                  <!-- per call -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_CALL'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <p>Customers subscribe to the service and receive an API key.</p>
                    <p>You simply set the price per individual call of the service.</p>
                    <p>Optionally, you can allow consumers to prepay a given number of calls at a discount. You can define up to three such tiers, with different discounts for each one. Once a consumer is subscribed, they can purchase additional prepaid calls at any point in time. If their prepaid calls are depleted, then they are charged with the standard price.</p>
                    <p>Further, you may optionally set the price per individual call of the service at different block rates, providing increasing discounts the more the service is used. In this manner, you reward consumers for their loyalty.</p>
                    <p>Topio will add a [30%] overhead to the price you set, which covers the costs of service provision according to the Service Level Agreement between Topio and the Consumer.</p>
                    <p>Consumers may cancel their subscription at any point time. If they had any prepaid calls still left, they will not be reimbursed.</p>
                    <p>We will automatically bill your account whenever your total reimbursement for all the services you provide has reached [50] Euros. This is to avoid excess processing fees.</p>
                    <div class="form-group form-group form-group--paragraph-small-margin">
                      <label for="pcwbr_price">Your price per call</label>
                      <p>This is the reimbursement you will receive per service call</p>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="pcwbr_price" name="pcwbr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="`pcwbr_${i}`" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|min_value:0">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwbr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="pcwbr_count" name="pcwbr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwbr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="pcwbr_discount" name="pcwbr_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removeDiscountRate(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Blocking Rate</button>
                    <div v-for="(prePaidTier, j) in pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers" :key="`pcwp_${j}`" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|integer|min_value:1">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwp_count">Number of calls</label>
                            <p>Number of prepaid service calls offered for this tier</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[j].count" type="number" class="form-group__text" id="pcwp_count" name="pcwp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="pcwp_discount">Discount %</label>
                            <p>This is the discount you provide for the prepaid calls</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[j].discount" type="number" class="form-group__text" id="pcwp_discount" name="pcwp_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removePrepaidTier(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addPrepaidTier">Add Prepaid Tier</button>
                  </div>
                  <!-- per row -->
                  <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_ROW'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <p>Customers subscribe to your service and receive an API key.</p>
                    <p>You simply set the price per individual returned row of the service.</p>
                    <p>Optionally, you can allow consumers to prepay a given number of rows at a discount. You can define up to three such tiers, with different discounts for each one. Once a consumer is subscribed, they can purchase additional prepaid rows at any point in time. If their prepaid rows are depleted, then they are charged with the standard price.</p>
                    <p>Further, you may optionally set the price per individual row returned by service at different block rates, providing increasing discounts the more the service is used. In this manner, you reward consumers for their loyalty.</p>
                    <p>Topio will add a [30%] overhead to the price you set, which covers the costs of service provision according to the Service Level Agreement between Topio and the Consumer. Consumers may cancel their subscription at any point time. If they had any prepaid rows still left, they will not be reimbursed.</p>
                    <p>We will automatically bill your account whenever your total reimbursement for all the services you provide has reached [50] Euros. This is to avoid excess processing fees.</p>
                    <div class="form-group form-group--paragraph-small-margin">
                      <label for="prwp_price">Your price per row</label>
                      <p>This is the reimbursement you will receive per service row</p>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="prwp_price" name="prwp_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="`prwbr_${i}`" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|min_value:0">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwbr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="prwbr_count" name="prwbr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwbr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="prwbr_discount" name="prwbr_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removeDiscountRate(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Blocking Rate</button>
                    <div v-for="(prePaidTier, j) in pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers" :key="`prwp_${j}`" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|integer|min_value:0">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwp_count">Number of rows</label>
                            <p>Number of prepaid service rows offered for this tier</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[j].count" type="number" class="form-group__text" id="prwp_count" name="prwp_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwp_discount">Discount %</label>
                            <p>This is the discount you provide for the prepaid rows</p>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].prePaidTiers[j].discount" type="number" class="form-group__text" id="prwp_discount" name="prwp_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removePrepaidTier(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addPrepaidTier">Add Prepaid Tier</button>
                  </div>
                  <!-- per row with block rate -->
                  <!-- <div v-if="pricingModelsLocal[selectedPricingModelForEditingLocal].type === 'PER_ROW_WITH_BLOCK_RATE'">
                    <validation-provider mode="lazy" v-slot="{ errors }" name="Price" rules="required|min_value:0.00000001">
                    <p>Customers subscribe to the service and receive an API key.</p>
                    <p>You simply set the price per individual row returned by service at different block rates, providing increasing discounts the more the service is used. In this manner, you reward consumers for their loyalty.</p>
                    <p>Topio will add a [30%] overhead to the price you set, which covers the costs of service provision according to the Service Level Agreement (SLA) between Topio and the Consumer.</p>
                    <p>Consumers may cancel their subscription at any point time.</p>
                    <p>We will automatically bill your account whenever your total reimbursement for all the services you provide has reached [50] Euros. This is to avoid excess processing fees.</p>
                    <div class="form-group form-group--paragraph-small-margin">
                      <label for="prwbr_price">Your price per row</label>
                      <p>This is the discount you provide for the prepaid rows</p>
                      <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].price" type="number" class="form-group__text" id="prwbr_price" name="prwbr_price">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                    </validation-provider>
                    <div v-for="(discountRate, i) in pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates" :key="i" class="d-flex">
                      <div class="row">
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Count" rules="required|min_value:0">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwbr_count">Threshold</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].count" type="number" class="form-group__text" id="prwbr_count" name="prwbr_count">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                        <div class="col-xs-6">
                          <validation-provider mode="lazy" v-slot="{ errors }" name="Discount" rules="required|min_value:0|max_value:100">
                          <div class="form-group form-group--paragraph-small-margin">
                            <label for="prwbr_discount">Discount %</label>
                            <input v-model.number="pricingModelsLocal[selectedPricingModelForEditingLocal].discountRates[i].discount" type="number" class="form-group__text" id="prwbr_discount" name="prwbr_discount">
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                          </div>
                          </validation-provider>
                        </div>
                      </div>
                      <div class="align-self-center ml-xs-30">
                        <button class="btn btn--std btn--outlineblue" @click="removeDiscountRate(i)">REMOVE</button>
                      </div>
                    </div>
                    <button class="btn btn--std btn--outlineblue mb-xs-20" @click="addDiscountRate">Add Blocking Rate</button>
                  </div> -->
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
  FreePricingModelCommand,
  PerCallPricingModelCommand,
  PerRowPricingModelCommand,
  PrePaidTier,
} from '@/model/pricing-model';
import store from '@/store';
import { EnumContinent } from '@/model/enum';

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
export default class ApiPricing extends Vue {
  @Prop({ required: true }) private pricingModels!: BasePricingModelCommand[];

  @Prop({ required: true }) private selectedPricingModelForEditing!: number | null;

  @Prop({ required: true }) private serviceType!: string;

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

    this.pricingModelTypes = this.serviceType === 'WFS' ? [
      { name: 'Subscription, fixed price per service call', priceModel: EnumPricingModel.PER_CALL },
      { name: 'Subscription, fixed price per number of rows returned', priceModel: EnumPricingModel.PER_ROW },
    ] : [
      { name: 'Subscription, fixed price per service call', priceModel: EnumPricingModel.PER_CALL },
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
      case EnumPricingModel.PER_CALL: {
        (pricingModel as PerCallPricingModelCommand).type = EnumPricingModel.PER_CALL;
        (pricingModel as PerCallPricingModelCommand).discountRates = [{}] as DiscountRate[];
        (pricingModel as PerCallPricingModelCommand).prePaidTiers = [{}] as PrePaidTier[];
        break;
      }
      case EnumPricingModel.PER_ROW: {
        (pricingModel as PerRowPricingModelCommand).type = EnumPricingModel.PER_ROW;
        (pricingModel as PerRowPricingModelCommand).discountRates = [{}] as DiscountRate[];
        (pricingModel as PerRowPricingModelCommand).prePaidTiers = [{}] as PrePaidTier[];
        break;
      }
      default:
    }
    // eslint-disable-next-line
    Vue.set(this.pricingModelsLocal, this.selectedPricingModelForEditingLocal!, pricingModel);
  }

  addDiscountRate(): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as PerCallPricingModelCommand | PerRowPricingModelCommand).discountRates.push({} as DiscountRate);
  }

  addPrepaidTier(): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as PerCallPricingModelCommand | PerRowPricingModelCommand).prePaidTiers.push({} as DiscountRate);
  }

  removeDiscountRate(i: number): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as PerCallPricingModelCommand | PerRowPricingModelCommand).discountRates.splice(i, 1);
  }

  removePrepaidTier(i: number): void {
    // eslint-disable-next-line
    (this.pricingModelsLocal[this.selectedPricingModelForEditingLocal!] as PerCallPricingModelCommand | PerRowPricingModelCommand).prePaidTiers.splice(i, 1);
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
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
