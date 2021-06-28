<template>
  <div class="page page--nooverflow about" v-if="pagedata">
    <section class="page__hero page__hero--about">
      <div class="page__hero__inner">
        <div class="page__hero__head s_container">
          <h1>{{ pagedata.heading }}</h1>
          <h2>{{ pagedata.subheading }}</h2>
          <div class="about__sections">
            <template v-for="section in pagedata.sections">
              <div :key="section.id" class="about__sections__row" data-aos="" data-aos-offset="350">
                <div class="about__sections__row__block about__sections__row__block--main">
                  <h3 class="about__sections__row__block__title">{{ section.heading }}</h3>
                  <div class="about__sections__row__block__text" v-html="section.content"></div>
                </div>
                <div class="about__sections__row__block about__sections__row__block--image">
                  <img :src="section.image.url" alt="" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

@Component
export default class About extends Vue {
  pagedata: any;

  wpUrl: string;

  constructor() {
    super();

    this.pagedata = null;
    this.wpUrl = '';
  }

  created(): void {
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    this.getPageData();
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  };

  async getPageData(): Promise<void> {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=about`)
      .then((response) => {
        this.pagedata = response.data[0].acf;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.initAOS();
      });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_page.scss';
</style>
