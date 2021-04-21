<template>
  <div class="page terms" v-if="page.length > 0">
    <div class="faq__header">
          <div class="m_container">
    <div class="faq__dreadcrumb">
          <router-link :to="`/faq/`" class="faq__dreadcrumb__item">
            FAQ
          </router-link>
        <span> > </span>
             <router-link :to="`/faq/${$route.params.category}`" class="faq__dreadcrumb__item">
          {{ $route.params.category | slugToName }}
          </router-link>
          <span> > </span>
        <div class="faq__dreadcrumb__item">
        {{ page[0].title.rendered }}
        </div>
      </div>
    </div>
    </div>
    <div class="m_container">
      <div class="terms__inner">
        <div class="terms__sidebar">
          <h1 class="terms__sidebar__title">{{ page[0].title.rendered }}</h1>
          <div class="terms__sidebar__menu">
            <ul v-if="page[0].acf.faq.length > 0">
              <li v-for="(item_title, index) in page[0].acf.faq" v-bind:key="`${index}_title`">
                <a
                  :id="'side' + index"
                  :class="{ active: activeMenuItem == index }"
                  href="#"
                  @click.prevent="scrollToSection(index)"
                  >{{ item_title.title }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div id="terms-main" class="terms__main" v-if="page[0].acf.faq.length > 0">
          <div v-for="(item, index) in page[0].acf.faq" v-bind:key="`${index}_item`">
            <h2 class="terms__main__title" :id="'main' + index">{{ item.title }}</h2>
            <div class="terms__main__text" v-html="item.text"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';

@Component({
  filters: {
    slugToName(val) {
      return val.replace(/_/g, ' ').replace(/-/g, ' ');
    },
  },
})
export default class Faq extends Vue {
  activeMenuItem = 0;

  TitleOffsets = [];

  topPos = 0;

  page: any;

  constructor() {
    super();
    this.page = [];
  }

  mounted():void {
    this.initAOS();
    window.addEventListener('scroll', this.changeActiveSideItem);
    axios
      .get(`${process.env.VUE_APP_API_WORDPRESS_URL}/wp-json/wp/v2/faq?slug=${this.$route.params.slug}`).then((response) => {
        this.page = response.data;
      }).catch((error) => {
        console.log(error);
      });
  }

  changeActiveSideItem():void {
    const titles:any = document.getElementsByClassName('terms__main__title');
    for (let i = 0; i <= titles.length; i += 1) {
      if (titles[i]) {
        if (document.documentElement.scrollTop + 245 >= titles[i].offsetTop) {
          this.activeMenuItem = i;
        }
      }
    }
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }

  scrollToSection(section:number):void {
    this.activeMenuItem = section;
    const MainID = `main${section}`;
    const MainEl = document.getElementById(MainID);
    if (MainEl) {
      this.topPos = MainEl.offsetTop;
    }
    document.documentElement.scrollTop = this.topPos - 230;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_terms.scss";
  @import "@/assets/styles/faq/_faq.scss";
</style>
