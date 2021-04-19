<template>
  <div class="select-area-modal__wrapper">
    <div class="select-area-modal">
      <div class="select-area-modal__header">
        <h3>Select areas</h3>
        <div @click="onCloseModal" class="select-area-modal__btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
            <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
              <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
              <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
            </g>
          </svg>
        </div>
      </div>
      <div class="select-area-modal__body">
        <div class="select-area-modal__col-areas">areas</div>
        <div class="select-area-modal__col-map">map</div>
        <div class="select-area-modal__col-submit">submit</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SelectAreas extends Vue {
  onCloseModal(): void {
    this.$emit('close');
  }
}
</script>
<style lang="scss">
  .select-area-modal {
    height: 100%;
    width: 100%;
    background: #fff;
    border: solid 2px $secondColor;
    border-radius: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;

    &__wrapper {
      position: fixed;
      height: 100vh;
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      padding: 20px;
    }

    &__btn-close {
      cursor: pointer;
    }

    &__header {
      width: 100%;
      display: flex;

      h3 {
        flex-grow: 1;
      }
    }

    &__body {
      height: 100%;
      display: flex;
      background: purple;
      flex-grow: 1;
    }

    &__body > div {
      height: 100%;
    }

    &__col-areas {
      background: yellow;
    }

    &__col-map {
      flex-grow: 1;
    }

    &__col-submit {
      background: burlywood;
    }
  }
</style>
