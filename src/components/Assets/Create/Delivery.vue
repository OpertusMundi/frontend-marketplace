<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">
      <div class="dashboard__form__step__delivery">
        <div class="dashboard__form__step__delivery__inner">
          <div class="dashboard__form__step__title">
            <h3>Asset delivery</h3>
            <p>Select how your asset will reach consumers.</p>
          </div>

          <div class="row">
            <div class="col-md-4">
              <validation-provider v-slot="{ errors }" name="Delivery method" rules="required">
                <div class="form-group">
                  <!-- todo: fix values -->
                  <label class="control control-radio">
                    By the platform
                    <span>You can upload your data asset securely in the platform. Customers will be able to download the data asset only after a transaction is made.</span>
                    <input type="radio" name="asset_delivery" v-model="byOwnMeans" value="DIGITAL_PLATFORM" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    By own means
                    <span>If your data is too large, updated daily, or you do not want to use our repository services, you can handle the delivery of the data asset to consumer through your own channel. </span>
                    <input type="radio" name="asset_delivery" v-model="byOwnMeans" value="MEANS" />
                    <div class="control_indicator"></div>
                  </label>
                  <div class="errors" v-if="errors">
                    <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
                  </div>
                </div>
              </validation-provider>
            </div>

            <div class="col-md-4" v-if="byOwnMeans === 'DIGITAL_PLATFORM' && byOwnMeans !== 0">
              <div class="dashboard__form__step__title">
                <p>Select specifically how the platform will have access to your asset</p>
              </div>
              <validation-provider v-slot="{ errors }" mode="passive" name="Platform access to your asset" rules="required">
                <div class="form-group">
                  <label class="control control-radio">
                    Direct upload
                    <input type="radio" name="by_platform" v-model="byPlatform" value="DIRECT_UPLOAD" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Link to asset
                    <input type="radio" name="by_platform" v-model="byPlatform" value="LINK_TO_ASSET" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Select from Storage
                    <input type="radio" name="by_platform" v-model="byPlatform" value="TOPIO_DRIVE" />
                    <div class="control_indicator"></div>
                  </label>
                  <div class="errors" v-if="errors">
                    <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
                  </div>
                </div>
              </validation-provider>
            </div>
            <div class="col-md-4" v-else-if="byOwnMeans === 'MEANS' && byOwnMeans !== 0">
              <div class="dashboard__form__step__title">
                <p>
                  Select one of the following options and provide the requested information. Delivery must take place within three (3) working days following a proof of payment provided to us by the consumer.
                </p>
              </div>
              <validation-provider v-slot="{ errors }" mode="passive" name="Delivery type" rules="required">
                <div class="form-group">
                  <label class="control control-radio">
                    Digital delivery
                    <input type="radio" name="asset_provider" v-model="deliveryMethodLocal" value="DIGITAL_PROVIDER" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Physical media
                    <input type="radio" name="asset_provider" v-model="deliveryMethodLocal" value="PHYSICAL_PROVIDER" />
                    <div class="control_indicator"></div>
                  </label>
                  <div class="errors" v-if="errors">
                    <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
                  </div>
                </div>
              </validation-provider>
            </div>

            <div v-if="byPlatform === 'DIRECT_UPLOAD' && byOwnMeans === 'DIGITAL_PLATFORM'" class="col-md-4">
              <div class="dashboard__form__step__title">
                <p>Please note that hosting your data asset is free for up to 20GB.</p>
              </div>
              <div>
                <!-- <p v-for="resource in resources" :key="resource.id">{{ resource.fileName }}</p> -->
                <div class="d-inline-flex mb-xs-20">
                  <div v-for="resource in resources" :key="resource.id" class="resource-label">
                    {{ resource.fileName }}
                    <div @click="removeResource(resource.id)" class="resource-label__remove-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="9.061" height="9.061" viewBox="0 0 9.061 9.061"><g data-name="Group 2880" fill="none" stroke="#190aff" stroke-width="1.5"><path data-name="Line 135" d="m0 0 8 8" transform="translate(.53 .53)"/><path data-name="Line 136" d="m0 8 8-8" transform="translate(.53 .53)"/></g></svg>
                    </div>
                  </div>
                </div>
                <h1>Upload Asset</h1>
                <input type="file" @change="readFile($event)" />

                <!-- a dummy hidden input to be cathced by validation observer if no file selected -->
                <div v-if="!fileToUploadLocal.isFileSelected && resources.length === 0">
                  <validation-provider v-slot="{ errors }" name="Upload" rules="required">
                    <div class="form-group mt-xs-20">
                      <input type="text" hidden />
                      <div class="errors" v-if="errors.length">
                        <span class="mt-xs-20">Upload is required</span>
                      </div>
                    </div>
                  </validation-provider>
                </div>

                <template v-if="fileToUploadLocal.isFileSelected">
                  <validation-provider v-slot="{ errors }" rules="required">
                    <div class="form-group mt-xs-20">
                      <label for="fileEncoding">Encoding</label>
                      <multiselect :options="popularEncodings" :taggable="true" :multiple="false" v-model="fileToUploadLocal.encoding" @tag="fileToUploadLocal = { ...fileToUploadLocal, encoding: $event }" tag-placeholder="Custom encoding"></multiselect>
                      <div class="errors" v-if="errors.length">
                        <span class="mt-xs-20">Encoding is required</span>
                      </div>
                    </div>
                  </validation-provider>
                </template>
              </div>
            </div>
            <div v-else-if="byPlatform === 'LINK_TO_ASSET' && byOwnMeans === 'DIGITAL_PLATFORM'" class="col-md-4">
              <div class="dashboard__form__step__title">
                <p>
                  Please provide a direct web accessible link for the system to download the file from.
                </p>
              </div>
              <div>
                <validation-provider v-slot="{ errors }" name="URL" rules="required|secure_link">
                  <div class="form-group">
                    <label for="linkToAssetURL">URL *</label>
                    <input type="text" class="form-group__text" name="linkToAssetURL" id="linkToAssetURL" placeholder="Paste link here" v-model="linkToAssetLocal.url">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="File name" :rules="`required|filename_extension:${format}`">
                  <div class="form-group">
                    <label for="linkToAssetFileName">File name *</label>
                    <input type="text" class="form-group__text" name="linkToAssetFileName" id="linkToAssetFileName" placeholder="" v-model="linkToAssetLocal.fileName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" rules="required">
                  <div class="form-group mt-xs-20">
                    <label for="fileEncoding">Encoding</label>
                    <multiselect :options="popularEncodings" :taggable="true" :multiple="false" v-model="linkToAssetLocal.encoding" @tag="linkToAssetLocal = { ...linkToAssetLocal, encoding: $event }" tag-placeholder="Custom encoding"></multiselect>
                    <div class="errors" v-if="errors.length">
                      <span class="mt-xs-20">Encoding is required</span>
                    </div>
                  </div>
                </validation-provider>
              </div>
            </div>
            <div v-else-if="byPlatform === 'TOPIO_DRIVE' && byOwnMeans === 'DIGITAL_PLATFORM'" class="col-md-4">
              <div class="d-inline-flex mb-xs-20" v-if="resources && resources.length">
                <div v-for="resource in resources" :key="resource.id" class="resource-label">
                  {{ resource.fileName }}
                  <div @click="removeResource(resource.id)" class="resource-label__remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9.061" height="9.061" viewBox="0 0 9.061 9.061"><g data-name="Group 2880" fill="none" stroke="#190aff" stroke-width="1.5"><path data-name="Line 135" d="m0 0 8 8" transform="translate(.53 .53)"/><path data-name="Line 136" d="m0 8 8-8" transform="translate(.53 .53)"/></g></svg>
                  </div>
                </div>
              </div>
              <div class="dashboard__form__step__title">
                <p>Select an asset from your topio Drive.</p>
              </div>
              <validation-provider v-slot="{ errors }" rules="required">
                <div class="form-group mt-xs-20">
                  <label for="fileEncoding">Encoding</label>
                  <multiselect :options="popularEncodings" :taggable="true" :multiple="false" v-model="fileTopioDriveEncoding" @tag="fileTopioDriveEncoding = $event" tag-placeholder="Custom encoding"></multiselect>
                  <div class="errors" v-if="errors.length">
                    <span class="mt-xs-20">Encoding is required</span>
                  </div>
                </div>
              </validation-provider>
              <div>
                <file-topio-drive :fileApi.sync="fileTopioDrive"></file-topio-drive>
              </div>
            </div>
            <div v-if="deliveryMethodLocal === 'DIGITAL_PROVIDER' && byOwnMeans === 'MEANS'" class="col-md-4">
              <div class="dashboard__form__step__title">
                <p>
                  Fill in any information you believe is important for the delivery of your asset.
                </p>
              </div>
              <div class="form-group">
                <label for="">Notes for buyer</label>
                <textarea class="form-group__text" cols="20" rows="5" value="test"></textarea>
              </div>
            </div>
            <div v-if="deliveryMethodLocal === 'PHYSICAL_PROVIDER' && byOwnMeans === 'MEANS'" class="col-md-4">
              <div class="dashboard__form__step__title">
                <p>
                  Fill in any information you believe is important for the delivery of your asset.
                </p>
              </div>
              <div class="form-group">
                <label for="">Type of physical media</label>
                <input type="text" name="typeMedia" class="form-group__text" id="" />
                <label for="">Number of objects</label>
                <input type="text" name="numberObjects" class="form-group__text" id="" />
                <label for="">Notes for buyer</label>
                <textarea class="form-group__text" cols="20" rows="5" value="notes for buyer"></textarea>
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
  Component, Vue, Watch, Prop,
} from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import { EnumDeliveryMethod, DraftApiFromFileCommand } from '@/model/catalogue';
import FileTopioDrive from '@/components/Assets/CreateApiTopioDrive/FileTopioDrive.vue';
import { EnumResourceSource, EnumResourceType, FileResource } from '@/model/asset';
import store from '@/store';

const secureLinkValidator = {
  message() {
    return 'A secure (https://) URL is required';
  },
  validate(value: string) {
    if (value.startsWith('https://')) return true;
    return false;
  },
};

const fileNameExtensionValidator = {
  message(value: string, args: any) {
    const format = args[0];
    const { fileTypes } = store.getters.getConfig?.configuration?.asset;
    return `File name must have one of the following extensions: ${(fileTypes.some((x) => x.format === format) ? fileTypes.find((x) => x.format === format).extensions : []).join(', ')}`;
  },
  validate(value: string, args: any) {
    const format = args[0];
    const { fileTypes } = store.getters.getConfig?.configuration?.asset;
    if (!fileTypes) return false;
    const acceptedExtensions = fileTypes.some((x) => x.format === format) ? fileTypes.find((x) => x.format === format).extensions : [];

    if (acceptedExtensions.some((x) => value.endsWith(`.${x}`) && value.split('.')[0])) return true;
    return false;
  },
};

extend('required', required);
extend('secure_link', secureLinkValidator);
extend('filename_extension', fileNameExtensionValidator);

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
    FileTopioDrive,
  },
})
export default class Delivery extends Vue {
  @Prop({ required: true }) private deliveryMethod!: EnumDeliveryMethod;

  @Prop({ required: true }) private fileToUpload!: FileToUpload;

  @Prop({ required: true }) private linkToAsset!: LinkToAsset;

  @Prop({ required: true }) private resources!: FileResource[];

  @Prop({ required: true }) readonly format!: string;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  deliveryMethodLocal: EnumDeliveryMethod | null;

  fileToUploadLocal: FileToUpload;

  byOwnMeans: any | null;

  byPlatform: 'DIRECT_UPLOAD' | 'LINK_TO_ASSET' | 'TOPIO_DRIVE' | null;

  linkToAssetLocal: LinkToAsset;

  fileTopioDrive: any | null;

  fileTopioDriveEncoding = 'UTF-8';

  popularEncodings: string[];

  constructor() {
    super();

    this.deliveryMethodLocal = this.deliveryMethod;

    this.fileToUploadLocal = { ...this.fileToUpload };

    this.byOwnMeans = 0;

    this.byPlatform = null;

    this.linkToAssetLocal = { ...this.linkToAsset };

    this.fileTopioDrive = {};

    this.popularEncodings = ['UTF-8', 'Windows-1251', 'Windows-1252', 'Windows-1253', 'ISO 8859-1', 'ISO 8859-2', 'ISO 8859-3', 'ISO 8859-4', 'ISO 8859-5', 'ISO 8859-7'];
  }

  created(): void {
    if (this.resources.length && this.resources[0].type === EnumResourceType.FILE) {
      if (this.resources[0].source && this.resources[0].source === EnumResourceSource.UPLOAD) {
        this.byOwnMeans = 'DIGITAL_PLATFORM';
        this.byPlatform = 'DIRECT_UPLOAD';
      }
      if (this.resources[0].source && this.resources[0].source === EnumResourceSource.FILE_SYSTEM) {
        this.byOwnMeans = 'DIGITAL_PLATFORM';
        this.byPlatform = 'TOPIO_DRIVE';
      }
    }
  }

  @Watch('byPlatform')
  onPlatformDeliveryMethodChange(): void {
    this.fileToUploadLocal = { ...this.fileToUploadLocal, isFileSelected: false, encoding: 'UTF-8' };
    this.linkToAssetLocal = { url: '', fileName: '', encoding: 'UTF-8' };
    this.fileTopioDrive = {};
  }

  @Watch('deliveryMethodLocal')
  onDeliveryMethodChange(deliveryMethod: EnumDeliveryMethod): void {
    this.$emit('update:deliveryMethod', deliveryMethod);
  }

  @Watch('byOwnMeans')
  onByOwnMeans(value: string): void {
    if (value === 'MEANS') {
      this.deliveryMethodLocal = null;
      this.byPlatform = null;
    } else {
      this.$emit('update:deliveryMethod', EnumDeliveryMethod.DIGITAL_PLATFORM);
    }
  }

  @Watch('fileTopioDrive', { deep: true })
  onfileTopioDriveChange(fileTopioDrive: DraftApiFromFileCommand | null): void {
    // this.fileToUploadLocal = {
    //   isFileSelected: false,
    //   file: {} as File,
    //   fileName: '',
    //   fileExtension: '',
    //   crs: '',
    //   encoding: '',
    // };

    this.$emit('update:selectedPublishedFileForDataFileCreation', { ...fileTopioDrive, encoding: this.fileTopioDriveEncoding });
    this.$emit('update:fileToUpload', this.fileToUploadLocal);
    console.log('Emit file from storage to CreatAsset component topio drive => ', fileTopioDrive);
  }

  @Watch('fileToUploadLocal', { deep: true })
  onFileToUploadChange(): void {
    console.log('file-to-upload change');
    this.$emit('update:fileToUpload', this.fileToUploadLocal);
  }

  @Watch('linkToAssetLocal', { deep: true })
  onLinkToAssetLocalChange(): void {
    console.log('link-to-asset change');
    this.$emit('update:linkToAsset', this.linkToAssetLocal);
  }

  // eslint-disable-next-line
  readFile(e): void {
    console.log(e);
    const [file] = e.srcElement.files;

    this.fileToUploadLocal = {
      ...this.fileToUploadLocal,
      isFileSelected: true,
      file,
      fileName: file.name,
      fileExtension: file.name.split('.').pop(),
    };
  }

  removeResource(id: string): void {
    console.log(id);
    this.$emit('removeResource', id);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
</style>
