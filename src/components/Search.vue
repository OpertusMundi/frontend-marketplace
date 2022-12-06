<template>
  <div class="asset_search">
    <transition name="fade" mode="out-in">
      <div class="asset_search__backdrop" v-if="searchResultsActive" @click="hideSearchResults"></div>
    </transition>
    <div class="asset_search__upper" v-bind:class="{ open: searchResultsActive }">
      <!-- <input type="text" name="" id="" placeholder="Search Assets" class="asset_search__upper__input" @focus="showSearchResults" @blur="hideSearchResults"> -->
      <form v-on:submit.prevent="searchAssets">
        <input v-on:keyup.enter="searchByTerm($event.target.value)" type="text" name="query" autocomplete="off" v-model="query" id="" placeholder="Search for Geospatial Assets" class="asset_search__upper__input" @focus="showSearchResults" @input="debouncedInput" />
      </form>
      <div class="asset_search__upper__controls">
        <div class="asset_search__upper__controls__inner">
          <div class="asset_search__upper__controls__icons">
            <div class="asset_search__upper__icon" @click.prevent="searchAssets" v-if="!searchResultsActive && !loading">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path id="Path_8967" data-name="Path 8967" d="M781.8,258.8l-8.266-8.266a8.658,8.658,0,1,0-6.771,3.263h.07a.96.96,0,0,0-.008-1.92h-.007a6.746,6.746,0,1,1,4.934-2.2,1.554,1.554,0,0,0-.153,1.636l8.844,8.844A.96.96,0,1,0,781.8,258.8Z" transform="translate(-758.086 -236.44)" fill="#333333" />
              </svg>
            </div>
            <div class="asset_search__upper__icon" v-if="query && searchResultsActive && !loading" @click.prevent="clearInput"><img src="@/assets/images/icons/close_icon.svg" alt="" /></div>
            <div class="asset_search__upper__icon" v-if="loading"><div class="loader_icon"></div></div>
          </div>
          <ul class="asset_search__upper__controls__links">
            <li><a href="#" @click.prevent="onSelectFilterShortcut('OPEN')">Open</a></li>
            <li><a href="#" @click.prevent="onSelectFilterShortcut('VECTOR')">Vector</a></li>
            <li><a href="#" @click.prevent="onSelectFilterShortcut('RASTER')">Raster</a></li>
            <li><a href="#" @click.prevent="onSelectFilterShortcut('SERVICE')">APIs</a></li>
            <li><router-link :to="'/catalogue'">ALL →</router-link></li>
          </ul>
        </div>
      </div>
      <!-- <div class="asset_search__upper__icon" @click.prevent="searchAssets" v-if="!searchResultsActive && !loading"><img src="@/assets/images/icons/search_new.svg" alt="" /></div>
      <div class="asset_search__upper__icon" v-if="query && searchResultsActive && !loading" @click.prevent="clearInput"><img src="@/assets/images/icons/close_icon.svg" alt="" /></div>
      <div class="asset_search__upper__icon" v-if="loading"><div class="loader_icon"></div></div> -->
    </div>
    <div class="asset_search__resultscont" v-if="searchResultsActive">
      <ul class="asset_search__resultscont__filters">
        <li>
          <a
            href="#"
            @click.prevent="
              query = '';
              queryResults = [];
              showRecent = true;
              showPopular = false;
            "
            :class="{ active: showRecent }"
            >Recent Searches</a
          >
        </li>
        <li>
          <a
            href="#"
            @click.prevent="
              query = '';
              queryResults = [];
              showRecent = false;
              showPopular = true;
            "
            :class="{ active: showPopular }"
            >Popular Searches</a
          >
        </li>
      </ul>
      <ul class="asset_search__resultscont__results" v-if="queryHasResults">
        <li v-for="item in queryResults" :key="item.id">
          <!-- <router-link :to="`/catalogue/${item.id}`" [...] -->
          <a class="cursor-pointer" @click.prevent="selectAsset(item.id)">
            <h5>{{ item.title }}</h5>
            <span>Language: {{ item.language }}, Price: {{ showItemPrice(item) }}</span>
          </a>
        </li>
      </ul>
      <ul class="asset_search__resultscont__results" v-if="query && !queryHasResults && !showRecent && !showPopular">
        <li class="no_results"><i>No results found for your query</i></li>
      </ul>
      <ul class="asset_search__resultscont__results related" v-if="showRecent">
        <template v-if="!$store.getters.isAuthenticated"
          ><li class="no_results">
            <i><a @click.prevent="loginWithKeycloak" class="login_link" style="cursor: pointer">Login</a> to view your recent searches</i>
          </li></template
        >
        <template v-else>
          <li v-for="recentSearch in getRecentSearches()" :key="recentSearch">
            <a href="#" @click.prevent="searchByTerm(recentSearch)">
              <h5>{{ recentSearch }}</h5>
              <!-- <span>Municipalities, Greece, Administrative boundaries, Kallikrates</span></a -->
            </a>
          </li>
        </template>
      </ul>
      <ul class="asset_search__resultscont__results related" v-if="showPopular">
        <li v-for="popularTerm in popularTerms" :key="popularTerm.term">
          <a href="#" @click.prevent="searchByTerm(popularTerm.term)">
            <h5>{{ popularTerm.term }}</h5>
            <!-- <span>{{ popularTerm.amount }} {{ popularTerm.amount === 1 ? 'search' : 'searches' }}</span> -->
          </a>
        </li>
        <!-- <li>
          <a href="#"
            ><h5>Administrative boundaries in Greece</h5>
            <span>Municipalities, Greece, Administrative boundaries, Kallikrates</span></a
          >
        </li>
        <li>
          <a href="#"
            ><h5>POIs in Luxembourg</h5>
            <span>POI, Points of Interest, Luxembourg, OpenStreetMap</span></a
          >
        </li>
        <li>
          <a href="#"
            ><h5>Athens road network WFS</h5>
            <span>Roads, Street names, Athens, Greece, WFS</span></a
          >
        </li> -->
      </ul>
      <a href="" class="asset_search__resultscont__action" v-if="showRecent">Delete search history</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AnalyticsApi from '@/service/analytics';
import CatalogueApi from '@/service/catalogue';
import ProfileApi from '@/service/profile';
import { CatalogueQueryResponse, CatalogueQuery, CatalogueItem } from '@/model';
import { navigateToKeycloakLogin } from '@/helper/login';
import { AxiosError } from 'axios';
import { Debounce } from 'vue-debounce-decorator';
import store from '@/store';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';

@Component
export default class Search extends Vue {
  searchResultsActive = false;

  catalogQuery: CatalogueQuery;

  query = '';

  queryHasResults = false;

  loading = false;

  showPopular = false;

  showRecent = true;

  analyticsApi: AnalyticsApi;

  catalogueApi: CatalogueApi;

  profileApi: ProfileApi;

  popularTerms: { term: string; amount: number }[] = [];

  queryResults: CatalogueItem[];

  @Debounce(500)
  debouncedInput(): void {
    this.searchAssets();
  }

  constructor() {
    super();

    this.query = '';
    this.queryResults = [];
    this.catalogQuery = {
      page: 0,
      size: 6,
      query: this.query,
    };

    this.analyticsApi = new AnalyticsApi();
    this.catalogueApi = new CatalogueApi();
    this.profileApi = new ProfileApi();
  }

  created(): void {
    this.updateProfile();

    this.analyticsApi.getMostPopularTerms({}).then((response) => {
      if (response.success) {
        this.popularTerms = response.result
          .filter((x) => Object.keys(x)[0])
          // eslint-disable-next-line
          .sort((a, b) => (Object.values(a)[0]! < Object.values(b)[0]! ? 1 : Object.values(a)[0]! > Object.values(b)[0]! ? -1 : 0))
          .map((x) => ({
            term: Object.keys(x)[0],
            amount: x[Object.keys(x)[0]],
          }));
      } else {
        console.log('err', response);
      }
    });
  }

  @Watch('query')
  onQueryChange(query: string): void {
    if (!query) return;
    this.showRecent = false;
    this.showPopular = false;
  }

  clearInput(): void {
    this.query = '';
    this.queryResults = [];
    this.showRecent = true;
    this.showPopular = false;
  }

  showItemPrice(item: CatalogueItem): string {
    return renderedPriceAsString(getPriceOrMinimumPrice(item));
  }

  showSearchResults(): void {
    if (this.searchResultsActive) return;
    this.searchResultsActive = true;
    // this.slideToggle('asset_search__resultscont');
  }

  hideSearchResults(): void {
    this.searchResultsActive = false;
    this.queryHasResults = false;
    // this.slideToggle('asset_search__resultscont');
  }

  // slideToggle(selectorClass:string):void {
  //   const selector = document.getElementsByClassName(selectorClass)[0] as HTMLElement;
  //   if (!selector) return;
  //   if (!selector.classList.contains('active')) {
  //     selector.classList.add('active');
  //     selector.style.height = 'auto';
  //     const height = `${selector.clientHeight}px`;
  //     selector.style.height = '0px';
  //     setTimeout(() => {
  //       selector.style.height = height;
  //     }, 0);
  //   } else {
  //     selector.style.height = '0px';
  //     selector.addEventListener('transitionend', () => {
  //       selector.classList.remove('active');
  //     }, {
  //       once: true,
  //     });
  //   }
  // }

  getRecentSearches(): string[] {
    return [...new Set(this.$store.getters.getProfile.recentSearches)] as string[];
  }

  selectAsset(id: string): void {
    this.catalogueApi.find({ text: this.query }); // dummy call, only to add query text to recent searches
    this.$router.push(`/catalogue/${id}`);
  }

  searchByTerm(term: string): void {
    this.$router.push({ name: 'Catalogue', params: { termShortcut: term } });
  }

  searchAssets(): void {
    if (this.query.length <= 2) {
      this.queryResults = [];
      return;
    }
    this.loading = true;
    // this.queryResults = [];
    this.catalogQuery.query = this.query;
    this.catalogueApi
      .findAutocomplete({ text: this.query })
      .then((queryResponse: CatalogueQueryResponse) => {
        this.showRecent = false;
        this.showPopular = false;
        if (!queryResponse.success) {
          this.queryHasResults = false;
          this.showRecent = false;
          this.showPopular = false;
        } else {
          // this.queryHasResults = true;
          this.queryHasResults = !!queryResponse.result.items.length;
          this.queryResults = queryResponse.result.items;
          this.updateProfile();
        }
        if (!this.searchResultsActive) {
          setTimeout(() => {
            this.showSearchResults();
          }, 200);
        }
        this.loading = false;
      })
      .catch((error: AxiosError) => {
        console.log(error);
        this.loading = false;
      });
  }

  onSelectFilterShortcut(filter: EnumAssetType | string): void {
    this.$router.push({ name: 'Catalogue', params: { filterShortcut: filter } });
  }

  // used to reload recent searches (they are included inside profile)
  updateProfile(): void {
    this.profileApi.getProfile().then((response) => {
      if (!response.success) return;
      store.commit('setUserData', response.result);
    });
  }

  loginWithKeycloak(): void {
    navigateToKeycloakLogin(this.$route.path);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_search.scss';
</style>
