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
      <!-- <validation-provider v-slot="{ errors }" name="Asset title" rules="required">
        <div class="form-group">
          <label for="">Asset title</label>
          <input type="text" class="form-group__text" id="" name="title" v-model="assetLocal.title">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
      <validation-provider v-slot="{ errors }" name="Asset short description">
        <div class="form-group">
          <label for="">Asset short description</label>
          <input type="text" class="form-group__text" id="" name="abstractText" v-model="assetLocal.abstract">
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
      <!-- <validation-provider v-slot="{ errors }" name="Metadata date" rules="required">
        <div class="form-group">
          <label for="">Metadata date</label>
          <datepicker v-model="assetLocal.metadataDate" name="metadataDate" format="dd/MM/yyyy" input-class="form-group__text"></datepicker>
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
      <!-- <validation-provider v-slot="{ errors }" name="Scale" rules="required">
        <div class="form-group">
          <label for="">Scale</label>
          <input type="text" class="form-group__text" id="" name="scale" v-model="assetLocal.scale">
          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
        </div>
      </validation-provider> -->
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
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import store from '@/store';
import { CatalogueItemCommand } from '@/model';

extend('required', required);

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
  },
})
export default class Metadata extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  assetLocal: CatalogueItemCommand;

  menusData: {
    assetTypes: string[],
    availableFormats: string[],
  }

  constructor() {
    super();

    this.assetLocal = this.asset;

    this.menusData = { assetTypes: [], availableFormats: [] };

    this.menusData.assetTypes = [...new Set(store.getters.getConfig.configuration.asset.fileTypes.map((x) => x.category))] as string[];
  }

  created(): void {
    this.populateAvailableFormatsForSelectedType();
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

  populateAvailableFormatsForSelectedType(): void {
    const selectedType = this.asset.type;
    this.menusData.availableFormats = store.getters.getConfig.configuration.asset.fileTypes.filter((x) => x.category === selectedType?.toUpperCase()).map((x) => x.format);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
