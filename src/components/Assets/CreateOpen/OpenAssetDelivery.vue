<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step__title">
      <p>Select an asset from your topio Drive.</p>
    </div>
    <div class="col-md-4">
      <file-topio-drive :fileApi.sync="fileTopioDrive"></file-topio-drive>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component, Vue, Watch,
} from 'vue-property-decorator';
import { ValidationObserver } from 'vee-validate';
import FileTopioDrive from '@/components/Assets/CreateApiTopioDrive/FileTopioDrive.vue';
import { DraftApiFromFileCommand } from '@/model/catalogue';

@Component({
  components: {
    ValidationObserver,
    FileTopioDrive,
  },
})
export default class OpenAssetDelivery extends Vue {
  fileTopioDrive: any | null;

  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>;
  };

  constructor() {
    super();

    this.fileTopioDrive = {};
  }

  @Watch('fileTopioDrive', { deep: true })
  onfileTopioDriveChange(fileTopioDrive: DraftApiFromFileCommand | null): void {
    this.$emit('update:selectedPublishedFileForDataFileCreation', fileTopioDrive);
    console.log('Emit file from storage to CreatAsset component topio drive => ', fileTopioDrive);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
</style>
