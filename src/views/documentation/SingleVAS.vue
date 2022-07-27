<template>
  <div class="page" v-if="page.length > 0">
    <section class="single-vas__hero">
      <img class="single-vas__hero__image" v-if="page[0].acf.hero_image"
           :src="page[0].acf.hero_image.sizes.large" alt=""/>
      <div class="single-vas__hero__content">
        <div class="single-vas__hero__content__left">
          <h1 class="single-vas__hero__content__title">
            <img src="@/assets/images/t-icon-white.svg" alt=""/>
            <span>{{ page[0].title.rendered }}</span>
          </h1>
        </div>
        <div class="single-vas__hero__content__right">
          <div class="single-vas__hero__content__hero-title">{{ page[0].acf.hero_title }}</div>
          <div class="single-vas__hero__content__text" v-if="page[0].excerpt.rendered"
               v-html="page[0].excerpt.rendered"></div>
          <div class="single-vars__hero__btn">
            <div v-if="page[0].acf.coming_soon" class="btn btn--std btn--coming-soon">
              COMING SOON
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="single-vas__features" v-if="page[0].acf.features.length > 0">
      <div class="s_container">
        <div class="single-vas__features__heading">Flexibility for your files</div>
        <div class="single-vas__features__holder">
          <div class="single-vas__features__item" v-for="(feature, index) in page[0].acf.features"
               v-bind:key="`${index}_feature`">
            <div class="single-vas__features__item__counter">{{ index + 1 }}</div>
            <div class="single-vas__features__item__title">{{ feature.title }}</div>
            <div class="single-vas__features__item__text">
              {{ feature.description }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <div v-if="page[0].acf.banners.length > 0">
      <section class="single-vas__banner" :class="{ 'single-vas__banner--rev': index % 2 != 0 }"
               v-for="(banner, index) in page[0].acf.banners" v-bind:key="`${index}_banner`">
        <div class="s_container">
          <div class="single-vas__banner__holder">
            <div class="single-vas__banner__text">
              <div class="single-vas__banner__text__title" v-if="banner.title">
                {{ banner.title }}
              </div>
              <div class="single-vas__banner__text__text" v-html="banner.text"
                   v-if="banner.text"></div>
            </div>
            <div class="single-vas__banner__right">
              <img v-if="banner.image" :src="banner.image.sizes.large" alt=""/>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!--LIST OF FEATURES-->
    <section class="single-vas__list-container">
      <div class="s_container">
        <div class="single-vas__list">
          <div class="single-vas__list__left">
            <img v-if="page[0].acf.list_image" :src="page[0].acf.list_image.sizes.large"
                 alt=""/>
          </div>
          <div class="single-vas__list__right">
            <div class="single-vas__list__title" v-if="page[0].acf.list_title">
              {{ page[0].acf.list_title }}
            </div>
            <div v-if="page[0].acf.list_text" class="single-vas__list__items"
                 v-html="page[0].acf.list_text"></div>
          </div>
        </div>
      </div>
    </section>
    <!--COMBINED WITH-->
    <section v-if="page[0].acf.related_vas.length" class="single-vas__services">
      <div class="s_container">
        <div class="single-vas__services__content">
          <span class="prefix">Combined with: </span>
          <router-link v-for="service in page[0].acf.related_vas" :key="service.ID"
                       :to="{name: 'single-vas', params: {slug: service.post_name }}">
            <span><img src="@/assets/images/t-icon.svg" alt=""/></span>
            {{ service.post_title }}
          </router-link>
        </div>
      </div>
    </section>

    <div v-if="page[0].acf.related_documentation.length" class="documentation-items">
      <div class="s_container">
        <div class="documentation-items__title">Related documentation</div>
        <div class="documentation-items__holder">
          <router-link :to="{name: 'single-documentation', params: {slug: documentation.post_name}}" class="documentation-items__item"
               v-for="(documentation, index) in page[0].acf.related_documentation"
               :key="documentation.ID">
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter"><span>{{ index + 1 }}</span></div>
              <div class="documentation-items__item__title">
                {{ documentation.post_title }}
              </div>
              <div class="documentation-items__item__text" v-html="documentation.post_excerpt" />
            </div>
            <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="single-vas__tiers" v-if="page[0].acf.tiers.length > 0">
      <div class="s_container">
        <div class="single-vas__title single-vas__title--center">Pricing</div>
        <div class="single-vas__tiers__holder">
          <div class="single-vas__tiers__item" v-for="(tier, index) in page[0].acf.tiers"
               v-bind:key="`${index}_tier`">
            <div class="single-vas__tiers__item__type" v-if="tier.tier_type">
              {{ tier.tier_type }}
            </div>
            <div class="single-vas__tiers__item__text" v-if="tier.description">
              {{ tier.description }}
            </div>
            <div class="single-vas__tiers__item__price">{{ tier.price }}</div>
            <div class="single-vas__tiers__item__price-description">{{ tier.price_description }}</div>
            <div class="single-vas__tiers__item__description" v-if="tier.specs"
                 v-html="tier.specs"></div>
            <a v-if="tier.link" :target="tier.link.target" :href="tier.link.url" class="services-tier__item__btn btn btn--std btn--trans">
              {{ tier.link.title }}
            </a>
          </div>
        </div>
      </div>
    </div>
<!--    RELATED VAS OLD-->
<!--    <div class="services-carts" v-if="page[0].acf.related_vas">-->
<!--      <div class="s_container">-->
<!--        <div class="single-vas__title">Other VaS</div>-->
<!--        <div class="services-carts__holder">-->
<!--          <router-link :to="`/vas/${related.post_name}`" class="services-carts__item"-->
<!--                       v-for="(related, index) in page[0].acf.related_vas"-->
<!--                       v-bind:key="`${index}_related`">-->
<!--            <div class="services-carts__item__view"><span>VIEW SERVICE</span></div>-->
<!--            <div class="services-carts__item__inner">-->
<!--              <div class="services-carts__item__top">-->
<!--                <img src="@/assets/images/t-icon.svg" alt=""/>-->
<!--                <span v-if="related.post_title">{{ related.post_title }}</span>-->
<!--              </div>-->
<!--              <div class="services-carts__item__main">-->
<!--                <div class="services-carts__item__main__text" v-if="related.post_excerpt">-->
<!--                  {{ related.post_excerpt }}-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </router-link>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class VAS extends Vue {
  page: any;

  wpUrl: string;

  services: any;

  constructor() {
    super();
    this.page = [];
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
    this.services = [];
  }

  @Watch('$route.params.slug')
  onRouteChange(oldRoute: string, newRoute: string): void {
    if (oldRoute !== newRoute) {
      this.getData();
    }
  }

  mounted(): void {
    this.getData();
  }

  async getData(): Promise<any> {
    await this.getPageResponse();
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }

  async getPageResponse(): Promise<any> {
    await axios
      .get(`${this.wpUrl}/wp-json/wp/v2/vas?slug=${this.$route.params.slug}`)
      .then((response) => {
        this.page = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_page.scss';
@import '@/assets/styles/_single-vas.scss';
@import '@/assets/styles/_services-carts.scss';
@import '@/assets/styles/_documentation-items.scss';
</style>
