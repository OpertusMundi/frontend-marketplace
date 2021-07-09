<template>
  <div class="page page--nooverflow" v-if="pagedata">
    <div class="vendors-container">
      <section class="page__hero">
        <div class="page__hero__inner">
          <h1>{{ pagedata[0].acf.heading }}</h1>
          <h2>{{ pagedata[0].acf.subheading }}</h2>
        </div>
      </section>
      <section class="benefits">
        <div class="benefits__row" v-for="(item, index) in benefits" :key="item.id">
          <div class="benefits__text" data-aos="fade-up">
            <div class="benefits__text__rendered" v-html="item.description_short"></div>
            <transition name="fade" mode="out-in">
              <div class="benefits__text__rendered" v-html="item.description_full" v-show="item.show"></div>
            </transition>
            <div v-if="item.description_full.length" @click="getItemId(index)" class="expand-btn">{{ item.show ? 'show less' : 'show more' }}</div>
          </div>
          <div class="benefits__img" :data-aos="index % 2 ? 'fade-right' : 'fade-left'">
            <img :src="item.image.url" />
          </div>
        </div>
      </section>
    </div>
    <div class="m_container">
      <section class="card" data-aos="fade-up" v-if="pagedata[0].acf.steps.length">
        <div class="card__title" data-aos="fade-up" data-aos-delay="200">
          <h3>{{ pagedata[0].acf.steps_heading }}</h3>
        </div>
        <div class="card__container">
          <template v-for="(step, totalIndex) in colArray">
            <div :key="step.name" class="card__grid">
              <template v-for="(item, index) in step">
                <div class="card__grid__item" :key="item.id" data-aos="fade-up" data-aos-delay="400">
                  <div class="card__grid__number">
                    <h1>{{ totalIndex * Math.ceil(pagedata[0].acf.steps.length / 2) + (index + 1) }}</h1>
                  </div>
                  <div class="card__grid__text" v-html="item.content"></div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

@Component
export default class VendorBenefits extends Vue {
  pagedata: any;

  show: boolean;

  benefits: any;

  colArray: any;

  wpUrl: string;

  constructor() {
    super();

    this.pagedata = null;
    this.show = false;
    this.benefits = [];
    this.colArray = [];
    this.wpUrl = '';
  }

  created(): void {
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    this.getPageData();
  }

  slpitSteps(): void {
    const cloned = this.pagedata[0].acf.steps.slice();
    while (cloned.length > 0) {
      const chunk = cloned.splice(0, Math.ceil(this.pagedata[0].acf.steps.length / 2));
      this.colArray.push(chunk);
    }
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  };

  async getPageData(): Promise<void> {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=user-benefits`)
      .then((response) => {
        this.pagedata = response.data;
        this.benefits = response.data[0].acf.benefits;
        if (response.data[0].acf.steps) {
          this.slpitSteps();
        }
        this.benefits.forEach((element) => {
          this.$set(element, 'show', false);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          this.initAOS();
        }, 500);
      });
  }

  getItemId(value: number): void {
    this.benefits[value].show = !this.benefits[value].show;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_page-benefits-vendors.scss';
</style>
