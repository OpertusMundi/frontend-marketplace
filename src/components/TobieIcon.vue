<template>
  <div class="tobie_icon">
    T
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TobieIcon extends Vue {
}
</script>
<style lang="scss" scoped>
  .tobie_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $secondColor;
    color: #fff;
    position: fixed;
    right: 15px;
    bottom: 15px;
  }
</style>
