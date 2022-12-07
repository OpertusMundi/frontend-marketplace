<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">

      <div class="row">
        <div class="col-md-7">
          <div class="dashboard__form__step__title">
            <h3>Collection Details</h3>
            <p>Give your new collection a title, versioning and a short description</p>
          </div>

          <validation-provider v-slot="{ errors }" name="Title" rules="required">
          <div class="form-group">
            <label for="metadata_title">Title *</label>
            <input type="text" class="form-group__text" name="metadata_title" id="metadata_title" v-model="assetLocal.title">
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
          <validation-provider v-slot="{ errors }" name="Abstract" rules="required">
            <div class="form-group">
              <label for="">Abstract *</label>
              <textarea v-model="assetLocal.abstract" placeholder="Short asset description"></textarea>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
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
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { CatalogueItemCommand } from '@/model';

@Component({
  components: { ValidationObserver, ValidationProvider },
})
export default class CollectionDetails extends Vue {
  @Prop({ required: true }) asset!: CatalogueItemCommand;

  assetLocal: CatalogueItemCommand = { ...this.asset };

  @Watch('assetLocal', { deep: true })
  onAssetChange(asset: CatalogueItemCommand): void {
    this.$emit('update:asset', asset);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
