<template>
  <router-link
    :to="`/documentation/${item.post_name}`"
    class="documentation-items__item"
  >
    <div class="documentation-items__item__inner">
      <div class="documentation-items__item__counter">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="documentation-items__item__title">
        {{ item.post_title }}
      </div>
      <div class="documentation-items__item__text" v-if="item.post_excerpt">
        {{ item.post_excerpt }}
      </div>
    </div>
    <div class="documentation-items__item__view"><span>VIEW DOCUMENTATION</span></div>
  </router-link>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component
export default class DocumentationCard extends Vue {
    @Prop({ required: true }) readonly item!: any;

    @Prop({ required: true }) readonly index!: number;
}
</script>
<style lang="scss">
@import "@/assets/styles/_documentation-items.scss";
</style>
