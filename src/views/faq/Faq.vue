<template>
  <div class="page" v-if="posts.length > 0">
    <section class="faq__hero">
      <shape></shape>
      <div class="faq__hero__content">
        <h1 class="faq__hero__content__title">{{ page[0].title.rendered }}</h1>
        <search></search>
        <div class="faq__hero__content__text" v-if="page[0].excerpt.rendered" v-html="page[0].excerpt.rendered"></div>
      </div>
    </section>
    <div class="m_container">
      <div class="faq__overview">
        <div class="faq__overview__title">Search by topic</div>
        <div class="faq__overview__holder">
          <router-link :to="`/faq/${post.slug}`" class="faq__overview__item" v-for="(post, index) in posts" v-bind:key="`${index}_posts`">
            <div class="faq__overview__item__title">
              <template v-if="post.acf.title_for_archive_page">{{ post.acf.title_for_archive_page }}</template>
              <template v-else>{{ post.title.rendered }}</template>
            </div>
            <div class="faq__overview__item__text" v-if="post.acf.subtitle_for_archive_page">
              {{ post.acf.subtitle_for_archive_page }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Search from '@/components/Search.vue';
import axios from 'axios';

@Component({
  components: { Search },
})
export default class FaqOverview extends Vue {
  categories: any;

  posts: any;

  page: any;

  searchResultsActive = false;

  wpUrl: string;

  constructor() {
    super();

    this.categories = [];
    this.page = [];
    this.posts = [];
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/faq`)
      .then((response) => {
        this.posts = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/faq_categories?parent=0`)
      .then((response) => {
        this.categories = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=faq`)
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
@import '@/assets/styles/_terms.scss';
@import '@/assets/styles/faq/_faq.scss';
</style>
