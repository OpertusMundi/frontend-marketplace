<template>
  <div class="blog assets">
    <div class="blog-post s_container d-flex flex-column align-items-center pt-xs-60">
      <template v-if="post">
        <div class="blog-inner-container">
          <template v-if="post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]">
            <router-link :to="{ name: 'Blog', params: { categoryID: post._embedded['wp:term'][0][0].id } }">
              <div class="category__item category__item__active">
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
          <button class="blog-post__btn-registration-info" v-if="!$store.getters.isAuthenticated">
            Registration information
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="33" viewBox="0 0 25 33"><text data-name="➝" transform="translate(0 27)" fill="#fff" font-size="25" font-family="SegoeUISymbol, Segoe UI Symbol" letter-spacing=".03em"><tspan x="0" y="0">➝</tspan></text></svg>
          </button>

          <div v-if="post.content" v-html="post.content.rendered" class="blog-inner-container__content mt-xs-50 terms__main__text"></div>
        </div>

      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import moment from 'moment';
import ConfigApi from '@/service/config';
import { Post, Category } from '@/model/wordpress';
import store from '@/store';

@Component
export default class BlogPost extends Vue {
  configApi = new ConfigApi();

  category = null as Category | null;

  post = null as Post | null;

  @Watch('$store.getters.getConfig', { immediate: true })
  onConfigChange(): void {
    if (store.getters.getConfig && !this.post) this.getPost();
  }

  mounted(): void {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  }

  async getPost(): Promise<void> {
    store.commit('setLoading', true);

    const { id: postID } = this.$route.params;
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;

    const url = `${wordressEndpoint}/wp-json/wp/v2/blog/${postID}?_embed`;

    const response = await axios.get(url);
    const { data } = response;
    this.post = data;

    store.commit('setLoading', false);

    this.makeIFramesFullWidth();
  }

  formatDate(date: string): string {
    return moment(date).format('D MMM YYYY');
  }

  makeIFramesFullWidth(): void {
    this.$nextTick(() => {
      const iframeElements = document.querySelectorAll('iframe');
      const targetWidth = (document.querySelector('.blog-inner-container') as HTMLElement).clientWidth;

      iframeElements.forEach((elem) => {
        const height = parseFloat(elem.height);
        const width = parseFloat(elem.width);
        console.log('w', 'h', width, height);

        const aspectRatio = width / height;

        const targetHeight = targetWidth / aspectRatio;
        console.log('target width', targetWidth);
        console.log('target height', targetHeight);
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
