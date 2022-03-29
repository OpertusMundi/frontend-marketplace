<template>
  <transition name="fade">
    <div class="select-sh-plan-modal__wrapper" v-if="show">
      <div class="select-sh-plan-modal">
        <div class="select-sh-plan-modal__header">
          <h1>Sentinel Hub</h1>
          <div @click="onCloseModal" class="select-sh-plan-modal__btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
              <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
                <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
                <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
              </g>
            </svg>
          </div>
        </div>
        <div class="select-sh-plan-modal__subheading">
          <span>Sentinel Hub plans let you access all open data collections and the full imagery archive.</span>
        </div>
        <div class="select-sh-plan-modal__billing_type_selection">
          <div class="form-group">
            <label class="control control-radio">
              Annual billing
              <input value="ANNUAL" type="radio" name="billing_type" v-model="billingType" />
              <div class="control_indicator"></div>
            </label>
          </div>
          <div class="form-group">
            <label class="control control-radio">
              Monthly billing
              <input value="MONTHLY" type="radio" name="billing_type" v-model="billingType" />
              <div class="control_indicator"></div>
            </label>
          </div>
        </div>
        <div class="select-sh-plan-modal__body">
          <div class="container">
            <div class="row justify-content-center" v-for="(chunk, i) in subscriptionPlansChunked" :key="i">
              <div class="col-md-3 col--no-padding" v-for="(subscriptionPlan, j) in chunk" :key="subscriptionPlan.id">
                <div class="subscription-plan-card" :class="{'subscription-plan-card--no-border-right': j === chunk.length - 1}">
                  <span class="subscription-plan-card__title">{{ subscriptionPlan.title }}</span>
                  <span class="subscription-plan-card__description">{{ subscriptionPlan.description }}</span>
                  <span class="subscription-plan-card__price-monthly">{{ billingType === 'MONTHLY' ? subscriptionPlan.billing.monthly : computeMonthlyPrice(subscriptionPlan.billing.annually) }}€/month</span>
                  <span class="subscription-plan-card__price-annual">Billed annually: {{ billingType === 'MONTHLY' ? computeAnnualPrice(subscriptionPlan.billing.monthly) : subscriptionPlan.billing.annually }}€</span>
                  <div class="subscription-plan-card__features-container">
                    <span v-for="feature, i in subscriptionPlan.features.flat()" :key="i">{{ feature }}</span>
                  </div>
                  <div class="subscription-plan-card__processing-units">
                    <span class="subscription-plan-card__processing-units__label">Processing units</span>
                    <template v-if="subscriptionPlan.processingUnits">
                      <span class="subscription-plan-card__processing-units__value">{{ subscriptionPlan.processingUnits.month }}/month</span>
                      <span class="subscription-plan-card__processing-units__value">{{ subscriptionPlan.processingUnits.minute }}/min</span>
                    </template>
                    <span v-else class="subscription-plan-card__processing-units__value">(unknown)</span>
                  </div>
                  <div class="subscription-plan-card__requests">
                    <span class="subscription-plan-card__requests__label">Requests</span>
                    <template v-if="subscriptionPlan.requests">
                      <span class="subscription-plan-card__requests__value">{{ subscriptionPlan.requests.month }}/month</span>
                      <span class="subscription-plan-card__requests__value">{{ subscriptionPlan.requests.minute }}/min</span>
                    </template>
                    <span v-else class="subscription-plan-card__requests__value">(unknown)</span>
                  </div>
                  <button class="btn btn--std btn--blue" style="flex-grow: 0">select tier</button>
                  <span class="subscription-plan-card__license">{{ subscriptionPlan.license }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  // Prop,
} from 'vue-property-decorator';
import { chunk } from 'lodash';
import SentinelHubApi from '@/service/sentinel-hub';
import { SubscriptionPlan } from '@/model/sentinel-hub';

@Component
export default class SelectSentinelHubPlan extends Vue {
  // @Prop() private assetId!: string;
  sentinelHubApi = new SentinelHubApi();

  show = false;

  subscriptionPlansChunked: SubscriptionPlan[][] = [];

  billingType: 'ANNUAL' | 'MONTHLY' = 'ANNUAL';

  mounted(): void {
    this.show = true;

    this.sentinelHubApi.getSubscriptionPlans().then((response) => {
      if (response.success) {
        const subscriptionPlans = response.result;
        this.subscriptionPlansChunked = chunk(subscriptionPlans, 4);
        console.log('asdasd', this.subscriptionPlansChunked);
      } else {
        console.log('err', response);
      }
    });
  }

  beforeDestroy(): void {
    this.show = false;
  }

  onCloseModal(): void {
    this.$emit('close');
  }

  computeMonthlyPrice(annualPrice: number): number {
    return parseFloat((annualPrice / 12).toFixed(2));
  }

  computeAnnualPrice(monthlyPrice: number): number {
    return monthlyPrice * 12;
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "~flexboxgrid/css/flexboxgrid.min.css";
@import "@/assets/styles/_cataloguesingle-select-sh-plan.scss";
</style>
