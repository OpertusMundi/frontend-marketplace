<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--review dashboard__form__step--full-width">
      <div class="dashboard__form__review">
        <!-- <div class="dashboard__form__review__inner"> -->
        <div class="row">
          <div class="col-md-4">
            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Asset type</h5>
                <a href="#" @click.prevent="goToStep(1)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><strong>Type:</strong>{{ asset.type }}</li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Metadata</h5>
                <a href="#" @click.prevent="goToStep(2)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li v-if="asset.language"><strong>Language:</strong>{{ asset.language }}</li>
                  <li v-if="asset.publisherName"><strong>Editor:</strong>{{ asset.publisherName }}</li>
                  <li v-if="asset.publisherEmail"><strong>Editor’s email:</strong>{{ asset.publisherEmail }}</li>
                  <li v-if="asset.metadataPointOfContactName"><strong>Maintenance manager:</strong>{{ asset.metadataPointOfContactName }}</li>
                  <li v-if="asset.metadataPointOfContactEmail"><strong>Maintenance manager’s email:</strong>{{ asset.metadataPointOfContactEmail }}</li>
                  <li v-if="asset.version"><strong>Version:</strong>{{ asset.version }}</li>
                  <!-- <li><strong>Identifier:</strong>{{ asset.language }}</li> -->
                  <li v-if="asset.title"><strong>Asset title:</strong>{{ asset.title }}</li>
                  <li v-if="asset.abstractText"><strong>Asset short description:</strong>{{ asset.abstractText }}</li>
                  <li v-if="asset.metadataLanguage"><strong>Metadata language:</strong>{{ asset.metadataLanguage }}</li>
                  <li v-if="asset.metadataDate"><strong>Metadata date:</strong>{{ asset.metadataDate }}</li>
                  <li v-if="asset.scale"><strong>Scale:</strong>{{ asset.scale }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Contract</h5>
                <a href="#" @click.prevent="goToStep(3)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><strong>Template:</strong></li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Pricing</h5>
                <a href="#" @click.prevent="goToStep(4)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <!-- <li><strong>Pricing type:</strong>{{ priceModelType }}</li> -->
                  <li v-for="(pricingModel, index) in asset.pricingModels" v-bind:key="`pricingmodel${index}`">
                    <span v-if="pricingModel.type === 'FREE'">
                      <strong>Pricing model {{ index + 1 }}:</strong>FREE
                    </span>
                    <span v-if="pricingModel.type === 'FIXED'">
                      <strong>Pricing model {{ index + 1 }}:</strong>{{ pricingModel.totalPriceExcludingTax }}€, {{ pricingModel.yearsOfUpdates }} {{ pricingModel.yearsOfUpdates == 1 ? 'year' : 'years' }} of updates
                    </span>
                    <span v-if="pricingModel.type === 'FIXED_PER_ROWS'">
                      <strong>Pricing model {{ index + 1 }}:</strong>
                      {{ pricingModel.totalPriceExcludingTax }}€, minimum rows: {{ pricingModel.minRows }} <br>
                      <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br></div>
                    </span>
                    <span v-if="pricingModel.type === 'FIXED_FOR_POPULATION'">
                      <strong>Pricing model {{ index + 1 }}:</strong>
                      {{ pricingModel.totalPriceExcludingTax }}€, minimum percent: {{ pricingModel.minPercent }} <br>
                      <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br></div>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dashboard__form__review__item__head dashboard__form__review__item__head--no-border">
              <h5>Vetting purchase</h5>
            </div>
            <div class="dashboard__form__review__item__body">
              <ul>
                <span>Do you want to vet the sale of the asset to prospective consumers, before the sale is processed? This allows you to accept or deny the sale of the asset by examining the profile information of a prospective consumer.</span>
              </ul>
              <div class="form-group mt-xs-20">
                <label class="control control-radio">
                  Yes, I want to approve a purchase first
                  <input type="radio" name="vetting_true" v-model="vettingOption" :value="true" />
                  <div class="control_indicator"></div>
                </label>
                <label class="control control-radio">
                  No, I do not want to approve a purchase first
                  <input type="radio" name="vetting_false" v-model="vettingOption" :value="false" />
                  <div class="control_indicator"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- </div> -->
        <!-- <div class="dashboard__form__review__inner"> -->

        <!-- </div> -->
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CatalogueItemCommand } from '@/model';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ValidationObserver,
  },
})
export default class Review extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  vettingOption: boolean;

  constructor() {
    super();

    this.vettingOption = false;
  }

  goToStep(step: number): void {
    this.$emit('goToStep', step);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
