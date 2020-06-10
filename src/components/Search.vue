<template>
  <div class="asset_search">
    <div class="asset_search__upper" v-bind:class="{'open':searchResultsActive}">
      <input type="text" name="" id="" placeholder="Search Assets" class="asset_search__upper__input" @focus="showSearchResults" @blur="hideSearchResults">
      <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt=""></div>
      <div class="asset_search__upper__icon asset_search__upper__icon--close" @click.prevent="hideSearchResults"><img src="@/assets/images/icons/close_icon.svg" alt=""></div>
    </div>
    <div class="asset_search__resultscont">
      <ul class="asset_search__resultscont__filters">
        <li><a href="#" class="active">Recent Searches</a></li>
        <li><a href="#" class="">Popular Searches</a></li>
      </ul>
      <ul class="asset_search__resultscont__results">
        <li><a href="#"><h5>Road network</h5><span>Country: Greece, Language: English, Price: 800-2500€</span></a></li>
        <li><a href="#"><h5>Recent search 2</h5><span>Country: Greece, Language: English, Price: 800-2500€</span></a></li>
        <li><a href="#"><h5>Recent search 5</h5><span>Country: Greece, Language: English, Price: 800-2500€</span></a></li>
        <li><a href="#"><h5>Recent search 6</h5><span>Country: Greece, Language: English, Price: 800-2500€</span></a></li>
      </ul>
      <a href="" class="asset_search__resultscont__action">Delete search history</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  searchResultsActive = false;

  showSearchResults():void {
    if (this.searchResultsActive) return;
    this.searchResultsActive = true;
    this.slideToggle('asset_search__resultscont');
  }

  hideSearchResults():void {
    this.searchResultsActive = false;
    this.slideToggle('asset_search__resultscont');
  }

  slideToggle(selectorClass:string):void {
    const selector = document.getElementsByClassName(selectorClass)[0] as HTMLElement;
    if (!selector) return;
    if (!selector.classList.contains('active')) {
      selector.classList.add('active');
      selector.style.height = 'auto';
      const height = `${selector.clientHeight}px`;
      selector.style.height = '0px';
      setTimeout(() => {
        selector.style.height = height;
      }, 0);
    } else {
      selector.style.height = '0px';
      selector.addEventListener('transitionend', () => {
        selector.classList.remove('active');
      }, {
        once: true,
      });
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_search.scss";
</style>
