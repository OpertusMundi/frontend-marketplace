<template>
   <validation-observer ref="refObserver">
      <div class="dashboard__form__step">
         <validation-provider v-slot="{ errors }" name="ContractType" rules="required">
            <div class="form-group">
               <label for="multiselect_type">Master Contract</label>
               <multiselect id="multiselect_type"  @input="onChange" v-model="contractType1" :options="masterContracts" label="title" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select contract type"></multiselect>
               <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
         </validation-provider>
      </div>
   </validation-observer>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import ProviderContractApi from '@/service/provider-contract';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { EnumMasterContractSortField, MasterContract } from '@/model/provider-contract';
import { Sorting } from '@/model/request';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
  },
})
export default class ContractTypeSelect extends Vue {
   @Prop({ required: true }) private contractType!: MasterContract | null;

  masterContracts: MasterContract[];

  providerContractApi: ProviderContractApi;

  contractType1: MasterContract | null;

  constructor() {
    super();

    this.contractType1 = null;
    this.masterContracts = [];
    this.providerContractApi = new ProviderContractApi();
  }

  created(): void {
    this.getMasterContracts();
  }

  onChange(): void {
    this.$emit('update:contractType', this.contractType1);
  }

  getMasterContracts(): void {
    const sortOrder: Sorting <EnumMasterContractSortField> = {
      id: EnumMasterContractSortField.TITLE,
      order: 'DESC',
    };
    this.providerContractApi.findAllMasterContracts(null, 0, 50, sortOrder).then((response) => {
      this.masterContracts = response.data.result.items;
    });
  }
}
</script>
