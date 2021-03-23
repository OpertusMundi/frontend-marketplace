<template>
  <div class="page" v-if="terms.length > 0">
    <section class="page__hero page__hero--white">
      <div class="page__hero__inner">
        <h1>Documentation</h1>
        <div class="page__hero__text">
          All the resources you need to unlock topio’s services.
        </div>
      </div>
    </section>
    <div class="documentation-items" v-for="(term, index) in terms" v-bind:key="`${index}_cat`">
      <div class="s_container">
        <div class="documentation-items__title">{{ term.cat_name }}</div>
        <div class="documentation-items__subtitle">{{ term.category_description }}</div>
        <div class="documentation-items__holder">
          <router-link
            :to="`/documentation/${post.post_name}`"
            class="documentation-items__item"
            v-for="(post, index) in term.posts"
            v-bind:key="`${index}_post`"
          >
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter">
                <span>{{ index + 1 }}</span>
              </div>
              <div class="documentation-items__item__title">
                {{ post.post_title }}
              </div>
              <div class="documentation-items__item__text">
                {{ post.post_excerpt }}
              </div>
            </div>

            <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
          </router-link>
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
import { Prop, Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class VAS extends Vue {
  terms: any;

  constructor() {
    super();

    this.terms = [];
  }

  mounted():void {
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
