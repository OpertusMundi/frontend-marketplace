<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step">
      <div class="dashboard__form__step__title">
        <h3>Add asset metadata</h3>
        <p>Fill in your asset metadata. If you already have compatible metadata, please upload them. You can still edit them. <br>All metadata will be available to prospective clients under a CC-BY-NC 4.0 license to facilitate asset discovery from consumers.</p>
      </div>

      <validation-provider v-slot="{ errors }" name="Title" rules="required">
      <div class="form-group">
        <label for="metadata_title">Title *</label>
        <input type="text" class="form-group__text" name="metadata_title" id="metadata_title" v-model="asset.title">
        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
      </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Type" rules="required">
        <div class="form-group">
          <label for="multiselect_type">Type *</label>
          <multiselect id="multiselect_type" v-model="asset.type" :options="menusData.assetTypes" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect>
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Type" rules="required">
        <div class="form-group">
          <label for="multiselect_type">Format *</label>
          <multiselect :disabled="!asset.type" id="multiselect_type" v-model="asset.format" :options="menusData.availableFormats" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select asset type"></multiselect>
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Language">
      <div class="form-group">
        <label for="metadata_language">Language</label>
        <input type="text" class="form-group__text" name="metadata_language" id="metadata_language" v-model="asset.language">
        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
      </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Editor's name">
        <div class="form-group">
          <label for="editor">Editor</label>
          <input type="text" name="publisherName" class="form-group__text" id="" v-model="asset.publisherName">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Editor's email" rules="email">
        <div class="form-group">
          <label for="">Editor’s email</label>
          <input type="text" class="form-group__text" id="" name="publisherEmail" v-model="asset.publisherEmail">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Maintenance manager name">
        <div class="form-group">
          <label for="">Maintenance manager</label>
          <input type="text" class="form-group__text" id="" name="metadataPointOfContactName" v-model="asset.metadataPointOfContactName">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Maintenance manager’s email" rules="email">
        <div class="form-group">
          <label for="">Maintenance manager’s email</label>
          <input type="text" class="form-group__text" id="" name="metadataPointOfContactEmail" v-model="asset.metadataPointOfContactEmail">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Version" rules="required">
        <div class="form-group">
          <label for="">Version *</label>
          <input type="text" class="form-group__text" id="" name="version" v-model="asset.version">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <!-- <validation-provider v-slot="{ errors }" name="Asset title" rules="required">
        <div class="form-group">
          <label for="">Asset title</label>
          <input type="text" class="form-group__text" id="" name="title" v-model="asset.title">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
      <validation-provider v-slot="{ errors }" name="Asset short description">
        <div class="form-group">
          <label for="">Asset short description</label>
          <input type="text" class="form-group__text" id="" name="abstractText" v-model="asset.abstract">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Metadata language">
        <div class="form-group">
          <label for="">Metadata language</label>
          <input type="text" class="form-group__text" name="metadataLanguage" id="" v-model="asset.metadataLanguage">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider>
      <!-- <validation-provider v-slot="{ errors }" name="Metadata date" rules="required">
        <div class="form-group">
          <label for="">Metadata date</label>
          <datepicker v-model="asset.metadataDate" name="metadataDate" format="dd/MM/yyyy" input-class="form-group__text"></datepicker>
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
      <!-- <validation-provider v-slot="{ errors }" name="Scale" rules="required">
        <div class="form-group">
          <label for="">Scale</label>
          <input type="text" class="form-group__text" id="" name="scale" v-model="asset.scale">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
    </div>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import store from '@/store';
import { CatalogueItemCommand } from '@/model';
import { EnumConformity } from '@/model/catalogue';
import { EnumAssetType } from '@/model/enum';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
  },
})
export default class Metadata extends Vue {
  // @Prop({ required: true }) asset!: CatalogueItemCommand;

  asset: CatalogueItemCommand;

  menusData: {
    assetTypes: string[],
    availableFormats: string[],
  }

  constructor() {
    super();

    this.menusData = { assetTypes: [], availableFormats: [] };

    this.menusData.assetTypes = [...new Set(store.getters.getConfig.configuration.asset.fileTypes.map((x) => x.category))] as string[];

    this.asset = {
      abstract: '',
      additionalResources: [],
      conformity: EnumConformity.NOT_EVALUATED,
      creationDate: '2020-06-02',
      dateEnd: '2020-06-02',
      dateStart: '2020-06-02',
      format: '',
      ingested: false,
      keywords: [],
      language: '',
      license: '',
      lineage: '',
      metadataDate: '2020-06-02',
      metadataLanguage: '',
      metadataPointOfContactEmail: '',
      metadataPointOfContactName: '',
      openDataset: false,
      parentId: '',
      publicAccessLimitations: '',
      publicationDate: '2020-06-02',
      publisherEmail: '',
      publisherName: '',
      referenceSystem: '',
      resourceLocator: '',
      responsibleParty: [],
      revisionDate: '2020-06-02',
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
      pricingModels: [],
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
  }

  @Watch('asset', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    console.log('updated metadata');
    this.$emit('update:asset', asset);
  }

  @Watch('asset.type', { immediate: true }) onAssetMainTypeChange(): void {
    this.asset.format = '';
    const selectedType = this.asset.type;
    this.menusData.availableFormats = store.getters.getConfig.configuration.asset.fileTypes.filter((x) => x.category === selectedType?.toUpperCase()).map((x) => x.format);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
