<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">

      <div class="row">
        <div class="col-md-7">
          <div class="dashboard__form__step__title">
            <h3>Add asset metadata</h3>
            <p>Metadata already filled in. <br>All metadata will be available to prospective clients under a CC-BY-NC 4.0 license to facilitate asset discovery from consumers.</p>
          </div>

          <!-- MODALS -->
          <!-- <modal :withSlots="true" :show="modalToShow == 'uploadAdditionalResources'" @dismiss="modalToShow = ''" :modalId="'uploadAdditionalResources'">
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
          </modal> -->
          <!-- END OF MODALS -->

          <validation-provider v-slot="{ errors }" name="Title" rules="required">
          <div class="form-group">
            <label for="metadata_title">Title *</label>
            <input disabled type="text" class="form-group__text" name="metadata_title" id="metadata_title" :value="`${asset.title} (${serviceType})`">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type" rules="required">
            <div class="form-group">
              <label for="multiselect_type">Type *</label>
              <input class="form-group__text" disabled type="text" :value="asset.type">
              <!-- <multiselect :disabled="true" id="multiselect_type" :value="assetLocal.type" :options="menusData.assetTypes" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider name="Abstract">
            <div class="form-group">
              <label for="">Abstract *</label>
              <textarea class="form-group__text" disabled :value="asset.abstract || asset.abstractText"></textarea>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Type" rules="required">
            <div class="form-group">
              <label for="multiselect_type">Format *</label>
              <input class="form-group__text" type="text" disabled :value="asset.format">
              <!-- <multiselect :disabled="true" id="multiselect_type" :value="assetLocal.format" :options="menusData.availableFormats" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <!-- <validation-provider v-slot="{ errors }" name="Language">
          <div class="form-group">
            <label for="metadata_language">Language</label>
            <input type="text" class="form-group__text" name="metadata_language" id="metadata_language" :value="assetLocal.language">
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
          </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Language">
            <div class="form-group">
              <label for="multiselect_language">Language</label>
              <!-- <input class="form-group__text" type="text" disabled :value="asset.language"> -->
              <input class="form-group__text" type="text" disabled :value="$store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.language) ? $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.language).name : ''">
              <!-- <multiselect :disabled="true" id="multiselect_language" @input="onSelectLanguage" :value="selectedLanguage" label="name" track-by="code" :options="languages" :multiple="false" :close-on-select="true" :show-labels="false" placeholder="Select language"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Editor's name">
            <div class="form-group">
              <label for="editor">Editor</label>
              <input disabled type="text" name="publisherName" class="form-group__text" id="" :value="asset.publisherName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Editor's email" rules="email">
            <div class="form-group">
              <label for="">Editor’s email</label>
              <input disabled type="text" class="form-group__text" id="" name="publisherEmail" :value="asset.publisherEmail">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Maintenance manager name">
            <div class="form-group">
              <label for="">Maintenance manager</label>
              <input disabled type="text" class="form-group__text" id="" name="metadataPointOfContactName" :value="asset.metadataPointOfContactName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Maintenance manager’s email" rules="email">
            <div class="form-group">
              <label for="">Maintenance manager’s email</label>
              <input disabled type="text" class="form-group__text" id="" name="metadataPointOfContactEmail" :value="asset.metadataPointOfContactEmail">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Version" rules="required">
            <div class="form-group">
              <label for="">Version *</label>
              <input disabled type="text" class="form-group__text" id="" name="version" :value="asset.version">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider>
          <!-- <validation-provider v-slot="{ errors }" name="Metadata language">
            <div class="form-group">
              <label for="">Metadata language</label>
              <input type="text" class="form-group__text" name="metadataLanguage" id="" :value="assetLocal.metadataLanguage">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Metadata language">
            <div class="form-group">
              <label for="multiselect_metadata_language">Metadata language</label>
              <input class="form-group__text" type="text" disabled :value="$store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.metadataLanguage) ? $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.metadataLanguage).name : ''">
              <!-- <multiselect :disabled="true" id="multiselect_metadata_language" @input="onSelectMetadataLanguage" :value="selectedMetadataLanguage" label="name" track-by="code" :options="languages" :multiple="false" :close-on-select="true" :show-labels="false" placeholder="Select metadata language"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider name="Date start">
            <div class="form-group">
              <label for="">Date start (of resource temporal extent)</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.dateStart)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.dateStart" @input="assetLocal.dateStart = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider name="Date end">
            <div class="form-group">
              <label for="">Date end (of resource temporal extent)</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.dateEnd)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.dateEnd" @input="assetLocal.dateEnd = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider name="Creation date">
            <div class="form-group">
              <label for="">Creation date</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.creationDate)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.creationDate" @input="assetLocal.creationDate = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider name="Publication date">
            <div class="form-group">
              <label for="">Publication date</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.publicationDate)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.publicationDate" @input="assetLocal.publicationDate = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider name="Revision date">
            <div class="form-group">
              <label for="">Revision date</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.revisionDate)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.revisionDate" @input="assetLocal.revisionDate = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider name="Metadata date">
            <div class="form-group">
              <label for="">Metadata date</label>
              <input class="form-group__text" type="text" disabled :value="formatDate(asset.metadataDate)">
              <!-- <datepicker input-class="form-group__text" :value="assetLocal.metadataDate" @input="assetLocal.metadataDate = formatDate($event)"></datepicker> -->
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Topic">
            <div class="form-group">
              <label for="multiselect_topic">Topic</label>
              <input class="form-group__text" type="text" disabled :value="asset.topicCategory.join(', ')">
              <!-- <multiselect id="multiselect_topic" :value="assetLocal.topicCategory" :options="getTopicCategories()" :multiple="true" :close-on-select="true" :show-labels="false" placeholder="Select topic(s)"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Suitable For">
            <div class="form-group">
              <label for="multiselect_suitablefor">Suitable for</label>
              <input class="form-group__text" type="text" disabled :value="asset.suitableFor.join(', ')">
              <!-- <multiselect id="multiselect_suitablefor" :value="assetLocal.suitableFor" tag-placeholder="Press enter to add a category" :options="assetLocal.suitableFor" :multiple="true" :taggable="true" @tag="(x) => assetLocal.suitableFor.push(x)" :close-on-select="false" :show-labels="false" placeholder="Type a category"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Keywords">
            <div class="form-group">
              <label for="multiselect_keywords">Keywords</label>
              <input class="form-group__text" type="text" disabled :value="asset.keywords.map((x) => x.keyword).join(', ')">
              <!-- <multiselect id="multiselect_keywords" :value="keywordsForDisplay" :options="assetLocal.keywords.map((x) => x.keyword)" tag-placeholder="Press enter to add a keyword" :multiple="true" :taggable="true" @tag="(x) => onAddKeyword(x)" @remove="(x) => onRemoveKeyword(x)" :close-on-select="false" :show-labels="false" placeholder="Type a keyword"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Scales">
            <div class="form-group">
              <label for="multiselect_scales">Scales</label>
              <input class="form-group__text" type="text" disabled :value="asset.scales.map((x) => x.description).join(', ')">
              <!-- <multiselect id="multiselect_scales" :value="scalesForDisplay" :options="assetLocal.scales.map((x) => x.scale)" tag-placeholder="Press enter to add a scale" :multiple="true" :taggable="true" @tag="(x) => onAddScale(x)" @remove="(x) => onRemoveScale(x)" :close-on-select="false" :show-labels="false" placeholder="Type a scale number"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <!-- <validation-provider v-slot="{ errors }" name="Type">
            <div class="form-group">
              <label for="multiselect_epsg">Reference system</label>
              <multiselect id="multiselect_epsg" @input="onEpsgSelection($event)" :value="selectedEpsgLabel" :options="menusData.epsgLabels" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select reference system"></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider> -->
          <validation-provider v-slot="{ errors }" name="Reference system">
            <div class="form-group">
              <label for="ajax">Reference system</label>
              <input class="form-group__text" type="text" disabled :value="epsg">
              <!-- <multiselect id="ajax" @input="onEpsgSelection($event)" :value="selectedEpsg" :options="epsgList" label="name" track-by="code" :loading="isLoadingEpsg" :searchable="true" @search-change="asyncFindEpsg" :close-on-select="true" :show-labels="false" placeholder="Search reference system"></multiselect> -->
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <div class="d-flex align-items-center form-group" v-if="asset.type === 'VECTOR'">
            <input disabled type="checkbox" id="ingested" :value="asset.ingested" class="mr-xs-10 mb-xs-10">
            <label for="ingested">Ingested <small>Import into PostGIS Database to publish using WMS/WFS</small></label>
          </div>
        </div>
        <div class="col-md-5">
          <!-- <div class="dashboard__form__step__title">
            <h3>Additional Resources</h3>
            <p>Provide any additional files for the documentation of your asset.</p>

            <div class="form-group mt-xs-20">
              <label class="control control-radio">
                Upload files
                <input type="radio" name="asset_type" :value="additionalResourcesOption" value="upload_files" />
                <div class="control_indicator"></div>
              </label>
              <div class="mt-xs-10 mb-xs-20 ml-xs-40 d-flex flex-column" v-if="additionalResourcesOption === 'upload_files'">
                <span v-for="(resource, i) in additionalResourcesToUploadLocal" :key="i" class="mb-xs-10">{{ resource.resourceCommand.fileName }}</span>
                <div><button class="btn btn--std btn--dark" @click="modalToShow = 'uploadAdditionalResources'">UPLOAD FILE</button></div>
              </div>
              <label class="control control-radio">
                External link
                <input type="radio" name="asset_type" :value="additionalResourcesOption" value="external_link" />
                <div class="control_indicator"></div>
              </label>
              <div v-if="additionalResourcesOption === 'external_link'" class="form-group ml-xs-40">
                <label for="additional_resources_link">Add a link</label>
                <input id="additional_resources_link" type="text" class="form-group__text" placeholder="https://" :value="additionalUriResource.uri">
                <label for="additional_resources_link_text">Displayed text for URI</label>
                <textarea id="additional_resources_link_text" type="text" class="form-group__text" :disabled="!additionalUriResource.uri" :value="additionalUriResource.text"></textarea>
              </div>
            </div>
          </div> -->
        </div>
      </div>

    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
} from 'vue-property-decorator';
import SpatialApi from '@/service/spatial';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import Modal from '@/components/Modal.vue';
import { CatalogueItemCommand } from '@/model';
import { AssetFileAdditionalResourceCommand } from '@/model/asset';
import moment from 'moment';
import { EnumSpatialDataServiceType } from '@/model/enum';

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

  @Prop({ required: true }) private serviceType!: EnumSpatialDataServiceType;

  @Prop({ required: true }) private additionalResourcesToUpload!: { resourceCommand: AssetFileAdditionalResourceCommand, file: File }[];

  spatialApi: SpatialApi;

  epsg: string;

  constructor() {
    super();

    this.spatialApi = new SpatialApi();

    this.epsg = '';
  }

  created(): void {
    this.getEpsgFullName(this.asset.referenceSystem);
  }

  formatDate(date: string): string {
    return date ? moment(date).format('DD MMM YYYY') : '';
  }

  getEpsgFullName(code: string): void {
    this.spatialApi.getEpsgCodes(code).then((epsgResponse) => {
      const epsg = epsgResponse.result.find((x) => `${x.code}` === this.asset.referenceSystem);
      if (epsg) this.epsg = `EPSG:${epsg.code} | ${epsg.name}`;
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
