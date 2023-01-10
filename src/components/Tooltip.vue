<template>
  <div class="tooltip-sm" ref="tooltipSm">
    <div class="tooltip-sm__icon" @mouseover="isOpen = true" @mouseleave="isOpen = false">i</div>
    <transition name="fade" mode="out-in">
      <div class="tooltip-sm__text-container" :style="{maxWidth: `${maxWidth}px`}" v-if="isOpen">
        <p>{{ text }}</p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Tooltip extends Vue {
  @Prop() readonly text!: string;

  isOpen = false;

  get maxWidth(): number {
    return document.documentElement.clientWidth - (this.$refs.tooltipSm as HTMLElement).getBoundingClientRect().left - 20;
  }
}
</script>
<style lang="scss" scoped>
.tooltip-sm {
  display: inline-flex;
  position: relative;

  &__icon {
    border: solid 1px $secondColor;
    border-radius: 50%;
    height: em(20);
    width: em(20);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: em(20);
  }

  &__text-container {
    position: absolute;
    pointer-events: none;
    background: #fff;
    border-radius: 5px;
    border: solid 1px $lightBgColor;
    padding: 15px;
    z-index: 9999;
    width: max-content;
    text-overflow: initial;
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
