<template>
  <router-link :to="`@`" class="map_card">
    <div class="map_card__view"><span>OPEN</span></div>
    <div class="map_card__inner">
      <div class="map_card__img">
        <img :src="require(`@/assets/images/maps/${image}`)" alt="" />
      </div>
      <div class="map_card__inner__title">{{ title }}</div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MapCard extends Vue {
  @Prop({ required: true }) readonly image!: string;

  @Prop({ required: true }) readonly title!: string;
}
</script>
<style lang="scss">
@import '@/assets/styles/_mapcard.scss';
</style>
