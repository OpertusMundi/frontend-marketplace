<template>
  <div>
    <div class="footer-cta" v-if="showFooterCta">
      <div class="s_container">
        <div class="footer-cta__inner">
          <div class="footer-cta__item">
            <div class="footer-cta__item__icon"><img src="@/assets/images/icons/home/layers_icon.svg" alt="" /></div>
            <div class="footer-cta__item__content">
              <h6>Do you<br />own geodata?</h6>
              <p>Upload, promote, and trade your data assets with ease</p>
              <p>Gain new clients & increase your profits</p>
              <p>Turn your assets into services</p>
              <router-link to="/vendor-benefits">Topio for data suppliers ➔</router-link>
            </div>
          </div>
          <div class="footer-cta__item">
            <div class="footer-cta__item__icon"><img src="@/assets/images/icons/home/marker_icon.svg" alt="" /></div>
            <div class="footer-cta__item__content">
              <h6>Do you<br />work with geodata?</h6>
              <p>Discover, view, and compare geospatial assets</p>
              <p>Rich metadata and clear terms before purchase</p>
              <p>Secure payment, delivery and storage methods</p>
              <router-link to="/vendor-benefits">Topio for data users ➔</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <section class="vendorpromo">
      <div class="s_container">
        <div class="vendorpromo__carousel">
          <div class="vendorpromo__item over">
            <h6 class="vendorpromo__title">Do you own geodata?</h6>
            <div class="vendorpromo__center">
              <img src="@/assets/images/icons/market_icon.svg" alt="" />
              <img src="@/assets/images/icons/arrow_icon.svg" alt="" />
              <img src="@/assets/images/icons/db_icon.svg" alt="" />
            </div>
            <div class="vendorpromo__content">
              <p>Upload, promote, and trade your data assets with ease</p>
              <p>Gain new clients & increase your profits</p>
              <p>Turn your assets into services</p>
              <router-link to="/vendor-benefits" class="btn btn--std btn--blue">BENEFITS FOR SUPPLIERS</router-link>
            </div>
          </div>
          <div class="vendorpromo__item over">
            <h6 class="vendorpromo__title">Do you work with geodata?</h6>
            <div class="vendorpromo__center">
              <img src="@/assets/images/icons/db_icon.svg" alt="" />
              <img src="@/assets/images/icons/arrow_icon.svg" alt="" />
              <img src="@/assets/images/icons/market_icon.svg" alt="" />
            </div>
            <div class="vendorpromo__content">
              <p>View, discover, compare, and purchase geospatial data assets</p>
              <p>Top-class methods of secure payment, delivery, and storage</p>
              <p>Zero fees</p>
              <router-link to="/user-benefits" class="btn btn--std btn--blue">BENEFITS FOR USERS</router-link>
            </div>
          </div>
        </div>
        <div class="vendorpromo__inner">
          <div class="vendorpromo__item" v-bind:class="promoClasses[0]" @mouseover="promoAnimation(0)">
            <h6 class="vendorpromo__title">Do you own geodata?</h6>
            <div class="vendorpromo__content">
              <p>Upload, promote, and trade your data assets with ease</p>
              <p>Gain new clients & increase your profits</p>
              <p>Turn your assets into services</p>
              <router-link to="/vendor-benefits" class="btn btn--std btn--blue">BENEFITS FOR SUPPLIERS</router-link>
            </div>
          </div>
          <div class="vendorpromo__center" v-bind:class="promoClasses[1]">
            <img src="@/assets/images/icons/db_icon.svg" alt="" />
            <img src="@/assets/images/icons/arrow_icon.svg" alt="" />
            <img src="@/assets/images/icons/market_icon.svg" alt="" />
          </div>
          <div class="vendorpromo__item" v-bind:class="promoClasses[1]" @mouseover="promoAnimation(1)">
            <h6 class="vendorpromo__title">Do you work with geodata?</h6>
            <div class="vendorpromo__content">
              <p>View, discover, compare, and purchase geospatial data assets</p>
              <p>Top-class methods of secure payment, delivery, and storage</p>
              <p>Zero fees</p>
              <router-link to="/user-benefits" class="btn btn--std btn--blue">BENEFITS FOR USERS</router-link>
            </div>
          </div>
        </div>
      </div>
    </section> -->
    <footer class="footer">
      <div class="m_container">
        <div class="footer__upper">
          <div class="footer__upper__logo">
            <a href="/"><img src="@/assets/images/logo_footer.svg" alt=""/><img src="@/assets/images/logo_footer_mobile.svg" alt=""/></a>
          </div>
          <div class="footer__upper__item">
            <h6>Sell Geodata</h6>
            <router-link to="/vendor-benefits">topio for data supppliers</router-link>
            <a href="#">Become a supplier</a>
          </div>
          <div class="footer__upper__item">
            <h6>Buy Geodata</h6>
            <router-link to="/user-benefits">topio for data users</router-link>
            <router-link to="/catalogue">Explore assets</router-link>
          </div>
          <div class="footer__upper__item">
            <h6>Use Geodata</h6>
            <router-link to="/vas">Services</router-link>
            <!-- <router-link to="/documentation">Documentation</router-link> -->
          </div>
          <div class="footer__upper__item">
            <h6>About</h6>
            <router-link to="/about">What is Topio</router-link>
            <router-link to="/blog">Blog</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/faq">FAQ</router-link>
          </div>
          <div class="footer__upper__item">
            <h6>Disclaimers</h6>
            <router-link to="/terms">Terms of Service</router-link>
            <router-link to="/privacy">Privacy Policy</router-link>
          </div>
          <div class="footer__upper__social">
            <a href="https://www.linkedin.com/company/topio-market" target="_blank"><img src="@/assets/images/icons/linkedin_icon.svg" alt=""/></a>
            <a href="https://github.com/OpertusMundi" target="_blank"><img src="@/assets/images/icons/github_icon.svg" alt=""/></a>
          </div>
        </div>
        <div class="footer__lower">
          <img src="@/assets/images/icons/eu_icon.svg" alt="" />
          <span>© 2020 · Opertus Mundi • This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 870228</span>
        </div>
        <!-- FOR DEVELOPING -->
        <div class="footer__lower" style="margin-top: 20px; display: flex; flex-direction: column; color: orange">
          <span>commit id: {{ $store.getters.getConfig.configuration.buildInfo.commitId }}</span>
          <span>comment: {{ $store.getters.getConfig.configuration.buildInfo.commitComment }}</span>
          <span>description: {{ $store.getters.getConfig.configuration.buildInfo.commitIdDescription }}</span>
          <span>build timestamp: {{ $store.getters.getConfig.configuration.buildInfo.buildTimestamp }}</span>
        </div>
        <!--  -->
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Flickity from 'flickity';
import 'flickity/css/flickity.css';

@Component
export default class Footer extends Vue {
  promoCarousel: any;

  showFooterCta = true;

  promoClasses: Array<string> = ['over', ''];

  mounted(): void {
    this.initPromoCarousel();
    // this.showHideFooterCta();
  }

  destroyed(): void {
    if (this.promoCarousel) this.promoCarousel.destroy();
  }

  @Watch('$route', { immediate: true, deep: true })
  showHideFooterCta(): void {
    console.log(this.$route.name);
    if (this.$route.name === 'Catalogue' || this.$route.name === 'CatalogueSingle' || this.$route.name === 'single-vas' || this.$route.name === 'vas') {
      this.showFooterCta = false;
    }
  }

  initPromoCarousel = (): void => {
    const slider = document.querySelector('.vendorpromo__carousel');
    if (slider) {
      this.promoCarousel = new Flickity(slider, {
        selectedAttraction: 0.015,
        friction: 0.3,
        prevNextButtons: false,
        wrapAround: false,
      });
    }
  };

  promoAnimation(child: number): void {
    if (this.promoClasses[child] !== 'over') {
      this.promoClasses = ['', ''];
      this.promoClasses[child] = 'over';
    }
  }
}
</script>
