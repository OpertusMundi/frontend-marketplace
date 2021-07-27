<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">
      <div class="dashboard__form__step__title">
        <h3>Contract template</h3>
        <p>Assign a contract template to your asset</p>
      </div>
      <div class="dashboard__form__step__contract">
        <div class="dashboard__form__step__contract__inner">
          <div class="row">
            <div class="col-sm-4">
              <validation-provider v-slot="{ errors }" name="Contract option" rules="required">
                <div class="form-group">
                  <label class="control control-radio">
                    Select from existing templates
                    <input type="radio" name="asset_type" v-model="contractModeOption" value="select_existing" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Create new template
                    <input type="radio" name="asset_type" v-model="contractModeOption" value="create_new" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Upload own contract
                    <input type="radio" name="asset_type" v-model="contractModeOption" value="upload_own" />
                    <div class="control_indicator"></div>
                  </label>
                  <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                </div>
              </validation-provider>
            </div>
            <div class="col-sm-4">
              <div v-if="contractModeOption === 'select_existing'">
                <h5>Available templates</h5>
                <!-- todo: check following paragraph -->
                <p>Select a contract template from the ones you have already created. The available templates are based on the asset type you have previously selected.</p>
                <div class="contract-template-card" v-for="(contractTemplate, i) in contractTemplates" :key="contractTemplate.key" :class="{'contract-template-card--selected': selectedContractTemplateIndex === i}" @click="onSelectContractTemplate(i)">
                  <div class="contract-template-card__title"><strong>{{ contractTemplate.title }}</strong></div>
                  <div class="contract-template-card__subtitle">{{ contractTemplate.subtitle }}</div>
                  <div class="contract-template-card__details"><strong>Last updated:</strong> {{ formatDate(contractTemplate.modifiedAt) }}</div>
                </div>

                <!-- a dummy hidden input to be cathced by validation observer if no contract template is selected -->
                <div v-if="selectedContractTemplateIndex === null">
                  <validation-provider v-slot="{ errors }" name="contract template" rules="required">
                    <div class="form-group mt-xs-20">
                      <input type="text" hidden>
                      <div class="errors" v-if="errors.length"><span class="mt-xs-20">Select a contract template.</span></div>
                    </div>
                  </validation-provider>
                </div>

              </div>
              <div v-if="contractModeOption === 'create_new'">
                create new
              </div>
              <div v-if="contractModeOption === 'upload_own'">
                upload own
              </div>
            </div>
            <div class="col-sm-4">
              <div v-if="contractModeOption==='select_existing' && selectedContractTemplateIndex !== null">
                <h5>Contract preview</h5>
                <h3>{{ contractTemplates[selectedContractTemplateIndex].title }}</h3>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="dashboard__form__step__contract__inner">
          <h5>Existing templates</h5>
          <p>Assign a contract template to your asset</p>
            <validation-provider v-slot="{ errors }" name="Contract Tamplate" rules="required">
              <div class="form-group">
                <multiselect v-model="contractLocal" :options="['Contract template #1','Contract template #2','Contract template #3']" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select a contract template"></multiselect>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
              </div>
            </validation-provider>
        </div>
        <div class="dashboard__form__step__contract__seperator">or</div>
        <div class="dashboard__form__step__contract__inner">
          <h5>Create a new one</h5>
          <p>By creating a new contract, you will exit this wizard, the asset will be saved as draft and you can continue editing it afterwards.</p>
          <a href="#">Create a new contract</a>
        </div> -->
      </div>
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
import Multiselect from 'vue-multiselect';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import ContractApi from '@/service/provider-contract';
import { Sorting } from '@/model/request';
import { EnumProviderContractSortField, ProviderTemplateContract } from '@/model/provider-contract';
import moment from 'moment';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class Contract extends Vue {
  @Prop({ required: true }) private contractTemplateKey!: string;

  contractApi: ContractApi;

  contractTemplates: ProviderTemplateContract[];

  selectedContractTemplateIndex: number | null;

  contractModeOption: string;

  constructor() {
    super();

    this.contractApi = new ContractApi();

    this.contractModeOption = '';

    this.contractTemplates = [];
    this.selectedContractTemplateIndex = null;

    console.log('c', this.contractTemplateKey);
    if (this.contractTemplateKey) {
      this.contractModeOption = 'select_existing';
    }
  }

  // mounted() {
  //   console.log('m', this.contractTemplateKey);
  // }

  @Watch('contractModeOption', { immediate: true })
  onContractModeOptionChange(option: string): void {
    if (option === 'select_existing') {
      this.loadContractTemplates();
    }
    if (option === 'create_new') {
      console.log('create new');
    }
    if (option === 'upload_own') {
      console.log('upload own');
    }
  }

  loadContractTemplates(): void {
    const sort: Sorting<EnumProviderContractSortField> = {
      id: EnumProviderContractSortField.CREATED_ON,
      order: 'DESC',
    };

    // todo: change args
    this.contractApi.findAllTemplates(0, 1000, sort).then((templatesResponse) => {
      const { data } = templatesResponse;
      if (data.success) {
        console.log('successfully fetched', data);
        this.contractTemplates = data.result.items;
        // todo: attention with pagination
        this.selectedContractTemplateIndex = this.contractTemplateKey ? this.contractTemplates.findIndex((x) => x.key === this.contractTemplateKey) : null;
      } else {
        console.log('error', data);
      }
    }).catch((err) => {
      console.log('error fetching templates', err);
    });
  }

  onSelectContractTemplate(i: number): void {
    this.selectedContractTemplateIndex = this.selectedContractTemplateIndex === i ? null : i;
    this.$emit('update:contractTemplateKey', this.contractTemplates[i].key);
  }

  @Watch('selectedContractTemplateIndex')
  onSelectedContractTemplateChange(i: number): void {
    const key = i !== null ? this.contractTemplates[i].key : '';
    this.$emit('update:contractTemplateKey', key);
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";

  // todo: move to external css file
  .contract-template-card {
    margin-top: 10px;
    padding: 10px 15px;
    background: #fff;
    border-radius: 7px;
    cursor: pointer;

    &--selected {
      background: $secondColor;
      color: #fff;

      .contract-template-card__subtitle {
        color: #fff;
      }
    }

    &__title {
      margin-bottom: 0;
    }

    &__subtitle {
      color: $labelColor;
      font-size: .9em;
      margin: 10px 0;
    }

    &__details {
      font-size: .7em;
    }
  }
</style>
