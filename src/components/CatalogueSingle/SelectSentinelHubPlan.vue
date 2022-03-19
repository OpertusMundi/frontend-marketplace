<template>
  <transition name="fade">
    <div class="select-sh-plan-modal__wrapper" v-if="show">
      <div class="select-sh-plan-modal">
        <div class="select-sh-plan-modal__header">
          <h1>Sentinel Hub</h1>
          <div @click="onCloseModal" class="select-sh-plan-modal__btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
              <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
                <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
                <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
              </g>
            </svg>
          </div>
        </div>
        <div class="select-sh-plan-modal__subheading">
          <p>Sentinel Hub plans let you access all open data collections and the full imagery archive.</p>
        </div>
        <div class="select-sh-plan-modal__billing_type_selection">
          <div class="form-group">
            <label class="control control-radio">
              Annual billing
              <input value="ANNUAL" type="radio" name="billing_type" />
              <div class="control_indicator"></div>
            </label>
          </div>
          <div class="form-group">
            <label class="control control-radio">
              Monthly billing
              <input value="MONTHLY" type="radio" name="billing_type" />
              <div class="control_indicator"></div>
            </label>
          </div>
        </div>
        <div class="select-sh-plan-modal__body">
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  // Prop,
} from 'vue-property-decorator';

@Component
export default class SelectSentinelHubPlan extends Vue {
  // @Prop() private assetId!: string;

  show = false;

  mounted(): void {
    this.show = true;
  }

  beforeDestroy(): void {
    this.show = false;
  }

  onCloseModal(): void {
    this.$emit('close');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_assets.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "~flexboxgrid/css/flexboxgrid.min.css";
@import "@/assets/styles/_cataloguesingle-select-sh-plan.scss";
</style>
