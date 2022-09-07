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
            <small>
              {{ formatDate(post.date) }}
              •
              <span class="author" v-if="post._embedded && post._embedded.author && post._embedded.author[0]">
                {{ post._embedded.author[0].name }}
              </span>
            </small>
          </div>
        </div>

        <img v-if="post.acf && post.acf.image" :src="post.acf.image.url" alt="post image" class="mt-xs-60">

        <div class="blog-inner-container">
          <div v-if="post.content" v-html="post.content.rendered" class="mt-xs-50 terms__main__text"></div>
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
  }

  formatDate(date: string): string {
    return moment(date).format('D MMM YYYY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import "@/assets/styles/_blog.scss";
@import '@/assets/styles/_terms.scss';
</style>
