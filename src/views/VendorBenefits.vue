<template>
  <div class="page page--nooverflow" v-if="loaded">
    <div class="vendors-container">
    <section class="page__hero">
      <div class="page__hero__inner">
          <h1>{{ pagedata[0].acf.heading }}</h1>
        <h2>{{ pagedata[0].acf.subheading }}</h2>
      </div>
    </section>
   <section class="benefits">
     <div class="benefits__row" v-for="item, index in benefits" :key="item.id">
       <div class="benefits__text" data-aos="fade-up">
         <span>{{ index }} + {{item.show}}</span>
        <div class="benefits__text__rendered"  v-html="item.description_short"></div>
         <transition name="fade" mode="out-in">
        <div class="benefits__text__rendered" v-html="item.description_full" v-show="item.show"></div>
         </transition>
         <div v-if="item.description_full.length" @click="getItemId(index)" class="expand-btn">{{item.show ? 'show less' : 'show more' }}</div>
       </div>
       <div class="benefits__img" data-aos="fade-left">
         <img :src="item.image.url"/>
       </div>
     </div>
   </section>
    </div>
    <div class="m_container">
      <section class="card">
        <div class="card__title">
          <h3>6 steps to grow your business</h3>
        </div>
        <div class="card__container">
        <div class="card__grid">
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>1</h1>
             </div>
           <div class="card__grid__text">
             <h3>Register in the market as a supplier</h3>
             <p>Full KYB compliance<br/>Direct payments to your account</p>
           </div>
         </div>
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>2</h1>
             </div>
           <div class="card__grid__text">
             <h3>Add metadata to your asset</h3>
             <p>Create from new or import existing<br/>Metadata built for trading not, curation</p>
           </div>
         </div>
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>3</h1>
             </div>
           <div class="card__grid__text">
             <h3>Upload your asset (optional)</h3>
             <p>We create automated metadata helping consumers make informed decisions<br/>We deliver you asset to consumers</p>
           </div>
         </div>
        </div>
         <div class="card__grid">
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>4</h1>
             </div>
           <div class="card__grid__text">
             <h3>Select your pricing model and price</h3>
             <p>Support for all pricing models and options<br/>Build trust with consumers</p>
           </div>
         </div>
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>5</h1>
             </div>
           <div class="card__grid__text">
             <h3>Select your terms</h3>
             <p>We provide you with ready-to-use templates.<br/> You select the terms and we automate contracts with consumers</p>
           </div>
         </div>
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>6</h1>
             </div>
           <div class="card__grid__text">
             <h3>Review and publish</h3>
             <p>Our helpdesk reviews the asset, we get in touch if needed and you are ready to publish it</p>
           </div>
         </div>
         </div>
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

  wpUrl: string;

  loaded: boolean;

  show: boolean;

  benefits: any;

  showIndex: any;

  constructor() {
    super();

    this.pagedata = null;
    this.loaded = false;
    this.show = false;
    this.benefits = [];
    this.showIndex = null;
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted():void {
    this.initAOS();
  }

  created():void {
    this.getPageData();
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }

  getPageData(): void {
    axios.get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=vendor-benefits`).then((response) => {
      this.pagedata = response.data;
      this.benefits = response.data[0].acf.benefits;
      this.benefits.forEach((element) => {
        this.$set(element, 'show', false);
      });
      console.log(this.benefits);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      this.loaded = true;
      console.log('data fetching completed');
    });
  }

  getItemId(value): void {
    this.benefits[value].show = !this.benefits[value].show;
    // this.$set(this.benefits.show, value, true);
    // console.log(this.benefits[value].show);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page-benefits-vendors.scss";
</style>
