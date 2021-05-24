<template>
  <div class="notebooks-item">
  <!-- <div class="notebooks-item notebooks-item--inactive"> -->
    <div class="notebooks-item__view"><span>OPEN</span></div>
    <div class="notebooks-item__inner">
      <div class="notebooks-item__top">
        <div class="notebooks-item__top__left">
          <div class="notebooks-item__title">Data Science</div>
          <ul class="notebooks-item__specs">
            <li>2GB RAM</li>
            <li>2VC</li>
          </ul>
        </div>
        <div class="notebooks-item__top__right">
          <div class="notebooks-item__action">Start</div>
        </div>
      </div>
      <div class="notebooks-item__bottom">
        <p>Provides interactive visualisation and python-based analysis of geospatial data.</p>
        <span>Available in Medium Tier package</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotebookCard extends Vue {
}
</script>
<style lang="scss">
@import "@/assets/styles/_notebooks.scss";
</style>
