<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <div class="d-flex space-between">
        <h4>Metadata</h4>
        <div class="asset__section__head__sample_download__btn" @click="downloadMetadata" v-show="!isSectionMinified">
          <svg data-name="Group 2342" xmlns="http://www.w3.org/2000/svg" width="15" height="16">
            <g data-name="Group 753">
              <g data-name="Group 752"><path data-name="Path 2224" d="M11.455 7.293A.5.5 0 0 0 11.002 7h-2V.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7h-2a.5.5 0 0 0-.376.829l3.5 4a.5.5 0 0 0 .752 0l3.5-4a.5.5 0 0 0 .077-.536z" fill="#333" /></g>
            </g>
            <g data-name="Group 755">
              <g data-name="Group 754"><path data-name="Path 2225" d="M13 11v3H2v-3H0v4a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4z" fill="#333" /></g>
            </g>
          </svg>
        </div>
      </div>
      <a href="#" class="asset__section__head__toggle" v-show="!isSectionMinified"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs" v-show="!isSectionMinified">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Identification</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Classification</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Geography</a></li>
        <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Temporal Reference</a></li>
        <li><a href="#" @click.prevent="activeTab = 5" :class="{ 'active' : activeTab == 5 }">Conformity & Lineage</a></li>
        <li><a href="#" @click.prevent="activeTab = 6" :class="{ 'active' : activeTab == 6 }">More</a></li>
      </ul>
    </div>
    <div class="asset__section__content" v-show="!isSectionMinified">
      <div class="asset__section__content__inner">
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1 && catalogueItem">
            <div class="asset__section__tabs__info_table">
              <p><strong>Title:</strong><span>{{ catalogueItem.title }}</span></p>
              <p><strong>Abstract:</strong><span>{{ catalogueItem.abstractText || catalogueItem.abstract }}</span></p>
              <p><strong>Type:</strong><span>{{ catalogueItem.type }}</span></p>
              <p><strong>Format:</strong><span>{{ catalogueItem.spatialDataServiceType || catalogueItem.format }}</span></p>
              <p><strong>Language:</strong><span>{{ catalogueItem.language ? $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.language).name : '' }}</span></p>
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
              <p><strong>Conformity:</strong><span>{{ catalogueItem.conformity ? $labelize(catalogueItem.conformity) : '' }}</span></p>
              <p><strong>Standard:</strong><span>{{ catalogueItem.conformityStandard }}</span></p>
              <p><strong>Lineage:</strong><span>{{ catalogueItem.lineage }}</span></p>
            </div>
          </li>
          <li v-if="activeTab == 6">
            <div class="asset__section__tabs__info_table">
              <template v-if="catalogueItem.openDataset">
                <p><strong>Publisher name:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').name }}</span></p>
                <p><strong>Publisher organisation name:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').organizationName }}</span></p>
                <p><strong>Publisher email:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').email }}</span></p>
                <p><strong>Publisher phone:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').phone }}</span></p>
                <p><strong>Publisher address:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').address }}</span></p>
                <p><strong class="mb-xs-20">Publisher service hours:</strong><span>{{ catalogueItem.responsibleParty.find((x) => x.role === 'PUBLISHER').serviceHours }}</span></p>
                <p><strong>Owner name:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').name || '' : ''}` }}</span></p>
                <p><strong>Owner organisation name:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').organizationName || '' : ''}` }}</span></p>
                <p><strong>Owner email:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').email || '' : ''}` }}</span></p>
                <p><strong>Owner phone:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').phone || '' : ''}` }}</span></p>
                <p><strong>Owner address:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').address || '' : ''}` }}</span></p>
                <p><strong class="mb-xs-20">Owner service hours:</strong><span>{{ `${catalogueItem.responsibleParty.some((x) => x.role === 'OWNER') ? catalogueItem.responsibleParty.find((x) => x.role === 'OWNER').serviceHours || '' : ''}` }}</span></p>
              </template>
              <template v-else>
                <!-- TODO (non-open datasets) -->
                <p><strong>Publisher name:</strong><span>{{ catalogueItem.publisherName }}</span></p>
                <p><strong>Publisher E-mail:</strong><span>{{ catalogueItem.publisherEmail }}</span></p>
                <p><strong>Public access limitations:</strong><span>{{ catalogueItem.publicAccessLimitations }}</span></p>
              </template>
              <p><strong>Metadata language:</strong><span>{{ catalogueItem.metadataLanguage ? $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === catalogueItem.metadataLanguage).name : '' }}</span></p>
              <p><strong>Metadata version:</strong><span>{{ catalogueItem.version }}</span></p>
              <p><strong>Metadata date:</strong><span>{{ catalogueItem.metadataDate ? formatDate(catalogueItem.metadataDate) : '' }}</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <a @click.prevent="isSectionMinified = !isSectionMinified" href="#" class="asset__section__toggle" :class="{'asset__section__toggle--upside-down': !isSectionMinified}"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import fileDownload from 'js-file-download';
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

  isSectionMinified = false;

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

  downloadMetadata(): void {
    const metadata = JSON.parse(JSON.stringify(this.catalogueItem));

    const propertiesToDelete = ['automatedMetadata', 'visibility', 'deliveryMethod', 'deliveryMethodOptions', 'parentId', 'parentDataSourceId', 'userOnlyForVas', 'vettingRequired', 'availableToPurchase', 'statistics', 'contract', 'favorite', 'owned', 'resources', 'pricingModels', 'ingestionInfo'];

    propertiesToDelete.forEach((x) => {
      delete metadata[x];
    });

    fileDownload(JSON.stringify(metadata), 'metadata.json');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_assets.scss";
</style>
