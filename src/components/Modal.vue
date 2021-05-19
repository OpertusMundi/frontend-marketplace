<!--
  MODAL DOCUMENTATION

  INPUTS & SUBMIT BUTTON CAN BE USED EITHER

  1) PASSING PROPS

    example:

      <modal
        :show="showModal"
        @dismiss="showModal = false"
        @submit="onModalSubmit"
        :title="'Change your full name'"
        :modalId="'fullName'"
        :inputs="[{id: 'firstName', name: 'First Name', value: userData.profile.firstName, type: 'text'}, {id: 'lastName', name: 'Last Name', value: userData.profile.lastName, type: 'text'}]">
      </modal>

  2) USING SLOTS

    example:

      <modal :withSlots="true" :show="showModal" @dismiss="showModal = false" :modalId="'kycIdentityProof'">
        <template v-slot:body>
          <h1>Upload pages</h1>

          <div v-for="inp in numberOfInputs" :key="inp" class="form-group">
            <div><input type="file"></div>
            <div><input type="text" placeholder="add comments"></div>
          </div>

          <button class="btn--std btn--outlineblue" @click="addKycInput">+ add page</button>
        </template>

        <template v-slot:footer>
          <button @click="onSubmitKycPages">submit pages</button>
        </template>
      </modal>

  -------------------
  Props:
    withSlots?: boolean
    showCancelButton?: boolean
    title: string
    modalId: string
    inputs: {
      id: string
      name: string
      value?: string (not needed for file inputs)
      type: string (e.g. 'text') (only tested for text/file inputs)
      returnType?: string (value type, only for file inputs. either 'blob' or 'base64')
    }[]

  Emmited Events:
    @dismiss
    @submit (returns modal id & input values)

  FOR USE WITH SLOTS, pass prop:
    withSlots: true
  Do not pass inputs or title as props, these should be used in v-slot:body.
  @submit is not emmited, submit logic should be handled in v-slot:footer.

  The following slots are required:
    <template v-slot:body></template>
    <template v-slot:footer></template>
-->

<template>
  <transition name="fade">
    <div class="modal__wrapper" v-if="show" @click="onDismiss">
      <div class="modal" @click.stop>
        <div class="mb-xs-40">
          <svg @click="onDismiss" class="modal__btn-close" xmlns="http://www.w3.org/2000/svg" width="31.121" height="31.121" viewBox="0 0 31.121 31.121">
            <g id="Group_506" data-name="Group 506" transform="translate(-1737.939 -45.939)">
              <path id="Path_815" data-name="Path 815" d="M0,0H41.012" transform="translate(1739 47) rotate(45)" fill="none" stroke="#190aff" stroke-width="3"/>
              <path id="Path_2030" data-name="Path 2030" d="M0,0H41.012" transform="translate(1739 76) rotate(-45)" fill="none" stroke="#190aff" stroke-width="3"/>
            </g>
          </svg>
        </div>

        <!-- BODY -->
        <!-- FOR USE WITHOUT SLOTS -->
        <div v-if="!withSlots">
          <h1> {{title}} </h1>
          <div v-for="(input, i) in inputs" :key="input.id" class="form-group">
            <label :for="'modal_input_' + input.id" class="mt-xs-20"> {{ input.name }} </label>
            <!-- input type: text -->
            <input v-if="input.type == 'text'" class="form-group__text" v-model="input.value" :type="input.type" :id="'modal_input_' + input.id">
            <!-- input type: file -->
            <input v-if="input.type == 'file'" class="form-group__text" @change="readFile(i, $event)" :type="input.type" :id="'modal_input_' + input.id">
          </div>
        </div>
        <!-- FOR USE WITH SLOTS -->
        <slot v-if="withSlots" name="body"></slot>

        <!-- FOOTER -->
        <div class="mt-sm-20">
          <button v-if="showCancelButton" @click="onDismiss" class="btn--std btn--blue">cancel</button>
          <!-- FOR USE WITHOUT SLOTS -->
          <button v-if="!withSlots" @click="onSubmit" class="btn--std btn--blue ml-xs-20">confirm</button>
          <!-- FOR USE WITH SLOTS -->
          <slot v-if="withSlots" name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
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
  @Prop() private show!: boolean;

  @Prop() private title!: string;

  @Prop() private modalId!: string;

  @Prop() private inputs!: Input[];

  @Prop() private withSlots?: boolean;

  @Prop({ default: true }) private showCancelButton!: boolean;

  // eslint-disable-next-line
  readFile(i: number, e): void {
    const file = e.srcElement.files[0];

    if (this.inputs[i].returnType === 'blob') {
      this.inputs[i].value = file;
    } else if (this.inputs[i].returnType === 'base64') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.inputs[i].value = reader.result;
      };
      // eslint-disable-next-line
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } else {
      console.log('unknown returnType format');
    }
  }

  onDismiss(): void {
    this.$emit('dismiss');
  }

  onSubmit(): void {
    const data = {
      modalId: this.modalId,
      inputValues: this.inputs.map((x) => ({ id: x.id, value: x.value, type: x.type })),
    };
    this.$emit('submit', data);
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/_forms.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_modals.scss";
</style>
