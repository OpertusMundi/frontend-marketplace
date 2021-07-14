<template>
  <transition name="fade">
    <div class="loader">
      <h1>LOADING</h1>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {

}
</script>

<style lang="scss">
@import "@/assets/styles/_loader.scss";
</style>
