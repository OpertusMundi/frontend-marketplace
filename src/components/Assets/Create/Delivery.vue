<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--delivery">
      <div class="dashboard__form__step__delivery">
        <div class="dashboard__form__step__delivery__inner">
          <div class="dashboard__form__step__title">
            <h3>Asset delivery</h3>
            <p>Select how your asset will reach consumers.</p>
          </div>

          <div class="row">
            <div class="col-md-6">
              <validation-provider v-slot="{ errors }" name="Delivery method" rules="required">
              <div class="form-group">
                <!-- todo: fix values -->
                <label class="control control-radio">
                  By the platform
                  <span>You can upload your data asset securely in the platform. Customers will be able to download the data asset only after a transaction is made.</span>
                  <input type="radio" name="asset_delivery" v-model="deliveryMethod" :value="'DIGITAL_PLATFORM'" />
                  <div class="control_indicator"></div>
                </label>
                <label class="control control-radio">
                  Digital Provider
                  <span>Digital Provider</span>
                  <input type="radio" name="asset_delivery" v-model="deliveryMethod" :value="'DIGITAL_PROVIDER'" />
                  <div class="control_indicator"></div>
                </label>
                <label class="control control-radio">
                  Physical Provider
                  <span>Physical Provider.</span>
                  <input type="radio" name="asset_delivery" v-model="deliveryMethod" :value="'PHYSICAL_PROVIDER'" />
                  <div class="control_indicator"></div>
                </label>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
              </div>
              </validation-provider>
            </div>
            <div class="col-md-6">
              <div v-if="deliveryMethod === 'DIGITAL_PLATFORM'">
                <h1>Upload Asset</h1>
                <input type="file" @change="readFile($event)">
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="dashboard__form__step__delivery__inner" v-if="deliveryType === 'owm_means'">
          <div class="dashboard__form__step__title">
            <p>Please select one of the following options and provide the requested information. Delivery must take place within three (3) working days following a proof of payment provided to us by the consumer.</p>
          </div>
          <validation-provider v-slot="{ errors }" name="Own Means" rules="required">
          <div class="form-group">
            <label class="control control-radio">
              Digital delivery
              <input type="radio" name="asset_access" value="digital" />
              <div class="control_indicator"></div>
            </label>
            <label class="control control-radio">
              Physical media
              <input type="radio" name="asset_access" value="physical" />
              <div class="control_indicator"></div>
            </label>
            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
          </div>
          </validation-provider>
          <div class="dashboard__form__step__delivery__access dashboard__form__step__delivery__access--digital">
            <validation-provider v-slot="{ errors }" name="Notes for buyer" rules="required">
            <div class="form-group">
              <label for="asset_link">Notes for buyer</label>
              <textarea name="" id="" cols="20" rows="5"></textarea>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
            </validation-provider>
          </div>
          <div class="dashboard__form__step__delivery__access dashboard__form__step__delivery__access--physical">
            <validation-provider v-slot="{ errors }" name="Type of physical media" rules="required">
              <div class="form-group">
                <label for="">Type of physical media</label>
                <input type="text" class="form-group__text" id="">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="Number of objects" rules="required">
              <div class="form-group">
                <label for="">Number of objects</label>
                <input type="text" class="form-group__text" id="">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="Notes for buyer" rules="required">
            <div class="form-group">
              <label for="asset_link">Notes for buyer</label>
              <textarea name="" id="" cols="20" rows="5"></textarea>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
            </div>
            </validation-provider>
          </div>
        </div> -->
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Delivery extends Vue {
  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
  }

  deliveryMethod: string;

  fileToUpload: {isFileSelected: boolean, file: File, fileName: string, fileExtension: string};

  constructor() {
    super();

    this.deliveryMethod = '';

    this.fileToUpload = {
      isFileSelected: false,
      file: {} as File,
      fileName: '',
      fileExtension: '',
    };
  }

  @Watch('deliveryMethod')
  onDeliveryMethodChange(deliveryMethod: string): void {
    this.$emit('update:deliveryMethod', deliveryMethod);
  }

  // eslint-disable-next-line
  readFile(e): void {
    const [file] = e.srcElement.files;
    this.fileToUpload.isFileSelected = true;
    this.fileToUpload.file = file;
    this.fileToUpload.fileName = file.name;
    this.fileToUpload.fileExtension = file.name.split('.').pop();

    this.$emit('update:fileToUpload', this.fileToUpload);
  }

  // validate(): Promise<boolean> {
  //   return this.$refs.refObserver.validate();
  // }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
