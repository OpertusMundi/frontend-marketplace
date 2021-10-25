<template>
  <section class="asset__section asset__section__overview">
    <div class="asset__section__head">
      <h4>Overview</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <div class="asset__section__overview__left">
          <h5>Description</h5>
          <p>{{ catalogueItem.abstract }}</p>
          <h5 v-if="catalogueItem.suitableFor">Suitable for:</h5>
          <ul>
            <li v-for="suitableFor in catalogueItem.suitableFor" v-bind:key="`${suitableFor}_suitable`">{{ suitableFor }}</li>
          </ul>
          <h5 v-if="catalogueItem.additionalResources">Additional resources:</h5>
          <!-- <a v-for="(additionalResources, index) in catalogueItem.additionalResources" v-bind:key="`${index}_aditional_r`" :href="additionalResources.uri" target="_blank" style="display:block">{{ additionalResources.text }}</a> -->
          <div class="asset__section__overview__resources">
            <div v-for="(additionalResource, index) in catalogueItem.additionalResources" :key="`${index}_aditional_r`" :class="{'asset__section__overview__resources__uri': additionalResource.type === 'URI', 'asset__section__overview__resources__file': additionalResource.type === 'FILE'}">
              <template v-if="additionalResource.type === 'URI'">
                <a :href="'//' + additionalResource.uri" target="_blank" style="display: block">{{ additionalResource.text || additionalResource.uri }}</a>
              </template>
              <template v-if="additionalResource.type === 'FILE'">
                <a href="#" @click.prevent="onDownloadAdditionalResource(additionalResource.id, additionalResource.fileName)">{{ additionalResource.fileName }}</a>
                <small>{{ additionalResource.description }}</small>
              </template>
            </div>
          </div>
        </div>
        <div class="asset__section__overview__right">
          <h5>Asset Info</h5>
          <!-- <p><strong>Language:</strong> {{ catalogueItem.language }} <br> -->
          <p><strong>Language:</strong> {{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.language) ? $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.language).name : '' }} <br>
          <strong>Temporal extent:</strong>
          <span v-if="catalogueItem.dateStart && catalogueItem.dateEnd">{{ formatDate(catalogueItem.dateStart) }} - {{ formatDate(catalogueItem.dateEnd) }}</span>
          <span v-if="catalogueItem.dateStart && !catalogueItem.dateEnd">From {{ formatDate(catalogueItem.dateStart) }}</span>
          <span v-if="!catalogueItem.dateStart && catalogueItem.dateEnd">Up to {{ formatDate(catalogueItem.dateEnd) }}</span>
          <span v-if="!catalogueItem.dateStart && !catalogueItem.dateEnd">Not specified</span>
          <h5>Tags</h5>
          <p>
            <span v-for="(keyword, i) in catalogueItem.keywords" :key="keyword.keyword">{{ keyword.keyword }}<span v-if="i !== catalogueItem.keywords.length - 1">, </span></span>
          </p>
          <!-- <div v-if="catalogueItemType == 'api'">
            <p>
              <span v-for="(tag, index) in catalogueItemDummyMetadata.distinct.feat_desc" :key="index">
                {{tag}}<span v-if="index < catalogueItemDummyMetadata.distinct.feat_desc.length - 1">,</span>
              </span>
            </p>
          </div>
          <div v-else></div> -->
        </div>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ProviderAssetsApi from '@/service/provider-assets';
import DraftAssetApi from '@/service/draft';
import { CatalogueItem } from '@/model';
import moment from 'moment';
import { saveAs } from 'file-saver';

@Component
export default class Overview extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  @Prop({ required: true }) readonly mode!: string;

  providerAssetsApi: ProviderAssetsApi;

  draftAssetApi: DraftAssetApi;

  constructor() {
    super();

    this.providerAssetsApi = new ProviderAssetsApi();
    this.draftAssetApi = new DraftAssetApi();
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM. YYYY');
  }

  onDownloadAdditionalResource(key: string, fileName: string): void {
    switch (this.mode) {
      case 'catalogue': {
        const pid = this.$route.params.id;

        this.providerAssetsApi.downloadAdditionalResource(pid, key).then((response) => {
          const blob = new Blob([(response as any).data]);

          saveAs(blob, fileName);
        });

        break;
      }
      case 'review': {
        const assetKey = this.$route.params.key;

        this.draftAssetApi.downloadAdditionalResource(assetKey, key).then((response) => {
          const blob = new Blob([(response as any).data]);

          saveAs(blob, fileName);
        });

        break;
      }
      default:
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
