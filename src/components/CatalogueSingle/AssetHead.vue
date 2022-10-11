<template>
  <div class="asset__head">
    <a href="" @click.prevent="$router.go(-1)" class="asset__head__breadcrumps"><img src="@/assets/images/icons/back_icon.svg" alt="">BACK</a>
    <div class="d-inline-flex">
      <topic-category-icon class="mr-xs-30" :type="catalogueItem.type === 'SERVICE' ? catalogueItem.spatialDataServiceType : catalogueItem.type"/>
    </div>
    <div class="asset__head__title">
      <h1>{{ catalogueItem.title }}</h1>
      <template v-if="mode === 'catalogue'">
        <a v-if="!catalogueItem.favorite" href="#" @click.prevent="onAddToFavorites(catalogueItem.id)">
          <img src="@/assets/images/icons/favorites/favorite_icon.svg" alt="">
        </a>
        <a v-else href="#" class="asset__head__favorites" @click.prevent="onRemoveFromFavorites(catalogueItem.favorite)">
          <img v-if="catalogueItem.favorite" src="@/assets/images/icons/favorites/favorite_icon--filled.svg" alt="">
        </a>
      </template>
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
        <li v-if="catalogueItem.type === 'SERVICE'"><strong>Service type:</strong>{{ catalogueItem.spatialDataServiceType }}</li>
        <li><strong>Version:</strong>{{ catalogueItem.version }}</li>
        <li v-if="catalogueItem.type !== 'SERVICE'"><strong>Last updated:</strong><span v-if="catalogueItem.revisionDate">{{ catalogueItem.revisionDate | format_date }}</span><span v-else>-</span></li>
        <li v-if="catalogueItem.type !== 'SERVICE'"><strong>Created:</strong><span v-if="catalogueItem.publicationDate">{{ catalogueItem.publicationDate | format_date }}</span><span v-else>-</span></li>
        <li v-if="catalogueItem.type !== 'SERVICE'"><strong>Topic:</strong><span v-for="(category, i) in catalogueItem.topicCategory" v-bind:key="`${category}_cat`">{{ category }}<span v-if="i !== catalogueItem.scales.length - 1">, </span></span></li>
        <li v-if="catalogueItem.type !== 'SERVICE'"><strong>Format:</strong>{{ catalogueItem.format }}</li>
        <!-- <li><strong>CRS:</strong>{{ catalogueItem.referenceSystem ? `EPSG:${catalogueItem.referenceSystem}` : '' }}</li> -->
        <li><strong>CRS:</strong>{{ crsLabel }}</li>
        <li v-if="catalogueItem.type !== 'SERVICE'"><strong>Scale:</strong><span v-for="(scale, i) in catalogueItem.scales" v-bind:key="`${scale}_scale`">{{ scale.description }}<span v-if="i !== catalogueItem.scales.length - 1">, </span></span></li>
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
import SpatialApi from '@/service/spatial';
import FavoriteApi from '@/service/favorite';
import { CatalogueItem } from '@/model';
import TopicCategoryIcon from '@/components/Catalogue/TopicCategoryIcon.vue';
import Modal from '@/components/Modal.vue';
import { CatalogueItemDetails } from '@/model/catalogue';
import store from '@/store';
import { EnumFavoriteType, FavoriteAssetCommand } from '@/model/favorite';

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
  @Prop({ required: true }) private catalogueItem!: CatalogueItem | CatalogueItemDetails;

  @Prop({ required: true }) private mode!: string;

  draftAssetApi: DraftAssetApi;

  spatialApi: SpatialApi;

  favoriteApi: FavoriteApi;

  // selectedVersion: string;

  crsLabel: string;

  modalToShow: string;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();
    this.spatialApi = new SpatialApi();
    this.favoriteApi = new FavoriteApi();

    // this.selectedVersion = '';

    this.crsLabel = '';

    this.modalToShow = '';
  }

  created(): void {
    if (this.catalogueItem.referenceSystem) {
      this.spatialApi.getEpsgCodes(this.catalogueItem.referenceSystem).then((epsgResponse) => {
        const epsg = epsgResponse.result.find((x) => `${x.code}` === this.catalogueItem.referenceSystem);
        if (epsg) this.crsLabel = `EPSG:${epsg.code} | ${epsg.name}`;
      });
    }
  }

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

  onAddToFavorites(pid: string): void {
    console.log('add to favorites');
    store.commit('setLoading', true);

    const assetData: FavoriteAssetCommand = {
      pid,
      type: EnumFavoriteType.ASSET,
    };

    this.favoriteApi.add(assetData).then((response) => {
      if (response.success) {
        console.log('added to favorites');
        this.$emit('reloadAsset');
      } else {
        console.log('error adding to favorites', response);
        store.commit('setLoading', false);
      }
    }).catch((err) => {
      console.log('error adding to favorites', err);
      store.commit('setLoading', false);
    });
  }

  onRemoveFromFavorites(assetKey: string): void {
    store.commit('setLoading', true);

    this.favoriteApi.remove(assetKey).then((response) => {
      if (response.success) {
        this.$emit('reloadAsset');
      } else {
        console.log('error removing from favorites', response);
        store.commit('setLoading', false);
      }
    }).catch((err) => {
      console.log('error removing from favorites', err);
      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
