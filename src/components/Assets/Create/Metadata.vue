<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">

      <div class="row">
        <div class="col-md-7">
          <div class="dashboard__form__step__title">
            <h3>Add asset metadata</h3>
            <p>Fill in your asset metadata. If you already have compatible metadata, please upload them. You can still edit them. <br>All metadata will be available to prospective clients under a CC-BY-NC 4.0 license to facilitate asset discovery from consumers.</p>
          </div>

          <!-- MODALS -->
          <modal :withSlots="true" :show="modalToShow == 'uploadAdditionalResources'" @dismiss="modalToShow = ''" :modalId="'uploadAdditionalResources'">
            <template v-slot:body>
              <h1>Upload files</h1>

              <div v-for="fileInput in numberOfAdditionalResourcesFiles" :key="fileInput" class="form-group mt-sm-20">
                <input class="form-group__text input-additional-resource-file" type="file">
                <input class="form-group__text input-additional-resource-comments" type="text" placeholder="add comments">
              </div>

              <button class="btn--std btn--outlineblue" @click="numberOfAdditionalResourcesFiles++">+ add file</button>
            </template>

            <template v-slot:footer>
              <button class="btn--std btn--blue ml-xs-20" @click="onSubmitAdditionalResourcesFiles">submit files</button>
            </template>
          </modal>
          <!-- END OF MODALS -->

          <validation-provider v-slot="{ errors }" name="Title" rules="required">
          <div class="form-group">
            <label for="metadata_title">Title *</label>
            <input type="text" class="form-group__text" name="metadata_title" id="metadata_title" v-model="assetLocal.title">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type" rules="required">
            <div class="form-group">
              <label for="multiselect_type">Type *</label>
              <multiselect id="multiselect_type" v-model="assetLocal.type" :options="menusData.assetTypes" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider name="Abstract">
            <div class="form-group">
              <label for="">Abstract</label>
              <textarea v-model="assetLocal.abstract" placeholder="Short asset description"></textarea>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type" rules="required">
            <div class="form-group">
              <label for="multiselect_type">Format *</label>
              <multiselect :disabled="!asset.type" id="multiselect_type" v-model="assetLocal.format" :options="menusData.availableFormats" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Language">
          <div class="form-group">
            <label for="metadata_language">Language</label>
            <input type="text" class="form-group__text" name="metadata_language" id="metadata_language" v-model="assetLocal.language">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Editor's name">
            <div class="form-group">
              <label for="editor">Editor</label>
              <input type="text" name="publisherName" class="form-group__text" id="" v-model="assetLocal.publisherName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Editor's email" rules="email">
            <div class="form-group">
              <label for="">Editor’s email</label>
              <input type="text" class="form-group__text" id="" name="publisherEmail" v-model="assetLocal.publisherEmail">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Maintenance manager name">
            <div class="form-group">
              <label for="">Maintenance manager</label>
              <input type="text" class="form-group__text" id="" name="metadataPointOfContactName" v-model="assetLocal.metadataPointOfContactName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Maintenance manager’s email" rules="email">
            <div class="form-group">
              <label for="">Maintenance manager’s email</label>
              <input type="text" class="form-group__text" id="" name="metadataPointOfContactEmail" v-model="assetLocal.metadataPointOfContactEmail">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Version" rules="required">
            <div class="form-group">
              <label for="">Version *</label>
              <input type="text" class="form-group__text" id="" name="version" v-model="assetLocal.version">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Metadata language">
            <div class="form-group">
              <label for="">Metadata language</label>
              <input type="text" class="form-group__text" name="metadataLanguage" id="" v-model="assetLocal.metadataLanguage">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>

          <validation-provider name="Date start">
            <div class="form-group">
              <label for="">Date start (of resource temporal extent)</label>
              <datepicker input-class="form-group__text" :value="assetLocal.dateStart" @input="assetLocal.dateStart = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider name="Date end">
            <div class="form-group">
              <label for="">Date end (of resource temporal extent)</label>
              <datepicker input-class="form-group__text" :value="assetLocal.dateEnd" @input="assetLocal.dateEnd = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider name="Creation date">
            <div class="form-group">
              <label for="">Creation date</label>
              <datepicker input-class="form-group__text" :value="assetLocal.creationDate" @input="assetLocal.creationDate = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider name="Publication date">
            <div class="form-group">
              <label for="">Publication date</label>
              <datepicker input-class="form-group__text" :value="assetLocal.publicationDate" @input="assetLocal.publicationDate = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider name="Revision date">
            <div class="form-group">
              <label for="">Revision date</label>
              <datepicker input-class="form-group__text" :value="assetLocal.revisionDate" @input="assetLocal.revisionDate = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider name="Metadata date">
            <div class="form-group">
              <label for="">Metadata date</label>
              <datepicker input-class="form-group__text" :value="assetLocal.metadataDate" @input="assetLocal.metadataDate = formatDate($event)"></datepicker>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Topic">
            <div class="form-group">
              <label for="multiselect_topic">Topic</label>
              <multiselect id="multiselect_topic" v-model="assetLocal.topicCategory" :options="getTopicCategories()" :multiple="true" :close-on-select="true" :show-labels="false" placeholder="Select topic(s)"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Suitable For">
            <div class="form-group">
              <label for="multiselect_suitablefor">Suitable for</label>
              <multiselect id="multiselect_suitablefor" v-model="assetLocal.suitableFor" tag-placeholder="Press enter to add a category" :options="assetLocal.suitableFor" :multiple="true" :taggable="true" @tag="(x) => assetLocal.suitableFor.push(x)" :close-on-select="false" :show-labels="false" placeholder="Type a category"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Keywords">
            <div class="form-group">
              <label for="multiselect_keywords">Keywords</label>
              <multiselect id="multiselect_keywords" :value="keywordsForDisplay" :options="assetLocal.keywords.map((x) => x.keyword)" tag-placeholder="Press enter to add a keyword" :multiple="true" :taggable="true" @tag="(x) => onAddKeyword(x)" :close-on-select="false" :show-labels="false" placeholder="Type a keyword"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Scales">
            <div class="form-group">
              <label for="multiselect_scales">Scales</label>
              <multiselect id="multiselect_scales" :value="scalesForDisplay" :options="assetLocal.scales.map((x) => x.scale)" tag-placeholder="Press enter to add a scale" :multiple="true" :taggable="true" @tag="(x) => onAddScale(x)" @remove="(x) => onRemoveScale(x)" :close-on-select="false" :show-labels="false" placeholder="Type a scale number"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type">
            <div class="form-group">
              <label for="multiselect_epsg">Reference system</label>
              <multiselect id="multiselect_epsg" @input="onEpsgSelection($event)" v-model="selectedEpsgLabel" :options="menusData.epsgLabels" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select reference system"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <div class="d-flex align-items-center form-group" v-if="assetLocal.type === 'VECTOR'">
            <input type="checkbox" id="ingested" v-model="assetLocal.ingested" class="mr-xs-10 mb-xs-10">
            <label for="ingested">Ingested <small>Import into PostGIS Database to publish using WMS/WFS</small></label>
          </div>
        </div>
        <div class="col-md-5">
          <div class="dashboard__form__step__title">
            <h3>Additional Resources</h3>
            <p>Provide any additional files for the documentation of your asset.</p>

            <div class="form-group mt-xs-20">
              <label class="control control-radio">
                Upload files
                <input type="radio" name="asset_type" v-model="additionalResourcesOption" value="upload_files" />
                <div class="control_indicator"></div>
              </label>
              <div class="mt-xs-10 mb-xs-20 ml-xs-40 d-flex flex-column" v-if="additionalResourcesOption === 'upload_files'">
                <span v-for="(resource, i) in additionalResourcesToUploadLocal" :key="i" class="mb-xs-10">{{ resource.resourceCommand.fileName }}</span>
                <div><button class="btn btn--std btn--dark" @click="modalToShow = 'uploadAdditionalResources'">UPLOAD FILE</button></div>
              </div>
              <label class="control control-radio">
                External link
                <input type="radio" name="asset_type" v-model="additionalResourcesOption" value="external_link" />
                <div class="control_indicator"></div>
              </label>
              <div v-if="additionalResourcesOption === 'external_link'" class="form-group ml-xs-40">
                <label for="additional_resources_link">Add a link</label>
                <input id="additional_resources_link" type="text" class="form-group__text" placeholder="https://" v-model="additionalUriResource.uri">
                <label for="additional_resources_link_text">Displayed text for URI</label>
                <textarea id="additional_resources_link_text" type="text" class="form-group__text" :disabled="!additionalUriResource.uri" v-model="additionalUriResource.text"></textarea>
              </div>
            </div>
          </div>
        </div>
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
import SpatialApi from '@/service/spatial';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import Modal from '@/components/Modal.vue';
import store from '@/store';
import { CatalogueItemCommand } from '@/model';
import { EnumTopicCategory } from '@/model/catalogue';
import { AssetFileAdditionalResourceCommand, AssetUriAdditionalResource, EnumAssetAdditionalResource } from '@/model/asset';
import moment from 'moment';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
    Datepicker,
    Modal,
  },
})
export default class Metadata extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  @Prop({ required: true }) private additionalResourcesToUpload!: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  spatialApi: SpatialApi;

  assetLocal: CatalogueItemCommand;

  additionalResourcesToUploadLocal: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  modalToShow: string;

  numberOfAdditionalResourcesFiles: number;

  additionalResourcesOption: string;

  additionalUriResource: AssetUriAdditionalResource;

  scalesForDisplay: string[];

  keywordsForDisplay: string[];

  menusData: {
    assetTypes: string[],
    availableFormats: string[],
    epsgLabels: string[],
  }

  epsgList: { code: string, name: string }[];

  selectedEpsgLabel: string | null;

  // TODO: currently, URIs are stored in asset.additionalResources and FILES are uploaded as additional resources on asset submit

  constructor() {
    super();

    this.spatialApi = new SpatialApi();

    this.assetLocal = this.asset;

    this.additionalResourcesToUploadLocal = this.additionalResourcesToUpload;

    this.modalToShow = '';

    this.numberOfAdditionalResourcesFiles = 1;

    this.additionalResourcesOption = '';

    if (this.assetLocal.additionalResources.length && this.assetLocal.additionalResources[0].type === EnumAssetAdditionalResource.URI) {
      const [uriResource] = this.assetLocal.additionalResources;
      this.additionalUriResource = uriResource;
      this.additionalResourcesOption = 'external_link';
    } else {
      this.additionalUriResource = {
        uri: '',
        text: '',
        type: EnumAssetAdditionalResource.URI,
      };
    }

    this.scalesForDisplay = this.assetLocal.scales.map((x) => x.description);

    this.keywordsForDisplay = this.assetLocal.keywords.map((x) => x.keyword);

    this.menusData = { assetTypes: [], availableFormats: [], epsgLabels: [] };

    this.epsgList = [];

    this.selectedEpsgLabel = null;

    this.menusData.assetTypes = [...new Set(store.getters.getConfig.configuration.asset.fileTypes.map((x) => x.category))] as string[];
  }

  onEpsgSelection(epsgLabel: string) {
    const i = this.menusData.epsgLabels.findIndex((x) => x === epsgLabel);
    this.assetLocal.referenceSystem = this.epsgList[i].code;
  }

  created(): void {
    this.populateAvailableFormatsForSelectedType();
    this.spatialApi.getEpsgCodes().then((epsgCodesResponse) => {
      this.epsgList = epsgCodesResponse.result.map((x) => ({ code: x.code.toString(), name: x.name }));
      this.menusData.epsgLabels = this.epsgList.map((x) => `EPSG:${x.code}, ${x.name}`);

      if (this.assetLocal.referenceSystem) {
        const i = this.epsgList.findIndex((x) => x.code === this.assetLocal.referenceSystem);
        this.selectedEpsgLabel = this.menusData.epsgLabels[i];
      }
    });
  }

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    console.log('updated metadata');
    this.$emit('update:asset', asset);
  }

  @Watch('assetLocal.type', { immediate: false }) onAssetMainTypeChange(): void {
    this.assetLocal.format = '';
    this.populateAvailableFormatsForSelectedType();
  }

  @Watch('additionalResourcesToUploadLocal', { deep: true })
  onAdditionalResourcesToUploadChange(): void {
    this.$emit('update:additionalResourcesToUpload', this.additionalResourcesToUploadLocal);
  }

  @Watch('additionalUriResource', { deep: true })
  onAdditionalUriResourceChange(): void {
    Vue.set(this.assetLocal, 'additionalResources', [this.additionalUriResource]);

    if (!this.additionalUriResource.uri) {
      this.additionalUriResource.text = '';
    }
  }

  @Watch('additionalResourcesOption', { deep: false })
  onAdditionalResourcesOptionChange(): void {
    console.log('artu', this.additionalResourcesOption);
    if (this.additionalResourcesOption === 'upload_files') {
      this.assetLocal.additionalResources = [];
      this.additionalUriResource = { uri: '', text: '', type: EnumAssetAdditionalResource.URI };
    }
    if (this.additionalResourcesOption === 'external_link') {
      this.additionalResourcesToUploadLocal = [];
      this.numberOfAdditionalResourcesFiles = 1;
    }
  }

  populateAvailableFormatsForSelectedType(): void {
    const selectedType = this.asset.type;
    this.menusData.availableFormats = store.getters.getConfig.configuration.asset.fileTypes.filter((x) => x.category === selectedType?.toUpperCase()).map((x) => x.format);
  }

  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  getTopicCategories(): string[] {
    return Object.values(EnumTopicCategory);
  }

  onAddScale(scale: string): void {
    const description = `1:${scale}`;
    this.assetLocal.scales.push({ scale: Number(scale), description });
    this.scalesForDisplay.push(description);
  }

  onRemoveScale(scale: string): void {
    this.scalesForDisplay = this.scalesForDisplay.filter((x) => x !== scale);
    this.assetLocal.scales = this.assetLocal.scales.filter((x) => x.description !== scale);
  }

  onAddKeyword(keyword: string): void {
    // TODO: add theme
    this.assetLocal.keywords.push({ keyword, theme: '' });
    this.keywordsForDisplay.push(keyword);
  }

  onRemoveKeyword(keyword: string): void {
    this.keywordsForDisplay = this.keywordsForDisplay.filter((x) => x !== keyword);
    this.assetLocal.keywords = this.assetLocal.keywords.filter((x) => x.keyword !== keyword);
  }

  onSubmitAdditionalResourcesFiles(): void {
    const files = [...this.$el.querySelectorAll('.input-additional-resource-file')].map((x) => (x as any).files[0]);
    const comments = [...this.$el.querySelectorAll('.input-additional-resource-comments')].map((x) => (x as any).value);

    this.additionalResourcesToUploadLocal = files.map((x, i) => ({
      file: x,
      resourceCommand: {
        fileName: x.name,
        description: comments[i],
      },
    }));

    console.log(this.additionalResourcesToUploadLocal);
    this.modalToShow = '';
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
