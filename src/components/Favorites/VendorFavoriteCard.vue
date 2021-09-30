<template>
  <div class="favorite_vendor_card">
    <img :src="'data:' + provider.provider.logoImageMimeType + ';base64, ' + provider.provider.logoImage" alt="" height="80" width="80">
    <div class="favorite_vendor_card__info">
      <div>
        <router-link :to="`/vendor/${provider.provider.id}`">
          <span class="favorite_vendor_card__info__title">{{ provider.provider.name }}</span>
        </router-link>
      </div>
      <div class="favorite_vendor_card__info__rating">
        <div v-if="provider.provider.rating && provider.provider.rating !== null" class="rating rating--dark">
          <span v-for="i in 5" :key="i" :class="{'active': Math.round(provider.provider.rating) >= i}">★</span>
          <i>{{ provider.provider.rating }}/5</i>
        </div>
      </div>
      <span class="favorite_vendor_card__info__location">{{ provider.provider.city }}, {{ $store.getters.getConfig.configuration.countries.find((x) => x.code === provider.provider.country).name }}</span>
      <span class="favorite_vendor_card__info__join_date">Joined {{ formatDate(provider.provider.joinedAt) }}</span>
    </div>
    <div>
      <a href="#" class="asset__head__favorites" @click.prevent="onRemoveFromFavorites(provider.key)">
        <img src="@/assets/images/icons/favorites/favorite_icon__dashboard__vendors.svg" alt="">
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Provider } from '@/model/account';
import FavoriteApi from '@/service/favorite';
import store from '@/store';
import moment from 'moment';

@Component
export default class VendorFavoriteCard extends Vue {
  @Prop({ required: true }) readonly provider!: Provider;

  favoriteApi: FavoriteApi;

  constructor() {
    super();

    console.log('prov', this.provider);

    this.favoriteApi = new FavoriteApi();
  }

  formatDate(date: string): string {
    return moment(date).format('MMMM YYYY');
  }

  onRemoveFromFavorites(key: string): void {
    store.commit('setLoading', true);

    this.favoriteApi.remove(key).then((response) => {
      if (response.success) {
        this.$emit('reload');
      } else {
        console.log('error removing from favorites', response);
      }
    }).catch((err) => {
      console.log('error removing from favorites', err);
    });
  }
}
</script>
<style lang="scss">
  // @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/_favorites.scss";
</style>
