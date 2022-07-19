<template>
  <div class="wrapper">
    <div class="homepage" :style="{ transform: `translateY(${$store.getters.getAnnouncementBarHeight}px)` }">
      <section class="homepage__hero">
        <shape></shape>
        <div class="homepage__hero__content">
          <h1 class="homepage__hero__content__title">Explore. Trade. Use. <span>Geodata.</span></h1>
          <h2>The new geodata marketplace for Europe</h2>
          <search></search>
          <!--  -->
          <div class="homepage__hero__content__text">
            <!-- <div class="homepage__hero__content__filter_shortcuts">
              <div>
                <p>Show Only</p>
                <div class="btn--filter-shortcut" @click="onSelectFilterShortcut('OPEN')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25.074" height="25.074"><path data-name="Path 14262" d="M12.514-.004a12.234 12.234 0 0 1 8.958 3.676 12.059 12.059 0 0 1 2.686 4.041 13.211 13.211 0 0 1 .011 9.649 11.5 11.5 0 0 1-2.676 3.974 12.888 12.888 0 0 1-4.164 2.776 12.478 12.478 0 0 1-4.813.963 12.188 12.188 0 0 1-4.757-.952 12.9 12.9 0 0 1-6.817-6.816 12.518 12.518 0 0 1 .011-9.548 12.568 12.568 0 0 1 2.763-4.11 11.849 11.849 0 0 1 8.798-3.653Zm.045 2.261a9.712 9.712 0 0 0-7.231 3 10.778 10.778 0 0 0-2.272 3.37 9.941 9.941 0 0 0 0 7.79 10.615 10.615 0 0 0 5.608 5.579 10.172 10.172 0 0 0 7.8-.011 10.826 10.826 0 0 0 3.414-2.261 9.632 9.632 0 0 0 2.933-7.186 10.293 10.293 0 0 0-.761-3.94 10.031 10.031 0 0 0-2.216-3.314 9.919 9.919 0 0 0-7.275-3.023Zm-.157 8.193-1.679.873a1.723 1.723 0 0 0-.661-.784 1.487 1.487 0 0 0-.727-.224q-1.679 0-1.679 2.216a2.748 2.748 0 0 0 .425 1.612 1.434 1.434 0 0 0 1.254.605 1.57 1.57 0 0 0 1.545-1.075l1.545.783a3.69 3.69 0 0 1-3.291 1.97 3.661 3.661 0 0 1-2.708-1.03 3.872 3.872 0 0 1-1.03-2.865 3.866 3.866 0 0 1 1.04-2.835 3.546 3.546 0 0 1 2.63-1.052 3.514 3.514 0 0 1 3.336 1.811Zm7.231 0-1.656.873a1.723 1.723 0 0 0-.661-.784 1.521 1.521 0 0 0-.75-.224q-1.679 0-1.679 2.216a2.745 2.745 0 0 0 .425 1.612 1.433 1.433 0 0 0 1.253.605 1.57 1.57 0 0 0 1.545-1.075l1.567.783a3.849 3.849 0 0 1-1.388 1.444 3.937 3.937 0 0 1-4.623-.5 3.9 3.9 0 0 1-1.019-2.865 3.866 3.866 0 0 1 1.043-2.839 3.546 3.546 0 0 1 2.63-1.052 3.466 3.466 0 0 1 3.313 1.811Z" fill="#333" /></svg>
                  Open
                </div>
                <div class="btn--filter-shortcut" @click="onSelectFilterShortcut('VECTOR')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25.01" height="25"><path data-name="Path 14263" d="M23.458 4.167h1.552V.003h-4.167V4.17h1.044c-.529 2.521-2.187 6.5-7.3 7.367V10.42H10.42v1.224h-6.4a2.082 2.082 0 1 0 0 1.563h2.478a11.143 11.143 0 0 0-4.942 7.63H.002v4.166h4.167v-4.17H3.117c.52-2.52 2.166-6.5 7.3-7.367v1.117h4.167v-1.38h6.287a2.08 2.08 0 1 0 .07-1.562H18.77a11.258 11.258 0 0 0 4.688-7.474Z" fill="#333" /></svg>
                  Vector
                </div>
                <div class="btn--filter-shortcut" @click="onSelectFilterShortcut('RASTER')">
                  <svg data-name="Group 3633" xmlns="http://www.w3.org/2000/svg" width="25.01" height="25">
                    <path data-name="Rectangle 4822" fill="#333" d="M0 0h4.167v4.167H0z" />
                    <path data-name="Rectangle 4823" fill="#333" d="M20.844 20.833h4.167V25h-4.167z" />
                    <path data-name="Rectangle 4824" fill="#333" d="M4.169 20.833h4.167V25H4.169z" />
                    <path data-name="Rectangle 4825" fill="#333" d="M8.337 0h4.167v4.167H8.337z" />
                    <path data-name="Rectangle 4826" fill="#333" d="M12.506 20.833h4.167V25h-4.167z" />
                    <path data-name="Rectangle 4827" fill="#333" d="M20.844 12.5h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4828" fill="#333" d="M4.169 12.5h4.167v4.167H4.169z" />
                    <path data-name="Rectangle 4829" fill="#333" d="M12.506 12.5h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4830" fill="#333" d="M20.844 4.167h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4831" fill="#333" d="M4.169 4.167h4.167v4.167H4.169z" />
                    <path data-name="Rectangle 4832" fill="#333" d="M12.506 4.167h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4833" fill="#333" d="M16.675 0h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4834" fill="#333" d="M0 16.667h4.167v4.167H0z" />
                    <path data-name="Rectangle 4835" fill="#333" d="M8.337 16.667h4.167v4.167H8.337z" />
                    <path data-name="Rectangle 4836" fill="#333" d="M16.675 16.667h4.167v4.167h-4.167z" />
                    <path data-name="Rectangle 4837" fill="#333" d="M0 8.333h4.167V12.5H0z" />
                    <path data-name="Rectangle 4838" fill="#333" d="M8.337 8.333h4.167V12.5H8.337z" />
                    <path data-name="Rectangle 4839" fill="#333" d="M16.675 8.333h4.167V12.5h-4.167z" />
                  </svg>
                  Raster
                </div>
                <div class="btn--filter-shortcut" @click="onSelectFilterShortcut('SERVICE')">
                  <svg data-name="Group 3640" xmlns="http://www.w3.org/2000/svg" width="25.003" height="25">
                    <path data-name="Path 9744" d="M16.177 13.123a2.988 2.988 0 1 0 2.988 2.988 2.992 2.992 0 0 0-2.988-2.988Zm0 4.415a1.426 1.426 0 1 1 1.426-1.427 1.428 1.428 0 0 1-1.426 1.427Z" fill="#333" />
                    <path data-name="Path 9745" d="m22.739 12.497 1.163-1.163-3.015-3.015-1.214 1.214-1.431-.58v-1.73h-4.264v1.765l-1.391.589-1.258-1.259-3.015 3.015 1.243 1.244a13.574 13.574 0 0 0-.595 1.4H7.219v4.259l1.745.014a13.766 13.766 0 0 0 .593 1.4l-1.243 1.242 3.015 3.015 1.257-1.256 1.392.587v1.765h4.264v-1.686a14.621 14.621 0 0 0 1.478-.578l1.167 1.167 3.015-3.015-1.161-1.161a13.878 13.878 0 0 0 .641-1.484h1.616v-4.264h-1.617a13.5 13.5 0 0 0-.642-1.485Zm.7 4.184h-1.28l-.127.626a11.152 11.152 0 0 1-.93 2.2l-.276.511.87.872-.8.806-.923-.923-.53.347a11.707 11.707 0 0 1-2.2.877l-.557.167v1.276h-1.139v-1.238l-3.314-1.4-.9.9-.806-.806.946-.946-.27-.509a11.073 11.073 0 0 1-.881-2.115l-.127-.621-1.41-.01V15.55h1.407l.127-.626a11.14 11.14 0 0 1 .883-2.128l.27-.509-.945-.946.806-.806.9.9 3.313-1.4v-1.25h1.139v1.22l3.365 1.365.843-.843.8.806-.872.874.277.514a11.052 11.052 0 0 1 .93 2.193l.127.627h1.281Z" fill="#333" />
                    <path data-name="Path 9746" d="M0 0v25h7.231v-1.563H1.562V1.562H23.44v6.041h1.562v-7.6Z" fill="#333" />
                  </svg>
                  APIs
                </div>
              </div>
              <router-link :to="'/catalogue'"><p>ADVANCED SEARCH &#8600;</p></router-link>
            </div> -->
          </div>
          <!--  -->
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" style="enable-background:new 0 0 95 95" xml:space="preserve">
                    <circle class="st0" cx="47.5" cy="47.5" r="25" fill="#190AFF" />
                    <path class="st0" d="M47.5 95c-6.9 0-13.9-1.5-20.3-4.6C15.7 85 7 75.4 2.8 63.5-6 38.8 6.9 11.6 31.5 2.8 36.7.9 42 0 47.5 0c2.4 0 4.8.2 7.1.5 1.4.2 2.3 1.5 2.1 2.9-.2 1.4-1.5 2.3-2.8 2.1-2.1-.3-4.3-.5-6.4-.5-4.9 0-9.7.8-14.3 2.5C11.1 15.4-.4 39.7 7.5 61.8 11.3 72.5 19 81.1 29.3 85.9c10.3 4.9 21.8 5.4 32.5 1.6 22.1-7.9 33.6-32.2 25.7-54.3-.5-1.3.2-2.7 1.5-3.2s2.7.2 3.2 1.5c8.8 24.7-4.1 51.9-28.8 60.7-5.1 1.9-10.5 2.8-15.9 2.8z" fill="#190AFF" />
                    <path class="st0" d="M76 27.5c-7.4 0-13.5-6.1-13.5-13.5S68.6.5 76 .5 89.5 6.6 89.5 14 83.4 27.5 76 27.5zm0-22c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5z" fill="#190AFF" />
                  </svg>
                </div>
              </transition>
              <img :src="pagedata.video_thumbnail.url" class="homepage__video__thumbnail" />
              <div class="homepage__video__wrapper" v-if="isVideoClicked" :class="{ 'homepage__video__wrapper--hidden': !isVideoStarted }">
                <youtube :fitParent="true" :video-id="'7LqfkkDDWyg'" :player-vars="{ autoplay: 1 }" @playing="onVideoStarted" ref="refYoutube"></youtube>
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
import { EnumAssetType } from '@/model/enum';

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

  onSelectFilterShortcut(filter: EnumAssetType | string): void {
    this.$router.push({ name: 'Catalogue', params: { filterShortcut: filter } });
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
@import '@/assets/styles/_btns.scss';
</style>
