<template>
  <div class="modal__wrapper">
    <div class="modal">
      <div @click="$emit('close')" class="modal__btn-close mb-sm-40">
        <svg xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
          <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
            <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
            <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
          </g>
        </svg>
      </div>
      <h1> {{title}} </h1>
      <div v-for="input in inputs" :key="input.id" class="form-group">
        <label :for="'modal_input_' + input.id"> {{ input.name }} </label>
        <input class="form-group__text mt-sm-20" v-model="input.value" :type="input.type" :id="'modal_input_' + input.id">
      </div>
      <div class="mt-sm-20">
        <button @click="$emit('close')" class="btn--std btn--blue">cancel</button>
        <button @click="$emit('submit', getInputValues())" class="btn--std btn--blue ml-sm-20">confirm</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
})
export default class Modal extends Vue {
  @Prop() private title!: string;

  @Prop() private inputs!: {id: string, name: string, value: string, type: string}[];

  getInputValues() {
    return this.inputs.map((x) => ({ id: x.id, value: x.value, type: x.type }));
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/_forms.scss";
@import "@/assets/styles/abstracts/_spacings.scss";

.modal {
  border: solid 2px $secondColor;
  border-radius: 15px;
  padding: 30px 190px 30px 190px;
  background: #f2f2f2 !important;
  width: 980px;
  text-align: center;
  & h1 {
    font-size: 2em;
  }
  &__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
}
</style>
