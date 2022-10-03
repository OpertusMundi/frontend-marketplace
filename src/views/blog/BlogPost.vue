<template>
  <div class="blog assets">
    <div class="blog-post s_container d-flex flex-column align-items-center pt-xs-60">
      <template v-if="post">
        <div class="blog-inner-container">
          <template v-if="post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]">
            <router-link :to="{ name: 'Blog', params: { categoryID: post._embedded['wp:term'][0][0].id } }">
              <div class="category__item category__item--active">
                {{ post._embedded['wp:term'][0][0].name }}
              </div>
            </router-link>
          </template>
          <h1 v-if="post.title" v-html="post.title.rendered" class="mt-xs-30"></h1>
          <div class="date-author-info mt-xs-30">
            <small class="blog-inner-container__upper-info">
              <span>{{ formatDate(post.date) }}</span>
              <span>•</span>
              <span class="author" v-if="post._embedded && post._embedded.author && post._embedded.author[0]">
                {{ post._embedded.author[0].name }}
              </span>
              <svg data-name="Group 7420" xmlns="http://www.w3.org/2000/svg" width="13.333" height="16" viewBox="0 0 13.333 16"><defs><clipPath id="a"><path data-name="Rectangle 5647" fill="#333" d="M0 0h13.333v16H0z"/></clipPath></defs><g data-name="Group 7419" clip-path="url(#a)"><path data-name="Path 14318" d="M11.167 11.667a2.156 2.156 0 0 0-1.493.6L4.2 8.723a2.022 2.022 0 0 0 0-1.441L9.674 3.73A2.162 2.162 0 1 0 9 2.167a2.128 2.128 0 0 0 .133.722L3.663 6.44a2.167 2.167 0 1 0 0 3.123l5.474 3.548a2.128 2.128 0 0 0-.137.722 2.167 2.167 0 1 0 2.167-2.167" fill="#333"/></g></svg>
            </small>
          </div>
        </div>

        <img v-if="post.acf && post.acf.image" :src="post.acf.image.url" alt="post image" class="mt-xs-60">

        <div class="blog-inner-container">
          <a class="blog-post__btn-registration-info" :href="post.acf.cta_button_url" target="_blank" v-if="post.acf && post.acf.cta_button_label && post.acf.cta_button_url">
            {{ post.acf.cta_button_label }}
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="33" viewBox="0 0 25 33"><text data-name="➝" transform="translate(0 27)" fill="#fff" font-size="25" font-family="SegoeUISymbol, Segoe UI Symbol" letter-spacing=".03em"><tspan x="0" y="0">➝</tspan></text></svg>
          </a>

          <div v-if="post.content" v-html="post.content.rendered" class="blog-inner-container__content mt-xs-50 terms__main__text"></div>
        </div>

        <div class="banner" v-if="!$store.getters.isAuthenticated">
          <h1>Explore. Trade. Use. <span class="blue-text">Geodata.</span></h1>
          <router-link to="/register" style="height: min-content">
            <button class="btn btn--std btn--blue">register now</button>
          </router-link>
        </div>

        <div class="blog-inner-container previous-next-posts__container" v-if="isPreviousNextPostsLoaded && categories">
          <div>
            <template v-if="previousPost && previousPost.title">
              <div class="previous-next-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><text data-name="➝" transform="matrix(-1 0 0 1 12 13)" fill="#333" font-size="12" font-family="SegoeUISymbol, Segoe UI Symbol" letter-spacing=".02em"><tspan x="0" y="0">➝</tspan></text></svg>
                Previous post
              </div>
              <div class="d-flex justify-content-start">
                <router-link :to="{ name: 'Blog', params: { categoryID: previousPost && previousPost.categories ? previousPost.categories[0] || null : null } }">
                  <div class="category__item category__item--active category__item--small-margins">{{ categories.find(x => previousPost.categories.includes(x.id)).name }}</div>
                </router-link>
              </div>
              <router-link :to="{ name: 'BlogPost', params: { slug: previousPost.slug, postDate: previousPost.date } }">
                <span class="post-title">{{ previousPost.title.rendered }}</span>
              </router-link>
            </template>
          </div>
          <div class="next-post">
            <template v-if="nextPost && nextPost.title">
              <div class="previous-next-label previous-next-label--next">
                Next post
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><text data-name="➝" transform="translate(0 13)" fill="#333" font-size="12" font-family="SegoeUISymbol, Segoe UI Symbol" letter-spacing=".02em"><tspan x="0" y="0">➝</tspan></text></svg>
              </div>
              <div class="d-flex justify-content-end">
                <router-link :to="{ name: 'Blog', params: { categoryID: nextPost && nextPost.categories ? nextPost.categories[0] || null : null } }">
                  <div class="category__item category__item--active category__item--small-margins">{{ categories.find(x => nextPost.categories.includes(x.id)).name }}</div>
                </router-link>
              </div>
              <router-link :to="{ name: 'BlogPost', params: { slug: nextPost.slug, postDate: nextPost.date } }">
                <span class="post-title">{{ nextPost.title.rendered }}</span>
              </router-link>
            </template>
          </div>
        </div>

        <div class="related-posts__wrapper">
          <div class="s_container">
            <h3 class="related-posts__heading">Related posts</h3>
          </div>

          <div class="related-posts__container" v-if="isRelatedPostsLoaded" v-dragscroll>
            <post-card
              v-for="(post, i) in relatedPosts"
              :carouselElement="true"
              :key="post.id"
              :postID="post.id"
              :postSlug="post.slug"
              :title="post.title.rendered"
              :body="post.content.rendered"
              :authorID="post._embedded.author[0].id"
              :authorName="post._embedded.author[0].name"
              :date="post.date"
              :image="post.acf && post.acf.image ? post.acf.image.url : null"
              :categoryID="post.categories && post.categories.length ? post.categories[0] : null"
              :categoryName="post.categories && post.categories.length ? categories.find(x => x.id === post.categories[0]).name : null"
              :style="{
                'margin-left': i === 0 ? `${relatedCardMarginLeft}px` : 0,
                'margin-right': i === relatedPosts.length - 1 ? '2em' : 0,
                'width': `calc((${windowInnerWidth}px - ${relatedCardMarginLeft}px - (1.5em * 3)) / 3.5)`
              }"
              @selectCategory="$router.push({ name: 'Blog', params: { categoryID: $event } })"
            ></post-card>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import moment from 'moment';
import { dragscroll } from 'vue-dragscroll';
import PostCard from '@/components/Blog/PostCard.vue';
import ConfigApi from '@/service/config';
import { Post, Category } from '@/model/wordpress';
import store from '@/store';

@Component({
  components: { PostCard },
  directives: { dragscroll },
})
export default class BlogPost extends Vue {
  configApi = new ConfigApi();

  category = null as Category | null;

  post = null as Post | null;

  previousPost = null as Post | null;

  nextPost = null as Post | null;

  relatedPosts = null as Post[] | null;

  isPreviousNextPostsLoaded = false;

  isRelatedPostsLoaded = false;

  categories: Category[] | null = null;

  @Watch('$store.getters.getConfig', { immediate: true })
  onConfigChange(): void {
    if (store.getters.getConfig && !this.post && !this.$store.getters.isLoading) {
      this.getPost();
      if (this.$route.params.postDate) this.getPreviousAndNextPost(this.$route.params.postDate);
      if (this.$route.params.categoryID && this.$route.params.postID) this.getRelatedPosts(parseInt(this.$route.params.categoryID, 10), parseInt(this.$route.params.postID, 10));
    }
  }

  mounted(): void {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  }

  get windowInnerWidth(): number {
    return window.innerWidth;
  }

  get relatedCardMarginLeft(): number | null {
    return (document.querySelector('.related-posts__heading') as HTMLElement).getBoundingClientRect().x || null;
  }

  async getPost(): Promise<void> {
    store.commit('setLoading', true);

    const { slug } = this.$route.params;
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;

    const urlPost = `${wordressEndpoint}/wp-json/wp/v2/blog?slug=${slug}&_embed`;
    const urlCategories = `${wordressEndpoint}/wp-json/wp/v2/categories`;

    const promises = Promise.all([
      axios.get(urlPost),
      axios.get(urlCategories),
    ]);

    const responses = await promises;
    const [postResponse, categoriesResponse] = responses;

    const { data: post } = postResponse;
    [this.post] = post;

    const { data: categories } = categoriesResponse;
    this.categories = categories;

    this.makeIFramesFullWidth();
    if (!this.$route.params.postDate && this.post) this.getPreviousAndNextPost(this.post.date);
    if (!this.$route.params.categoryID && !this.$route.params.postID && this.post && this.post.categories && this.post.categories[0]) this.getRelatedPosts(this.post.categories[0], this.post.id);

    store.commit('setLoading', false);
  }

  async getPreviousAndNextPost(postDate: string): Promise<void> {
    console.log('getpreviousandnextpost!!!!!!');
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;

    const urlPreviousPosts = `${wordressEndpoint}/wp-json/wp/v2/blog?per_page=1&before=${postDate}&orderBy=date&order=desc`;
    const urlNextPosts = `${wordressEndpoint}/wp-json/wp/v2/blog?per_page=1&after=${postDate}&orderBy=date&order=asc`;

    const promises = Promise.all([
      axios.get(urlPreviousPosts),
      axios.get(urlNextPosts),
    ]);

    const responses = await promises;
    const [previousPostsResponse, nextPostsResponse] = responses;

    const { data: previousPosts } = previousPostsResponse;
    const { data: nextPosts } = nextPostsResponse;

    /* eslint-disable prefer-destructuring */
    if (previousPosts.length) this.previousPost = previousPosts[0];
    /* eslint-disable prefer-destructuring */
    if (nextPosts.length) this.nextPost = nextPosts[0];

    console.log('HEY', this.previousPost, this.nextPost);
    this.isPreviousNextPostsLoaded = true;
  }

  async getRelatedPosts(categoryID: number, postID: number): Promise<void> {
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;
    const url = `${wordressEndpoint}/wp-json/wp/v2/blog?page=1&per_page=5&_embed&categories=${categoryID}&exclude=${postID}`;

    const relatedPostsResponse = await axios.get(url);
    const { data: relatedPosts } = relatedPostsResponse;

    this.relatedPosts = relatedPosts;
    this.isRelatedPostsLoaded = true;
  }

  formatDate(date: string): string {
    return moment(date).format('D MMM YYYY');
  }

  makeIFramesFullWidth(): void {
    this.$nextTick(() => {
      const iframeElements = document.querySelectorAll('iframe');
      const targetWidth = (document.querySelector('.blog-inner-container') as HTMLElement).clientWidth;

      iframeElements.forEach((elem) => {
        if (elem.width === '100%') return;

        const height = parseFloat(elem.height);
        const width = parseFloat(elem.width);

        const aspectRatio = width / height;

        const targetHeight = targetWidth / aspectRatio;
        /* eslint-disable no-param-reassign */
        elem.width = '100%';
        elem.height = `${targetHeight}px`;
        /* eslint-enable no-param-reassign */
      });
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import "@/assets/styles/_blog.scss";
@import '@/assets/styles/_terms.scss';
</style>
