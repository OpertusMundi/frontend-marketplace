<template>
  <div class="page" v-if="page.length > 0">
    <section class="page__hero page__hero--white">
      <img class="page__hero__img"
           v-if="page[0].acf.hero_image"
           :src="page[0].acf.hero_image.sizes.large" alt=""
      />
      <div
        :class="page[0].acf.hero_image ? 'page__hero__inner page__hero__inner--white' : 'page__hero__inner'">
        <h1>{{ page[0].title.rendered }}</h1>
        <div class="page__hero__text" v-if="page[0].excerpt.rendered"
             v-html="page[0].excerpt.rendered"></div>
      </div>
    </section>

    <div class="services-carts" v-if="services.length > 0">
      <div class="s_container">
        <div class="services-carts__holder">
          <router-link :to="`/vas/${service.slug}`" class="services-carts__item"
                       v-for="service in services" v-bind:key="service.id">
            <div class="services-carts__item__view"><span>VIEW SERVICE</span></div>
            <div class="services-carts__item__inner">
              <div class="services-carts__item__top services-carts__item__top--m-0">
                <img src="@/assets/images/t-icon.svg" alt=""/>
                <span>{{ service.title.rendered }}</span>
              </div>
              <div class="services-carts__item__main">
                <div class="services-carts__item__main__hero-title">{{
                    service.acf.hero_title
                  }}
                </div>
                <div class="services-carts__item__main__text"
                     v-html="service.excerpt.rendered"></div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <!-- <documentation-cards :title="page[0].acf.documentation_title"
                         :subtitle="page[0].acf.documentation_text"
                         :items="page[0].acf.documentation"></documentation-cards>
    <div v-if="page[0].acf.documentation_archive_link" class="page__bottom">
      <router-link :to="{name: 'documentation'}" class="btn btn--std btn--blue">
        all documentation
      </router-link>
    </div> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DocumentationCards from '@/components/Documentation/DocumentationCards.vue';
import axios from 'axios';

@Component({
  components: {
    DocumentationCards,
  },
})
export default class VAS extends Vue {
  page: any;

  services: any;

  wpUrl: string;

  constructor() {
    super();
    this.page = [];
    this.services = [];
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=vas`)
      .then((response) => {
        this.page = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/vas`)
      .then((response) => {
        this.services = response.data;
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
</style>
