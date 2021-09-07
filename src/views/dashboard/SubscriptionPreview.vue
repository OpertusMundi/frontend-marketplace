<template>
  <div class="dashboard__inner" v-if="subscription">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/subscriptions" class="asset__head__breadcrumps"
        ><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5" /></svg>BACK</router-link
      >
      <div class="dashboard__head__helpers dashboard__head__helpers--justify-center mt-xs-30">
        <h1>{{ subscription.item.title }}</h1>
        <div class="dashboard__head__settings" @mouseover="showOptions = true" @mouseout="showOptions = false">
          <a href="#" @click.prevent=""
            ><svg data-name="Asset actions" xmlns="http://www.w3.org/2000/svg" width="3" height="17">
              <g data-name="Group 2622" fill="#333">
                <circle data-name="Ellipse 169" cx="1.5" cy="1.5" r="1.5"></circle>
                <circle data-name="Ellipse 170" cx="1.5" cy="1.5" r="1.5" transform="translate(0 14)"></circle>
                <circle data-name="Ellipse 171" cx="1.5" cy="1.5" r="1.5" transform="translate(0 7)"></circle>
              </g></svg
          ></a>
          <transition name="fade" mode="out-in">
            <div class="dashboard__head__settings__options" v-show="showOptions">
              <ul>
                <li><a href="#">Upgrade plan</a></li>
                <li><a href="#">Cancel subscription</a></li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="contract-single">
      <ul class="contract-single__info">
        <li>
          <strong>Plan Description</strong>
          <p>-</p>
        </li>
        <li>
          <strong>Provided by</strong>
          <p>{{ subscription.provider.name }}</p>
        </li>
        <li>
          <strong>Start date</strong>
          <p>{{ formatDate(subscription.addedOn) }}</p>
        </li>
        <li>
          <strong>Expiration update</strong>
          <p>{{ formatDate(subscription.addedOn) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConsumerAPI from '@/service/consumer';
import { ConsumerAccountSubscription } from '@/model/account-asset';
import store from '@/store';
import moment from 'moment';

@Component
export default class SubscriptionsPreview extends Vue {
  subscriptionKey: string | null;

  consumerApi: ConsumerAPI;

  subscription: ConsumerAccountSubscription | null;

  showOptions = false;

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
      } else {
        // TODO: handle error
        console.log('error fetching subscription info');
      }
    });
  }

  formatDate(date: string): string {
    return moment(date).format('MMM Do YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/_dashboard.scss';
@import '@/assets/styles/_contracts.scss';
</style>
