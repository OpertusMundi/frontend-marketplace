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
        <button class="btn btn--std btn--blue ml-xs-20" @click="submitDataFileForm(true)">Save Draft</button>
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

    <modal :withSlots="true" :show="isPendingDefaultContractAcceptance" :showCancelButton="false" :modalId="'pendingTemplateAcceptance'">
      <template v-slot:body>
        <h1>Accept contract?</h1>

        <p class="mb-xs-10">In order to use the selected contract, you firstly need to accept it</p>
        <p class="mt-xs-20 mb-xs-30"><a target="_blank" :href="`/dashboard/contracts/${asset.contractTemplateKey}`" class="btn btn--std btn--blue">GO TO CONTRACT</a></p>
        <p><small>This window will automatically close after you accept it and you will be able to proceed</small></p>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'serviceAlreadyCreated'" @dismiss="modalToShow = ''" :modalId="'serviceAlreadyCreated'" :showCancelButton="false" :showCloseButton="false">
      <template v-slot:body>
        <h1>Already created!</h1>

        <p>A service of the selected type is already created by the selected asset.</p>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="modalToShow = ''">OK</button>
      </template>
    </modal>

    <modal :withSlots="true" :show="modalToShow === 'contractNotAvailable'" @dismiss="modalToShow = ''" :modalId="'ContractNotAvailable'" :showCancelButton="false" :showCloseButton="false">
      <template v-slot:body>
        <h1>Contract not available</h1>

        <p>The selected contract is not available. Please, select another one.</p>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="modalToShow = ''">OK</button>
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
        <ul v-if="assetMainType === 'DATA_FILE'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Metadata</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Delivery</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>

        <ul v-if="assetMainType === 'COLLECTION'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Assets</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Details</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>

        <ul v-if="assetMainType === 'OPEN'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Metadata</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">License</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Delivery</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Review</a></li>
        </ul>

        <ul v-if="assetMainType === 'API'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">API details</a></li>
          <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Metadata</a></li>
          <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Pricing</a></li>
          <li><a href="#" :class="[currentStep == 5 ? 'active' : '', currentStep < 5 ? 'inactive' : '']" @click="goToStep(5)">Contract</a></li>
          <li><a href="#" :class="[currentStep == 6 ? 'active' : '', currentStep < 6 ? 'inactive' : '']" @click="goToStep(6)">Payout</a></li>
          <li><a href="#" :class="[currentStep == 7 ? 'active' : '', currentStep < 7 ? 'inactive' : '']" @click="goToStep(7)">Review</a></li>
        </ul>

        <ul v-if="assetMainType === 'SENTINEL_HUB_OPEN_DATA'" class="dashboard__form__nav">
          <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Asset Type</a></li>
          <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Metadata</a></li>
        </ul>

        <div class="dashboard__form__steps">
          <transition name="fade" mode="out-in">
            <div class="dashboard__form__steps__inner" :style="currentStep === 2 && assetMainType === 'COLLECTION' ? 'height: auto' : ''">
              <type ref="step1" :assetMainType.sync="assetMainType" :disabled="isEditingExistingDraft" v-if="currentStep == 1"></type>

              <template v-if="assetMainType === 'DATA_FILE'">
                <metadata ref="step2" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-if="currentStep === 2"></metadata>
                <delivery ref="step3" :resources="asset.resources" :deliveryMethod.sync="asset.deliveryMethod" :deliveryMethodOptions.sync="asset.deliveryMethodOptions" :fileToUpload.sync="fileToUpload" :linkToAsset.sync="linkToAsset" :selectedPublishedFileForDataFileCreation.sync="selectedPublishedFileForDataFileCreation" :assetType="asset.type" :format="asset.format" @removeResource="onRemoveResource" v-if="currentStep === 3"></delivery>
                <pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" :assetType="asset.type" :deliveryMethod="asset.deliveryMethod" v-if="currentStep === 4"></pricing>
                <contract ref="step5" :contractTemplateType.sync="asset.contractTemplateType" :contractTemplateKey.sync="asset.contractTemplateKey" :customContractToUpload.sync="customContractToUpload" :assetMainType="assetMainType" v-if="currentStep === 5"></contract>
                <payout ref="step6" :selectedPayoutMethod.sync="selectedPayoutMethod" v-if="currentStep === 6"></payout>
                <review ref="step7" :accessToFileType="getAccessToFileType" :vettingRequired.sync="asset.vettingRequired" :iprProtectionEnabled.sync="asset.iprProtectionEnabled" :errors="errors" :asset="asset" v-if="currentStep === 7" @goToStep="goToStep"></review>
              </template>

              <template v-if="assetMainType === 'COLLECTION'">
                <selected-assets ref="step2" :asset.sync="asset" v-if="currentStep === 2"></selected-assets>
                <collection-details ref="step3" :asset.sync="asset" v-if="currentStep === 3"></collection-details>
                <pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" :assetType="asset.type" :deliveryMethod="asset.deliveryMethod" v-if="currentStep === 4"></pricing>
                <contract ref="step5" :contractTemplateType.sync="asset.contractTemplateType" :contractTemplateKey.sync="asset.contractTemplateKey" :customContractToUpload.sync="customContractToUpload" :assetMainType="assetMainType" v-if="currentStep === 5"></contract>
                <payout ref="step6" :selectedPayoutMethod.sync="selectedPayoutMethod" v-if="currentStep === 6"></payout>
                <review ref="step7" :accessToFileType="getAccessToFileType" :vettingRequired.sync="asset.vettingRequired" :iprProtectionEnabled.sync="asset.iprProtectionEnabled" :errors="errors" :asset="asset" v-if="currentStep === 7" @goToStep="goToStep"></review>
              </template>

              <template v-if="assetMainType === 'OPEN'">
                <open-asset-metadata ref="step2" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-if="currentStep === 2"></open-asset-metadata>
                <license ref="step3" :license.sync="asset.license" v-if="currentStep === 3">license (wip)</license>
                <open-asset-delivery ref="step4" :selectedPublishedFileForDataFileCreation.sync="selectedPublishedFileForDataFileCreation" :linkToAsset.sync="linkToAsset" :assetType="asset.type" :format="asset.format" v-if="currentStep === 4"></open-asset-delivery>
                <review ref="step5" :accessToFileType="getAccessToFileType" :vettingRequired="false" :iprProtectionEnabled.sync="asset.iprProtectionEnabled" :errors="errors" :asset="asset" v-if="currentStep === 5" @goToStep="goToStep"></review>
              </template>

              <template v-if="assetMainType === 'API'">
                <api-details :disabled="isEditingExistingDraft" ref="step2" :asset.sync="asset" :selectedPublishedAssetForApiCreation.sync="selectedPublishedAssetForApiCreation" :selectedPublishedFileForApiCreation.sync="selectedPublishedFileForApiCreation" :serviceType="serviceType" :apiCreationType.sync="apiCreationType" v-if="currentStep === 2"></api-details>
                <api-metadata ref="step3" :asset="selectedPublishedAssetForApiCreation" :additionalResourcesToUpload.sync="additionalResourcesToUpload" :serviceType="asset.spatialDataServiceType" v-if="currentStep === 3 && selectedPublishedAssetForApiCreation != null"></api-metadata>
                <metadata ref="step3" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-else-if="currentStep === 3 && selectedPublishedAssetForApiCreation == null"></metadata>
                <api-pricing ref="step4" :pricingModels.sync="asset.pricingModels" :selectedPricingModelForEditing.sync="selectedPricingModelForEditing" :serviceType="asset.spatialDataServiceType" v-if="currentStep === 4"></api-pricing>
                <contract ref="step5" :contractTemplateType.sync="asset.contractTemplateType" :contractTemplateKey.sync="asset.contractTemplateKey" :customContractToUpload.sync="customContractToUpload" :assetMainType="assetMainType" v-if="currentStep === 5"></contract>
                <payout ref="step6" :selectedPayoutMethod.sync="selectedPayoutMethod" v-if="currentStep === 6"></payout>
                <review ref="step7" :accessToFileType="getAccessToFileType" :vettingRequired.sync="asset.vettingRequired" :iprProtectionEnabled.sync="asset.iprProtectionEnabled" :errors="errors" :asset="{ ...selectedPublishedAssetForApiCreation, ...{ contractTemplateKey: asset.contractTemplateKey, pricingModels: asset.pricingModels, spatialDataServiceType: asset.spatialDataServiceType } }" v-if="currentStep == 7" @goToStep="goToStep"></review>
              </template>

              <template v-if="assetMainType === 'SENTINEL_HUB_OPEN_DATA'">
                <sentinel-hub-metadata ref="step2" :asset.sync="asset" :additionalResourcesToUpload.sync="additionalResourcesToUpload" v-if="currentStep === 2"></sentinel-hub-metadata>
              </template>

              <div class="dashboard__form__errors" v-if="uploading.errors.length">
                <ul>
                  <li v-for="error in uploading.errors" v-bind:key="`error${error.code}`">{{ error.description }}</li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
        <div>
          <div
            class="mt-xs-40 mr-xs-20 d-flex justify-content-end"
            v-if="asset.type === 'TABULAR' && currentStep === 2"
          >
            <div class="form-group-checkbox">
              <input type="checkbox" id="terms" v-model="asset.dataProfilingEnabled">
              <label for="terms">Compute automated metadata</label>
            </div>
          </div>
          <div class="dashboard__form__navbuttons">
            <button class="btn btn--std btn--blue" v-if="this.currentStep !== 1" @click.prevent="previousStep()">PREVIOUS</button>
            <button class="btn btn--std btn--blue" @click.prevent="nextStep()">
              {{ currentStep === totalSteps || (assetMainType === 'SENTINEL_HUB_OPEN_DATA' && currentStep === 2) || (assetMainType === 'OPEN' && currentStep === 5) ? 'confirm and submit for review' : 'NEXT' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard__form__uploading" v-if="uploading.status">
      <div class="dashboard__form__uploading__inner">
        <div class="dashboard__form__uploading__pbar">
          <span :style="{ width: uploading.percentage + '%' }"></span>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CatalogueItemCommand } from '@/model';
import CatalogueApi from '@/service/catalogue';
import DraftAssetApi from '@/service/draft';
import ContractApi from '@/service/provider-contract';
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
  CatalogueItem, EnumConformity, EnumDeliveryMethod, DraftApiFromAssetCommand, EnumDraftCommandType, DraftApiFromFileCommand, SentinelHubItemCommand, EnumResponsiblePartyRole,
} from '@/model/catalogue';
import { EnumAssetType, EnumAssetTypeCategory, EnumSpatialDataServiceType } from '@/model/enum';
import {
  AssetFileAdditionalResourceCommand,
  FileResourceCommand,
  UserFileResourceCommand,
  ExternalLinkCommand,
  Resource,
} from '@/model/asset';
import { EnumContractType } from '@/model/contract';
import store from '@/store';
import Type from '@/components/Assets/Create/Type.vue';
import Metadata from '@/components/Assets/Create/Metadata.vue';
import Contract from '@/components/Assets/Create/Contract.vue';
import Pricing from '@/components/Assets/Create/Pricing.vue';
import Delivery from '@/components/Assets/Create/Delivery.vue';
import Payout from '@/components/Assets/Create/Payout.vue';
import Review from '@/components/Assets/Create/Review.vue';
import SelectedAssets from '@/components/Assets/CreateBundle/SelectedAssets.vue';
import CollectionDetails from '@/components/Assets/CreateBundle/CollectionDetails.vue';
import OpenAssetMetadata from '@/components/Assets/CreateOpen/OpenAssetMetadata.vue';
import OpenAssetDelivery from '@/components/Assets/CreateOpen/OpenAssetDelivery.vue';
import License from '@/components/Assets/CreateOpen/License.vue';
import ApiDetails from '@/components/Assets/CreateServiceFromPublished/ApiDetails.vue';
import ApiPricing from '@/components/Assets/CreateServiceFromPublished/ApiPricing.vue';
import ApiMetadata from '@/components/Assets/CreateServiceFromPublished/ApiMetadata.vue';
import SentinelHubMetadata from '@/components/Assets/CreateSentinelHub/SentinelHubMetadata.vue';
import Modal from '@/components/Modal.vue';
import { EnumPricingModel } from '@/model/pricing-model';
import { Address } from '@/model/account';

Vue.use(VueCardFormat);

extend('required', required);
extend('email', email);
extend('regex', regex);

extend('credit_card', (value) => Vue.prototype.$cardFormat.validateCardNumber(value));
extend('credit_card_exp', (value) => Vue.prototype.$cardFormat.validateCardExpiry(value));
extend('credit_card_cvc', (value) => Vue.prototype.$cardFormat.validateCardCVC(value));

interface FileToUpload {
  isFileSelected: boolean;
  file: File;
  fileName: string;
  fileExtension: string;
  crs: string;
  encoding: string;
}

interface LinkToAsset {
  url: string;
  fileName: string;
  encoding: string;
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
    SelectedAssets,
    CollectionDetails,
    OpenAssetMetadata,
    OpenAssetDelivery,
    License,
    ApiDetails,
    ApiPricing,
    ApiMetadata,
    SentinelHubMetadata,
    Modal,
  },
})
export default class CreateAsset extends Vue {
  $refs!: {
    step1: InstanceType<typeof ValidationObserver>;
    step2: InstanceType<typeof ValidationObserver>;
    step3: InstanceType<typeof ValidationObserver>;
    step4: InstanceType<typeof ValidationObserver>;
    step5: InstanceType<typeof ValidationObserver>;
    step6: InstanceType<typeof ValidationObserver>;
    step7: InstanceType<typeof ValidationObserver>;
  };

  catalogueApi: CatalogueApi;

  draftAssetApi: DraftAssetApi;

  contractApi: ContractApi;

  modalToShow: string;

  isEditingExistingDraft: boolean;

  assetId: string; // if editing existing draft, the asset id (key) of draft asset

  asset: CatalogueItemCommand | SentinelHubItemCommand;

  assetMainType: EnumAssetTypeCategory | string; // Data File / API / Collection

  serviceType: null | EnumSpatialDataServiceType;

  selectedPricingModelForEditing: number | null;

  selectedPublishedAssetForApiCreation: CatalogueItem | null;

  selectedPayoutMethod: 'through_platform' | 'external_means' | 'credit_debit' | null;

  selectedPublishedFileForApiCreation: DraftApiFromFileCommand | null;

  selectedPublishedFileForDataFileCreation: UserFileResourceCommand | null;

  totalSteps = 7;

  currentStep = 1;

  customContractToUpload: File | null;

  additionalResourcesToUpload: { resourceCommand: AssetFileAdditionalResourceCommand; file: File }[];

  fileToUpload: FileToUpload;

  linkToAsset: LinkToAsset;

  uploading: any;

  apiCreationType: string | null;

  isPendingDefaultContractAcceptance: boolean;

  errors: any;

  uploadConfig: AxiosRequestConfig;

  constructor() {
    super();

    // TODO: do validation of filetype<->format before uploading file
    console.log('config', store.getters.getConfig);

    this.modalToShow = '';

    this.apiCreationType = '';

    this.customContractToUpload = null;

    this.additionalResourcesToUpload = [];

    this.fileToUpload = {
      isFileSelected: false,
      file: {} as File,
      fileName: '',
      fileExtension: '',
      crs: '',
      encoding: 'UTF-8',
    };

    this.linkToAsset = {
      url: '',
      fileName: '',
      encoding: 'UTF-8',
    };

    this.assetMainType = '' as EnumAssetTypeCategory;

    this.serviceType = null;

    this.selectedPricingModelForEditing = null;

    this.selectedPublishedAssetForApiCreation = null;

    this.selectedPublishedFileForApiCreation = null;

    this.selectedPublishedFileForDataFileCreation = null;

    this.assetId = '';

    this.asset = {} as CatalogueItemCommand;

    this.isEditingExistingDraft = false;

    this.selectedPayoutMethod = null;

    this.isPendingDefaultContractAcceptance = false;

    this.errors = [];

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
    this.contractApi = new ContractApi();

    this.uploadConfig = {
      onUploadProgress: (progressEvent: any): void => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          this.showUploadingProgress(Math.round((progressEvent.loaded * 100) / totalLength));
        }
      },
    };
  }

  /**
   * STEP 1 => Controll the asset main type
   */
  @Watch('assetMainType', { deep: true })
  onMaitTypeChange(assetMainType: string): void {
    // console.log('View: Type -> CreateAsset =', assetMainType);
    // console.log('this.asset : ', this.asset);
    console.info('STEP 1 => this.assetMainType: ', this.assetMainType, assetMainType);

    if (!this.isEditingExistingDraft) this.initAsset();
  }

  @Watch('apiCreationType')
  onApiCreationChange(value: string): void {
    console.log(value);
  }

  /**
   * STEP 2 -> A Control the API Creation type
   */

  @Watch('apiCreationType')
  creationtype(): void {
    console.log('STEP 2 A => this.apiCreationType', this.apiCreationType);
  }
  /**
   * STEP 2 -> B1 Control the published asset selection
   */

  @Watch('selectedPublishedAssetForApiCreation', { deep: true })
  onPublishedAssetChange(): void {
    // this.asset = value;
    console.log('STEP 2 B1 => this.selectedPublishedAssetForApiCreation: ', this.selectedPublishedAssetForApiCreation);
  }

  /**
   * STEP 2 -> B2 Control the file selection
   */

  @Watch('selectedPublishedFileForApiCreation', { deep: true })
  onFileApiChange(): void {
    console.log('STEP 2 B2 => this.selectedPublishedFileForApiCreation: ', this.selectedPublishedFileForApiCreation);
  }

  /**
   * STEP 2 -> C Control the file selection
   */

  @Watch('asset', { deep: true })
  onAssetChange(value: CatalogueItemCommand): void {
    this.serviceType = value.spatialDataServiceType;
    console.log('STEP 2 C => this.asset: ', this.asset);
  }

  /**
   * Step 6 Payout method
   */

  @Watch('selectedPayoutMethod')
  onChangePayoutMethod(value: 'through_platform' | 'external_means' | 'credit_debit' | null): void {
    console.log('STEP 6 => Payout method', value);
  }

  @Watch('selectedPublishedFileForDataFileCreation')
  onChangeSelectedPublishedFileForDataFileCreation(): void {
    console.log('FILE FROM TOPIO DRIVE DELIVERY => ', this.selectedPublishedFileForDataFileCreation);
  }

  created(): void {
    console.log('created');

    this.initAsset();

    this.assetId = this.$route.params.id ? this.$route.params.id : '';
    this.isEditingExistingDraft = !!this.assetId;

    if (this.isEditingExistingDraft) {
      this.loadExistingDraftAsset();
    }
  }

  initAsset(): void {
    if (this.assetMainType as string !== 'SENTINEL_HUB_OPEN_DATA') {
      this.asset = {
        abstract: '',
        additionalResources: [],
        conformity: EnumConformity.NOT_EVALUATED,
        conformityStandard: '',
        contractTemplateKey: '',
        contractTemplateType: this.assetMainType as string === 'OPEN' ? 'OPEN_DATASET' : EnumContractType.MASTER_CONTRACT,
        contractAnnexes: [],
        creationDate: '',
        dataProfilingEnabled: true,
        dateEnd: '',
        dateStart: '',
        deliveryMethod: this.assetMainType as string === 'OPEN' ? EnumDeliveryMethod.DIGITAL_PLATFORM : EnumDeliveryMethod.NONE,
        deliveryMethodOptions: {
          mediaType: 'CD-ROM',
          notes: '',
          numberOfItems: 1,
        },
        format: '',
        ingested: false,
        iprProtectionEnabled: false,
        keywords: [],
        language: '',
        license: '',
        lineage: '',
        metadataDate: '',
        metadataLanguage: '',
        metadataPointOfContactEmail: '',
        metadataPointOfContactName: '',
        openDataset: this.assetMainType as string === 'OPEN',
        parentId: '',
        pricingModels: this.assetMainType as string === 'OPEN' ? [{
          type: 'FREE',
          domainRestrictions: [],
          coverageRestrictionContinents: [],
          coverageRestrictionCountries: [],
          consumerRestrictionContinents: [],
          consumerRestrictionCountries: [],
        }] : [],
        publicAccessLimitations: '',
        publicationDate: '',
        publisherEmail: store.getters.getProfile?.provider?.current?.email || '',
        publisherName: store.getters.getProfile?.provider?.current?.name || '',
        referenceSystem: '4326',
        resourceLocator: '',
        responsibleParty: this.assetMainType as string === 'OPEN' ? [{
          address: '',
          email: 'hello@opertusmundi.eu',
          name: 'topio',
          organizationName: 'topio',
          phone: '',
          role: EnumResponsiblePartyRole.PUBLISHER,
          serviceHours: '',
        }, {
          address: '',
          email: '',
          name: '',
          organizationName: '',
          phone: '',
          role: '' as EnumResponsiblePartyRole,
          serviceHours: '',
        }] : [{
          address: store.getters.getProfile?.provider?.current?.headquartersAddress ? this.getAddressAsText(store.getters.getProfile.provider.current.headquartersAddress) : '',
          email: store.getters.getProfile?.provider?.current?.email || '',
          name: store.getters.getProfile?.provider?.current?.name || '',
          organizationName: store.getters.getProfile?.provider?.current?.name || '',
          phone: store.getters.getProfile?.provider?.current?.phone || '',
          role: EnumResponsiblePartyRole.PUBLISHER,
          serviceHours: '',
        }],
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
        type: this.assetMainType === 'COLLECTION' ? 'BUNDLE' : '' as EnumAssetType,
        userOnlyForVas: false,
        version: '',
        vettingRequired: false,
        geometry: null,
      } as CatalogueItemCommand;
    } else {
      this.asset = {
        abstract: '',
        additionalResources: [],
        conformity: EnumConformity.NOT_EVALUATED,
        conformityStandard: '',
        contractTemplateKey: '',
        contractTemplateType: EnumContractType.MASTER_CONTRACT,
        contractAnnexes: [],
        creationDate: '',
        dataProfilingEnabled: true,
        dateEnd: '',
        dateStart: '',
        deliveryMethod: EnumDeliveryMethod.DIGITAL_PROVIDER,
        extensions: {
          sentinelHub: {
            type: 'OPEN_DATA',
            open: true,
            collection: '',
          },
        },
        ingested: false,
        iprProtectionEnabled: false,
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
        // pricingModels: [],
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
        type: EnumAssetType.SENTINEL_HUB_OPEN_DATA,
        userOnlyForVas: false,
        version: '',
        vettingRequired: false,
        geometry: null,
      } as SentinelHubItemCommand;
    }
  }

  loadExistingDraftAsset(): void {
    this.draftAssetApi.findOne(this.assetId).then((assetResponse) => {
      console.log('asset id', this.assetId);
      console.log('asset', this.asset);
      console.log('asset resp', assetResponse);
      this.asset = { ...this.asset, ...assetResponse.result.command };
      console.log(this.assetMainType, 'ASSET MAIN TYPE');

      /* open dataset fix */
      if (this.asset.openDataset) {
        (this.asset as CatalogueItemCommand).pricingModels = [{
          type: EnumPricingModel.FREE,
          domainRestrictions: [],
          coverageRestrictionContinents: [],
          coverageRestrictionCountries: [],
          consumerRestrictionContinents: [],
          consumerRestrictionCountries: [],
        }];
        this.asset.contractTemplateType = EnumContractType.OPEN_DATASET;
      }
      /* */

      this.serviceType = assetResponse.result.serviceType ? assetResponse.result.serviceType : null;

      if (this.asset.type === EnumAssetType.SERVICE) {
        console.log('type: service');
        console.log('aa', this.asset);
        console.log('id', this.asset.parentDataSourceId);
        // if (!this.asset.parentDataSourceId) throw new Error('unknown parent data source id');
        if (this.asset.parentDataSourceId) {
          this.catalogueApi.findOne(this.asset.parentDataSourceId).then((parentAssetResponse) => {
            console.log('parent id', this.asset.parentDataSourceId, parentAssetResponse);
            this.selectedPublishedAssetForApiCreation = parentAssetResponse.result;
          });
        }
      }

      // todo (Enums may have to be fixed to include NetCDF)
      if (['VECTOR', 'RASTER', 'NETCDF', 'TABULAR'].includes(this.asset.type?.toUpperCase() as string)) {
        // todo: add 'OPEN' to enum
        this.assetMainType = this.asset.openDataset ? 'OPEN' as any : EnumAssetTypeCategory.DATA_FILE;
      } else if ((this.asset.type as string) === EnumAssetType.SERVICE) {
        this.assetMainType = EnumAssetTypeCategory.API;
        console.log('ΕΔΩ');
      } else if (this.asset.type as string === 'SENTINEL_HUB_OPEN_DATA') {
        this.assetMainType = 'SENTINEL_HUB_OPEN_DATA';
      } else if (this.asset.type === 'BUNDLE') {
        this.assetMainType = 'COLLECTION';
      } else {
        // todo
        console.log('other main type');
      }
    });
  }

  /* is called on submission to handle cases where an asset was saved as draft but meanwhile, the selected contract template was deactivated / removed */
  async isSelectedContractAvailable(): Promise<boolean> {
    const { contractTemplateKey } = this.asset;

    const contractResponse = await this.contractApi.findOneTemplate(contractTemplateKey);

    return contractResponse.success;
  }

  async isSelectedContractAccepted(): Promise<boolean> {
    const { contractTemplateKey } = this.asset;

    const contractResponse = await this.contractApi.findOneTemplate(contractTemplateKey);
    const contract = contractResponse.result;

    if (contract.defaultContract && !contract.defaultContractAccepted) return false;
    return true;
  }

  async pollDefaultContractAcceptance(): Promise<void> {
    const pollingTime = 1000;

    const { contractTemplateKey } = this.asset;

    const contractResponse = await this.contractApi.findOneTemplate(contractTemplateKey);
    const contract = contractResponse.result;

    if (contract.defaultContractAccepted) {
      this.isPendingDefaultContractAcceptance = false;
      this.currentStep += 1;
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollingTime));
    this.pollDefaultContractAcceptance();
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  previousStep(): void {
    if (this.currentStep <= 1) return;
    this.currentStep -= 1;
  }

  nextStep(): void {
    // console.log(JSON.stringify(this.asset, null, 4));
    // console.group('asset: ', this.asset);
    // console.log(Object.keys(this.asset));
    // console.dir(this.selectedPublishedAssetForApiCreation, { depth: null, colors: true });

    // console.log('uploadFile?', this.fileToUpload.isFileSelected);
    this.$refs[`step${this.currentStep}`].$refs.refObserver.validate().then(async (isValid) => {
      if (isValid) {
        if (this.assetMainType as string === 'SENTINEL_HUB_OPEN_DATA' && this.currentStep === 2) {
          this.submitSentinelHubForm();
          return;
        }
        if (this.assetMainType as string === 'OPEN' && this.currentStep === 5) {
          this.submitDataFileForm();
          return;
        }
        if (this.currentStep === this.totalSteps) {
          console.log(this.asset);
          if (this.assetMainType === EnumAssetTypeCategory.API) {
            this.submitApiForm();
            console.log('submit form for service');
          } else if (this.assetMainType === EnumAssetTypeCategory.COLLECTION) {
            this.submitBundleForm();
          } else {
            this.submitDataFileForm();
          }
        } else {
          /* check if this service type is already created by the selected asset */
          if (this.currentStep === 2 && this.assetMainType === 'API' && this.selectedPublishedAssetForApiCreation) {
            store.commit('setLoading', true);

            const relatedAssetsResponse = await this.catalogueApi.findRelated(this.selectedPublishedAssetForApiCreation.id);
            const relatedAssetsServiceTypes = relatedAssetsResponse.result.items.map((x) => x.spatialDataServiceType).filter((x) => x);

            if (relatedAssetsServiceTypes.includes(this.serviceType)) {
              store.commit('setLoading', false);
              this.modalToShow = 'serviceAlreadyCreated';
              return;
            }
            store.commit('setLoading', false);
          }

          /* check contract */
          if (this.currentStep === 5 && !this.asset.openDataset) {
            store.commit('setLoading', true);
            if (!(await this.isSelectedContractAccepted())) {
              this.isPendingDefaultContractAcceptance = true;
              this.pollDefaultContractAcceptance();
              store.commit('setLoading', false);
              return;
            }
            store.commit('setLoading', false);
          }

          this.currentStep += 1;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    });
    console.log('ASSET=> ', this.asset);
    console.group('STEP: ', this.currentStep);
    console.log('STEP 1 => this.assetMainType: ', this.assetMainType);
    console.log('STEP 2 A => this.apiCreationType', this.apiCreationType);
    // eslint-disable-next-line
    console.log('STEP 2 B1 => this.selectedPublishedAssetForApiCreation: ', this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation!.title : 'null');
    console.log('STEP 2 B2 => this.selectedPublishedFileForApiCreation: ', this.selectedPublishedFileForApiCreation);
    console.log('STEP 2 C => this.asset: ', this.asset.spatialDataServiceType);
  }

  isButtonSaveDraftShown(): boolean {
    if (!this.assetMainType) return false;

    if (this.assetMainType === EnumAssetTypeCategory.DATA_FILE) {
      if (this.selectedPricingModelForEditing !== null) return false;
      if (!this.asset.title || !this.asset.type || !this.asset.abstract || !this.asset.version) return false;
    }

    // todo: not checked
    if (this.assetMainType as string === 'OPEN') {
      if (!this.asset.title || !this.asset.type || !this.asset.abstract || !this.asset.version) return false;
    }

    if (this.assetMainType === EnumAssetTypeCategory.API && this.apiCreationType !== 'TOPIO_DRIVE') {
      console.log('isButtonSaveDraftShown: is API', this.apiCreationType);
      if (!this.selectedPublishedAssetForApiCreation) return false;
      if (!this.asset.spatialDataServiceType || ![EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType)) return false;
    }

    if (this.apiCreationType === 'TOPIO_DRIVE') {
      console.log('is here');
      if (!this.selectedPublishedFileForApiCreation) return false;
      if (!this.asset.title || !this.asset.type || !this.asset.abstract || !this.asset.version) return false;
    }

    // todo: add 'SENTINEL_HUB_OPEN_DATA' in Enumeration
    if (this.assetMainType === EnumAssetTypeCategory.COLLECTION || this.assetMainType as string === 'SENTINEL_HUB_OPEN_DATA') return false;

    return true;
  }

  onRemoveResource(id: string): void {
    this.asset.resources = this.asset.resources.filter((x) => x.id !== id);
  }

  onSaveDraft(): void {
    if (this.assetMainType === EnumAssetTypeCategory.DATA_FILE) {
      if (this.fileToUpload.isFileSelected || this.linkToAsset.url) {
        this.modalToShow = 'saveDraftFileAlert';
        return;
      }
      this.submitDataFileForm(true);
    }
    if (this.assetMainType === EnumAssetTypeCategory.API) {
      this.submitApiForm(true);
      console.log('IS API BRO!!!! -> SUBMIT FORM SERVICE');
    }
  }

  onCancelDraft(): void {
    this.$router.push('/dashboard/assets');
  }

  get getAccessToFileType(): string {
    if (this.fileToUpload.isFileSelected) return 'Direct upload';
    if (this.selectedPublishedFileForApiCreation || this.selectedPublishedFileForDataFileCreation) return 'topio Drive';
    return '';
  }

  isSelectedFormatCompatibleWithFileExtension(): boolean {
    const fileTypeInfo = store.getters.getConfig.configuration.asset.fileTypes.find((x) => x.format.toUpperCase() === (this.asset as CatalogueItemCommand).format.toUpperCase());
    const acceptedExtensions = fileTypeInfo.bundleSupported && Array.isArray(fileTypeInfo.bundleExtensions) ? fileTypeInfo.extensions.concat(fileTypeInfo.bundleExtensions) : fileTypeInfo.extensions;
    if (acceptedExtensions.includes(this.fileToUpload.fileExtension)) return true;
    return false;
  }

  getAddressAsText(address: Address): string {
    return `${address.line1 ? `${address.line1}, ` : ''}${address.line2 ? `${address.line2}, ` : ''}${address.city ? `${address.city}, ` : ''}${address.region ? `${address.region}, ` : ''}${address.postalCode ? `${address.postalCode}, ` : ''}${address.country ? `${address.country}, ` : ''}`;
  }

  async createDraft(): Promise<AssetDraft> {
    console.log(this.asset, 'ASSET ON CREATE');
    const draftAssetResponse = await this.draftAssetApi.create(this.asset as CatalogueItemCommand);

    if (draftAssetResponse.success) return draftAssetResponse.result;

    console.log('err => create draft', draftAssetResponse);
    this.showUploadingMessage(true, 'An error occurred');
    throw new Error('error');
  }

  async saveDraftAfterEditingExistingDraft(): Promise<AssetDraft> {
    const draftAssetResponse = await this.draftAssetApi.update(this.assetId, this.asset as CatalogueItemCommand);
    if (draftAssetResponse.success) return draftAssetResponse.result;

    console.log('err', draftAssetResponse);
    this.showUploadingMessage(true, 'An error occurred');
    throw new Error('error');
  }

  async saveDraftApiFromTopioDrive(): Promise<AssetDraft> {
    const serviceType = this.asset.spatialDataServiceType && [EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType) ? this.asset.spatialDataServiceType : '';
    const draftApi: DraftApiFromFileCommand = {
      type: EnumDraftCommandType.FILE,
      title: this.asset.title as string,
      version: this.asset.version,
      serviceType: serviceType as 'WMS' | 'WFS' | 'DATA_API',
      path: this.selectedPublishedFileForApiCreation ? this.selectedPublishedFileForApiCreation.path : '',
      format: (this.asset as CatalogueItemCommand).format,
    };
    console.log(draftApi, 'draft API for file');
    const draftAssetResponse = await this.draftAssetApi.createApi(draftApi);
    console.log(draftAssetResponse);

    if (draftAssetResponse.success) return draftAssetResponse.result;

    console.log('err', draftAssetResponse);
    this.showUploadingMessage(true, 'An error occurred');
    throw new Error('error');
  }

  async saveDraftApiFromPublishedAsset(): Promise<AssetDraft> {
    const serviceType = this.asset.spatialDataServiceType && [EnumSpatialDataServiceType.WMS, EnumSpatialDataServiceType.WFS, EnumSpatialDataServiceType.DATA_API].includes(this.asset.spatialDataServiceType) ? this.asset.spatialDataServiceType : '';
    const draftApi: DraftApiFromAssetCommand = {
      type: EnumDraftCommandType.ASSET,
      pid: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.id : '',
      title: this.selectedPublishedAssetForApiCreation ? `${this.selectedPublishedAssetForApiCreation.title} (${serviceType})` : '',
      version: this.selectedPublishedAssetForApiCreation ? this.selectedPublishedAssetForApiCreation.version : '',
      serviceType: serviceType as 'WMS' | 'WFS' | 'DATA_API',
    };
    console.log(draftApi, 'draft API');
    const draftAssetResponse = await this.draftAssetApi.createApi(draftApi);
    console.log(draftAssetResponse);

    if (draftAssetResponse.success) return draftAssetResponse.result;

    console.log('err', draftAssetResponse);
    this.showUploadingMessage(true, 'An error occurred');
    throw new Error('error');
  }

  async submitAsset(draftAssetKey: string): Promise<void> {
    const submitResponse = await this.draftAssetApi.updateAndSubmit(draftAssetKey, this.asset as CatalogueItemCommand);

    if (submitResponse.success) {
      this.showUploadingMessage(true, 'Asset created!');
    } else {
      // Passing error response to review component as prop
      this.errors = submitResponse.messages;
      console.log('error submitting service', submitResponse.messages);
      // this.showUploadingMessage(true, 'An error occurred');
    }
  }

  async uploadCustomContract(draftAssetKey: string, config: AxiosRequestConfig): Promise<CatalogueItemCommand> {
    this.showUploadingMessage(false, 'Your contract is being uploaded');

    if (!this.customContractToUpload) return {} as CatalogueItemCommand;
    const uploadContractResponse = await this.draftAssetApi.uploadContract(draftAssetKey, this.customContractToUpload, false, config);

    if (!uploadContractResponse.success) {
      console.log('err', uploadContractResponse);
      this.showUploadingMessage(true, 'An error occurred');
      throw new Error('error');
    }

    const asset = uploadContractResponse.result.command;
    return asset;
  }

  async uploadAdditionalResources(draftAssetKey: string, config: AxiosRequestConfig): Promise<CatalogueItemCommand> {
    this.showUploadingMessage(false, 'Your additional metadata resources are being uploaded');

    // add suffix (n) to files with same name
    this.additionalResourcesToUpload.reduceRight((_, x, i) => {
      const numSuffix = this.additionalResourcesToUpload.filter((y, j) => y.file.name === x.file.name && j < i).length;

      this.additionalResourcesToUpload[i] = numSuffix ? {
        ...x,
        resourceCommand: {
          ...x.resourceCommand,
          fileName: x.file.name.split('.').map((y, j) => (j === x.file.name.split('.').length - 2 ? `${y}(${numSuffix})` : y)).join('.'),
        },
      } : x;

      return _;
    }, null);

    let asset: CatalogueItemCommand = {} as CatalogueItemCommand;

    for (let i = 0; i < this.additionalResourcesToUpload.length; i += 1) {
      // eslint-disable-next-line
      const uploadAdditionalResourceResponse = await this.draftAssetApi.uploadAdditionalResource(draftAssetKey, this.additionalResourcesToUpload[i].file, this.additionalResourcesToUpload[i].resourceCommand, config);

      if (!uploadAdditionalResourceResponse.success) {
        console.log('err', uploadAdditionalResourceResponse);
        this.showUploadingMessage(true, 'An error occurred');
        throw new Error('error');
      }

      asset = uploadAdditionalResourceResponse.result.command;
    }

    return asset;
  }

  async uploadResource(draftAssetKey: string, config: AxiosRequestConfig): Promise<CatalogueItemCommand> {
    this.showUploadingMessage(false, 'Your resource is being uploaded');

    // todo: currently, file CRS is ignored (when support for multiple resources is implemented, we should consider adding a CRS for each resource)
    const fileInfo: FileResourceCommand = {
      fileName: this.fileToUpload.fileName,
      format: (this.asset as CatalogueItemCommand).format,
      ...(this.fileToUpload.encoding && { encoding: this.fileToUpload.encoding }),
      crs: this.asset.referenceSystem,
    };

    const uploadResourceResponse = await this.draftAssetApi.uploadResource(draftAssetKey, this.fileToUpload.file, fileInfo, config);

    if (!uploadResourceResponse.success) {
      console.log('err', uploadResourceResponse);
      this.showUploadingMessage(true, 'An error occurred');
      throw new Error('error');
    }

    const asset = uploadResourceResponse.result.command;
    return asset;
  }

  async addExternalLink(draftAssetKey: string, linkData: LinkToAsset, asset: CatalogueItemCommand): Promise<CatalogueItemCommand> {
    this.showUploadingMessage(false, 'Your resource is being added');

    const data: ExternalLinkCommand = {
      crs: asset.referenceSystem,
      encoding: linkData.encoding,
      fileName: linkData.fileName,
      format: asset.format,
      url: linkData.url,
    };

    const externalLinkResponse = await this.draftAssetApi.addExternalLink(draftAssetKey, data);

    if (!externalLinkResponse.success) {
      console.log('err', externalLinkResponse);
      this.showUploadingMessage(true, 'An error occurred');
      throw new Error('error');
    }

    return externalLinkResponse.result.command;
  }

  async addResourceFromFileSystem(draftKey: string): Promise<CatalogueItemCommand> {
    this.showUploadingMessage(false, 'Your resource from topio drive is being uploaded');

    const filetFromTopioDrive: UserFileResourceCommand = {
      path: this.selectedPublishedFileForDataFileCreation?.path as string,
      format: (this.asset as CatalogueItemCommand).format,
      encoding: this.selectedPublishedFileForDataFileCreation?.encoding as string,
      crs: this.asset.referenceSystem,
    };

    const addResourceFromFileSystemResponse = await this.draftAssetApi.addResourceFromFileSystem(draftKey, filetFromTopioDrive);

    if (!addResourceFromFileSystemResponse.success) {
      console.log('err', addResourceFromFileSystemResponse);
      this.showUploadingMessage(true, 'An error occurred');
      throw new Error('error');
    }

    const asset = addResourceFromFileSystemResponse.result.command;
    return asset;
  }

  async submitBundleForm(): Promise<void> {
    /* */
    if (this.asset.type === 'BUNDLE') {
      (this.asset as CatalogueItemCommand).deliveryMethod = EnumDeliveryMethod.DIGITAL_PLATFORM;
      if ('deliveryMethodOptions' in this.asset) delete this.asset.deliveryMethodOptions;
    }
    /* */

    /* fix format of resources for collections */
    if (this.asset.type === 'BUNDLE') this.asset.resources = this.asset.resources.map((x) => ({ id: x.id, type: 'ASSET' })) as unknown as Resource[];
    /* */

    if (this.isEditingExistingDraft) {
      const key = this.$route.params.id;
      this.submitAsset(key);
      return;
    }

    const draft = await this.createDraft();
    this.submitAsset(draft.key);
  }

  async submitSentinelHubForm(): Promise<void> {
    this.showUploadingMessage(false, 'Creating Sentinel Hub Asset...');

    // TODO: IMPORTANT, contract key is hardcoded
    const asset = {
      ...this.asset,
      contractTemplateKey: '2b0fec49-eac4-4cd3-a92b-204cdfc0bbaf',
    } as SentinelHubItemCommand;

    console.log('SH ASSET', asset);

    let assetKey: string | null = null;
    let draftCommand: SentinelHubItemCommand | null = null;
    try {
      const response = await this.draftAssetApi.create(asset);

      if (response.success) {
        console.log('YEAP!');
        assetKey = response.result.key;
        draftCommand = response.result.command;
      } else {
        console.log('err', response);
        this.showUploadingMessage(true, 'An error occurred');
        return;
      }
    } catch (err) {
      console.log('err', err);
      this.showUploadingMessage(true, 'An error occurred');
      return;
    }

    try {
      const response = await this.draftAssetApi.updateAndSubmit(assetKey, draftCommand);

      if (response.success) {
        console.log('YEAP2');
      } else {
        console.log('err', response);
        this.showUploadingMessage(true, 'An error occurred');
        return;
      }
    } catch (err) {
      console.log('err', err);
      this.showUploadingMessage(true, 'An error occurred');
      return;
    }

    this.showUploadingMessage(true, 'Sentinel Hub Asset is created!');
  }

  async submitApiForm(isDraft = false): Promise<void> {
    /* CHECK IF CONTRACT AVAILABLE */
    store.commit('setLoading', true);
    if (!(await this.isSelectedContractAvailable())) {
      this.modalToShow = 'contractNotAvailable';
      this.currentStep = 5;
      store.commit('setLoading', false);
      return;
    }
    store.commit('setLoading', false);
    /* */

    try {
      let draftAsset: AssetDraft = {} as AssetDraft;

      if (this.isEditingExistingDraft) {
        draftAsset = await this.saveDraftAfterEditingExistingDraft();
      } else {
        if (this.apiCreationType === 'TOPIO_DRIVE') {
          draftAsset = await this.saveDraftApiFromTopioDrive();
        }
        if (this.apiCreationType === 'PUBLISHED_ASSET') {
          draftAsset = await this.saveDraftApiFromPublishedAsset();
        }
      }

      if (isDraft) {
        this.showUploadingMessage(true, 'Draft saved!');
        return;
      }

      // bug (todo: important)
      if (this.customContractToUpload) this.asset = await this.uploadCustomContract(draftAsset.key, this.uploadConfig);

      this.asset = {
        ...this.asset,
        deliveryMethod: EnumDeliveryMethod.DIGITAL_PLATFORM,
        type: draftAsset.command.type,
        resources: draftAsset.command.resources,
        additionalResources: draftAsset.command.additionalResources,
      };

      // eslint-disable-next-line
      if (this.asset.type === EnumAssetType.SERVICE) delete this.asset['deliveryMethodOptions'];

      await this.submitAsset(draftAsset.key);
    } catch (err) {
      console.error((err as any).message);
      this.showUploadingMessage(true, 'An error occurred');
    }
  }

  async submitDataFileForm(isDraft = false): Promise<void> {
    /* CHECK IF CONTRACT AVAILABLE */
    if (!this.asset.openDataset) {
      store.commit('setLoading', true);
      if (!(await this.isSelectedContractAvailable())) {
        this.modalToShow = 'contractNotAvailable';
        this.currentStep = 5;
        store.commit('setLoading', false);
        return;
      }
      store.commit('setLoading', false);
    }
    /* */

    // fix open dataset
    if (this.assetMainType as string === 'OPEN') {
      this.asset = {
        ...this.asset,
        // remove empty responsible parties
        responsibleParty: this.asset.responsibleParty ? this.asset.responsibleParty.filter((x) => x.role) : null,
        deliveryMethod: EnumDeliveryMethod.DIGITAL_PLATFORM,
        // contractTemplateKey: '',
      };
    }

    // remove deliveryMethodOptions for non-physical/digital provider
    if (![EnumDeliveryMethod.PHYSICAL_PROVIDER, EnumDeliveryMethod.DIGITAL_PROVIDER].includes((this.asset as CatalogueItemCommand).deliveryMethod)) delete (this.asset as CatalogueItemCommand).deliveryMethodOptions;
    // remove specific fields of deliveryMethodOptions if digital provider
    if ((this.asset as CatalogueItemCommand).deliveryMethod === EnumDeliveryMethod.DIGITAL_PROVIDER) {
      /* eslint-disable */
      if ('deliveryMethodOptions' in this.asset) delete (this.asset as CatalogueItemCommand).deliveryMethodOptions!.mediaType;
      if ('deliveryMethodOptions' in this.asset) delete (this.asset as CatalogueItemCommand).deliveryMethodOptions!.numberOfItems;
      /* eslint-enable */
    }

    /* if resource is URL, remove previous URLs */
    if (this.linkToAsset.url && this.linkToAsset.fileName && this.asset.resources.length) this.asset.resources = [];
    /* */

    console.log('DATA FILE SUBMISSION =>');
    console.log(this.fileToUpload.isFileSelected, 'IS FILE SELECTED');
    try {
      this.modalToShow = '';

      let draftAsset: AssetDraft;

      if (!isDraft && this.fileToUpload.isFileSelected) {
        if (!this.isSelectedFormatCompatibleWithFileExtension()) {
          // TODO: make it a modal
          // eslint-disable-next-line
          alert('format-extension mismatch (not compatible)');
          return;
        }
      }

      if (this.isEditingExistingDraft) {
        console.log('EDITING DRAFT');
        draftAsset = await this.saveDraftAfterEditingExistingDraft();
      } else {
        console.log('GO TO CREATE');
        draftAsset = await this.createDraft();
        console.log(draftAsset, 'draft asset => go to create');
      }
      this.asset = draftAsset.command;

      if (isDraft) {
        this.showUploadingMessage(true, 'Draft saved!');
        return;
      }

      if (this.customContractToUpload) this.asset = await this.uploadCustomContract(draftAsset.key, this.uploadConfig);

      if (this.additionalResourcesToUpload.length) this.asset = await this.uploadAdditionalResources(draftAsset.key, this.uploadConfig);

      if (this.fileToUpload.isFileSelected) this.asset = await this.uploadResource(draftAsset.key, this.uploadConfig);

      if (this.linkToAsset.url && this.linkToAsset.fileName) this.asset = await this.addExternalLink(draftAsset.key, this.linkToAsset, this.asset as CatalogueItemCommand);

      if (this.selectedPublishedFileForDataFileCreation?.path) this.asset = await this.addResourceFromFileSystem(draftAsset.key);

      console.log('dak', draftAsset.key);
      await this.submitAsset(draftAsset.key);
      console.log(this.asset, 'ON TYEY SUBMISSION');
    } catch (err) {
      console.error((err as any).message);

      this.showUploadingMessage(true, 'An error occurred');
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
@import '@/assets/styles/_forms.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';

.card {
  padding: 30px;
  background: #fff;
  letter-spacing: 0.06em;
  font-size: 0.8em;
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
