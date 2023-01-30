<template>
  <a :href="url" target="_blank" class="map_card">
    <div class="map_card__view"><span>OPEN</span></div>
    <div class="map_card__inner">
      <div class="map_card__img">
        <img :src="image.startsWith('http') ? image : require(`@/assets/images/maps/${image}`)" alt="" />
      </div>
      <div class="map_card__inner__title">{{ title }}</div>
    </div>
  </a>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MapCard extends Vue {
  @Prop({ required: true }) readonly image!: string;

  @Prop({ required: true }) readonly title!: string;

  @Prop({ required: true }) readonly url!: string;
}
</script>
<style lang="scss">
@import '@/assets/styles/_mapcard.scss';
</style>
