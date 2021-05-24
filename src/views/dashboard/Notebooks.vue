<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>topio Notebooks</h1>
        <h2>Available servers for your subscription</h2>
      </div>
    </div>
    <div class="notebooks pt-xs-50">
      <div class="notebooks__inner">
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
      </div>
      <hr>
      <div class="notebooks__sectiontitle">More servers</div>
      <div class="notebooks__inner">
        <notebook-card></notebook-card>
        <notebook-card></notebook-card>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NotebookCard from '@/components/NotebookCard.vue';

@Component({
  components: { NotebookCard },
})
export default class Notebooks extends Vue {
}
</script>
<style lang="scss">
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
