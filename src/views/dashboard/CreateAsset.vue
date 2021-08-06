<template>
  <div class="dashboard__inner">
    <!-- MODALS -->
    <modal :withSlots="true" :show="modalToShow === 'saveDraftFileAlert'" @dismiss="modalToShow = ''" :modalId="'saveDraftFileAlert'">
      <template v-slot:body>
        <h1>Save draft?</h1>

        <p class="mb-xs-10">Selected file will not be saved. You will need to specify it again when completing draft creation.</p>
        <p><strong>Everything else will be saved as draft.</strong></p>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="submitForm(true)">Save Draft</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'exitCreateAssetAlert'" @dismiss="modalToShow = ''" :modalId="'exitCreateAssetAlert'">
      <template v-slot:body>
        <h1>Exit asset creation?</h1>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue ml-xs-20" @click="onCancelDraft">Exit</button>
      </template>
    </modal>
    <!-- END OF MODALS -->

    <div class="dashboard__inner__steps" v-if="!uploading.status">
      <div class="dashboard__head">
        <h1>Add an asset</h1>
        <div class="dashboard__head__helpers">
          <button href="#" class="btn btn--outlineblue" @click="onSaveDraft" v-if="isButtonSaveDraftShown()">SAVE DRAFT</button>
          <a href="#" class="btn btn--outlineblue" @click="modalToShow = 'exitCreateAssetAlert'">EXIT</a>
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
          <transition name="fade" mode="out-in">
          <div class="dashboard__form__steps__inner">

            <!-- ASSET TYPE -->
            <!-- <transition name="fade" mode="out-in"> -->
              <type ref="step1" :assetMainType.sync="assetMainType" v-if="currentStep == 1"></type>
            <!-- </transition> -->

            <!-- METADATA -->
            <!-- <transition name="fade" mode="out-in"> -->
              <metadata ref="step2" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-if="currentStep == 2"></metadata>
            <!-- </transition> -->

            <!-- CONTRACT -->
            <!-- <transition name="fade" mode="out-in"> -->
              <contract ref="step3" :contractTemplateKey.sync="asset.contractTemplateKey" v-if="currentStep == 3"></contract>
            <!-- </transition> -->

            <!-- PRICING -->
            <!-- <transition name="fade" mode="out-in"> -->
              <pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" v-if="currentStep == 4"></pricing>
            <!-- </transition> -->

            <!-- DELIVERY -->
            <!-- <transition name="fade" mode="out-in"> -->
              <delivery ref="step5" :deliveryMethod.sync="asset.deliveryMethod" :fileToUpload.sync="fileToUpload" v-if="currentStep == 5"></delivery>
            <!-- </transition> -->

            <!-- PAYOUT -->
            <!-- <transition name="fade" mode="out-in"> -->
              <payout ref="step6" v-if="currentStep == 6"></payout>
            <!-- </transition> -->

            <!-- REVIEW -->
            <!-- <transition name="fade" mode="out-in"> -->
              <review ref="step7" :asset="asset" v-if="currentStep == 7" @goToStep="goToStep"></review>
            <!-- </transition> -->

            <div class="dashboard__form__errors" v-if="uploading.errors.length">
              <ul>
                <li v-for="error in uploading.errors" v-bind:key="`error${error.code}`">{{ error.description }}</li>
              </ul>
            </div>

          </div>
          </transition>
        </div>
        <div class="dashboard__form__navbuttons">
          <button class="btn btn--std btn--blue" v-if="this.currentStep !== 1" @click.prevent="previousStep()">PREVIOUS</button>
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
import { EnumConformity, EnumDeliveryMethod } from '@/model/catalogue';
import { EnumAssetType } from '@/model/enum';
import { AssetFileAdditionalResourceCommand } from '@/model/asset';
import store from '@/store';
import Type from '@/components/Assets/Create/Type.vue';
import Metadata from '@/components/Assets/Create/Metadata.vue';
import Contract from '@/components/Assets/Create/Contract.vue';
import Pricing from '@/components/Assets/Create/Pricing.vue';
import Delivery from '@/components/Assets/Create/Delivery.vue';
import Payout from '@/components/Assets/Create/Payout.vue';
import Review from '@/components/Assets/Create/Review.vue';
import Modal from '@/components/Modal.vue';

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
    Modal,
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

  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  modalToShow: string;

  isEditingExistingDraft: boolean;

  assetId: string; // if editing existing draft, the asset id (key) of draft asset

  asset: CatalogueItemCommand;

  assetMainType: string; // Data File / API / Collection

  selectedPricingModelForEditing: number | null;

  // contract: string;

  totalSteps = 7;

  currentStep = 1;

  additionalResourcesToUpload: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  fileToUpload: {isFileSelected: boolean, file: File, fileName: string, fileExtension: string};

  uploading:any;

  constructor() {
    super();

    // TODO: do validation of filetype<->format before uploading file
    console.log('config', store.getters.getConfig);

    this.modalToShow = '';

    this.additionalResourcesToUpload = [];

    this.fileToUpload = {
      isFileSelected: false,
      file: {} as File,
      fileName: '',
      fileExtension: '',
    };

    this.assetMainType = '';

    this.selectedPricingModelForEditing = null;

    this.assetId = '';

    this.asset = {} as CatalogueItemCommand;

    this.isEditingExistingDraft = false;

    // this.contract = '';

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

  created(): void {
    console.log('created');

    this.asset = {
      abstract: '',
      additionalResources: [],
      conformity: EnumConformity.NOT_EVALUATED,
      contractTemplateKey: '',
      creationDate: '',
      dateEnd: '',
      dateStart: '',
      deliveryMethod: 'NONE' as EnumDeliveryMethod,
      format: '',
      ingested: false,
      keywords: [],
      language: '',
      license: '',
      lineage: '',
      metadataDate: '',
      metadataLanguage: '',
      metadataPointOfContactEmail: '',
      metadataPointOfContactName: '',
      openDataset: false,
      parentId: '',
      pricingModels: [],
      publicAccessLimitations: '',
      publicationDate: '',
      publisherEmail: '',
      publisherName: '',
      referenceSystem: '',
      resourceLocator: '',
      responsibleParty: [],
      revisionDate: '',
      resources: [],
      scales: [],
      spatialDataServiceOperations: [],
      spatialDataServiceQueryables: [],
      spatialDataServiceType: null,
      spatialDataServiceVersion: null,
      spatialResolution: null,
      suitableFor: [],
      title: '',
      topicCategory: [],
      type: '' as EnumAssetType,
      userOnlyForVas: false,
      version: '',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.94818115234375, 36.40359962073253],
            [23.57940673828125, 36.40359962073253],
            [23.57940673828125, 38.31795595794451],
            [20.94818115234375, 38.31795595794451],
            [20.94818115234375, 36.40359962073253],
          ],
        ],
      } as GeoJSON.Polygon,
    };

    this.assetId = this.$route.params.id ? this.$route.params.id : '';
    this.isEditingExistingDraft = !!this.assetId;

    if (this.isEditingExistingDraft) {
      this.loadExistingDraftAsset();
    }
  }

  loadExistingDraftAsset(): void {
    this.draftAssetApi.findOne(this.assetId).then((assetResponse) => {
      this.asset = { ...this.asset, ...assetResponse.result.command };

      // todo: use Enum (Enums may have to be fixed to include NetCDF)
      if (['VECTOR', 'RASTER', 'NETCDF'].includes(this.asset.type?.toUpperCase() as string)) {
        this.assetMainType = 'datafile';
      } else if (this.asset.type as string === 'API') {
        this.assetMainType = 'API';
      } else {
        // todo
        console.log('other main type');
      }
    });
  }

  goToStep(step:number):void {
    this.currentStep = step;
  }

  previousStep():void {
    if (this.currentStep <= 1) return;
    this.currentStep -= 1;
  }

  nextStep():void {
    console.log('a', this.asset);
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

  isButtonSaveDraftShown(): boolean {
    if (!this.assetMainType) {
      return false;
    }
    if (!this.asset.pricingModels.length || this.selectedPricingModelForEditing !== null) {
      return false;
    }
    if (!this.asset.title || !this.asset.type || !this.asset.format || !this.asset.version) {
      return false;
    }
    return true;
  }

  onSaveDraft(): void {
    if (this.fileToUpload.isFileSelected) {
      this.modalToShow = 'saveDraftFileAlert';
      return;
    }
    this.submitForm(true);
  }

  onCancelDraft(): void {
    this.$router.push('/dashboard/assets');
  }

  // TODO: check if this method can be removed (not required)
  fixDataForSubmitting(): void {
    // fix dates format
    this.asset.metadataDate = moment(this.asset.metadataDate).format('YYYY-MM-DD');
  }

  // needs refactoring
  async submitForm(isDraft = false): Promise<void> {
    this.modalToShow = '';

    console.log('rtu', this.additionalResourcesToUpload);

    // if user has selected file to upload, check if format is compatible with file extension
    if (!isDraft) {
      if (this.fileToUpload.isFileSelected) {
        console.log('file is selected');
        const fileTypeInfo = store.getters.getConfig.configuration.asset.fileTypes.find((x) => x.format.toUpperCase() === this.asset.format.toUpperCase());
        const acceptedExtensions = fileTypeInfo.bundleSupported && Array.isArray(fileTypeInfo.bundleExtensions) ? fileTypeInfo.extensions.concat(fileTypeInfo.bundleExtensions) : fileTypeInfo.extensions;
        console.log('accepted extensions:', acceptedExtensions);

        if (!acceptedExtensions.includes(this.fileToUpload.fileExtension)) {
          // TODO: make it a modal
          // eslint-disable-next-line
          alert('format-extension mismatch (not compatible)');
          return;
        }
      } else {
        console.log('no file selected');
      }
    }

    // this.uploading.status = true;
    // this.uploading.errors = [];

    this.fixDataForSubmitting();

    const config: AxiosRequestConfig = {
      onUploadProgress: (progressEvent: any): void => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          this.uploading.percentage = (Math.round((progressEvent.loaded * 100) / totalLength));
        }
      },
    };
    console.log('ASSET', this.asset);

    const draftAssetResponse: ServerResponse<AssetDraft> | void = this.isEditingExistingDraft ? await this.draftAssetApi.update(this.assetId, this.asset) : await this.draftAssetApi.create(this.asset, config)
      .catch((err: AxiosError) => { console.log('eeeee', err); });
    const isDraftCreated = draftAssetResponse && draftAssetResponse.success ? draftAssetResponse.success : false;
    const draftAssetKey = draftAssetResponse && draftAssetResponse.success ? draftAssetResponse.result.key : '';
    console.log('draft status', isDraftCreated, draftAssetKey);

    if (!isDraftCreated && draftAssetResponse) {
      console.log('error creating draft', draftAssetResponse);
      this.onError(draftAssetResponse);
    }

    if (!isDraft && this.additionalResourcesToUpload.length) {
      console.log('upload additional resources');
      this.uploading.status = true;
      this.uploading.errors = [];
      this.uploading.completed = false;
      this.uploading.title = 'Your additional metadata resources are being uploaded';

      for (let i = 0; i < this.additionalResourcesToUpload.length; i += 1) {
        // eslint-disable-next-line
        const uploadAdditionalResourceResponse = await this.draftAssetApi.uploadAdditionalResource(draftAssetKey, this.additionalResourcesToUpload[i].file, this.additionalResourcesToUpload[i].resourceCommand);
        this.asset = uploadAdditionalResourceResponse.result.command;
        if (uploadAdditionalResourceResponse.success) console.log('successfully uploaded additional resource!');
      }
    }

    if (!isDraft && this.fileToUpload.isFileSelected) {
      this.uploading.status = true;
      this.uploading.errors = [];
      this.uploading.completed = false;
      this.uploading.title = 'Your resource is being uploaded';
      // todo: catch error
      const uploadResponse = await this.draftAssetApi.uploadResource(draftAssetKey, this.fileToUpload.file, { fileName: this.fileToUpload.fileName, format: this.asset.format }, config);
      this.asset = uploadResponse.result.command;

      if (uploadResponse.success) {
        console.log('uploaded resource!');
        // this.uploading.completed = true;
        // this.uploading.title = 'Your asset is uploaded successfully!';
        // this.uploading.subtitle = '';
      } else {
        console.log('error uploading resource', uploadResponse);
        this.onError(uploadResponse);
        this.uploading.completed = true;
        this.uploading.title = 'Error uploading asset';
        this.uploading.subtitle = '';
        return;
      }
    }

    if (isDraft) {
      this.uploading.status = true;
      this.uploading.completed = true;
      this.uploading.title = 'Draft saved!';
      this.uploading.subtitle = '';
    } else {
      // todo: catch error
      const submitResponse = await this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset);
      this.uploading.status = true;
      this.uploading.completed = true;
      this.uploading.subtitle = '';
      if (submitResponse.success) {
        console.log('submitted successfully!');
        this.uploading.title = 'Asset created!';
      } else {
        console.log('error submitting asset', submitResponse);
        this.onError(submitResponse);
        this.uploading.title = 'Error creating asset';
      }
    }
  }

  // todo
  onError(response: ServerResponse<AssetDraft>): void {
    this.uploading.errors = response.messages;
    setTimeout(() => {
      this.uploading.errors = [];
    }, 10000);
    this.uploading.status = false;
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
