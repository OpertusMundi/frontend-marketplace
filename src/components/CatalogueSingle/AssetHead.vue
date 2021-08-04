<template>
  <div class="asset__head">
    <a href="" @click.prevent="$router.go(-1)" class="asset__head__breadcrumps"><img src="@/assets/images/icons/back_icon.svg" alt="">BACK</a>
    <div class="d-inline-flex">
      <topic-category-icon class="mr-xs-30" v-for="category in catalogueItem.topicCategory" v-bind:key="`${category}_cat_icon`" :category="category"/>
    </div>
    <div class="asset__head__title">
      <h1>{{ catalogueItem.title }}</h1>
      <a v-if="mode === 'catalogue'" href="#" class="asset__head__favorites">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 33 31" style="enable-background:new 0 0 33 31;" xml:space="preserve">
          <path style="fill:#FFFFFF;"
                d="M16.5,30.7l-3.2-2.9C5.6,20.8,0.4,16.1,0.4,9.9c0-5.2,4.1-9.3,9.3-9.3c2.5,0,4.9,1,6.8,2.7c1.8-1.7,4.2-2.7,6.8-2.7c5.2,0,9.3,4.1,9.3,9.3c0,6.1-5.1,10.8-12.9,18L16.5,30.7z M9.7,2.6c-4.1,0-7.3,3.2-7.3,7.3c0,5.2,4.9,9.7,12.2,16.5l1.8,1.6l1.8-1.6c7.4-6.8,12.2-11.2,12.2-16.5c0-4.1-3.2-7.3-7.3-7.3c-2.3,0-4.5,1.1-6,2.8l-0.8,0.9l-0.8-0.9C14.2,3.7,12,2.6,9.7,2.6z"/>
          <path style="fill:#FFFFFF;" d="M16.5,29.4l-2.2-2C6.6,20.3,1.4,15.7,1.4,9.9c0-4.7,3.6-8.3,8.3-8.3c2.6,0,5.1,1.2,6.8,3.2c1.7-2,4.1-3.2,6.8-3.2c4.7,0,8.3,3.6,8.3,8.3c0,5.8-5.1,10.4-12.9,17.5L16.5,29.4z"/>
        </svg>
      </a>
      <div v-if="mode === 'review'">
        <button class="btn btn--std btn--outlineblue" @click="acceptDraft">accept</button>
        <button class="btn btn--std btn--outlineblue ml-xs-10" @click="modalToShow = 'rejectDraft'">reject</button>
      </div>
    </div>
    <!-- <div class="asset__head__version"> -->
      <!-- <div class="custom-select">
        <select name="version" v-model="selectedVersion">
          <option :value="version" v-for="version in catalogueItem.versions" v-bind:key="`${version}_version`">VERSION {{ version }}</option>
        </select>
      </div> -->
      <!-- <div class="asset__head__rating rating">
        <span v-for="index in 5" v-bind:key="`${index}_rating`" :class="{ 'active' : index <= catalogueItem.statistics.rating }">★</span>
        <i>{{catalogueItem.statistics.rating ? catalogueItem.statistics.rating : '- '}}/5</i>
      </div> -->
    <!-- </div> -->
    <!-- <div class="asset__head__data" v-if="catalogueItemType == 'api'">
      <ul>
        <li><strong>Last updated:</strong>{{ catalogueItem.revisionDate | format_date }}</li>
        <li><strong>Created:</strong>{{ catalogueItem.publicationDate | format_date }}</li>
        <li><strong>Scale:</strong> 1:5,000 urban areas, 1:10,000 provincial areas</li>
        <li><strong>Coverage:</strong>97% of Greece</li>
      </ul>
    </div> -->
    <div class="asset__head__data">
      <ul>
        <li><strong>Version:</strong>{{ catalogueItem.version }}</li>
        <li><strong>Last updated:</strong>{{ catalogueItem.revisionDate | format_date }}</li>
        <li><strong>Created:</strong>{{ catalogueItem.publicationDate | format_date }}</li>
        <li><strong>Topic:</strong><span v-for="(category, i) in catalogueItem.topicCategory" v-bind:key="`${category}_cat`">{{ category }}<span v-if="i !== catalogueItem.scales.length - 1">, </span></span></li>
        <li><strong>Format:</strong>{{ catalogueItem.format }}</li>
        <li><strong>CRS:</strong>{{ catalogueItem.referenceSystem }}</li>
        <li><strong>Scale:</strong><span v-for="(scale, i) in catalogueItem.scales" v-bind:key="`${scale}_scale`">{{ scale.description }}<span v-if="i !== catalogueItem.scales.length - 1">, </span></span></li>
        <!-- <li><strong>Coverage:</strong>97% of Greece (DUMMY)</li> -->
      </ul>
    </div>
    <!-- MODALS -->
    <modal :modalId="'modalRejectDraft'" :show="modalToShow === 'rejectDraft'" @dismiss="modalToShow = ''" @submit="rejectDraft" :title="'Reject asset?'" :inputs="[{id: 'reason', name: 'reason', type: 'text'}]"></modal>
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Prop,
  Component,
} from 'vue-property-decorator';
import moment from 'moment';
import DraftAssetApi from '@/service/draft';
import { CatalogueItem } from '@/model';
import TopicCategoryIcon from '@/components/Catalogue/TopicCategoryIcon.vue';
import Modal from '@/components/Modal.vue';

@Component({
  components: {
    TopicCategoryIcon,
    Modal,
  },
  filters: {
    format_date(value) {
      return moment(value).format('DD MMM. YYYY');
    },
  },
})
export default class AssetHead extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItem;

  @Prop({ required: true }) private mode!: string;

  draftAssetApi: DraftAssetApi

  // selectedVersion: string;

  modalToShow: string;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    // this.selectedVersion = '';

    this.modalToShow = '';
  }

  // @Watch('catalogueItem', { deep: true, immediate: true })
  // onCatalogueItemLoaded(): void {
  //   this.selectedVersion = this.catalogueItem.version;
  // }

  acceptDraft(): void {
    const { key } = this.$route.params;
    console.log('key', key);
    this.draftAssetApi.acceptDraft(key).then(() => {
      console.log('accepted!!');
      // todo
      this.$router.push('/dashboard');
    });
  }

  // eslint-disable-next-line
  rejectDraft(data: any): void {
    const { key } = this.$route.params;
    const reasonMsg = data.inputValues[0].value;
    this.modalToShow = '';
    this.draftAssetApi.rejectDraft(key, reasonMsg).then(() => {
      console.log('rejected');
      // todo
      this.$router.push('/dashboard');
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
