<template>
   <validation-observer ref="refObserver">
      <div class="dashboard__form__step">
         <validation-provider v-slot="{ errors }" name="Title" rules="required">
          <div class="form-group">
            <label for="contracttitle">Reference name</label>
            <input type="text" class="form-group__text" name="contract_title" id="contracttitle" v-model="contractTitle">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
         </validation-provider>
         <validation-provider v-slot="{ errors }" name="Description" rules="">
          <div class="form-group">
            <label for="contractsubtitle">Short description</label>
            <textarea name="contract_description" class="form-group__text" id="contractsubtitle" cols="20" rows="5" v-model="contractDescription"></textarea>
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
         </validation-provider>
      </div>
   </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class ContractDetails extends Vue {
   @Prop({ required: true }) private templateContract!: any | null;

  contractTitle: string;

  contractDescription: string;

  templateContractC: any;

  constructor() {
    super();

    this.contractTitle = '';
    this.contractDescription = '';
    this.templateContractC = {};
  }


  @Watch('templateContract')
  templateContractChange(): void {
    this.templateContractC = this.templateContract;
    this.contractTitle = this.templateContract.title;
    this.contractDescription = this.templateContract.subtitle;
  }

  @Watch('contractTitle')
  contractTitleChange(): void {
    this.templateContractC.title = this.contractTitle;
    this.templateContractC.subtitle = this.contractDescription;
    this.$emit('update:templateContract', this.templateContractC);
  }

  @Watch('contractDescription')
  contractDescriptionChange(): void {
    this.templateContractC.title = this.contractTitle;
    this.templateContractC.subtitle = this.contractDescription;
    this.$emit('update:templateContract', this.templateContractC);
  }
}
</script>
