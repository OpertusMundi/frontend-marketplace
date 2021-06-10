<template>
<div class="dashboard__inner">
    <div class="dashboard__inner__steps" v-if="!uploading.status">
      <div class="dashboard__head">
        <h1>Add an asset</h1>
        <div class="dashboard__head__helpers">
          <a href="#" class="btn btn--outlineblue">SAVE DRAFT</a>
          <a href="#" class="btn btn--outlineblue">EXIT</a>
        </div>
      </div>

      <div class="dashboard__form">
        <ul v-if="assetMainType !== 'API'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Metadata</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Delivery</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>

        <ul v-else class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">API details</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Meadata</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>
        <div class="dashboard__form__steps">
          <div class="dashboard__form__steps__inner">

            <!-- ASSET TYPE -->
            <!-- <type :assetMainType.sync="assetMainType" v-if="currentStep == 1"></type> -->
            <type ref="step1" v-show="currentStep == 1" @update:assetMainType="x => assetMainType = x"></type>

            <!-- METADATA -->
            <metadata ref="step2" v-show="currentStep == 2" @update:asset="x => asset = x"></metadata>

            <!-- CONTRACT -->
            <contract ref="step3" v-show="currentStep == 3" @update:contract="x => contract = x"></contract>

            <!-- PRICING -->
            <pricing ref="step4" v-show="currentStep == 4" @update:pricingModels="x => asset.pricingModels = x"></pricing>

            <!-- DELIVERY -->
            <delivery ref="step5" v-show="currentStep == 5" @update:deliveryMethod="x => asset.deliveryMethod = x" @update:fileToUpload="x => fileToUpload = x"></delivery>

            <!-- PAYOUT -->
            <payout ref="step6" v-show="currentStep == 6"></payout>

            <!-- REVIEW -->
            <review ref="step7" :asset="asset" v-show="currentStep == 7"></review>


            <div class="dashboard__form__errors" v-if="uploading.errors.length">
              <ul>
                <li v-for="error in uploading.errors" v-bind:key="`error${error.code}`">{{ error.description }}</li>
              </ul>
            </div>

          </div>
        </div>
        <div class="dashboard__form__navbuttons">
          <button class="btn btn--std btn--blue" @click.prevent="previousStep()">PREVIOUS</button>
          <!-- <button class="btn btn--std btn--blue" :disabled="isButtonDisabled('next')" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and submit for review' : 'NEXT' }}</button> -->
          <button class="btn btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and submit for review' : 'NEXT' }}</button>
        </div>
      </div>
    </div>

    <div class="dashboard__form__uploading" v-if="uploading.status">
      <div class="dashboard__form__uploading__inner">
        <div class="dashboard__form__uploading__pbar">
          <span :style="{width: uploading.percentage + '%'}"></span>
          <p v-if="!uploading.completed">{{ uploading.percentage }}%</p>
          <p v-if="uploading.completed">Well done!</p>
        </div>
        <div class="dashboard__form__uploading__body">
          <h4>{{ uploading.title }}</h4>
          <p>{{ uploading.subtitle }}</p>
          <div class="dashboard__form__uploading__body__btns">
            <router-link to="/dashboard" class="btn btn--std btn--blue">GO TO Dashboard</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CatalogueItemCommand, ServerResponse } from '@/model';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';
import { required, email, regex } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import VueCardFormat from 'vue-credit-card-validation';
import { AxiosError, AxiosRequestConfig } from 'axios';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { AssetDraft } from '@/model/draft';
import store from '@/store';
import Type from '@/components/Assets/Create/Type.vue';
import Metadata from '@/components/Assets/Create/Metadata.vue';
import Contract from '@/components/Assets/Create/Contract.vue';
import Pricing from '@/components/Assets/Create/Pricing.vue';
import Delivery from '@/components/Assets/Create/Delivery.vue';
import Payout from '@/components/Assets/Create/Payout.vue';
import Review from '@/components/Assets/Create/Review.vue';

Vue.use(VueCardFormat);

extend('required', required);
extend('email', email);
extend('regex', regex);

extend('credit_card', (value) => Vue.prototype.$cardFormat.validateCardNumber(value));
extend('credit_card_exp', (value) => Vue.prototype.$cardFormat.validateCardExpiry(value));
extend('credit_card_cvc', (value) => Vue.prototype.$cardFormat.validateCardCVC(value));

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
    Datepicker,
    Type,
    Metadata,
    Contract,
    Pricing,
    Delivery,
    Payout,
    Review,
  },
})
export default class CreateAsset extends Vue {
  $refs!: {
    step1: InstanceType<typeof ValidationObserver>,
    step2: InstanceType<typeof ValidationObserver>,
    step3: InstanceType<typeof ValidationObserver>,
    step4: InstanceType<typeof ValidationObserver>,
    step5: InstanceType<typeof ValidationObserver>,
    step6: InstanceType<typeof ValidationObserver>,
    step7: InstanceType<typeof ValidationObserver>,
  }

  // menusData: {
  //   assetTypes: string[],
  //   availableFormats: string[],
  //   domainRestrictions: any[],
  //   continents: any[],
  //   countries: any[],
  // };

  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  asset: CatalogueItemCommand;

  assetMainType: string; // Data File / API / Collection

  // assetTypes: string[];

  // availableFormats: string[];

  // contract: string;

  // pricingModelTypes: any;

  // selectedPricingModelForEditing: number | null;

  // tempSelectedType: string;

  totalSteps = 7;

  currentStep = 1;

  // creatidCardValid = false;

  // uploadedFile: File;
  fileToUpload: {isFileSelected: boolean, file: File, fileName: string, fileExtension: string};

  uploading:any;

  constructor() {
    super();

    // TODO: do validation of filetype<->format before uploading file
    console.log(store.getters.getConfig);

    // this.uploadedFile = {} as File;
    this.fileToUpload = {
      isFileSelected: false,
      file: {} as File,
      fileName: '',
      fileExtension: '',
    };

    this.assetMainType = '';

    this.asset = {} as CatalogueItemCommand;

    // this.menusData = {
    //   assetTypes: [],
    //   availableFormats: [],
    //   domainRestrictions: [],
    //   continents: [],
    //   countries: [],
    // };
    // this.menusData.assetTypes = [...new Set(store.getters.getConfig.configuration.asset.fileTypes.map((x) => x.category))] as string[];
    // this.menusData.domainRestrictions = [
    //   {
    //     name: 'Photogrammetry',
    //     code: 'PH',
    //   },
    //   {
    //     name: 'Geography',
    //     code: 'GE',
    //   },
    //   {
    //     name: 'Elevation',
    //     code: 'EL',
    //   },
    //   {
    //     name: 'Pharming',
    //     code: 'PA',
    //   },
    //   {
    //     name: 'Health',
    //     code: 'HE',
    //   },
    // ];

    // this.menusData.continents = [
    //   {
    //     name: 'Europe',
    //     code: 'EUROPE',
    //   },
    //   {
    //     name: 'Africa',
    //     code: 'AFRICA',
    //   },
    //   {
    //     name: 'Asia',
    //     code: 'ASIA',
    //   },
    //   {
    //     name: 'North America',
    //     code: 'NORTH_AMERICA',
    //   },
    //   {
    //     name: 'South America',
    //     code: 'SOUTH_AMERICA',
    //   },
    //   {
    //     name: 'Oceania',
    //     code: 'OCEANIA',
    //   },
    //   {
    //     name: 'Antarctica',
    //     code: 'ANTARCTICA',
    //   },
    // ];

    // this.menusData.countries = [
    //   {
    //     name: 'France',
    //     code: 'FRA',
    //   },
    //   {
    //     name: 'Spain',
    //     code: 'ESP',
    //   },
    // ];

    // this.contract = '';

    // this.pricingModelTypes = [
    //   { name: 'Free', priceModel: EnumPricingModel.FREE },
    //   { name: 'Fixed', priceModel: EnumPricingModel.FIXED },
    //   { name: 'Fixed per rows', priceModel: EnumPricingModel.FIXED_PER_ROWS },
    //   { name: 'Fixed per population', priceModel: EnumPricingModel.FIXED_FOR_POPULATION },
    // ];
    // this.selectedPricingModelForEditing = null;

    this.uploading = {
      status: false,
      percentage: 0,
      title: 'Your asset is being uploaded',
      subtitle: 'Don’t close this page until upload is complete',
      completed: false,
      errors: [],
    };


    this.catalogueApi = new CatalogueApi();
    this.draftAssetApi = new DraftAssetApi();
  }

  // mounted():void {
  //   console.log(this.$route.params.error);
  //   console.log(this.asset.pricingModels);
  // }

  goToStep(step:number):void {
    this.currentStep = step;
  }

  previousStep():void {
    if (this.currentStep >= 1) {
      this.currentStep -= 1;
    }
  }

  nextStep():void {
    // console.log(this.asset);
    // this.$refs[`step${this.currentStep}`].validate().then((success) => {
    //   if (success) {
    //     if (this.currentStep === this.totalSteps) {
    //       this.submitForm();
    //     } else {
    // this.currentStep += 1;
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth',
    // });
    //     }
    //   }
    // });

    // this.$refs[`step${this.currentStep}`].validate().then((isValid) => {
    //   if (isValid) {
    //     if (this.currentStep === this.totalSteps) {
    //       this.submitForm();
    //     } else {
    //       this.currentStep += 1;
    //       window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //       });
    //     }
    //   }
    // });
    this.$refs[`step${this.currentStep}`].$refs.refObserver.validate().then((isValid) => {
      if (isValid) {
        if (this.currentStep === this.totalSteps) {
          console.log(this.asset);
          this.submitForm();
        } else {
          this.currentStep += 1;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    });
  }

  // isButtonDisabled(button: string): boolean {
  //   switch (button) {
  //     case 'next': {
  //       if (this.currentStep === 4 && this.selectedPricingModelForEditing !== null) {
  //         return true;
  //       }
  //       return false;
  //     }
  //     default:
  //       return false;
  //   }
  // }

  // @Watch('asset.type', { immediate: true }) onAssetMainTypeChange(): void {
  //   this.asset.format = '';
  //   const selectedType = this.asset.type;
  //   this.menusData.availableFormats = store.getters.getConfig.configuration.asset.fileTypes.filter((x) => x.category === selectedType?.toUpperCase()).map((x) => x.format);
  // }

  // async setPricingModel(): Promise<void> {
  //   const isValid = await this.$refs.step4.validate();
  //   if (!isValid) {
  //     return;
  //   }
  //   this.selectedPricingModelForEditing = null;
  // }

  // addPricingModel():void {
  //   this.asset.pricingModels.push({} as BasePricingModelCommand);
  //   this.selectedPricingModelForEditing = this.asset.pricingModels.length - 1;
  // }

  // onChangePricingModelType(model: EnumPricingModel): void {
  //   console.log(model);
  //   const pricingModel = {
  //     type: '' as EnumPricingModel,
  //     domainRestrictions: [],
  //     coverageRestrictionContinents: [],
  //     consumerRestrictionContinents: [],
  //     coverageRestrictionCountries: [],
  //     consumerRestrictionCountries: [],
  //     includeDomainRestrictions: false,
  //     includeCoverageRestrictions: false,
  //     includeConsumerRestrictions: false,
  //   } as BasePricingModelCommand;
  //   switch (model) {
  //     case EnumPricingModel.FREE: {
  //       (pricingModel as FreePricingModelCommand).type = EnumPricingModel.FREE;
  //       break;
  //     }
  //     case EnumPricingModel.FIXED: {
  //       (pricingModel as FixedPricingModelCommand).type = EnumPricingModel.FIXED;
  //       break;
  //     }
  //     case EnumPricingModel.FIXED_PER_ROWS: {
  //       (pricingModel as FixedRowPricingModelCommand).type = EnumPricingModel.FIXED_PER_ROWS;
  //       (pricingModel as FixedRowPricingModelCommand).discountRates = [{}] as DiscountRate[];
  //       break;
  //     }
  //     case EnumPricingModel.FIXED_FOR_POPULATION: {
  //       (pricingModel as FixedPopulationPricingModelCommand).type = EnumPricingModel.FIXED_FOR_POPULATION;
  //       (pricingModel as FixedPopulationPricingModelCommand).discountRates = [{}] as DiscountRate[];
  //       break;
  //     }
  //     default:
  //   }
  //   // eslint-disable-next-line
  //   Vue.set(this.asset.pricingModels, this.selectedPricingModelForEditing!, pricingModel);
  // }

  // addDiscountRate(): void {
  //   // eslint-disable-next-line
  //   (this.asset.pricingModels[this.selectedPricingModelForEditing!] as FixedRowPricingModelCommand | FixedPopulationPricingModelCommand).discountRates.push({} as DiscountRate);
  // }

  // removePricingModel(): void {
  //   const i = this.selectedPricingModelForEditing;
  //   this.selectedPricingModelForEditing = null;
  //   // eslint-disable-next-line
  //   this.asset.pricingModels.splice(i!, 1);
  // }

  // eslint-disable-next-line
  readFile(e): void {
    const [file] = e.srcElement.files;
    this.fileToUpload.isFileSelected = true;
    this.fileToUpload.file = file;
    this.fileToUpload.fileName = file.name;
    this.fileToUpload.fileExtension = file.name.split('.').pop();
  }

  submitForm():void {
    // if user has selected file to upload, check if format is compatible with file extension
    if (this.fileToUpload.isFileSelected) {
      const acceptedExtensions = store.getters.getConfig.configuration.asset.fileTypes.find((x) => x.format.toUpperCase() === this.asset.format.toUpperCase()).extensions;
      if (!acceptedExtensions.includes(this.fileToUpload.fileExtension)) {
        // eslint-disable-next-line
        alert('format-extension mismatch (not compatible)');
        return;
      }
    }

    // TODO: submit form!
    this.uploading.status = true;
    this.uploading.errors = [];

    // fix dates format
    this.asset.metadataDate = moment(this.asset.metadataDate).format('YYYY-MM-DD');

    // fix pricing models format (vue-multiselect can't bind values but whole objects)
    /* eslint-disable no-param-reassign */
    this.asset.pricingModels.forEach((x) => {
      x.domainRestrictions = x.domainRestrictions.map((c: any) => c.code);
      x.consumerRestrictionContinents = x.consumerRestrictionContinents.map((c: any) => c.code);
      x.coverageRestrictionContinents = x.coverageRestrictionContinents.map((c: any) => c.code);
      x.consumerRestrictionCountries = x.consumerRestrictionCountries.map((c: any) => c.code);
      x.coverageRestrictionCountries = x.coverageRestrictionCountries.map((c: any) => c.code);
      delete (x as any).includeDomainRestrictions;
      delete (x as any).includeCoverageRestrictions;
      delete (x as any).includeConsumerRestrictions;
    });
    /* eslint-enable no-param-reassign */

    const config: AxiosRequestConfig = {
      onUploadProgress: (progressEvent: any): void => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          this.uploading.percentage = (Math.round((progressEvent.loaded * 100) / totalLength));
        }
      },
    };
    console.log('ASSET', this.asset);

    this.draftAssetApi.create(this.asset, config)
      .then((response: ServerResponse<AssetDraft>) => {
        if (response.success) {
          console.log('draft created');
          const draftAssetKey = response.result.key;

          if (this.fileToUpload.isFileSelected) { // if a file is to be uploaded
            this.uploading.status = true;
            this.uploading.completed = false;
            this.uploading.title = 'Your resource is being uploaded';
            this.draftAssetApi.uploadResource(draftAssetKey, this.fileToUpload.file, { fileName: this.fileToUpload.fileName, format: this.asset.format }, config).then((uploadResponse) => {
              if (uploadResponse.success) {
                console.log('uploaded resource!!!');
                this.uploading.completed = true;
                this.uploading.title = 'Your asset is uploaded successfully!';
                this.uploading.subtitle = '';
                this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset).then((submitResponse) => {
                  if (submitResponse.success) {
                    console.log('asset submitted successfully');
                  } else {
                    console.log('error submitting asset', submitResponse);
                  }
                });
              } else {
                console.log(uploadResponse);
                console.log('error uploading resource');
              }
            });
          } else {
            this.uploading.completed = true;
          }
        } else {
          console.log('error creating draft', response);
          this.uploading.status = false;
          this.uploading.completed = true;
          this.uploading.errors = response.messages;
          setTimeout(() => {
            this.uploading.errors = [];
          }, 10000);
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 300);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          this.uploading.errors = error.response.data.messages;
          setTimeout(() => {
            this.uploading.errors = [];
          }, 10000);
        }
        this.uploading.status = false;
      });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";

  .card {
    padding: 30px;
    background: #fff;
    letter-spacing: 0.06em;
    font-size: .8em;
    border: solid 2px $darkColor;
    border-radius: 7px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &--selected {
      border: solid 2px $secondColor;
    }

    &--clickable {
      cursor: pointer;
    }

  .form-group .multiselect__option--highlight {
    background: $secondColor !important;
  }

  .form-group .multiselect__tag {
    background: $secondColor !important;
  }
  }
</style>
