<template>
  <div class="page" v-if="page.length > 0">
    <div class="faq__header">
        <div class="m_container">
        <div class="faq__dreadcrumb">
           <router-link :to="`/faq/`" class="faq__dreadcrumb__item">
            FAQ
          </router-link>
          <span> > </span>
          <div class="faq__dreadcrumb__item">
            {{page[0].name}}
          </div>
        </div>
    <div class="faq__header__title">
      {{page[0].name}}
    </div>
     <div class="faq__header__text" v-if="page[0].description.length > 0">
       {{page[0].description}}
    </div>
    </div>
      </div>

    <div class="m_container">
      <div class="faq__category">
        <div class="faq__category__inner"  v-for="(item, index) in category"
            v-bind:key="`${index}_category`">
          <div class="faq__category__title">
           {{item.name}}
          </div>
          <router-link :to="`${page[0].slug}/${post.post_name}`" class="faq__category__item"  v-for="(post, index) in item.posts"
            v-bind:key="`${index}_post`" >
         {{post.post_title}}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class FaqCategory extends Vue {
page: any;

category: any;

constructor() {
  super();
  this.page = ['string'];
  this.category = ['string'];
}

mounted():void {
  axios.get(`${process.env.VUE_APP_API_WORDPRESS_URL}/wp-json/wp/v2/faq_categories?slug=${this.$route.params.category}`).then((response) => {
    this.page = response.data;
  }).catch((error) => {
    console.log(error);
  });

  axios.get(`${process.env.VUE_APP_API_WORDPRESS_URL}/wp-json/om/v1/faq-categories?category=${this.$route.params.category}`).then((response) => {
    this.category = response.data;
    console.log(this.category);
  }).catch((error) => {
    console.log(error);
  });
}
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_terms.scss";
  @import "@/assets/styles/faq/_faq.scss";
</style>
