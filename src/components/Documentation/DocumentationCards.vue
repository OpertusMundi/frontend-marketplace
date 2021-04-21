<template>
  <div class="documentation-items">
    <div class="s_container">
      <div class="documentation-items__title">{{ title }}</div>
      <div class="documentation-items__subtitle">{{ subtitle }}</div>
      <div class="documentation-items__holder">
        <documentation-card :item=item :index=index  v-for="(item, index) in items" v-bind:key="`${index}_doc_item`"></documentation-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import DocumentationCard from '@/components/Documentation/DocumentationCard.vue';
@Component({
  components: {
    DocumentationCard,
  },
})
export default class DocumentationCards extends Vue {
    @Prop({ required: true }) readonly title!: string;

    @Prop({ required: true }) readonly subtitle!: string;

    @Prop({ required: true }) readonly items!: string;
}
</script>
<style lang="scss">
@import "@/assets/styles/_documentation-items.scss";
</style>
