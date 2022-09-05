<template>
  <div class="blog-list assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>topio Blog</h1>
      </div>
      <div>
        <div class="category__container">
          <span class="category__item" :class="{'category__item__active': selectedCategoryID === null}" @click="selectedCategoryID = null">ALL</span>
          <span
            class="category__item"
            :class="{'category__item__active': category.id === selectedCategoryID}"
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategoryID = category.id"
          >
              {{ category.name }}
          </span>
        </div>
        <template v-if="categories.length">
          <div class="row" v-for="(postsRow, i) in postsChunked" :key="i">
            <div class="col-sm-4" v-for="post in postsRow" :key="post.id">
              <post-card
                :title="post.title.rendered"
                :body="post.content.rendered"
                :authorID="post._embedded.author[0].id"
                :authorName="post._embedded.author[0].name"
                :date="post.date"
                :image="post.acf && post.acf.image ? post.acf.image.url : null"
                :categoryID="post.categories && post.categories.length ? post.categories[0] : null"
                :categoryName="post.categories && post.categories.length ? categories.find(x => x.id === post.categories[0]).name : null"
              ></post-card>
            </div>
          </div>

          <pagination :currentPage="pagination.currentPage" :itemsPerPage="pagination.itemsPerPage" :itemsTotal="pagination.itemsTotal" @pageSelection="onPageSelect($event)"></pagination>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import { chunk } from 'lodash';
import PostCard from '@/components/Blog/PostCard.vue';
import Pagination from '@/components/Pagination.vue';
import { Post, Category } from '@/model/wordpress';
import store from '@/store';

@Component({
  components: {
    PostCard,
    Pagination,
  },
})
export default class BlogList extends Vue {
  categories: Category[] = [];

  selectedCategoryID: number | null = null;

  postsChunked: Post[][] = [[]];

  postsUrl = '';

  pagination = {
    currentPage: 0,
    itemsPerPage: 12,
    itemsTotal: 0,
  };

  created(): void {
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;
    this.postsUrl = `${wordressEndpoint}/wp-json/wp/v2/blog`;

    store.commit('setLoading', true);

    Promise.all([
      this.getCategories(),
      this.getPosts(undefined, undefined, false),
    ]).then(() => {
      store.commit('setLoading', false);
    });
  }

  @Watch('selectedCategoryID')
  onSelectedCategoryChange(): void {
    this.getPosts();
  }

  async getCategories(): Promise<void> {
    const { endpoint: wordressEndpoint } = store.getters.getConfig.configuration.wordPress;
    const url = `${wordressEndpoint}/wp-json/wp/v2/categories`;

    const categoriesResponse = await axios.get(url);
    const { data: categories } = categoriesResponse;

    this.categories = categories.filter((x) => x.slug !== 'uncategorized');
  }

  async getPosts(page = 0, itemsPerPage = this.pagination.itemsPerPage, withLoading = true): Promise<void> {
    if (withLoading) store.commit('setLoading', true);

    const urlWithParams = `${this.postsUrl}?page=${page + 1}&per_page=${itemsPerPage}&_embed${this.selectedCategoryID === null ? '' : `&categories=${this.selectedCategoryID}`}`;

    const postsResponse = await axios.get(urlWithParams);
    const { data: posts } = postsResponse;

    this.postsChunked = chunk(posts, 3);
    Vue.set(this.pagination, 'itemsTotal', postsResponse.headers['x-wp-total']);
    Vue.set(this.pagination, 'currentPage', page);

    if (withLoading) store.commit('setLoading', false);
  }

  onPageSelect(e: number): void {
    this.getPosts(e);
  }
}
</script>
<style lang="scss">
  @import "~flexboxgrid/css/flexboxgrid.min.css";

  .blog-list {
    .category {
      &__container {
        display: inline-flex;
        gap: 20px;
      }

      &__item {
        font-size: 13px;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 2rem 0;
        cursor: pointer;

        &__active {
          color: $secondColor;
        }
      }
    }
  }
</style>