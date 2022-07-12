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

              <div v-for="(additionalResource, i) in additionalResourcesTemp" :key="additionalResource.key" class="form-group mt-sm-20">
                <div class="form-group additional-resource-input">
                  <input @input="onAdditionalResourceFileInput(i, $event.target.files[0])" class="form-group__text input-additional-resource-file" type="file">
                  <div
                    v-if="additionalResourcesTemp.length > 1"
                    @click.prevent="removeInputFromAdditionalResources(additionalResource.key)"
                    class="additional-resource-input__remove-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.061" height="13.061" viewBox="0 0 13.061 13.061"><g data-name="Group 762" fill="none" stroke="#333" stroke-width="1.5"><path data-name="Line 135" d="m0 0 12 12" transform="translate(.53 .53)"/><path data-name="Line 136" d="M0 12 12 0" transform="translate(.53 .53)"/></g>
                    </svg>
                  </div>
                </div>
                <input v-model="additionalResourcesTemp[i].resourceCommand.description" class="form-group__text input-additional-resource-comments" type="text" placeholder="add comments">
              </div>

              <button class="btn--std btn--outlineblue" @click="addInputToAdditionalResources">+ add file</button>
            </template>

            <template v-slot:footer>
              <button class="btn--std btn--blue ml-xs-20" @click="onSubmitAdditionalResourceFiles">submit files</button>
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
          <validation-provider v-slot="{ errors }" name="Abstract" rules="required">
            <div class="form-group">
              <label for="">Abstract *</label>
              <textarea v-model="assetLocal.abstract" placeholder="Short asset description"></textarea>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type" rules="required">
            <div class="form-group">
              <label for="multiselect_type">Format *</label>
              <multiselect :disabled="!asset.type" id="multiselect_type" v-model="assetLocal.format" :options="menusData.availableFormats" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <!-- <validation-provider v-slot="{ errors }" name="Language">
          <div class="form-group">
            <label for="metadata_language">Language</label>
            <input type="text" class="form-group__text" name="metadata_language" id="metadata_language" v-model="assetLocal.language">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Language">
            <div class="form-group">
              <label for="multiselect_language">Language</label>
              <multiselect id="multiselect_language" @input="onSelectLanguage" v-model="selectedLanguage" label="name" track-by="code" :options="languages" :multiple="false" :close-on-select="true" :show-labels="false" placeholder="Select language"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
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
          <!-- <validation-provider v-slot="{ errors }" name="Metadata language">
            <div class="form-group">
              <label for="">Metadata language</label>
              <input type="text" class="form-group__text" name="metadataLanguage" id="" v-model="assetLocal.metadataLanguage">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Metadata language">
            <div class="form-group">
              <label for="multiselect_metadata_language">Metadata language</label>
              <multiselect id="multiselect_metadata_language" @input="onSelectMetadataLanguage" v-model="selectedMetadataLanguage" label="name" track-by="code" :options="languages" :multiple="false" :close-on-select="true" :show-labels="false" placeholder="Select metadata language"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
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
              <multiselect id="multiselect_keywords" :value="keywordsForDisplay" :options="assetLocal.keywords.map((x) => x.keyword)" tag-placeholder="Press enter to add a keyword" :multiple="true" :taggable="true" @tag="(x) => onAddKeyword(x)" @remove="(x) => onRemoveKeyword(x)" :close-on-select="false" :show-labels="false" placeholder="Type a keyword"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Scales">
            <div class="form-group" v-show="!isSpatialMetadataHidden">
              <label for="multiselect_scales">Scales</label>
              <multiselect id="multiselect_scales" :value="scalesForDisplay" :options="assetLocal.scales.map((x) => x.scale)" tag-placeholder="Press enter to add a scale" :multiple="true" :taggable="true" @tag="(x) => onAddScale(x)" @remove="(x) => onRemoveScale(x)" :close-on-select="false" :show-labels="false" placeholder="Type a scale number"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <!-- <validation-provider v-slot="{ errors }" name="Type">
            <div class="form-group">
              <label for="multiselect_epsg">Reference system</label>
              <multiselect id="multiselect_epsg" @input="onEpsgSelection($event)" v-model="selectedEpsgLabel" :options="menusData.epsgLabels" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select reference system"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Reference system" rules="required">
            <div class="form-group" v-show="!isSpatialMetadataHidden">
              <label for="ajax">Reference system *</label>
              <multiselect id="ajax" @input="onEpsgSelection($event)" v-model="selectedEpsg" :options="epsgList" label="name" track-by="code" :loading="isLoadingEpsg" :searchable="true" @search-change="asyncFindEpsg" :close-on-select="true" :show-labels="false" placeholder="Search reference system"></multiselect>
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

            <div class="collection__menu mt-xs-20">
              <ul>
                <li :class="{'active': additionalResourceSelectedTab === 'upload_file'}"><a href="#" @click.prevent="additionalResourceSelectedTab = 'upload_file'">Files</a></li>
                <li :class="{'active': additionalResourceSelectedTab === 'external_link'}"><a href="#" @click.prevent="additionalResourceSelectedTab = 'external_link'">External links</a></li>
              </ul>
            </div>

            <div class="mt-xs-10 mb-xs-20" v-if="additionalResourceSelectedTab === 'upload_file'">
              <div class="d-inline-flex">
                <div v-for="(resource, i) in additionalResourcesToUploadLocal" :key="i" class="resource-label">
                  {{ resource.resourceCommand.fileName }}
                  <div @click="removeAdditionalResourceFile(i)" class="resource-label__remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9.061" height="9.061" viewBox="0 0 9.061 9.061"><g data-name="Group 2880" fill="none" stroke="#190aff" stroke-width="1.5"><path data-name="Line 135" d="m0 0 8 8" transform="translate(.53 .53)"/><path data-name="Line 136" d="m0 8 8-8" transform="translate(.53 .53)"/></g></svg>
                  </div>
                </div>
              </div>
              <div><button class="btn btn--std btn--dark" :class="additionalResourcesToUploadLocal.length > 0 ? 'mt-xs-20' : 'mt-xs-0'" @click="openModalUploadAdditionalResources">UPLOAD FILES</button></div>
            </div>

            <div class="form-group" v-if="additionalResourceSelectedTab === 'external_link'">
              <div v-for="(additionalUriResource, i) in additionalUriResources" :key="i">
                <label for="additional_resources_link">Add a link</label>
                <input id="additional_resources_link" type="text" class="form-group__text" placeholder="https://" v-model="additionalUriResource.uri">
                <label for="additional_resources_link_text">Displayed text for URI</label>
                <textarea id="additional_resources_link_text" type="text" class="form-group__text" :disabled="!additionalUriResource.uri" v-model="additionalUriResource.text"></textarea>
              </div>
              <button class="btn btn--std btn--dark" :disabled="isAddAdditionalUriResourceDisabled()" @click="onAddAdditionalUriResource">ADD MORE</button>
            </div>

            <!-- <div class="form-group mt-xs-20">
              <h4>Upload files</h4>
              <div class="mt-xs-10 mb-xs-20 ml-xs-40 d-flex flex-column" v-if="additionalResourcesOption === 'upload_files'">
                <span v-for="(resource, i) in additionalResourcesToUploadLocal" :key="i" class="mb-xs-10">{{ resource.resourceCommand.fileName }}</span>
                <div><button class="btn btn--std btn--dark" @click="modalToShow = 'uploadAdditionalResources'">UPLOAD FILES</button></div>
              </div>
              <h4>External links</h4>
              <div v-if="additionalResourcesOption === 'external_link'" class="form-group ml-xs-40">
                <label for="additional_resources_link">Add a link</label>
                <input id="additional_resources_link" type="text" class="form-group__text" placeholder="https://" v-model="additionalUriResource.uri">
                <label for="additional_resources_link_text">Displayed text for URI</label>
                <textarea id="additional_resources_link_text" type="text" class="form-group__text" :disabled="!additionalUriResource.uri" v-model="additionalUriResource.text"></textarea>
              </div>
            </div> -->
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
import { EnumAssetType } from '@/model/enum';

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

  additionalResourcesTemp: { resourceCommand: AssetFileAdditionalResourceCommand, file: File | null, key: string }[];

  additionalResourcesToUploadLocal: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  modalToShow: string;

  // additionalResourcesOption: string;

  additionalResourceSelectedTab: string;

  additionalUriResources: AssetUriAdditionalResource[];

  scalesForDisplay: string[];

  keywordsForDisplay: string[];

  menusData: {
    assetTypes: string[],
    availableFormats: string[],
  }

  epsgList: { code: string, name: string }[];

  languages: { code: string, name: string }[];

  // epsgsList: { code: string, name: string }[]; // deprecated

  // selectedEpsgLabel: string | null; // deprecated

  selectedLanguage: { code: string, name: string };

  selectedMetadataLanguage: { code: string, name: string };

  selectedEpsg: { code: string, name: string };

  isLoadingEpsg: boolean;

  isSpatialMetadataHidden: boolean;

  // TODO: currently, URIs are stored in asset.additionalResources and FILES are uploaded as additional resources on asset submit

  constructor() {
    super();

    this.spatialApi = new SpatialApi();

    this.assetLocal = this.asset;

    this.additionalResourcesTemp = [];

    this.additionalResourcesToUploadLocal = this.additionalResourcesToUpload;

    this.modalToShow = '';

    // this.additionalResourcesOption = '';

    this.additionalResourceSelectedTab = 'upload_file';

    this.additionalUriResources = this.assetLocal.additionalResources.filter((x) => x.type === EnumAssetAdditionalResource.URI).length
      ? this.assetLocal.additionalResources.filter((x) => x.type === EnumAssetAdditionalResource.URI) as AssetUriAdditionalResource[]
      : [{ uri: '', text: '', type: EnumAssetAdditionalResource.URI }];

    // this.additionalUriResources = [];

    // if (this.assetLocal.additionalResources.length && this.assetLocal.additionalResources[0].type === EnumAssetAdditionalResource.URI) {
    //   const [uriResource] = this.assetLocal.additionalResources;
    //   this.additionalUriResource = uriResource;
    //   this.additionalResourcesOption = 'external_link';
    // } else {
    //   this.additionalUriResource = {
    //     uri: '',
    //     text: '',
    //     type: EnumAssetAdditionalResource.URI,
    //   };
    // }

    this.scalesForDisplay = this.assetLocal.scales.map((x) => x.description);

    this.keywordsForDisplay = this.assetLocal.keywords.map((x) => x.keyword);

    this.menusData = { assetTypes: [], availableFormats: [] };

    this.epsgList = [];

    this.languages = store.getters.getConfig.configuration.europeLanguages;

    // this.epsgsList = [];

    // this.selectedEpsgLabel = null;

    this.selectedLanguage = { name: '', code: '' };
    this.selectedMetadataLanguage = { name: '', code: '' };

    this.selectedEpsg = { name: '', code: '' };

    this.isLoadingEpsg = false;

    this.isSpatialMetadataHidden = false;

    this.menusData.assetTypes = [...new Set(store.getters.getConfig.configuration.asset.fileTypes.map((x) => x.category))] as string[];
  }

  created(): void {
    this.populateAvailableFormatsForSelectedType();

    if (this.assetLocal.referenceSystem) {
      this.isLoadingEpsg = true;
      this.spatialApi.getEpsgCodes(this.assetLocal.referenceSystem).then((epsgResponse) => {
        const epsg = epsgResponse.result.find((x) => `${x.code}` === this.assetLocal.referenceSystem);
        if (epsg) {
          this.selectedEpsg = { code: `${epsg.code}`, name: `EPSG:${epsg.code} | ${epsg.name}` };
          this.epsgList = [{ code: `${epsg.code}`, name: `EPSG:${epsg.code} | ${epsg.name}` }];
        }
        this.isLoadingEpsg = false;
      });
    }

    // eslint-disable-next-line
    if (this.assetLocal.language && this.languages.find((x) => x.code === this.assetLocal.language)) this.selectedLanguage = this.languages.find((x) => x.code === this.assetLocal.language)!;
    // eslint-disable-next-line
    if (this.assetLocal.metadataLanguage && this.languages.find((x) => x.code === this.assetLocal.metadataLanguage)) this.selectedMetadataLanguage = this.languages.find((x) => x.code === this.assetLocal.metadataLanguage)!;
  }

  asyncFindEpsg(q: string): void {
    if (!q) return;
    console.log(q);
    this.isLoadingEpsg = true;
    const typeOfSearch = Number.isNaN(Number(q)) ? 'name' : 'number';
    console.log(typeOfSearch);
    const epsgPromise = Number.isNaN(Number(q)) ? this.spatialApi.getEpsgCodes(undefined, q) : this.spatialApi.getEpsgCodes(q, undefined);
    epsgPromise.then((epsgResponse) => {
      this.epsgList = epsgResponse.result.map((x) => ({ code: `${x.code}`, name: `EPSG:${x.code} | ${x.name}` }));
      this.isLoadingEpsg = false;
    });
  }

  onSelectLanguage(language: { code: string, name: string }): void {
    if (language && language.code) this.assetLocal.language = language.code;
  }

  onSelectMetadataLanguage(language: { code: string, name: string }): void {
    if (language && language.code) this.assetLocal.metadataLanguage = language.code;
  }

  onEpsgSelection(selectedEpsg: { code: string, name: string }): void {
    // const i = this.menusData.epsgLabels.findIndex((x) => x === epsgLabel);
    // this.assetLocal.referenceSystem = this.epsgsList[i].code;
    if (selectedEpsg && selectedEpsg.code) this.assetLocal.referenceSystem = selectedEpsg.code;
  }

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    console.log('updated metadata');
    this.$emit('update:asset', asset);
  }

  @Watch('assetLocal.type', { immediate: false })
  onAssetMainTypeChange(type: EnumAssetType): void {
    this.assetLocal.format = '';
    this.populateAvailableFormatsForSelectedType();

    if (type === EnumAssetType.TABULAR) {
      this.isSpatialMetadataHidden = true;
      this.assetLocal.scales = [];
      this.selectedEpsg = { name: '', code: '' };
      this.epsgList = [];
      this.assetLocal.referenceSystem = '';
      return;
    }
    this.isSpatialMetadataHidden = false;
  }

  @Watch('additionalResourcesToUploadLocal', { deep: true })
  onAdditionalResourcesToUploadChange(): void {
    this.$emit('update:additionalResourcesToUpload', this.additionalResourcesToUploadLocal);
  }

  @Watch('additionalUriResources', { deep: true })
  onAdditionalUriResourcesChange(): void {
    if (this.additionalUriResources.some((x) => !x.uri && x.text)) {
      this.additionalUriResources = this.additionalUriResources.map((x) => (x.uri ? x : { ...x, text: '' }));
    }

    const additionalUriResourcesWithoutEmptyOnes = this.additionalUriResources.filter((x) => x.uri);
    Vue.set(this.assetLocal, 'additionalResources', additionalUriResourcesWithoutEmptyOnes);
  }

  // @Watch('additionalUriResource', { deep: true })
  // onAdditionalUriResourceChange(): void {
  //   Vue.set(this.assetLocal, 'additionalResources', [this.additionalUriResource]);

  //   if (!this.additionalUriResource.uri) {
  //     this.additionalUriResource.text = '';
  //   }
  // }

  // @Watch('additionalResourcesOption', { deep: false })
  // onAdditionalResourcesOptionChange(): void {
  //   console.log('artu', this.additionalResourcesOption);
  //   if (this.additionalResourcesOption === 'upload_files') {
  //     // this.additionalUriResource = { uri: '', text: '', type: EnumAssetAdditionalResource.URI };
  //     this.assetLocal.additionalResources = [];
  //   }
  //   if (this.additionalResourcesOption === 'external_link') {
  //     this.additionalResourcesToUploadLocal = [];
  //     this.numberOfadditionalResourceFiles = 1;
  //   }
  // }

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

  onAddAdditionalUriResource(): void {
    this.additionalUriResources.push({
      uri: '',
      text: '',
      type: EnumAssetAdditionalResource.URI,
    });
  }

  isAddAdditionalUriResourceDisabled(): boolean {
    if (this.additionalUriResources.some((x) => !x.uri)) return true;
    return false;
  }

  openModalUploadAdditionalResources(): void {
    this.initAdditionalResources();
    this.modalToShow = 'uploadAdditionalResources';
  }

  initAdditionalResources(): void {
    this.additionalResourcesTemp = [{
      file: null,
      resourceCommand: {
        fileName: '',
        description: '',
      },
      key: `${Date.now()}${Math.random()}`,
    }];
  }

  addInputToAdditionalResources(): void {
    this.additionalResourcesTemp.push({
      file: null,
      resourceCommand: {
        fileName: '',
        description: '',
      },
      key: `${Date.now()}${Math.random()}`,
    });
  }

  removeInputFromAdditionalResources(key: string): void {
    // this.additionalResourcesTemp = this.additionalResourcesTemp.filter((x, j) => j !== i);
    this.additionalResourcesTemp = this.additionalResourcesTemp.filter((x) => x.key !== key);
  }

  removeAdditionalResourceFile(i: number): void {
    this.additionalResourcesToUploadLocal = this.additionalResourcesToUploadLocal.filter((x, j) => j !== i);
  }

  onAdditionalResourceFileInput(i: number, file: File): void {
    this.additionalResourcesTemp[i] = {
      file,
      resourceCommand: {
        fileName: file.name,
        description: this.additionalResourcesTemp[i].resourceCommand.description,
      },
      key: this.additionalResourcesTemp[i].key,
    };
  }

  onSubmitAdditionalResourceFiles(): void {
    this.additionalResourcesToUploadLocal = this.additionalResourcesToUploadLocal.concat(
      this.additionalResourcesTemp
        .map((x) => ({
          resourceCommand: x.resourceCommand,
          file: x.file,
        }))
        .filter((x) => x.file) as { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[],
    );

    console.log('artul', this.additionalResourcesToUploadLocal);
    this.modalToShow = '';
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_collection.scss";

  .additional-resource-input {
    position: relative;
    margin: 10px 0 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
        margin: 0;
    }
    &__remove-btn {
        z-index: 10;
        position: absolute;
        right: 0;
        margin: 5px 20px 0 0;
        cursor: pointer;
    }
  }
</style>
