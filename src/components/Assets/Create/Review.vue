<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--review">
      <div class="dashboard__form__review">
        <div class="dashboard__form__review__inner">

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
                <li><strong>Language:</strong>{{ asset.language }}</li>
                <li><strong>Editor:</strong>{{ asset.publisherName }}</li>
                <li><strong>Editor’s email:</strong>{{ asset.publisherEmail }}</li>
                <li><strong>Maintenance manager:</strong>{{ asset.metadataPointOfContactName }}</li>
                <li><strong>Maintenance manager’s email:</strong>{{ asset.metadataPointOfContactEmail }}</li>
                <li><strong>Version:</strong>{{ asset.version }}</li>
                <!-- <li><strong>Identifier:</strong>{{ asset.language }}</li> -->
                <li><strong>Asset title:</strong>{{ asset.title }}</li>
                <li><strong>Asset short description:</strong>{{ asset.abstractText }}</li>
                <li><strong>Metadata language:</strong>{{ asset.metadataLanguage }}</li>
                <li><strong>Metadata date:</strong>{{ asset.metadataDate }}</li>
                <li><strong>Scale:</strong>{{ asset.scale }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dashboard__form__review__inner">

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
                  <span v-if="pricingModel.type === 'FIXED'">
                    <strong>Pricing model {{ index+1 }}:</strong>{{ pricingModel.totalPriceExcludingTax }}€ + {{ pricingModel.yearsOfUpdates }} years
                  </span>
                  <span v-if="pricingModel.type === 'SUBSCRIPTION'">
                    <strong>Pricing model {{ index+1 }}:</strong>{{ pricingModel.monthlyPrice }}€ + {{ pricingModel.duration }} months
                  </span>
                  <span v-if="pricingModel.type === 'FREE'">
                    <strong>Pricing model {{ index+1 }}:</strong>FREE
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div class="dashboard__form__review__item">
            <div class="dashboard__form__review__item__head">
              <h5>Delivery</h5>
              <a href="#" @click.prevent="goToStep(5)">EDIT</a>
            </div>
            <div class="dashboard__form__review__item__body">
              <ul>
                <li><strong>Method:</strong>{{ asset.deliveryType }}</li>
              </ul>
            </div>
          </div>

          <div class="dashboard__form__review__item">
            <div class="dashboard__form__review__item__head">
              <h5>Payout</h5>
              <a href="#" @click.prevent="goToStep(6)">EDIT</a>
            </div>
            <div class="dashboard__form__review__item__body">
              <ul>
                <li><strong>Method:</strong>{{ asset.paymentMethod }}</li>
              </ul>
            </div>
          </div>

        </div>
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
  @Prop() private asset!: CatalogueItemCommand;
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
