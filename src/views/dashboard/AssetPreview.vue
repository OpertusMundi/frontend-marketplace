<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <h1>Asset preview</h1>
      <router-link :to="'/dashboard/assets'"><button class="btn btn--std btn--outlineblue">EXIT</button></router-link>
    </div>

    <div class="dashboard__form" v-if="isAssetLoaded">
      <div class="dashboard__form__step dashboard__form__step--review">
        <div class="dashboard__form__review">
          <div class="dashboard__form__review__inner">

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Asset type</h5>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><strong>Type:</strong>{{ asset.command ? asset.command.type : '' }}</li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Metadata</h5>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><strong>Language:</strong>{{ asset.command ? asset.command.language : '' }}</li>
                  <li><strong>Editor:</strong>{{ asset.publisher ? asset.publisher.name : '' }}</li>
                  <li><strong>Editor’s email:</strong>{{ asset.publisher ? asset.publisher.email : '' }}</li>
                  <li><strong>Version:</strong>{{ asset.version }}</li>
                  <li><strong>Asset title:</strong>{{ asset.title }}</li>
                  <li><strong>Metadata language:</strong>{{ asset.command ? asset.command.metadataLanguage : '' }}</li>
                  <li><strong>Metadata date:</strong>{{ asset.command ? asset.command.metadataDate : '' }}</li>
                  <li>
                    <strong>Scales:</strong>
                    <div v-if="asset.command && asset.command.scales.length">
                      <span v-for="scale in asset.command.scales" :key="scale.description">{{ scale.description }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="dashboard__form__review__inner">

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Contract</h5>
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
    </div>

    <div v-if="!isAssetLoaded" class="dummy-loader" style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; z-index: 9999;"><h1>LOADER</h1></div>

  </div>
</template>

<script lang="ts">
import { AssetDraft } from '@/model/draft';
import DraftAssetApi from '@/service/draft';
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class DashboardHome extends Vue {
  draftAssetApi: DraftAssetApi;

  assetId: string;

  asset: AssetDraft;

  isAssetLoaded: boolean;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assetId = '';
    this.asset = {} as AssetDraft;
    this.isAssetLoaded = false;
  }

  mounted(): void {
    this.assetId = this.$route.params.id;

    this.draftAssetApi.findOne(this.assetId).then((resp) => {
      if (resp.success) {
        this.asset = resp.result;
        this.isAssetLoaded = true;
        console.log(this.asset);
      } else {
        // TODO: handle error
        console.log('error fetching asset info');
      }
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_forms.scss";
</style>
