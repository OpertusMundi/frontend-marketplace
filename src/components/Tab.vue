<template>
  <transition name="fade" mode="out-in">
    <div class="tab" v-if="isActive">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
  @Prop(String) readonly title: string | undefined;

  isActive: boolean;

  constructor() {
    super();

    this.isActive = true;
  }
}
</script>
