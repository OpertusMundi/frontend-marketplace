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
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
        </div>
        <!-- MIDDLE  -->
        <div class="col-md-4">
          <div class="dashboard__form__step__title">
            <p>Select one of your published data files</p>
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
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
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
  Watch,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import ProviderAssetsApi from '@/service/provider-assets';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import { CatalogueItemCommand } from '@/model/catalogue';

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
  },
})
export default class ApiDetails extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  @Prop({ required: true }) private serviceType!: EnumSpatialDataServiceType | null;

  providerAssetsApi: ProviderAssetsApi;

  assetLocal: CatalogueItemCommand;

  creationType: CreationType;

  serviceTypeLocal: EnumSpatialDataServiceType | null;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
  }

  constructor() {
    super();

    this.providerAssetsApi = new ProviderAssetsApi();

    this.assetLocal = this.asset;
    this.serviceTypeLocal = this.serviceType;

    this.creationType = CreationType.UNDEFINED;
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

  created(): void {
    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.SERVICE,
      pageRequest: { page: 0, size: 1000 },
      sorting: { id: EnumProviderAssetSortField.TITLE, order: 'ASC' },
    };
    this.providerAssetsApi.find(query).then((response) => {
      if (response.success) {
        console.log('successfully fetched provider assets', response);
      } else {
        console.log('error fetching provider assets', response);
      }
    }).catch((err) => {
      console.log('err', (err));
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
