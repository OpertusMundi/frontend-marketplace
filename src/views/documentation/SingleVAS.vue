<template>
  <div class="page" v-if="page.length > 0">
    <section class="single-vas__hero">
      <img class="single-vas__hero__image" v-if="page[0].acf.hero_image" :src="page[0].acf.hero_image.sizes.large" alt="" />
      <div class="single-vas__hero__content">
        <h1 class="single-vas__hero__content__title">
          <img src="@/assets/images/t-icon-white.svg" alt="" />
          <span>{{ page[0].title.rendered }}</span>
        </h1>
        <div class="single-vas__hero__content__text" v-if="page[0].excerpt.rendered" v-html="page[0].excerpt.rendered"></div>
        <div class="single-vars__hero__btn">
          <a href="" class="btn btn--std btn--white">
            Start using
          </a>
        </div>
      </div>
    </section>
    <section class="single-vas__features" v-if="page[0].acf.features.length > 0">
      <div class="s_container">
        <div class="single-vas__features__holder">
          <div class="single-vas__features__item" v-for="(feature, index) in page[0].acf.features" v-bind:key="`${index}_feature`">
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
      <section class="single-vas__banner" :class="{ 'single-vas__banner--rev': index % 2 != 0 }" v-for="(banner, index) in page[0].acf.banners" v-bind:key="`${index}_banner`">
        <div class="s_container">
          <div class="single-vas__banner__holder">
            <div class="single-vas__banner__text">
              <div class="single-vas__banner__text__title" v-if="banner.title">
                {{ banner.title }}
              </div>
              <div class="single-vas__banner__text__text" v-html="banner.text" v-if="banner.text"></div>
            </div>
            <div class="single-vas__banner__right">
              <img v-if="banner.image" :src="banner.image.sizes.large" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="single-vas__banner single-vas__banner--align-top">
      <div class="s_container">
        <div class="single-vas__banner__holder">
          <div class="single-vas__banner__text">
            <div class="single-vas__banner__text__title" v-if="page[0].acf.list_title">
              {{ page[0].acf.list_title }}
            </div>
          </div>
          <div class="single-vas__banner__right">
            <div v-html="page[0].acf.list_text" v-if="page[0].acf.list_text"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="documentation-items">
      <div class="s_container">
        <div class="documentation-items__title">Related documentation</div>
        <div class="documentation-items__holder">
          <div class="documentation-items__item">
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter"><span>1</span></div>
              <div class="documentation-items__item__title">
                Documentation #1
              </div>
              <div class="documentation-items__item__text">
                Secure cloud storage for managing, sharing, trading and using your files across Topio’s services.
              </div>
            </div>
            <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
          </div>
          <div class="documentation-items__item">
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter"><span>1</span></div>
              <div class="documentation-items__item__title">
                Documentation #1
              </div>
              <div class="documentation-items__item__text">
                Secure cloud storage for managing, sharing, trading and using your files across Topio’s services.
              </div>
            </div>

            <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
          </div>
          <div class="documentation-items__item">
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter"><span>1</span></div>
              <div class="documentation-items__item__title">
                Documentation #1
              </div>
              <div class="documentation-items__item__text">
                Secure cloud storage for managing, sharing, trading and using your files across Topio’s services.
              </div>
            </div>

            <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
          </div>
          <div class="documentation-items__item">
            <div class="documentation-items__item__inner">
              <div class="documentation-items__item__counter"><span>1</span></div>
              <div class="documentation-items__item__title">
                Documentation #1
              </div>
              <div class="documentation-items__item__text">
                Secure cloud storage for managing, sharing, trading and using your files across Topio’s services.
              </div>
            </div>

            <div class="documentation-items__item__view"><span>VIEW DOCUMENTATION</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="single-vas__tiers" v-if="page[0].acf.tiers.length > 0">
      <div class="s_container">
        <div class="single-vas__title">Tiers</div>
        <div class="single-vas__tiers__holder">
          <div class="single-vas__tiers__item" v-for="(tier, index) in page[0].acf.tiers" v-bind:key="`${index}_tier`">
            <div class="single-vas__tiers__item__type" v-if="tier.tier_type">
              {{ tier.tier_type }}
            </div>
            <div class="single-vas__tiers__item__description" v-if="tier.specs" v-html="tier.specs"></div>
            <div class="single-vas__tiers__item__text" v-if="tier.description">
              {{ tier.description }}
            </div>
            <a href="" class="services-tier__item__btn btn btn--std btn--trans">
              Select tier
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="services-carts" v-if="page[0].acf.related_vas">
      <div class="s_container">
        <div class="single-vas__title">Other VaS</div>
        <div class="services-carts__holder">
          <router-link :to="`/vas/${related.post_name}`" class="services-carts__item" v-for="(related, index) in page[0].acf.related_vas" v-bind:key="`${index}_related`">
            <div class="services-carts__item__view"><span>VIEW SERVICE</span></div>
            <div class="services-carts__item__inner">
              <div class="services-carts__item__top">
                <img src="@/assets/images/t-icon.svg" alt="" />
                <span v-if="related.post_title">{{ related.post_title }}</span>
              </div>
              <div class="services-carts__item__main">
                <div class="services-carts__item__main__text" v-if="related.post_excerpt">
                  {{ related.post_excerpt }}
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class VAS extends Vue {
  page: any;

  wpUrl: string;

  constructor() {
    super();
    this.page = [];
    this.wpUrl = this.$store.getters.getConfig.configuration.wordPress.endpoint;
  }

  mounted(): void {
    axios
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
