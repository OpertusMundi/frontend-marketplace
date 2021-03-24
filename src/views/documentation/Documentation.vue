<template>
  <div class="page" v-if="terms.length && page.length  > 0">
    <section class="page__hero page__hero--white">
      <div class="page__hero__inner">
          <h1>{{ page[0].title.rendered }}</h1>
        <div class="page__hero__text" v-if="page[0].excerpt.rendered" v-html=" page[0].excerpt.rendered">
        </div>
      </div>
    </section>
    <div class="documentation-items" v-for="(term, index) in terms" v-bind:key="`${index}_cat`">
      <div class="s_container">
        <div class="documentation-items__title">{{ term.cat_name }}</div>
        <div class="documentation-items__subtitle">{{ term.category_description }}</div>
        <div class="documentation-items__holder">
        <documentation-card :item=post :index=index  v-for="(post, index) in term.posts" v-bind:key="`${index}_post`"></documentation-card>
        </div>
      </div>
    </div>

    <div class="s_container">
      <div class="documentation-items__help">
        <div class="documentation-items__help__title">
          Need any help?
        </div>
        <div class="documentation-items__help__text">
          In case you have any questions please visit our Hepldesk
        </div>
        <div class="documentation-items__help__btn">
          <a href="" class="btn btn--std btn--blue">
            Go to helpdesk
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DocumentationCard from '@/components/Documentation/DocumentationCard.vue';
import axios from 'axios';

@Component({
  components: {
    DocumentationCard,
  },
})
export default class VAS extends Vue {
  page: any;

  terms: any;

  constructor() {
    super();

    this.page = [];
    this.terms = [];
  }

  mounted():void {
    axios.get('http://om-docs.bracketdev.com/wp-json/wp/v2/pages?slug=documentation').then((response) => {
      this.page = response.data;
      console.log(this.page);
    }).catch((error) => {
      console.log(error);
    });

    axios.get('http://om-docs.bracketdev.com/wp-json/om/v1/documentation-posts').then((response) => {
      this.terms = response.data;
      console.log(this.terms);
    }).catch((error) => {
      console.log(error);
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_page.scss";
@import "@/assets/styles/_services-carts.scss";
@import "@/assets/styles/_documentation-items.scss";
</style>
