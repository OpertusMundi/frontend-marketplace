<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Profile</h1>
      </div>
    </div>

    <div class="profile-section" v-if="account && account.profile && account.profile.provider && account.profile.provider.current">
      <img
        v-if="account.profile.provider.current.logoImage && account.profile.provider.current.logoImageMimeType"
        :src="`data:${account.profile.provider.current.logoImageMimeType};base64,${account.profile.provider.current.logoImage}`"
        alt="profile image"
      >
      <img v-else :src="defaultLogo()" alt="default logo image">
      <div>
        <span>{{ account.profile.provider.current.name }}</span>
        <span class="profile-section__address">{{ account.profile.provider.current.headquartersAddress.line1 }}, {{ account.profile.provider.current.headquartersAddress.line2 ? account.profile.provider.current.headquartersAddress.line1 + ', ': '' }} {{ account.profile.provider.current.headquartersAddress.postalCode }}, {{ account.profile.provider.current.headquartersAddress.city }}, {{ account.profile.provider.current.headquartersAddress.country }}</span>
        <span class="profile-section__join-date">Joined {{ formatDate(account.registeredAt).date.split(' ').filter((x, i) => i > 0).join(' ') }}</span>
        <router-link to="/dashboard/settings"><button class="btn btn--std btn--blue">edit profile</button></router-link>
      </div>
    </div>

    <div class="profile-section" v-else-if="account && account.profile">
      <img
        v-if="account.profile.image && account.profile.imageMimeType"
        :src="`data:${account.profile.imageMimeType};base64,${account.profile.image}`"
        alt="profile image"
      >
      <img v-else :src="defaultLogo()" alt="default logo image">
      <div>
        <span>{{ account.profile.firstName || '' }} {{ account.profile.lastName || '' }}</span>
        <span class="profile-section__join-date">Joined {{ formatDate(account.registeredAt).date.split(' ').filter((x, i) => i > 0).join(' ') }}</span>
        <router-link to="/dashboard/settings"><button class="btn btn--std btn--blue">edit profile</button></router-link>
      </div>
    </div>

    <div v-if="account && account.profile && account.profile.provider && account.profile.provider.current">
      <div class="filters">
        <div class="filters__block">
          <p class="filters__title">{{ paginationData.itemsTotal }} ASSETS</p>
        </div>
        <div class="filters__block">
          <div class="filters__block__select">
            <select name="filter" id="filter">
              <option
                v-for="orderOption in orderOptions"
                :key="orderOption.label"
                @click="selectedOrderOption = orderOption"
                :selected="orderOption.label === selectedOrderOption.label"
              >{{ orderOption.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <asset-published-card v-for="asset in assets" :key="asset.id" :noSideMenu="true" :asset="asset"></asset-published-card>
      </div>

      <div class="more__bottom">
        <div class="more__bottom__block">
          <pagination :currentPage="paginationData.currentPage" :itemsPerPage="paginationData.itemsPerPage" :itemsTotal="paginationData.itemsTotal" @pageSelection="onPageSelect"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import ProfileApi from '@/service/profile';
import ProviderAssetsApi from '@/service/provider-assets';
import { Account, CatalogueItem } from '@/model';
import AssetPublishedCard from '@/components/Assets/AssetPublishedCard.vue';
import Pagination from '@/components/Pagination.vue';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';
import moment from 'moment';

@Component({
  components: { AssetPublishedCard, Pagination },
})
export default class Profile extends Vue {
  profileApi = new ProfileApi();

  providerAssetsApi = new ProviderAssetsApi();

  account: Account | null = null;

  paginationData: {
    currentPage: number,
    itemsPerPage: number,
    itemsTotal: number,
  } = {
    currentPage: 0,
    itemsPerPage: 4,
    itemsTotal: 0,
  };

  orderOptions = [
    { label: 'TITLE ASCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'ASC' },
    { label: 'TITLE DESCENDING', orderBy: EnumProviderAssetSortField.TITLE, order: 'DESC' },
    { label: 'DATE PUBLISHED ASCENDING', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, order: 'ASC' },
    { label: 'DATE PUBLISHED DESCENDING', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, order: 'DESC' },
    { label: 'TYPE ASCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'ASC' },
    { label: 'TYPE DESCENDING', orderBy: EnumProviderAssetSortField.TYPE, order: 'DESC' },
  ];

  selectedOrderOption = this.orderOptions[3];

  assets: CatalogueItem[] = [];

  @Watch('selectedOrderOption', { deep: true })
  onOrderOptionChange(): void {
    if (!this.account?.profile?.provider?.current) return;
    this.loadAssets();
  }

  async created(): Promise<void> {
    store.commit('setLoading', true);

    const profileResponse = await this.profileApi.getProfile();
    this.account = profileResponse.result;
    store.commit('setLoading', false);

    if (!this.account.profile?.provider?.current) return;
    this.loadAssets();
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }

  formatDate(datetime: string): { date: string, time: string } {
    const date = moment(datetime).format('D MMM YY');
    const time = moment(datetime).format('HH:mm');

    return {
      date,
      time,
    };
  }

  async onPageSelect(page: number): Promise<void> {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    store.commit('setLoading', true);
    await this.loadAssets(page);
    store.commit('setLoading', false);
  }

  loadAssets(page = 0): Promise<void> {
    store.commit('setLoading', true);

    const query: ProviderDraftQuery = {
      q: '',
      pageRequest: {
        page,
        size: this.paginationData.itemsPerPage,
      },
      sorting: {
        id: this.selectedOrderOption.orderBy,
        order: this.selectedOrderOption.order as 'ASC' | 'DESC',
      },
    };

    return this.providerAssetsApi.find(query).then((response) => {
      this.assets = response.result.items;

      this.paginationData = {
        itemsTotal: response.result.count,
        itemsPerPage: response.result.pageRequest.size,
        currentPage: response.result.pageRequest.page,
      };

      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_messages.scss";
  @import "@/assets/styles/_search.scss";

  .dashboard__head__helpers h1 {
    font-size: 1.8em;
  }

  .profile-section {
    display: flex;
    gap: 1em;
    margin: 2em 0;

    img {
      border-radius: 50%;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      border: solid 1px #333;
      height: min-content;
      max-width: 200px;
    }

    &__address {
      color: $darkColor;
      font-size: .85em;
    }

    &__join-date {
      color: $labelColor;
      font-size: .85em;
    }

    >div {
      display: flex;
      gap: .8em;
      flex-direction: column;

      span:nth-child(1) {
        color: $secondColor;
        font-size: 1.6em;
        font-weight: 600;
      }

      a {
        transform: scale(.8);
        transform-origin: 0;
        -webkit-transform-origin-x: 0;
      }
    }
  }
</style>
