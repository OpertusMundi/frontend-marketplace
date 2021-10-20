<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Metadata</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Identification</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Classification</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Geography</a></li>
        <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Temporal Reference</a></li>
        <li><a href="#" @click.prevent="activeTab = 5" :class="{ 'active' : activeTab == 5 }">Conformity & Lineage</a></li>
        <li><a href="#" @click.prevent="activeTab = 6" :class="{ 'active' : activeTab == 6 }">More</a></li>
      </ul>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1 && catalogueItem">
            <div class="asset__section__tabs__info_table">
              <p><strong>Title:</strong><span>{{ catalogueItem.title }}</span></p>
              <p><strong>Abstract:</strong><span>{{ catalogueItem.abstract }}</span></p>
              <p><strong>Type:</strong><span>{{ catalogueItem.type }}</span></p>
              <p><strong>Format:</strong><span>{{ catalogueItem.spatialDataServiceType }}</span></p>
              <p><strong>Language:</strong><span>{{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.language).name }}</span></p>
              <p><strong>Resource locator:</strong><span>{{ catalogueItem.resourceLocator }}</span></p>
              <p><strong>Version:</strong><span>{{ catalogueItem.version }}</span></p>
              <!-- <p><strong>Data coupled resource</strong><span>{{  }}</span></p> -->
              <!-- todo: check following -->
              <p><strong>Parent identifier (PID):</strong><span>{{ catalogueItem.parentId || catalogueItem.parentDataSourceId }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 2">
             <div class="asset__section__tabs__info_table">
              <p><strong>Keywords:</strong><span>{{ catalogueItem.keywords.map((x) => x.keyword).join(', ') }}</span></p>
              <p><strong>Topic Category:</strong><span>{{ catalogueItem.topicCategory.join(', ') }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 3">
            <div class="asset__section__tabs__info_table">
              <p><strong>Reference system:</strong><span>{{ crsLabel }}</span></p>
              <p><strong>Spatial resolution:</strong><span>{{ catalogueItem.spatialResolution }}</span></p>
              <p><strong>Scale:</strong><span>{{ catalogueItem.scales.map((x) => x.description).join(', ') }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 4">
            <div class="asset__section__tabs__info_table">
              <p><strong>Date start:</strong><span>{{ catalogueItem.dateStart ? formatDate(catalogueItem.dateStart) : '' }}</span></p>
              <p><strong>Date end:</strong><span>{{ catalogueItem.dateEnd ? formatDate(catalogueItem.dateEnd) : '' }}</span></p>
              <p><strong>Creation date:</strong><span>{{ catalogueItem.creationDate ? formatDate(catalogueItem.creationDate) : '' }}</span></p>
              <p><strong>Publication date:</strong><span>{{ catalogueItem.publicationDate ? formatDate(catalogueItem.publicationDate) : '' }}</span></p>
              <p><strong>Revision date:</strong><span>{{ catalogueItem.revisionDate ? formatDate(catalogueItem.revisionDate) : '' }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 5">
            <div class="asset__section__tabs__info_table">
              <p><strong>Conformity:</strong><span>{{ catalogueItem.conformity }}</span></p>
              <p><strong>Lineage:</strong><span>{{ catalogueItem.lineage }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 6">
            <div class="asset__section__tabs__info_table">
              <p><strong>Publisher name:</strong><span>{{ catalogueItem.publisherName }}</span></p>
              <p><strong>Publisher E-mail:</strong><span>{{ catalogueItem.publisherEmail }}</span></p>
              <!-- <p><strong>Additional resources:</strong><span>{{ catalogueItem.additionalResources }}</span></p> -->
              <p><strong>Public access limitations:</strong><span>{{ catalogueItem.publicAccessLimitations }}</span></p>
              <p><strong>Metadata language:</strong><span>{{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.metadataLanguage).name }}</span></p>
              <p><strong>Metadata version:</strong><span>{{ catalogueItem.version }}</span></p>
              <p><strong>Metadata date:</strong><span>{{ formatDate(catalogueItem.metadataDate) }}</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';
import { CatalogueItemDetails } from '@/model/catalogue';
import SpatialApi from '@/service/spatial';
import moment from 'moment';

@Component
export default class Metadata extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItem | CatalogueItemDetails;

  spatialApi: SpatialApi;

  activeTab: number;

  crsLabel: string;

  constructor() {
    super();

    this.spatialApi = new SpatialApi();

    console.log('abc', this.catalogueItem);

    this.activeTab = 1;

    this.crsLabel = '';
  }

  created(): void {
    if (this.catalogueItem.referenceSystem) {
      this.spatialApi.getEpsgCodes(this.catalogueItem.referenceSystem).then((epsgResponse) => {
        const epsg = epsgResponse.result.find((x) => `${x.code}` === this.catalogueItem.referenceSystem);
        if (epsg) this.crsLabel = `EPSG:${epsg.code} | ${epsg.name}`;
      });
    }
  }

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
