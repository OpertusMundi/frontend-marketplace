<template>
  <div class="asset__vendor_info">
    <div class="s_container">
      <div class="asset__related__content">
        <div class="asset__related__content__right" v-if="catalogueItem && catalogueItem.publisher">
          <h6>About the vendor</h6>
          <div class="asset__vendor_info__card">
            <img :src="catalogueItem.publisher.logoImage ? 'data:' + catalogueItem.publisher.logoImageMimeType + ';base64, ' + catalogueItem.publisher.logoImage : defaultLogo()" alt="" height="80" width="80">
            <div class="asset__vendor_info__card__info">
              <div>
                <span class="asset__vendor_info__card__info__title">{{ catalogueItem.publisher.name }}</span>
                <a v-if="!catalogueItem.publisher.favorite" href="#" class="asset__head__favorites" @click.prevent="onAddToFavorites(catalogueItem.publisher.id)">
                  <img src="@/assets/images/icons/favorites/favorite_icon--dark.svg" alt="">
                </a>
                <a v-else href="#" class="asset__head__favorites" @click.prevent="onRemoveFromFavorites(catalogueItem.publisher.favorite)">
                  <img src="@/assets/images/icons/favorites/favorite_icon--dark--filled.svg" alt="">
                </a>
              </div>
              <div class="asset__vendor_info__card__info__rating">
                <div v-if="catalogueItem.publisher.rating && catalogueItem.publisher.rating !== null" class="rating rating--dark">
                  <span v-for="i in 5" :key="i" :class="{'active': Math.round(catalogueItem.publisher.rating) >= i}">★</span>
                  <i>{{ catalogueItem.publisher.rating }}/5</i>
                </div>
              </div>
              <span class="asset__vendor_info__card__info__location">{{ catalogueItem.publisher.city }}, {{ $store.getters.getConfig.configuration.countries.find((x) => x.code === catalogueItem.publisher.country).name }}</span>
              <span class="asset__vendor_info__card__info__join_date">Joined {{ formatDate(catalogueItem.publisher.joinedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';
import FavoriteApi from '@/service/favorite';
import store from '@/store';
import { EnumFavoriteType, FavoriteProviderCommand } from '@/model/favorite';
import getDefaultLogo from '@/helper/logo';
import moment from 'moment';

@Component
export default class VendorInformation extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  favoriteApi: FavoriteApi;

  constructor() {
    super();

    this.favoriteApi = new FavoriteApi();
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }

  formatDate(date: string): string {
    return moment(date).format('MMMM YYYY');
  }

  onAddToFavorites(publisherKey: string): void {
    store.commit('setLoading', true);

    const providerData: FavoriteProviderCommand = {
      publisherKey,
      type: EnumFavoriteType.PROVIDER,
    };

    this.favoriteApi.add(providerData).then((response) => {
      if (response.success) {
        this.$emit('reloadAsset');
      } else {
        console.log('error adding provider to favorites', response);
        store.commit('setLoading', false);
      }
    }).catch((err) => {
      console.log('error adding provider to favorites', err);
      store.commit('setLoading', false);
    });
  }

  onRemoveFromFavorites(publisherKey: string): void {
    store.commit('setLoading', true);

    this.favoriteApi.remove(publisherKey).then((response) => {
      if (response.success) {
        this.$emit('reloadAsset');
      } else {
        console.log('error removing provider from favorites', response);
        store.commit('setLoading', false);
      }
    }).catch((err) => {
      console.log('error removing provider from favorites', err);
      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
