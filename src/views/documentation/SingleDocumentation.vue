<template>
  <div class="page" v-if="page.length > 0">
    <section class="page__hero page__hero--white page__hero__documentation">
      <div class="page__hero__inner">
        <div class="s_container">
          <div class="page__hero__documentation__title">
            <div class="page__hero__documentation__counter" v-if="page[0].acf.hero_counter">
              <span>{{ page[0].acf.hero_counter }}</span>
            </div>
            <h1 v-if="page[0].acf.hero_title">
              {{ page[0].acf.hero_title }}
            </h1>
          </div>
          <div class="page__hero__text" v-if="page[0].acf.hero_text">
            {{ page[0].acf.hero_text }}
          </div>
        </div>
      </div>
    </section>
    <section class="documentation-tabs" v-if="page[0].acf.tabs.length > 0">
      <div class="s_container">
        <div class="documentation-tabs__holder">
          <div class="documentation-tabs__title" :class="{ active: activeTab == index }" @click="activeTab = index" v-for="(tab, index) in page[0].acf.tabs" v-bind:key="`${index}_tab_title`">
            {{ tab.tab_title }}
          </div>
        </div>
      </div>
    </section>
    <section class="documentation-tabs__items">
      <div v-for="(tab, index) in page[0].acf.tabs" v-bind:key="`${index}_tab_content`">
        <transition name="fade">
          <div class="documentation-tabs__item" v-if="activeTab == index">
            <div class="s_container">
              <div class="documentation-tabs__holder">
                <div class="documentation-tabs__item__text" v-html="tab.tab_description"></div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class VAS extends Vue {
  page: any;

  activeTab: number;

  wpUrl: string;

  constructor() {
    super();
    this.page = [];
    this.activeTab = 0;
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/documentation?slug=${this.$route.params.slug}`)
      .then((response) => {
        this.page = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_page.scss';
@import '@/assets/styles/_services-carts.scss';
@import '@/assets/styles/_documentation-items.scss';
@import '@/assets/styles/_documentation-tabs.scss';
</style>
