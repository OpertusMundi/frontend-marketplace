<template>
  <div class="loader">
    <div :style="{transform: `rotate(${getRandomInitialRotationDegrees()}deg)`}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" style="enable-background:new 0 0 95 95" xml:space="preserve"><circle class="st0" cx="47.5" cy="47.5" r="25" fill="#190AFF"/><path class="st0" d="M47.5 95c-6.9 0-13.9-1.5-20.3-4.6C15.7 85 7 75.4 2.8 63.5-6 38.8 6.9 11.6 31.5 2.8 36.7.9 42 0 47.5 0c2.4 0 4.8.2 7.1.5 1.4.2 2.3 1.5 2.1 2.9-.2 1.4-1.5 2.3-2.8 2.1-2.1-.3-4.3-.5-6.4-.5-4.9 0-9.7.8-14.3 2.5C11.1 15.4-.4 39.7 7.5 61.8 11.3 72.5 19 81.1 29.3 85.9c10.3 4.9 21.8 5.4 32.5 1.6 22.1-7.9 33.6-32.2 25.7-54.3-.5-1.3.2-2.7 1.5-3.2s2.7.2 3.2 1.5c8.8 24.7-4.1 51.9-28.8 60.7-5.1 1.9-10.5 2.8-15.9 2.8z" fill="#190AFF"/><path class="st0" d="M76 27.5c-7.4 0-13.5-6.1-13.5-13.5S68.6.5 76 .5 89.5 6.6 89.5 14 83.4 27.5 76 27.5zm0-22c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5z" fill="#190AFF"/></svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
  getRandomInitialRotationDegrees(): number {
    return Math.floor(Math.random() * 360);
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/_loader.scss";
</style>
