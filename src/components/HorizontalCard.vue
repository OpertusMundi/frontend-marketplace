<template>
  <router-link :to="link" class="horizontalcard">
    <div class="horizontalcard__view">
      <span>{{ linkText }}</span>
    </div>
    <div class="horizontalcard__inner">
      <!-- <div class="horizontalcard__top">
        <div class="horizontalcard__top__left"><img src="@/assets/images/icons/vector_icon.svg" alt=""><span>asset type</span><span>Environment, Natural resources</span></div>
        <div class="horizontalcard__top__right"><span>asset status</span></div>
      </div> -->
      <div class="horizontalcard__top">
        <!-- <div class="horizontalcard__title">{{ `Purchase #${index}` }}</div> -->
        <div class="horizontalcard__title">{{ title }}</div>
        <!-- <div class="horizontalcard__price">Order Placed</div> -->
        <div class="horizontalcard__top__right horizontalcard__top__right--blue">
          <span>{{ topRight }}</span>
        </div>
      </div>
      <div class="horizontalcard__middle">{{ subtitle }}</div>
      <div class="horizontalcard__bottom">
        <div class="horizontalcard__bottom__left">
          <!-- <div class="rating rating--dark"><span class="active">★</span><span>★</span><span>★</span><span>★</span><span>★</span><i>4.8/5</i></div>
          <div class="horizontalcard__bottom__left__info">
            <span><strong>Version: </strong>1.0.1</span><span><strong>Last updated: </strong>20 Nov. 2020 </span>
          </div> -->
          <div class="horizontalcard__bottom__left__info" v-html="infoText"></div>
        </div>
        <div class="horizontalcard__bottom__right" v-if="price">
          <div class="horizontalcard__price">{{ price }}</div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class HorizontalCard extends Vue {
  @Prop({ required: true }) readonly title!: string;

  @Prop({ required: true }) readonly subtitle!: string;

  @Prop({ required: true }) readonly link!: string;

  @Prop({ required: true }) readonly linkText!: string;

  @Prop({ required: true }) readonly topRight!: string;

  @Prop({ required: true }) readonly infoText!: string;

  @Prop({ required: false }) readonly price!: string;

  formatDate(date: string): string {
    return moment(date).format('MMM Do YY');
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_horizontalcard.scss';
</style>
