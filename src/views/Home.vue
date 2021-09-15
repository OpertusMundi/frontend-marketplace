<template>
  <div class="wrapper">
    <div class="homepage">
      <section class="homepage__hero">
        <shape></shape>
        <div class="homepage__hero__content">
          <h1 class="homepage__hero__content__title">Explore. Trade. Use. <span>Geodata.</span></h1>
          <h2>The new geodata marketplace for Europe</h2>
          <search></search>
          <!-- <div class="homepage__hero__content__text">
            <p>
              A top-class, trusted and secure marketplace for proprietary geospatial data all across Europe.
            </p>
          </div> -->
        </div>
      </section>
      <div v-if="pagedata">
        <section class="homepage__big_blocks">
          <h4 class="homepage__big_blocks__title" data-aos="fade-up">
            {{ pagedata.section_one_heading }}
          </h4>
          <div class="m_container">
            <div class="homepage__big_blocks__inner">
              <template v-for="(item, index) in pagedata.section_one">
                <div :key="item.id" class="homepage__big_blocks__item" data-aos="fade-up" :data-aos-delay="index * 250">
                  <img v-if="item.image.url" :src="item.image.url" alt="" class="homepage__big_blocks__item__icon" />
                  <div class="homepage__big_blocks__item__content" v-html="item.content"></div>
                </div>
              </template>
            </div>
          </div>
        </section>
        <section class="homepage__big_blocks">
          <h4 class="homepage__big_blocks__title" data-aos="fade-up">
            {{ pagedata.section_two_heading }}
          </h4>
          <div class="m_container">
            <div class="homepage__big_blocks__inner">
              <template v-for="(item, index) in pagedata.section_two">
                <div :key="item.id" class="homepage__big_blocks__item" data-aos="fade-up" :data-aos-delay="index * 250">
                  <img v-if="item.image.url" :src="item.image.url" alt="" class="homepage__big_blocks__item__icon" />
                  <div class="homepage__big_blocks__item__content" v-html="item.content"></div>
                </div>
              </template>
            </div>
          </div>
        </section>
        <section class="homepage__assets" data-aos="fade-in" data-aos-delay="500">
          <h4 class="homepage__assets__title">Popular Assets</h4>
          <div class="a_carousel draggable">
            <a href="" class="a_carousel__item a_carousel__item--green">
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/vector_icon.svg" alt="" />
                  <span>Vector</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">Lakes of Greece</h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/download-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price a_carousel__item__footer__price--open">
                    <img src="@/assets/images/icons/cc_icons/cc-by-nc-Attribution-NonCommercial.svg" alt="" />
                    <span>OPEN</span>
                  </div>
                </div>
              </div>
            </a>
            <a href="" class="a_carousel__item a_carousel__item--purple">
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/raster_icon.svg" alt="" />
                  <span>Raster</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">
                    The Historical Centre of the Municipality of Athens
                  </h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/bag-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price">300€</div>
                </div>
              </div>
            </a>
            <a href="" class="a_carousel__item a_carousel__item--blue">
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/api_icon.svg" alt="" />
                  <span>API</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">Swimming Shore Water</h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/check-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price">300€</div>
                </div>
              </div>
            </a>
            <a href="" class="a_carousel__item a_carousel__item--green">
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/tiles_icon.svg" alt="" />
                  <span>Tiles</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">Spatial and residential</h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/download-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price">300€</div>
                </div>
              </div>
            </a>
            <a href="" class="a_carousel__item a_carousel__item--green">
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/vector_icon.svg" alt="" />
                  <span>Vector</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">Lakes of Greece</h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/download-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price">300€</div>
                </div>
              </div>
            </a>
            <a href="" class="a_carousel__item a_carousel__item--green">
              <div class="a_carousel__item__bundle">BUNDLE</div>
              <div class="a_carousel__item__view"><span>VIEW ASSET</span></div>
              <div class="a_carousel__item__inner">
                <div class="a_carousel__item__top">
                  <img src="@/assets/images/icons/vector_icon.svg" alt="" />
                  <span>Vector</span>
                </div>
                <div class="a_carousel__item__main">
                  <h4 class="a_carousel__item__main__title">Lakes of Greece</h4>
                  <div class="a_carousel__item__main__rating">★★★★★<span>4.8/5</span></div>
                  <div class="a_carousel__item__main__vendor">@Ministry of Environment</div>
                </div>
                <div class="a_carousel__item__footer">
                  <div class="a_carousel__item__footer__stats"><img src="@/assets/images/icons/download-icon.svg" alt="" /><span>1546</span></div>
                  <div class="a_carousel__item__footer__price">300€</div>
                </div>
              </div>
            </a>
          </div>
          <div class="homepage__assets__btn">
            <router-link to="/catalogue" class="btn btn--std btn--blue">ALL ASSETS</router-link>
          </div>
        </section>
        <section class="homepage__video">
          <div class="m_container">
            <div class="homepage__video__placeholder" data-aos="fade-up" data-aos-delay="400">
              <button class="homepage__video__button" @click.once="videoClicked" v-if="!isVideoClicked">
                <img src="@/assets/images/icons/home/video-btn.svg" />
              </button>
              <transition name="fade" mode="out-in">
                <div class="homepage__video__loader" v-if="isVideoClicked && !isVideoStarted">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" style="enable-background:new 0 0 95 95" xml:space="preserve"><circle class="st0" cx="47.5" cy="47.5" r="25" fill="#190AFF"/><path class="st0" d="M47.5 95c-6.9 0-13.9-1.5-20.3-4.6C15.7 85 7 75.4 2.8 63.5-6 38.8 6.9 11.6 31.5 2.8 36.7.9 42 0 47.5 0c2.4 0 4.8.2 7.1.5 1.4.2 2.3 1.5 2.1 2.9-.2 1.4-1.5 2.3-2.8 2.1-2.1-.3-4.3-.5-6.4-.5-4.9 0-9.7.8-14.3 2.5C11.1 15.4-.4 39.7 7.5 61.8 11.3 72.5 19 81.1 29.3 85.9c10.3 4.9 21.8 5.4 32.5 1.6 22.1-7.9 33.6-32.2 25.7-54.3-.5-1.3.2-2.7 1.5-3.2s2.7.2 3.2 1.5c8.8 24.7-4.1 51.9-28.8 60.7-5.1 1.9-10.5 2.8-15.9 2.8z" fill="#190AFF"/><path class="st0" d="M76 27.5c-7.4 0-13.5-6.1-13.5-13.5S68.6.5 76 .5 89.5 6.6 89.5 14 83.4 27.5 76 27.5zm0-22c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5z" fill="#190AFF"/></svg>
                </div>
              </transition>
              <img :src="pagedata.video_thumbnail.url" class="homepage__video__thumbnail" />
              <div class="homepage__video__wrapper" v-if="isVideoClicked" :class="{'homepage__video__wrapper--hidden': !isVideoStarted}">
                <youtube :fitParent="true" :video-id="'9xwazD5SyVg'" :player-vars="{autoplay: 1}" @playing="onVideoStarted" ref="refYoutube"></youtube>
              </div>
            </div>
          </div>
        </section>
        <section class="homepage__small_blocks">
          <h4 class="homepage__small_blocks__title" data-aos="fade-in">
            {{ pagedata.section_footer_heading }}
          </h4>
          <div class="m_container">
            <div class="homepage__small_blocks__inner">
              <template v-for="(item, index) in pagedata.section_footer">
                <div :key="item.id" class="homepage__small_blocks__item" data-aos="fade-up" :data-aos-delay="index * 100 + 100">
                  <img :src="item.image.url" alt="" class="homepage__small_blocks__item__icon" />
                  <div class="homepage__small_blocks__item__text" v-html="item.content"></div>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Shape from '@/components/Shape.vue';
import Search from '@/components/Search.vue';
import AOS from 'aos';
import VueYoutube from 'vue-youtube';
import 'aos/dist/aos.css';
import $ from '@/assets/scripts/jquery_cs';
import slider from '@/assets/scripts/slider';
import axios from 'axios';
import store from '@/store';
import { Configuration } from '@/model';

Vue.use(VueYoutube);

@Component({
  components: { Shape, Search },
})
export default class Header extends Vue {
  searchResultsActive = false;

  isVideoClicked: boolean;

  isVideoStarted: boolean;

  videoElem: any;

  pagedata: any;

  wpUrl: string;

  constructor() {
    super();

    this.pagedata = null;
    this.isVideoClicked = false;
    this.isVideoStarted = false;
    this.videoElem = null;
    this.wpUrl = '';
  }

  created(): void {
    console.log('created');
    // this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  get config(): Configuration | null {
    return this.$store.getters.getConfig;
  }

  @Watch('config', { immediate: true })
  onConfigStateChange(): void {
    if (this.config) {
      this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
      this.loadPage();
    }
  }

  // mounted(): void {
  //   this.getPageData();
  //   this.carouselLeftOffset();
  //   slider.init();
  //   window.addEventListener('resize', this.carouselLeftOffset);
  //   document.documentElement.style.setProperty('overflow-y', 'scroll');
  // }

  loadPage(): void {
    this.getPageData();
    this.carouselLeftOffset();
    slider.init();
    window.addEventListener('resize', this.carouselLeftOffset);
    document.documentElement.style.setProperty('overflow-y', 'scroll');
  }

  destroyed(): void {
    document.documentElement.style.setProperty('overflow-y', 'visible');
    window.removeEventListener('resize', this.carouselLeftOffset);
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  };

  carouselLeftOffset = (): void => {
    if (!$('.s_container')[0]) {
      return;
    }

    const widthCont = $('.s_container')[0];
    const offset = (window.innerWidth - widthCont.getBoundingClientRect().width) / 2;
    document.documentElement.style.setProperty('--container-s-left-space', `${offset}px`);
  };

  videoClicked(): void {
    this.isVideoClicked = true;
    // this.videoElem = this.$refs.videoplayer;
    // this.videoElem.play();
  }

  onVideoStarted(): void {
    this.isVideoStarted = true;
  }

  async getPageData(): Promise<void> {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=home`)
      .then((response) => {
        this.pagedata = response.data[0].acf;
        store.commit('setLoading', false);
        // console.log(this.pagedata);
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
@import '@/assets/styles/_acarousel.scss';
@import '@/assets/styles/_search.scss';
@import '@/assets/styles/_homepage.scss';
</style>
