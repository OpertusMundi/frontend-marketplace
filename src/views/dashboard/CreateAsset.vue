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
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Metadata</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>
        <div class="dashboard__form__steps">
          <transition name="fade" mode="out-in">
          <div class="dashboard__form__steps__inner">

            <type ref="step1" :assetMainType.sync="assetMainType" v-if="currentStep == 1"></type>

            <template v-if="assetMainType !== 'API'">
              <metadata ref="step2" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-if="currentStep === 2"></metadata>
              <contract ref="step3" :contractTemplateKey.sync="asset.contractTemplateKey" v-if="currentStep === 3"></contract>
              <pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" v-if="currentStep === 4"></pricing>
              <delivery ref="step5" :deliveryMethod.sync="asset.deliveryMethod" :fileToUpload.sync="fileToUpload" v-if="currentStep === 5"></delivery>
            </template>

            <template v-if="assetMainType === 'API'">
              <api-details ref="step2" :asset.sync="asset" :selectedPublishedAssetForApiCreation.sync="selectedPublishedAssetForApiCreation" :serviceType="serviceType" v-if="currentStep === 2"></api-details>
              <api-metadata ref="step3" :asset="selectedPublishedAssetForApiCreation" :additionalResourcesToUpload.sync="additionalResourcesToUpload" :serviceType="asset.spatialDataServiceType" v-if="currentStep === 3"></api-metadata>
              <api-pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" :serviceType="asset.spatialDataServiceType" v-if="currentStep === 4"></api-pricing>
              <contract ref="step5" :contractTemplateKey.sync="asset.contractTemplateKey" v-if="currentStep === 5"></contract>
            </template>

            <payout ref="step6" :selectedPayoutMethod.sync="selectedPayoutMethod" v-if="currentStep == 6"></payout>
            <review ref="step7" :vettingRequired.sync="asset.vettingRequired" :asset="assetMainType === 'API' ? { ...selectedPublishedAssetForApiCreation, ...{ contractTemplateKey: asset.contractTemplateKey, pricingModels: asset.pricingModels, spatialDataServiceType: asset.spatialDataServiceType } } : asset" v-if="currentStep == 7" @goToStep="goToStep"></review>

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
          <div v-if="uploading.completed" class="dashboard__form__uploading__body__btns">
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
// import { AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosRequestConfig } from 'axios';
import Datepicker from 'vuejs-datepicker';
import { AssetDraft } from '@/model/draft';
import {
  CatalogueItem,
  EnumConformity,
  EnumDeliveryMethod,
  DraftApiFromAssetCommand,
  EnumDraftCommandType,
} from '@/model/catalogue';
import { EnumAssetType, EnumAssetTypeCategory, EnumSpatialDataServiceType } from '@/model/enum';
import { AssetFileAdditionalResourceCommand, FileResourceCommand } from '@/model/asset';
import store from '@/store';
import Type from '@/components/Assets/Create/Type.vue';
import Metadata from '@/components/Assets/Create/Metadata.vue';
import Contract from '@/components/Assets/Create/Contract.vue';
import Pricing from '@/components/Assets/Create/Pricing.vue';
import Delivery from '@/components/Assets/Create/Delivery.vue';
import Payout from '@/components/Assets/Create/Payout.vue';
import Review from '@/components/Assets/Create/Review.vue';
import ApiDetails from '@/components/Assets/CreateServiceFromPublished/ApiDetails.vue';
import ApiPricing from '@/components/Assets/CreateServiceFromPublished/ApiPricing.vue';
import ApiMetadata from '@/components/Assets/CreateServiceFromPublished/ApiMetadata.vue';
import Modal from '@/components/Modal.vue';

Vue.use(VueCardFormat);

extend('required', required);
extend('email', email);
extend('regex', regex);

extend('credit_card', (value) => Vue.prototype.$cardFormat.validateCardNumber(value));
extend('credit_card_exp', (value) => Vue.prototype.$cardFormat.validateCardExpiry(value));
extend('credit_card_cvc', (value) => Vue.prototype.$cardFormat.validateCardCVC(value));

interface FileToUpload {
  isFileSelected: boolean,
  file: File,
  fileName: string,
  fileExtension: string,
  crs: string,
  encoding: string,
}

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
    ApiDetails,
    ApiPricing,
    ApiMetadata,
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

  assetMainType: EnumAssetTypeCategory; // Data File / API / Collection

  serviceType: null | EnumSpatialDataServiceType;

  selectedPricingModelForEditing: number | null;

  selectedPublishedAssetForApiCreation: CatalogueItem | null;

  selectedPayoutMethod: 'through_platform' | 'external_means' | 'credit_debit' | null;

  // contract: string;

  totalSteps = 7;

  currentStep = 1;

  additionalResourcesToUpload: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  fileToUpload: FileToUpload;

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
      crs: '',
      encoding: '',
    };

    this.assetMainType = '' as EnumAssetTypeCategory;

    this.serviceType = null;

    this.selectedPricingModelForEditing = null;

    this.selectedPublishedAssetForApiCreation = null;

    this.assetId = '';

    this.asset = {} as CatalogueItemCommand;

    this.isEditingExistingDraft = false;

    this.selectedPayoutMethod = null;

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
      deliveryMethod: '' as EnumDeliveryMethod,
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
      vettingRequired: false,
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
      console.log('asset id', this.assetId);
      console.log('asset', this.asset);
      console.log('asset resp', assetResponse);
      this.asset = { ...this.asset, ...assetResponse.result.command };

      this.serviceType = assetResponse.result.serviceType ? assetResponse.result.serviceType : null;

      if (this.asset.type === EnumAssetType.SERVICE) {
        console.log('type: service');
        this.catalogueApi.findOne(this.asset.parentId).then((parentAssetResponse) => {
          console.log('parent id', this.asset.parentId, parentAssetResponse);
          this.selectedPublishedAssetForApiCreation = parentAssetResponse.result;
        });
      }

      // todo (Enums may have to be fixed to include NetCDF)
      if (['VECTOR', 'RASTER', 'NETCDF'].includes(this.asset.type?.toUpperCase() as string)) {
        this.assetMainType = EnumAssetTypeCategory.DATA_FILE;
      } else if (this.asset.type as string === EnumAssetType.SERVICE) {
        this.assetMainType = EnumAssetTypeCategory.API;
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
    console.log('uploadFile?', this.fileToUpload.isFileSelected);
    this.$refs[`step${this.currentStep}`].$refs.refObserver.validate().then((isValid) => {
      if (isValid) {
        if (this.currentStep === this.totalSteps) {
          console.log(this.asset);
          if (this.assetMainType === EnumAssetTypeCategory.API) {
            this.submitFormForService();
          } else {
            this.submitForm();
          }
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
    if (!this.assetMainType) return false;

    if (this.assetMainType === EnumAssetTypeCategory.DATA_FILE) {
      if (this.selectedPricingModelForEditing !== null) return false;
      if (!this.asset.title || !this.asset.type || !this.asset.version) return false;
    }

    if (this.assetMainType === EnumAssetTypeCategory.API) {
      if (!this.selectedPublishedAssetForApiCreation) return false;
      if (!this.asset.spatialDataServiceType || ![EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType)) return false;
    }

    if (this.assetMainType === EnumAssetTypeCategory.COLLECTION) return false;

    return true;
  }

  onSaveDraft(): void {
    if (this.assetMainType === EnumAssetTypeCategory.DATA_FILE) {
      if (this.fileToUpload.isFileSelected) {
        this.modalToShow = 'saveDraftFileAlert';
        return;
      }
      this.submitForm(true);
    }
    if (this.assetMainType === EnumAssetTypeCategory.API) {
      this.submitFormForService(true);
    }
  }

  onCancelDraft(): void {
    this.$router.push('/dashboard/assets');
  }

  // todo: needs refactoring
  async submitFormForService(isDraft = false): Promise<void> {
    let draftAssetResponse: ServerResponse<AssetDraft>;
    let draftAssetKey = '';

    if (isDraft) {
      try {
        if (this.isEditingExistingDraft) {
          console.log('save draft - edit existing draft');
          draftAssetResponse = await this.draftAssetApi.update(this.assetId, this.asset);
          // todo
        } else {
          console.log('create draft');
          const serviceType = this.asset.spatialDataServiceType && [EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType) ? this.asset.spatialDataServiceType : '';
          const draftApi: DraftApiFromAssetCommand = {
            type: EnumDraftCommandType.ASSET,
            pid: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.id : '',
            title: this.selectedPublishedAssetForApiCreation ? `${this.selectedPublishedAssetForApiCreation.title} (${serviceType})` : '',
            version: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.version : '',
            serviceType: serviceType as 'WMS' | 'WFS' | 'DATA_API',
          };
          draftAssetResponse = await this.draftAssetApi.createApi(draftApi);
          // todo
        }
        if (draftAssetResponse.success) this.showUploadingMessage(true, 'Draft saved!');
        return;
      } catch (err) {
        console.error(err.message);
        // eslint-disable-next-line
        alert('Error (check console)');
      }
    }

    // let asset: CatalogueItemCommand;
    try {
      if (this.isEditingExistingDraft) {
        console.log('editing existing draft');
        draftAssetResponse = await this.draftAssetApi.update(this.assetId, this.asset);
      } else {
        console.log('new draft');
        const serviceType = this.asset.spatialDataServiceType && [EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType) ? this.asset.spatialDataServiceType : '';
        const draftApi: DraftApiFromAssetCommand = {
          type: EnumDraftCommandType.ASSET,
          pid: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.id : '',
          title: this.selectedPublishedAssetForApiCreation ? `${this.selectedPublishedAssetForApiCreation.title} (${serviceType})` : '',
          version: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.version : '',
          serviceType: serviceType as 'WMS' | 'WFS' | 'DATA_API',
        };
        draftAssetResponse = await this.draftAssetApi.createApi(draftApi);
        // this.asset.parentId = draftAssetResponse.result.command.parentId;
        this.asset = { ...draftAssetResponse.result.command, ...{ contractTemplateKey: this.asset.contractTemplateKey, pricingModels: this.asset.pricingModels } };
        console.log('qwe', this.asset);
      }
      draftAssetKey = draftAssetResponse.result.key;
      console.log('create draft success', draftAssetResponse);
    } catch (err) {
      console.error(err.message);
      // eslint-disable-next-line
      alert(`Error: ${err.message}`);
      throw new Error(err.message);
    }
    if (!draftAssetResponse.success) {
      console.log('error', draftAssetResponse);
      // eslint-disable-next-line
      alert(`Error: ${draftAssetResponse.messages}`);
      return;
    }

    // const submitResponse = await this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset);
    const submitResponse = await this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset);
    console.log(submitResponse);
    if (submitResponse.success) {
      this.uploading.status = true;
      this.uploading.completed = true;
      this.uploading.title = 'Service created!';
      this.uploading.subtitle = '';
    } else {
      console.log('error submitting service');
    }
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

    const config: AxiosRequestConfig = {
      onUploadProgress: (progressEvent: any): void => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          this.showUploadingProgress(Math.round((progressEvent.loaded * 100) / totalLength));
        }
      },
    };
    console.log('ASSET', this.asset);

    // CREATE DRAFT
    let draftAssetResponse: ServerResponse<AssetDraft>;
    let draftAssetKey = '';
    try {
      if (this.isEditingExistingDraft) {
        draftAssetResponse = await this.draftAssetApi.update(this.assetId, this.asset);
      } else {
        draftAssetResponse = await this.draftAssetApi.create(this.asset, config);
      }
      this.asset = draftAssetResponse.result.command;
      draftAssetKey = draftAssetResponse.result.key;
      console.log('create draft success', draftAssetResponse);
    } catch (err) {
      console.error(err.message);
      // eslint-disable-next-line
      alert(`Error: ${err.message}`);
      throw new Error(err.message);
    }
    if (!draftAssetResponse.success) {
      console.log('error', draftAssetResponse);
      // eslint-disable-next-line
      alert(`Error: ${draftAssetResponse.messages}`);
      return;
    }

    // UPLOAD ADDITIONAL RESOURCES FILES
    if (!isDraft && this.additionalResourcesToUpload.length) {
      console.log('upload additional resources');
      this.showUploadingMessage(false, 'Your additional metadata resources are being uploaded');

      for (let i = 0; i < this.additionalResourcesToUpload.length; i += 1) {
        let uploadAdditionalResourceResponse: ServerResponse<AssetDraft>;
        try {
          // eslint-disable-next-line
          uploadAdditionalResourceResponse = await this.draftAssetApi.uploadAdditionalResource(draftAssetKey, this.additionalResourcesToUpload[i].file, this.additionalResourcesToUpload[i].resourceCommand);
          this.asset = uploadAdditionalResourceResponse.result.command;
          console.log('upload additional resource success', uploadAdditionalResourceResponse);
        } catch (err) {
          console.error(err.message);
          // eslint-disable-next-line
          alert(`Error: ${err.message}`);
          throw new Error(err.message);
        }
        if (!uploadAdditionalResourceResponse.success) {
          console.log('error', uploadAdditionalResourceResponse);
          // eslint-disable-next-line
          alert(`Error: ${uploadAdditionalResourceResponse.messages}`);
          return;
        }
      }
    }

    // UPLOAD RESOURCE
    if (!isDraft && this.fileToUpload.isFileSelected) {
      console.log('upload resource');
      this.showUploadingMessage(false, 'Your resource is being uploaded');

      let uploadResource: ServerResponse<AssetDraft>;
      try {
        const fileInfo: FileResourceCommand = {
          fileName: this.fileToUpload.fileName,
          format: this.asset.format,
        };
        if (this.fileToUpload.encoding) fileInfo.encoding = this.fileToUpload.encoding;
        // todo: currently, file CRS is ignored (when support for multiple resources is implemented, we should consider adding a CRS for each resource)

        console.log('file info', fileInfo);

        uploadResource = await this.draftAssetApi.uploadResource(draftAssetKey, this.fileToUpload.file, fileInfo, config);
        this.asset = uploadResource.result.command;
        console.log('upload resource success', uploadResource);
      } catch (err) {
        console.error(err.message);
        // eslint-disable-next-line
        alert(`Error: ${err.message}`);
        throw new Error(err.message);
      }
      if (!uploadResource.success) {
        console.log('error', uploadResource);
        // eslint-disable-next-line
        alert(`Error: ${uploadResource.messages}`);
        return;
      }
    }

    // SUBMIT
    if (isDraft) {
      this.showUploadingMessage(true, 'Draft saved!');
    } else {
      let submitResponse: ServerResponse<AssetDraft>;
      try {
        submitResponse = await this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset);
        this.showUploadingMessage(true, 'Asset created!');
        console.log('submit success', submitResponse);
      } catch (err) {
        console.error(err.message);
        // eslint-disable-next-line
        alert(`Error: ${err.message}`);
        throw new Error(err.message);
      }
      if (!submitResponse.success) {
        console.log('error', submitResponse);
        // eslint-disable-next-line
        alert(`Error: ${submitResponse.messages}`);
      }
    }
  }

  showUploadingMessage(completed: boolean, title: string, subtitle?: string): void {
    Vue.set(this.uploading, 'status', true);
    Vue.set(this.uploading, 'completed', completed);
    Vue.set(this.uploading, 'title', title);
    Vue.set(this.uploading, 'subtitle', subtitle || '');
  }

  showUploadingProgress(percentage: number): void {
    Vue.set(this.uploading, 'percentage', percentage);
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
