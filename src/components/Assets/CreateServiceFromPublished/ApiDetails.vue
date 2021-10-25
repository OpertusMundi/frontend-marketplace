<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width dashboard__form__step__api_details">
      <div class="row">
        <!-- LEFT -->
        <div class="col-md-4">
          <div class="dashboard__form__step__title">
            <h3>Create or publish an API</h3>
            <p>Create an API from a file or just publish an API you provide</p>
          </div>
          <validation-provider v-slot="{ errors }" name="API creation method" rules="required">
            <div class="form-group">
              <label class="control control-radio">
                Create API from file already published in Topio
                <input type="radio" name="creation_type" v-model="creationType" value="PUBLISHED_ASSET" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                Create API from file in your topio Drive
                <input type="radio" name="creation_type" v-model="creationType" value="TOPIO_DRIVE" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                Publish existing API
                <input type="radio" name="creation_type" v-model="creationType" value="EXISTING_API" />
                <div class="control_indicator"></div>
              </label>
              <div class="errors" v-if="errors">
                <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
              </div>
            </div>
          </validation-provider>
        </div>
        <!-- MIDDLE  -->
        <div class="col-md-4" v-if="creationType === 'PUBLISHED_ASSET'">
          <div class="dashboard__form__step__title">
            <p>Select one of your published data files</p>
            <div v-for="asset in publishedAssets" :key="asset.id">
              <asset-api-details-card @click.native="onSelectPublishedAsset(asset)" :selected="selectedPublishedAssetForApiCreationLocal && selectedPublishedAssetForApiCreationLocal.id === asset.id" :asset="asset"></asset-api-details-card>
            </div>
          </div>
        </div>
        <!-- INHALT WORKING HERE -->
        <div class="col-md-4" v-if="creationType === 'TOPIO_DRIVE'">
          <div class="dashboard__form__step__title">
            <p>Select one data file from your topio Drive</p>
            <p v-html="`${fileApi.name}`"></p>
            <file-topio-drive :fileApi.sync="fileApi"></file-topio-drive>
          </div>
        </div>

        <!-- RIGHT  -->
        <div class="col-md-4">
          <div class="dashboard__form__step__title">
            <h3>Type of API</h3>
            <p>What type of API would you like to publish</p>
          </div>
          <validation-provider v-slot="{ errors }" name="API Type" rules="required">
            <div class="form-group">
              <label class="control control-radio">
                WMS
                <input type="radio" name="api_type" v-model="serviceTypeLocal" value="WMS" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                WFS
                <input type="radio" name="api_type" v-model="serviceTypeLocal" value="WFS" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                Data API
                <input type="radio" name="api_type" v-model="serviceTypeLocal" value="DATA_API" />
                <div class="control_indicator"></div>
              </label>
              <div class="errors" v-if="errors">
                <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
              </div>
            </div>
          </validation-provider>
        </div>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import ProviderAssetsApi from '@/service/provider-assets';
import AssetApiDetailsCard from '@/components/Assets/AssetApiDetailsCard.vue';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import store from '@/store';
import { CatalogueItem, CatalogueItemCommand, DraftApiFromFileCommand } from '@/model/catalogue';
import FileTopioDrive from '@/components/Assets/CreateApiTopioDrive/FileTopioDrive.vue';

extend('required', required);

enum CreationType {
  UNDEFINED = 'UNDEFINED',
  PUBLISHED_ASSET = 'PUBLISHED_ASSET',
  TOPIO_DRIVE = 'TOPIO_DRIVE',
  EXISTING_API = 'EXISTING_API',
}

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    AssetApiDetailsCard,
    FileTopioDrive,
  },
})
export default class ApiDetails extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  @Prop({ required: true }) private serviceType!: EnumSpatialDataServiceType | null;

  @Prop({ required: true }) private selectedPublishedAssetForApiCreation!: CatalogueItem | null;

  @Prop({ required: true }) private apiCreationType!: CreationType | null;

  @Prop({ required: true }) private selectedPublishedFileForApiCreation!: DraftApiFromFileCommand | null;

  providerAssetsApi: ProviderAssetsApi;

  assetLocal: CatalogueItemCommand;

  creationType: CreationType;

  serviceTypeLocal: EnumSpatialDataServiceType | null;

  publishedAssets: CatalogueItem[];

  fileApi: any | null;

  selectedPublishedAssetForApiCreationLocal: CatalogueItem | null;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  constructor() {
    super();

    this.fileApi = {};

    this.providerAssetsApi = new ProviderAssetsApi();

    this.assetLocal = this.asset;
    this.serviceTypeLocal = this.serviceType;

    this.creationType = CreationType.PUBLISHED_ASSET;

    this.publishedAssets = [];

    this.selectedPublishedAssetForApiCreationLocal = this.selectedPublishedAssetForApiCreation;
    console.log('local', this.selectedPublishedAssetForApiCreationLocal);
  }

  @Watch('fileApi', { deep: true })
  onFileApiChange(fileApi: any | null): void {
    console.log('file api changed', fileApi);
    this.$emit('update:selectedPublishedFileForApiCreation', fileApi);
  }

  @Watch('creationType', { deep: true })
  onCreationTypeChange(creationType: CreationType): void {
    console.log('creation type changed', creationType);
    this.$emit('update:apiCreationType', creationType);
    if (creationType === 'TOPIO_DRIVE') {
      this.selectedPublishedAssetForApiCreationLocal = null;
    }
  }

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    console.log('updated metadata');
    this.$emit('update:asset', asset);
  }

  @Watch('serviceTypeLocal')
  onServiceTypeChange(serviceType: EnumSpatialDataServiceType | null): void {
    console.log('s', serviceType);
    // this.assetLocal.spatialDataServiceType = serviceType;
    Vue.set(this.assetLocal, 'spatialDataServiceType', serviceType);
  }

  @Watch('selectedPublishedAssetForApiCreationLocal')
  onSelectedPublishedAssetChange(asset: CatalogueItem): void {
    console.log('hey', asset);
    this.$emit('update:selectedPublishedAssetForApiCreation', asset);
  }

  created(): void {
    console.log('selectedPublishedAsset', this.selectedPublishedAssetForApiCreationLocal);
    store.commit('setLoading', true);
    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.VECTOR,
      pageRequest: { page: 0, size: 1000 },
      sorting: { id: EnumProviderAssetSortField.TITLE, order: 'ASC' },
    };
    this.providerAssetsApi
      .find(query)
      .then((response) => {
        if (response.success) {
          console.log('successfully fetched provider assets', response);
          this.publishedAssets = response.result.items;
        } else {
          console.log('error fetching provider assets', response);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        store.commit('setLoading', false);
      });
  }

  onSelectPublishedAsset(asset: CatalogueItem): void {
    this.selectedPublishedAssetForApiCreationLocal = asset;
    console.log(asset);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';
</style>
