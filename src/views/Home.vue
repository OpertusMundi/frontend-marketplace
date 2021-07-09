<template>
  <div class="wrapper">
    <div class="homepage" v-if="pagedata">
      <section class="homepage__hero">
        <shape></shape>
        <div class="homepage__hero__content">
          <h1 class="homepage__hero__content__title">Explore. Trade. Use. <span>Geodata.</span></h1>
          <search></search>
          <div class="homepage__hero__content__text">
            <p>
              A top-class, trusted and secure marketplace for proprietary geospatial data all across Europe.
            </p>
          </div>
        </div>
      </section>
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
            <div class="homepage__video__overlay" :class="[isClicked ? 'hidden' : 'shownk']" @click.once="videoClicked()">
              <button class="homepage__video__button">
                <img src="@/assets/images/icons/home/video-btn.svg" />
              </button>
              <img :src="pagedata.video_thumbnail.url" class="homepage__video__thumbnail" />
            </div>
            <video class="homepage__video__player" controls ref="videoplayer">
              <source :src="pagedata.video_file.url" type="video/mp4" />
            </video>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Shape from '@/components/Shape.vue';
import Search from '@/components/Search.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import $ from '@/assets/scripts/jquery_cs';
import slider from '@/assets/scripts/slider';
import axios from 'axios';

@Component({
  components: { Shape, Search },
})
export default class Header extends Vue {
  searchResultsActive = false;

  isClicked: boolean;

  videoElem: any;

  pagedata: any;

  wpUrl: string;

  constructor() {
    super();

    this.pagedata = null;
    this.isClicked = false;
    this.videoElem = null;
    this.wpUrl = '';
  }

  created(): void {
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    this.getPageData();
    this.carouselLeftOffset();
    slider.init();
    window.addEventListener('resize', this.carouselLeftOffset);
  }

  destroyed(): void {
    window.removeEventListener('resize', this.carouselLeftOffset);
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  };

  carouselLeftOffset = (): void => {
    console.log('asdf');
    const widthCont = $('.s_container')[0];
    const offset = (window.innerWidth - widthCont.getBoundingClientRect().width) / 2;
    document.documentElement.style.setProperty('--container-s-left-space', `${offset}px`);
  };

  videoClicked(): void {
    this.isClicked = true;
    this.videoElem = this.$refs.videoplayer;
    this.videoElem.play();
  }

  async getPageData(): Promise<void> {
    axios
      .get(`${this.wpUrl}/wp-json/wp/v2/pages?slug=home`)
      .then((response) => {
        this.pagedata = response.data[0].acf;
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
