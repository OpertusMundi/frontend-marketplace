<template>
  <div class="stepper" v-if="currentStep">
    <div class="stepper__labels">
      <div class="stepper__labels__label"><span>Purchase requested</span></div>
      <div class="stepper__labels__label"><span>PayIn created</span></div>
      <div class="stepper__labels__label"><span>Payment has been received<br>delivery/subscription is pending</span></div>
      <div class="stepper__labels__label"><span>Order complete</span></div>
    </div>
    <div class="stepper__items">
      <div v-for="i in 4" :key="i" class="stepper__items__item" :class="{'stepper__items__item--completed': currentStep > i, 'stepper__items__item--active': currentStep === i}">
        <div class="stepper__items__item__counter"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class StepProgressBar extends Vue {
  @Prop({ required: true }) readonly currentStep!: number;
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_order-purchase-preview.scss";
</style>
