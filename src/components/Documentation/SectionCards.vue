<template>
  <div class="documentation-items">
    <div class="s_container">
      <div class="documentation-items__title">{{ title }}</div>
      <div class="documentation-items__subtitle">{{ subtitle }}</div>
      <div class="documentation-items__holder">
        <router-link :to="`/documentation/${item.post_name}`"  class="documentation-items__item"  v-for="(item,index) in items"  v-bind:key="`${index}_tab_content`">
          <div class="documentation-items__item__inner">
            <div class="documentation-items__item__counter"><span>{{index+1}}</span></div>
            <div class="documentation-items__item__title" v-if="item.acf.hero_title">
              {{item.acf.hero_title}}
            </div>
            <div class="documentation-items__item__text" v-if="item.acf.overview_text">
                  {{item.acf.overview_text}}
            </div>
          </div>
          <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component
export default class DocumentationSection extends Vue {
    @Prop({ required: true }) readonly title!: string;

    @Prop({ required: true }) readonly subtitle!: string;

    @Prop({ required: true }) readonly items!: string;
}
</script>
<style lang="scss">
@import "@/assets/styles/_documentation-items.scss";
</style>
