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
                <input :disabled="disabled" type="radio" name="creation_type" v-model="creationType" value="PUBLISHED_ASSET" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                Create API from file in your topio Drive
                <input :disabled="disabled" type="radio" name="creation_type" v-model="creationType" value="TOPIO_DRIVE" />
                <div class="control_indicator"></div>
              </label>
              <label class="control control-radio">
                Publish existing API
                <input :disabled="disabled" type="radio" name="creation_type" v-model="creationType" value="EXISTING_API" />
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
          <div class="dashboard__form__step__title overflow-y" v-if="!disabled">
            <p>Select one of your published data files</p>

            <div class="asset_search asset_search--sm asset_search--grey-border mt-xs-20">
              <div class="asset_search__upper asset_search__upper--no-z-index asset_search__upper--no-functional-search-button">
                <input type="text" name="" id="" placeholder="Search in your assets" class="asset_search__upper__input" @input="onPublishedAssetsSearchTextChange($event.target.value)" />
                <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt="" /></div>
              </div>
            </div>

            <div class="filters filters--no-left-spacing mt-xs-20">
              <div class="filters__block">
                <div class="filters__block__select">
                  <label for="filter">TYPE </label>
                  <select v-model="publishedAssetsTypeFilter" name="filter">
                    <option v-for="filterOption in publishedAssetsTypeFilterOptions" :key="filterOption.value" :value="filterOption.value">{{ filterOption.label }}</option>
                  </select>
                </div>
                <div class="filters__block__select">
                  <label for="filter">&uarr;&darr;</label>
                  <select v-model="publishedAssetsOrder" name="filter">
                    <option v-for="filterOption in publishedAssetsOrderOptions" :key="filterOption.label" :value="filterOption.label">{{ filterOption.label }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- a dummy hidden input to be cathced by validation observer if no pricing model is selected -->
            <div v-if="!selectedPublishedAssetForApiCreationLocal">
              <validation-provider v-slot="{ errors }" name="pricing models" rules="required">
                <div class="form-group mt-xs-20">
                  <!-- <input :value="pricingModels.length ? 'x' : ''" type="text"> -->
                  <input type="text" hidden>
                  <div class="errors" v-if="errors.length"><span class="mt-xs-20">Select an asset</span></div>
                </div>
              </validation-provider>
            </div>

            <div v-for="asset in publishedAssets" :key="asset.id">
              <asset-api-details-card @click.native="onSelectPublishedAsset(asset)" :selected="selectedPublishedAssetForApiCreationLocal && selectedPublishedAssetForApiCreationLocal.id === asset.id" :asset="asset"></asset-api-details-card>
            </div>
            <pagination class="mt-xs-20" :currentPage="publishedAssetsPaginationData.currentPage" :itemsPerPage="publishedAssetsPaginationData.itemsPerPage" :itemsTotal="publishedAssetsPaginationData.itemsTotal" @pageSelection="onPublishedAssetsPageSelect"></pagination>
          </div>
          <div v-else class="dashboard__form__step__title">
            <p>Selected data file</p>
            <asset-api-details-card :selected="true" :asset="asset"></asset-api-details-card>
          </div>
        </div>
        <!-- INHALT WORKING HERE -->
        <div class="col-md-4" v-if="creationType === 'TOPIO_DRIVE'">
          <div class="dashboard__form__step__title" v-if="!disabled">
            <p>Select one data file from your topio Drive</p>
            <p v-html="`${fileApi.name}`"></p>
            <file-topio-drive :fileApi.sync="fileApi"></file-topio-drive>
          </div>
          <div v-else class="dashboard__form__step__title">
            <p>Selected data file</p>
            <asset-api-details-card :selected="true" :asset="asset"></asset-api-details-card>
          </div>
        </div>

        <!-- RIGHT  -->
        <div class="col-md-4" v-show="creationType">
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
import FileTopioDrive from '@/components/Assets/CreateApiTopioDrive/FileTopioDrive.vue';
import Pagination from '@/components/Pagination.vue';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import store from '@/store';
import { CatalogueItem, CatalogueItemCommand, DraftApiFromFileCommand } from '@/model/catalogue';
import { Debounce } from 'vue-debounce-decorator';
import { Order } from '@/model/request';

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
    Pagination,
  },
})
export default class ApiDetails extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  @Prop({ required: true }) private serviceType!: EnumSpatialDataServiceType | null;

  @Prop({ required: true }) private selectedPublishedAssetForApiCreation!: CatalogueItem | null;

  @Prop({ required: true }) private apiCreationType!: CreationType;

  @Prop({ required: true }) private selectedPublishedFileForApiCreation!: DraftApiFromFileCommand | null;

  @Prop({ default: false }) private disabled!: boolean;

  providerAssetsApi: ProviderAssetsApi;

  assetLocal: CatalogueItemCommand;

  creationType: CreationType;

  serviceTypeLocal: EnumSpatialDataServiceType | null;

  publishedAssets: CatalogueItem[];

  fileApi: any | null;

  selectedPublishedAssetForApiCreationLocal: CatalogueItem | null;

  selectedPublishedFileForApiCreationLocal: DraftApiFromFileCommand | null;

  publishedAssetsSearchText: string;

  publishedAssetsTypeFilter: EnumAssetType | null;

  publishedAssetsTypeFilterOptions: { value: EnumAssetType | null, label: string }[];

  publishedAssetsOrder: string;

  publishedAssetsOrderOptions: { label: string, orderBy: EnumProviderAssetSortField, orderType: Order }[];

  publishedAssetsPaginationData: {
    currentPage: number,
    itemsPerPage: number,
    itemsTotal: number,
  };

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  constructor() {
    super();

    this.fileApi = {};

    this.providerAssetsApi = new ProviderAssetsApi();

    this.assetLocal = this.asset;
    this.serviceTypeLocal = this.serviceType;

    // this.creationType = this.apiCreationType;
    this.creationType = this.asset.parentDataSourceId ? CreationType.PUBLISHED_ASSET : '' as CreationType;
    console.log('assssssset', this.asset);
    console.log('apicreationtype', this.apiCreationType);

    this.publishedAssets = [];
    this.selectedPublishedAssetForApiCreationLocal = this.selectedPublishedAssetForApiCreation;
    this.selectedPublishedFileForApiCreationLocal = this.selectedPublishedFileForApiCreation;

    this.publishedAssetsSearchText = '';

    this.publishedAssetsTypeFilter = null;
    this.publishedAssetsTypeFilterOptions = [
      { value: null, label: 'ALL' },
      { value: EnumAssetType.VECTOR, label: 'VECTOR' },
      { value: EnumAssetType.RASTER, label: 'RASTER' },
      // { value: EnumAssetType.BUNDLE, label: 'BUNDLE' },
    ];

    this.publishedAssetsOrder = 'NEWEST';

    this.publishedAssetsOrderOptions = [
      { label: 'NEWEST', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, orderType: 'DESC' },
      { label: 'OLDEST', orderBy: EnumProviderAssetSortField.DATE_PUBLISHED, orderType: 'ASC' },
      { label: 'TITLE ASCENDING', orderBy: EnumProviderAssetSortField.TITLE, orderType: 'ASC' },
      { label: 'TITLE DESCENDING', orderBy: EnumProviderAssetSortField.TITLE, orderType: 'DESC' },
      { label: 'TYPE ASCENDING', orderBy: EnumProviderAssetSortField.TYPE, orderType: 'ASC' },
      { label: 'TYPE DESCENDING', orderBy: EnumProviderAssetSortField.TYPE, orderType: 'DESC' },
    ];

    this.publishedAssetsPaginationData = {
      currentPage: 0,
      itemsPerPage: 10,
      itemsTotal: 0,
    };
  }

  @Watch('creationType', { deep: true })
  onCreationTypeChange(creationType: CreationType): void {
    this.$emit('update:apiCreationType', creationType);
    if (creationType === 'TOPIO_DRIVE') {
      this.selectedPublishedAssetForApiCreationLocal = null;
    }
  }

  /**
   * STEP 2 -> B1 Control the published asset selection
   */
  @Watch('selectedPublishedAssetForApiCreationLocal')
  onSelectedPublishedAssetChange(asset: CatalogueItem): void {
    this.$emit('update:selectedPublishedAssetForApiCreation', asset);
  }

  /**
   * STEP 2 -> B2 Control the file selection
   */

  @Watch('fileApi', { deep: true })
  onFileApiChange(fileApi: DraftApiFromFileCommand | null): void {
    this.$emit('update:selectedPublishedFileForApiCreation', fileApi);
  }

  /**
   * STEP 2 -> C Control the file selection
   */

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    this.$emit('update:asset', asset);
  }

  @Watch('serviceTypeLocal')
  onServiceTypeChange(serviceType: EnumSpatialDataServiceType | null): void {
    // this.assetLocal.spatialDataServiceType = serviceType;
    Vue.set(this.assetLocal, 'spatialDataServiceType', serviceType);
  }

  @Watch('publishedAssetsSearchText')
  onDebouncedSearch(): void {
    this.loadPublishedAssets();
  }

  @Watch('publishedAssetsTypeFilter')
  onPublishedAssetsTypeFilterChange(): void {
    this.loadPublishedAssets();
  }

  @Watch('publishedAssetsOrder')
  onPublishedAssetsOrderChange(): void {
    this.loadPublishedAssets();
  }

  @Debounce(400)
  onPublishedAssetsSearchTextChange(searchText: string): void {
    this.publishedAssetsSearchText = searchText;
  }

  created(): void {
    if (this.apiCreationType === 'UNDEFINED') {
      this.creationType = CreationType.PUBLISHED_ASSET;
    }
    this.$emit('update:apiCreationType', this.creationType);

    this.loadPublishedAssets();
  }

  loadPublishedAssets(page = 0): void {
    store.commit('setLoading', true);

    this.selectedPublishedAssetForApiCreationLocal = null;

    const query: ProviderDraftQuery = {
      q: this.publishedAssetsSearchText,
      // type: this.publishedAssetsTypeFilter || [EnumAssetType.BUNDLE, EnumAssetType.VECTOR, EnumAssetType.RASTER],
      type: this.publishedAssetsTypeFilter || [EnumAssetType.VECTOR, EnumAssetType.RASTER],
      pageRequest: { page, size: this.publishedAssetsPaginationData.itemsPerPage },
      sorting: {
        id: this.publishedAssetsOrderOptions.find((x) => x.label === this.publishedAssetsOrder)?.orderBy || '' as EnumProviderAssetSortField,
        order: this.publishedAssetsOrderOptions.find((x) => x.label === this.publishedAssetsOrder)?.orderType || '' as Order,
      },
    };

    this.providerAssetsApi
      .find(query)
      .then((response) => {
        if (response.success) {
          this.publishedAssets = response.result.items;

          this.publishedAssetsPaginationData = {
            ...this.publishedAssetsPaginationData,
            currentPage: response.result.pageRequest.page,
            itemsTotal: response.result.count,
          };
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

  onPublishedAssetsPageSelect(page: number): void {
    const elem = document.querySelector('.dashboard__form__step__api_details .overflow-y');
    if (!elem) return;
    elem.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.loadPublishedAssets(page);
  }

  onSelectPublishedAsset(asset: CatalogueItem): void {
    this.selectedPublishedAssetForApiCreationLocal = asset;
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';
.overflow-y {
  max-height: 470px;
  overflow-y: auto;
  margin-bottom: 0 !important;
}
</style>
