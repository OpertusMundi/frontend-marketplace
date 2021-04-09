<!--
  MODAL DOCUMENTATION
  tested for text/file inputs
  -------------------
  Props:
    title: string
    modalId: string
    inputs: {
      id: string
      name: string
      value?: string (not needed for file inputs)
      type: string (e.g. 'text')
      returnType?: string (value type, only for file inputs. either 'blob' or 'base64')
    }[]

  Emmited Events:
    @close
    @submit (returns modal id & input values)
-->

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
      <div v-for="(input, i) in inputs" :key="input.id" class="form-group">
        <label :for="'modal_input_' + input.id"> {{ input.name }} </label>
        <!-- INPUT TYPE: TEXT -->
        <input v-if="input.type == 'text'" class="form-group__text mt-sm-20" v-model="input.value" :type="input.type" :id="'modal_input_' + input.id">
        <!-- INPUT TYPE: FILE -->
        <input v-if="input.type == 'file'" class="form-group__text mt-sm-20" @change="readFile(i, $event)" :type="input.type" :id="'modal_input_' + input.id">
      </div>
      <div class="mt-sm-20">
        <button @click="$emit('close')" class="btn--std btn--blue">cancel</button>
        <button @click="$emit('submit', emitValues())" class="btn--std btn--blue ml-sm-20">confirm</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface Input {
  id: string,
  name: string,
  value?: string | ArrayBuffer | null,
  type: string,
  returnType?: string,
}

@Component({
})
export default class Modal extends Vue {
  @Prop() private title!: string;

  @Prop() private modalId!: string;

  @Prop() private inputs!: Input[];

  readFile(i, e) {
    const file = e.srcElement.files[0];

    if (this.inputs[i].returnType === 'blob') {
      this.inputs[i].value = file;
    } else if (this.inputs[i].returnType === 'base64') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.inputs[i].value = reader.result;
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } else {
      console.log('unknown returnType format');
    }
  }

  emitValues() {
    const data = {
      modalId: this.modalId,
      inputValues: this.inputs.map((x) => ({ id: x.id, value: x.value, type: x.type })),
    };
    return data;
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
    position: fixed;
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
