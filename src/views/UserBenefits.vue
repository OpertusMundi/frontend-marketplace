<template>
  <div class="page page--nooverflow">
    <div class="vendors-container">
    <section class="page__hero">
      <div class="page__hero__inner">
        <h1>Explore. Create. Expand.</h1>
        <h2>A marketplace where you can do more</h2>
      </div>
    </section>
   <section class="benefits">
     <div class="benefits__row">
       <div class="benefits__text" data-aos="fade-up">
         <h3>All the data you need</h3>
            <p>Looking for geospatial data and services for Europe? You’ve come to the right place! Topio is the one-stop-shop for all kinds of geospatial information.</p>
            <router-link to="/">SHOW MORE</router-link>
       </div>
       <div class="benefits__img" data-aos="fade-left">
         <img src="@/assets/images/vendors_benefits/data-need.svg"/>
       </div>
     </div>
      <div class="benefits__row">
        <div class="benefits__img" data-aos="fade-right">
         <img src="@/assets/images/vendors_benefits/powerfull-search.svg"/>
       </div>
       <div class="benefits__text" data-aos="fade-up">
         <h3>Powerfull search</h3>
            <p>Search for all geospatial data in one place, simple as that. We know how it feels when you endlessly browse the web to find the missing data you want for your product or your client. We’ve been there ourselves.</p>
            <router-link to="/">SHOW MORE</router-link>
        </div>
     </div>
     <div class="benefits__row">
       <div class="benefits__text" data-aos="fade-up">
         <h3>Sneak-peak inside data</h3>
            <p>When you buy data, you typically only know in advance some information about the coverage and contents. Then you pay up, and anxiously wait to see whether what you were promised is actually what you were looking for. This doesn’t really work, does it? If you are buying a car, aren’t supposed to see the real thing, or even test drive it first?</p>
            <router-link to="/">SHOW MORE</router-link>
       </div>
       <div class="benefits__img" data-aos="fade-left">
         <img src="@/assets/images/vendors_benefits/sneak-peak.svg"/>
       </div>
     </div>
     <div class="benefits__row">
        <div class="benefits__img" data-aos="fade-right">
         <img src="@/assets/images/vendors_benefits/vendors-get-data.svg"/>
       </div>
       <div class="benefits__text" data-aos="fade-up">
         <h3>Clear terms and prices</h3>
            <p>All assets in Topio are available with clear terms, pricing options, and prices, before you purchase them! Weird right? Not having to exchange several emails, browse through hundreds of documentation pages, request and wait for a quote, or dealing with preferential pricing for your competitors. Not anymore, with Topio you how much it costs and what you can do with an asset, before you purchase it.</p>
            <router-link to="/">SHOW MORE</router-link>
        </div>
     </div>
     <div class="benefits__row">
       <div class="benefits__text" data-aos="fade-up">
         <h3>Safe purchases and deliveries</h3>
            <p>Found what you want to purchase? Just add to your cart, agree to the terms, pay, and get it delivered in minutes. Simple as that!</p>
            <router-link to="/">SHOW MORE</router-link>
       </div>
       <div class="benefits__img" data-aos="fade-left">
         <img src="@/assets/images/vendors_benefits/purchases-deliveries.svg"/>
       </div>
     </div>
      <div class="benefits__row">
        <div class="benefits__img" data-aos="fade-right">
         <img src="@/assets/images/vendors_benefits/vendors-paid.svg"/>
       </div>
       <div class="benefits__text" data-aos="fade-up">
         <h3>Do more</h3>
            <p>Congrats on purchasing your first asset from Topio. But wait, don’t leave yet, there is more! You can use the data you buy, and data you own, right here.</p>
            <router-link to="/">SHOW MORE</router-link>
        </div>
     </div>
   </section>
    </div>
    <div class="m_container">
      <section class="card">
        <div class="card__title">
          <h3>6 steps to create and expand</h3>
        </div>
        <div class="card__container">
        <div class="card__grid">
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>1</h1>
             </div>
           <div class="card__grid__text">
             <h3>Register in the market as a consumer</h3>
             <p>Full KYB compliance<br/>Registered users get access to free tiers of topio services</p>
           </div>
         </div>
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>2</h1>
             </div>
           <div class="card__grid__text">
             <h3>Search for an asset</h3>
             <p>Search for all types of geospatial assets<br/>Filter and use based on rich metadata</p>
           </div>
         </div>
         <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>3</h1>
             </div>
           <div class="card__grid__text">
             <h3>View an asset</h3>
             <p>Know what you will receive before purchase<br/>Automated metadata, clear terms and prices</p>
           </div>
         </div>
        </div>
         <div class="card__grid">
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>4</h1>
             </div>
           <div class="card__grid__text">
             <h3>Purchase asset</h3>
             <p>Just add to basket and pay<br/>Automatic contract generation</p>
           </div>
         </div>
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>5</h1>
             </div>
           <div class="card__grid__text">
             <h3>Receive asset</h3>
             <p>We process the payment and either deliver the asset immediately, or instruct the supplier to deliver to you</p>
           </div>
         </div>
           <div class="card__grid__item">
           <div class="card__grid__number">
             <h1>6</h1>
             </div>
           <div class="card__grid__text">
             <h3>Trust purchases</h3>
             <p>If the asset has not been delivered by the supplier we will return you the payment,  no questions asked</p>
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

@Component
export default class VendorBenefits extends Vue {
  mounted():void {
    this.initAOS();
    this.headerStatic();
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }

  headerStatic = (): void => {
    console.log(this.$root);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page-benefits-vendors.scss";
</style>
