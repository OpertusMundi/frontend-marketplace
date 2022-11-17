<template>
  <validation-observer ref="refObserver">

    <div class="row">
      <div class="col-md-4">
        <div class="dashboard__form__step__title">
          <p>Select specifically how the platform will have access to your asset</p>
        </div>
        <validation-provider v-slot="{ errors }" mode="passive" name="Platform access to your asset" rules="required">
          <div class="form-group">
            <label class="control control-radio">
              Link to asset
              <input type="radio" name="by_platform" v-model="type" value="LINK_TO_ASSET" />
              <div class="control_indicator"></div>
            </label>
            <label class="control control-radio">
              Select from Storage
              <input type="radio" name="by_platform" v-model="type" value="TOPIO_DRIVE" />
              <div class="control_indicator"></div>
            </label>
            <div class="errors" v-if="errors">
              <span v-for="error in errors" v-bind:key="error">{{ error }}</span>
            </div>
          </div>
        </validation-provider>
      </div>

      <div class="col-md-6">
        <template v-if="type === 'LINK_TO_ASSET'">
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
        </template>
        <template v-if="type === 'TOPIO_DRIVE'">
          <div class="dashboard__form__step__title">
            <p>Select an asset from your topio Drive.</p>
          </div>
          <file-topio-drive :fileApi.sync="fileTopioDrive"></file-topio-drive>
        </template>
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
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import FileTopioDrive from '@/components/Assets/CreateApiTopioDrive/FileTopioDrive.vue';
import { DraftApiFromFileCommand } from '@/model/catalogue';
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

interface LinkToAsset {
  url: string;
  fileName: string;
  encoding: string;
}

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
    FileTopioDrive,
  },
})
export default class OpenAssetDelivery extends Vue {
  @Prop({ required: true }) private linkToAsset!: LinkToAsset;

  @Prop({ required: true }) readonly format!: string;

  fileTopioDrive: any | null;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  type: string;

  linkToAssetLocal: LinkToAsset;

  popularEncodings: string[];

  constructor() {
    super();

    this.fileTopioDrive = {};

    this.type = 'LINK_TO_ASSET';

    this.linkToAssetLocal = { ...this.linkToAsset };

    this.popularEncodings = ['UTF-8', 'Windows-1251', 'Windows-1252', 'Windows-1253', 'ISO 8859-1', 'ISO 8859-2', 'ISO 8859-3', 'ISO 8859-4', 'ISO 8859-5', 'ISO 8859-7'];
  }

  @Watch('type')
  onTypeChange(): void {
    this.fileTopioDrive = {};
    this.linkToAssetLocal = { url: '', fileName: '', encoding: 'UTF-8' };
  }

  @Watch('fileTopioDrive', { deep: true })
  onfileTopioDriveChange(fileTopioDrive: DraftApiFromFileCommand | null): void {
    this.$emit('update:selectedPublishedFileForDataFileCreation', fileTopioDrive);
    console.log('Emit file from storage to CreatAsset component topio drive => ', fileTopioDrive);
  }

  @Watch('linkToAssetLocal', { deep: true })
  onLinkToAssetLocalChange(): void {
    console.log('link-to-asset change');
    this.$emit('update:linkToAsset', this.linkToAssetLocal);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
</style>
