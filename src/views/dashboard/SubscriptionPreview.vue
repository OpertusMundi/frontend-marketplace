<template>
  <div class="dashboard__inner" v-if="subscription">
    <modal :withSlots="true" :show="modalToShow === 'cancelSubscription'" @dismiss="modalToShow = ''" :modalId="'cancelSubscription'">
      <template v-slot:body>
        <h1>Cancel Subscription?</h1>

        <p class="mb-xs-10">By proceeding, your subscription will be cancelled</p>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="cancelSubscription">OK</button>
      </template>
    </modal>

    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/subscriptions" class="asset__head__breadcrumps"
        ><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5" /></svg>BACK</router-link
      >
      <div class="dashboard__head__helpers dashboard__head__helpers--justify-center mt-xs-30">
        <h1 v-if="subscription.status === 'ACTIVE'">{{ subscription.item.title }}</h1>
        <div v-else>
          <h3 style="color: #6c6c6c">INACTIVE</h3>
          <h1>{{ subscription.item.title }}</h1>
        </div>
        <div class="dashboard__head__settings" @mouseover="showOptions = true" @mouseout="showOptions = false" v-if="subscription.status === 'ACTIVE'">
          <a href="#" @click.prevent="">
            <svg data-name="Asset actions" xmlns="http://www.w3.org/2000/svg" width="3" height="17">
              <g data-name="Group 2622" fill="#333">
                <circle data-name="Ellipse 169" cx="1.5" cy="1.5" r="1.5"></circle>
                <circle data-name="Ellipse 170" cx="1.5" cy="1.5" r="1.5" transform="translate(0 14)"></circle>
                <circle data-name="Ellipse 171" cx="1.5" cy="1.5" r="1.5" transform="translate(0 7)"></circle>
              </g>
            </svg>
          </a>
          <transition name="fade" mode="out-in">
            <div class="dashboard__head__settings__options" v-show="showOptions">
              <ul>
                <!-- <li><a href="#">Upgrade plan</a></li> -->
                <li><a href="#" @click.prevent="modalToShow = 'cancelSubscription'">Cancel subscription</a></li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="contract-single">
      <div class="row">
        <div class="col-md-6">

          <template v-if="servicesData.length">
            <div v-for="(service, i) in servicesData" :key="i">
              <p class="private-ogc-single__detail__title">Type</p>
              <p class="private-ogc-single__detail__value">
                {{ service.type }}
              </p>

              <p class="private-ogc-single__detail__title mt-xs-10">URI</p>
              <p class="private-ogc-single__detail__value">
                <!-- <span>({{ service.type }})</span> -->
                {{ service.uri }}
              </p>

              <p class="private-ogc-single__detail__title mt-xs-10">Requests</p>
              <p class="private-ogc-single__detail__value">
                <ul>
                  <li v-for="request in service.availableRequests" :key="request">&#8226; {{ request }}</li>
                </ul>
              </p>

              <div v-for="[paramKey, paramVal] in service.parameters" :key="paramKey">
                <p class="private-ogc-single__detail__title mt-xs-10">{{ paramKey }}</p>
                <p class="private-ogc-single__detail__value">
                  {{ paramVal }}
                </p>
              </div>

              <p class="private-ogc-single__detail__title mt-xs-10">Example</p>
              <p class="private-ogc-single__detail__value">
                {{ service.example }}
              </p>
            </div>
          </template>
          <div v-else class="private-ogc-single__detail__value"><span>(URI not yet available)</span></div>

        </div>
        <div class="col-md-6">
          <ul class="contract-single__info">
            <li>
              <strong>Plan Description</strong>
              <p>
                <span v-if="subscription.pricingModel.type === 'FIXED_PER_ROWS'">
                  <span style="font-weight: 400; margin-bottom: 0.5em; display: block">{{ subscription.pricingModel.price }}€, minimum rows: {{ subscription.pricingModel.minRows }} <br /></span>
                  <div v-for="discountRate in subscription.pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                </span>
                <span v-if="subscription.pricingModel.type === 'FIXED_FOR_POPULATION'">
                  <span style="font-weight: 400; margin-bottom: 0.5em; display: block">{{ subscription.pricingModel.price }}€, minimum percent: {{ pricingModel.minPercent }} <br /></span>
                  <div v-for="discountRate in subscription.pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                </span>
                <span v-if="subscription.pricingModel.type === 'PER_CALL'">
                  <span style="font-weight: 400; margin-bottom: 0.5em; display: block">{{ subscription.pricingModel.price }}€ per call<br /></span>
                  <div v-for="discountRate in subscription.pricingModel.discountRates" :key="discountRate.count">discount: {{ discountRate.discount }}% discount at {{ discountRate.count }} calls<br /></div>
                  <div v-for="prePaidTier in subscription.pricingModel.prePaidTiers" :key="prePaidTier.count">prepaid tier: {{ prePaidTier.discount }}% discount at {{ prePaidTier.count }} calls<br /></div>
                </span>
                <span v-if="subscription.pricingModel.type === 'PER_ROW'">
                  <span style="font-weight: 400; margin-bottom: 0.5em; display: block">{{ subscription.pricingModel.price }}€ per row<br /></span>
                  <div v-for="discountRate in subscription.pricingModel.discountRates" :key="discountRate.count">discount: {{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                  <div v-for="prePaidTier in subscription.pricingModel.prePaidTiers" :key="prePaidTier.count">prepaid tier: {{ prePaidTier.discount }}% discount at {{ prePaidTier.count }} rows<br /></div>
                </span>
                <span v-if="subscription.pricingModel.type === 'SENTINEL_HUB_SUBSCRIPTION'">
                  <div v-for="discountRate in subscription.pricingModel.discountRates" :key="discountRate.count">Monthly price excluding tax: {{ subscription.pricingModel.monthlyPriceExcludingTax }}€<br /></div>
                  <div v-for="prePaidTier in subscription.pricingModel.prePaidTiers" :key="prePaidTier.count">Annual price excluding tax: {{ subscription.pricingModel.monthlyPriceExcludingTax }}€<br /></div>
                </span>

                <span style="display: flex; margin-top: 0.5em;">
                  <strong style="font-weight: 500; margin-bottom: 0.3em; color: #333;">Use restricted for: </strong>
                  <span v-if="getDomainRestrictions(subscription.pricingModel).length">
                    <span v-for="(domain, i) in getDomainRestrictions(subscription.pricingModel)" :key="domain">{{ domain }}<span v-if="i !== getDomainRestrictions(subscription.pricingModel).length - 1">, </span></span>
                  </span>
                  <span v-else>Any domain</span>
                </span>

                <span style="display: flex; margin-top: 0.3em;">
                  <strong style="font-weight: 500; margin-bottom: 0.3em; color: #333;">Coverage: </strong>
                  <span v-if="getCoverageRestrictions(subscription.pricingModel).length">
                    <span v-for="(area, i) in getCoverageRestrictions(subscription.pricingModel)" :key="area">{{ area }}<span v-if="i !== getCoverageRestrictions(subscription.pricingModel).length - 1">, </span></span>
                  </span>
                  <span v-else>Worldwide</span>
                </span>

                <span style="display: flex; margin-top: 0.3em;">
                  <strong style="font-weight: 500; margin-bottom: 0.3em; color: #333;">Consumers: </strong>
                  <span v-if="getConsumerRestrictions(subscription.pricingModel).length">
                    <span v-for="(area, i) in getConsumerRestrictions(subscription.pricingModel)" :key="area">{{ area }}<span v-if="i !== getConsumerRestrictions(subscription.pricingModel).length - 1">, </span></span>
                  </span>
                  <span v-else>Worldwide</span>
                </span>
              </p>
            </li>
            <li>
              <strong>Provided by</strong>
              <p>{{ subscription.provider.name }}</p>
            </li>
            <li>
              <strong>Start date</strong>
              <p>{{ formatDate(subscription.addedOn) }}</p>
            </li>
          </ul>
        </div>
      </div>
      <ul>
        <li class="mt-xs-50 mb-xs-20">
          <strong>Asset details</strong>
        </li>
      </ul>
      <card :asset="subscription.item"></card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConsumerAPI from '@/service/consumer';
import { ConsumerAccountSubscription } from '@/model/account-asset';
import Modal from '@/components/Modal.vue';
import Card from '@/components/Catalogue/Card.vue';
import store from '@/store';
import moment from 'moment';
import { BasePricingModelCommand } from '@/model/pricing-model';

@Component({
  components: { Modal, Card },
})
export default class SubscriptionsPreview extends Vue {
  subscriptionKey: string | null;

  consumerApi: ConsumerAPI;

  subscription: ConsumerAccountSubscription | null;

  servicesData: {
    uri: string,
    type: string,
    parameters: string[][],
    availableRequests: string[],
    example: string,
  }[] = [];

  showOptions = false;

  modalToShow = '';

  constructor() {
    super();

    this.subscriptionKey = null;
    this.consumerApi = new ConsumerAPI();
    this.subscription = null;
  }

  mounted(): void {
    this.subscriptionKey = this.$route.params.key;
    store.commit('setLoading', true);
    this.consumerApi.getSubscription(this.subscriptionKey).then((response) => {
      store.commit('setLoading', false);
      if (response.data.success) {
        this.subscription = response.data.result;
        console.log(this.subscription);

        if ((this.subscription.item as any).ingestionInfo[0]?.endpoints) {
          this.servicesData = (this.subscription.item as any).ingestionInfo[0].endpoints
            .map((x) => {
              const parameters = x.uri.split('?')[1]
                ? x.uri
                  .split('?')[1]
                  .split('&')
                  .map((y) => y.split('='))
                  .filter((y) => y[0].toLowerCase() !== 'request')
                  .map((y) => [y[0].split('').map((z, i) => (i === 0 ? z.toUpperCase() : z)).join(''), y[1]])
                : [];

              return {
                uri: x.uri.split('?')[0],
                type: x.type,
                // eslint-disable-next-line
                availableRequests: x.type === 'WMS' ? ['GetCapabilities', 'GetMap', 'GetLegendGraphic', 'DescribeLayer'] : x.type === 'WFS' ? ['GetCapabilities', 'GetFeature', 'DescribeFeatureType'] : x.type as unknown as string === 'WMTS' ? ['GetCapabilities', 'GetTile'] : [],
                example: x.uri,
                parameters,
              };
            });

          console.log('LAAAA', this.servicesData);

          store.commit('setLoading', false);
        }
      } else {
        // TODO: handle error
        console.log('error fetching subscription info');
      }
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }

  cancelSubscription(): void {
    this.modalToShow = '';

    store.commit('setLoading', true);

    this.consumerApi.cancelSubscription(this.subscription?.key || '').then((response) => {
      store.commit('setLoading', false);
      if (response.success) this.$router.push('/dashboard/subscriptions');
    });
  }

  getDomainRestrictions(pricingModel: BasePricingModelCommand): string[] {
    if (!pricingModel.domainRestrictions) return [];
    return pricingModel?.domainRestrictions as string[];
  }

  getCoverageRestrictions(pricingModel: BasePricingModelCommand): string[] {
    const continents = Array.isArray(pricingModel?.coverageRestrictionContinents) ? pricingModel?.coverageRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(pricingModel?.coverageRestrictionCountries) ? pricingModel?.coverageRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }

  getConsumerRestrictions(pricingModel: BasePricingModelCommand): string[] {
    const continents = Array.isArray(pricingModel?.consumerRestrictionContinents) ? pricingModel?.consumerRestrictionContinents.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()) : null;
    const countries = Array.isArray(pricingModel?.consumerRestrictionCountries) ? pricingModel?.consumerRestrictionCountries.map((x) => store.getters.getConfig.configuration.countries.find((y) => y.code === x).name) as string[] : null;

    if (continents && countries) return continents.concat(countries);
    return continents || countries || [];
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
@import '@/assets/styles/_contracts.scss';
@import "~flexboxgrid/css/flexboxgrid.min.css";

.private-ogc-single {
  &__detail {
    margin-bottom: 25px;
    font-size: .9em;

    &__title {
      font-weight: 700;
      margin-bottom: 10px;
    }

    &__value {
      span {
        color: $labelColor;
      }
      margin-top: .3em;
      font-size: .9em;
      margin-bottom: 25px;
    }
  }
}

</style>
