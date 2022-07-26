<template>
  <div class="graphcard">
    <div class="graphcard__head">
      <div class="graphcard__head__data">
        <div class="graphcard__head__data__left">
          <h3>{{ cardHeading }}</h3>
          <p>{{ cardDescription }}</p>
        </div>
        <div class="graphcard__head__data__right">
          <ul>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(temporalUnitEnum.DAY)" :class="{ active: temporalUnit === temporalUnitEnum.DAY }">DAY</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(temporalUnitEnum.WEEK)" :class="{ active: temporalUnit === temporalUnitEnum.WEEK }">WEEK</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(temporalUnitEnum.MONTH)" :class="{ active: temporalUnit === temporalUnitEnum.MONTH }">MONTH</a>
            </li>
            <li>
              <a href="#" @click.prevent="setTemporalUnit(temporalUnitEnum.YEAR)" :class="{ active: temporalUnit === temporalUnitEnum.YEAR }">YEAR</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="graphcard__head__filters">
        <div class="graphcard__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[1]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
          <multiselect v-model="selectedAssets[2]" :options="filteredAssets(assets)" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
        </div>
        <div class="graphcard__head__filters__time">
          <DataRangePicker :dataRangeMin.sync="temporalUnitMin" :dataRangeMax.sync="temporalUnitMax" @triggerchange="onDateTimeChange" @init="setInitialDate" />
        </div>
      </div>
    </div>
    <div class="pie-container">
      <PieChartSubscriberApi v-if="selectedAssets.length > 0"
                :index="0"
                :asset-query="selectedAssets"
                :time="timeParams"
                :pieColor="bluePalette" />
      <PieChartSubscriberApi v-if="selectedAssets.length >= 2"
                :index="1"
                :asset-query="selectedAssets"
                :time="timeParams"
                :pieColor="greenPalette" />
      <PieChartSubscriberApi v-if="selectedAssets.length === 3"
                :index="2"
                :asset-query="selectedAssets"
                :time="timeParams"
                :pieColor="magentaPalette" />
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import AssetSelector from '@/components/AssetSelector.vue';
import DataRangePicker from '@/components/DataRangePicker.vue';
import DraftAssetApi from '@/service/draft';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AssetMiniCardProvider from '@/components/Assets/AssetMiniCardProvider.vue';
import { EnumAssetSource, EnumTemporalUnit } from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import PieChartSubscriberApi from '@/components/Charts/PieChartSubscriberApi.vue';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import { CatalogueItem, CatalogueQueryResponse } from '@/model';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';
import ProviderAssetsApi from '@/service/provider-assets';

exportingInit(Highcharts);

interface TemporalDimension {
  /**
   * Time interval unit (required)
   */
  unit: EnumTemporalUnit;
  /**
   * Min date in YYYY-MM-DD ISO format
   */
  min?: string;
  /**
   * Max date in YYYY-MM-DD ISO format
   */
  max?: string;
}

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCardProvider,
    DataRangePicker,
    PieChartSubscriberApi,
    highcharts: Chart,
  },
})
export default class PieSubscribersApi extends Vue {
  @Prop({ default: null }) private assetSourceEnum!: EnumAssetSource;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  @Prop({ default: '' }) private cardDescription!: string;

  draftAssetApi: DraftAssetApi;

  assets: CatalogueItem[];

  selectedAssets: CatalogueItem[];

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  bluePalette: string[];

  greenPalette: string[];

  magentaPalette: string[];

  timeParams: TemporalDimension | null;

  temporalUnitEnum: typeof EnumTemporalUnit;

  ProviderAssetsApi: ProviderAssetsApi;

  constructor() {
    super();

    this.draftAssetApi = new DraftAssetApi();

    this.assets = [];

    this.selectedAssets = [];

    this.temporalUnitMin = '';

    this.temporalUnitMax = '';

    this.temporalUnit = EnumTemporalUnit.DAY;

    this.temporalUnitEnum = EnumTemporalUnit;

    this.timeParams = {
      unit: EnumTemporalUnit.DAY,
      min: this.temporalUnitMin,
      max: this.temporalUnitMax,
    };

    this.ProviderAssetsApi = new ProviderAssetsApi();

    this.bluePalette = ['rgb(0,0,146)', 'rgb(0,0,183)', 'rgb(0,0,219)', 'rgb(25,10,255)', 'rgb(61,46,255)', 'rgb(97,82,255)', 'rgb(134,119,255)', 'rgb(170,155,255)', 'rgb(207,192,255)', 'rgb(243,228,255)'];

    this.greenPalette = ['rgb(0,71,67)', 'rgb(17,107,103)', 'rgb(53,143,139)', 'rgb(89,179,175)', 'rgb(125,215,211)', 'rgb(162,252,248)', 'rgb(198,255,255)'];

    this.magentaPalette = ['rgb(59,0,72)', 'rgb(96,0,109)', 'rgb(132,31,145)', 'rgb(168,67,181)', 'rgb(204,103,217)', 'rgb(240,139,253)', 'rgb(255,176,255)'];
  }

  async mounted(): Promise<any> {
    await this.getAssets();
  }

  filteredAssets(assets: CatalogueItem[]): any {
    return assets.filter((asset) => this.selectedAssets.every((selected) => selected.id !== asset.id));
  }

  getAssets(): void {
    const query: ProviderDraftQuery = {
      q: '',
      type: EnumAssetType.VECTOR,
      pageRequest: {
        page: 0,
        size: 100,
      },
      sorting: {
        id: EnumProviderAssetSortField.TYPE,
        order: 'ASC',
      },
    };
    this.ProviderAssetsApi.find(query)
      .then((response: CatalogueQueryResponse) => {
        if (response.success) {
          this.assets = response.result.items.map((item) => ({
            ...item,
            price: getPriceOrMinimumPrice(item),
            priceRendered: renderedPriceAsString(getPriceOrMinimumPrice(item)),
          }));
        }
      });
  }

  onDateTimeChange(): void { // cast time on datetime change
    this.timeParams = {
      unit: this.temporalUnit,
      min: this.temporalUnitMin,
      max: this.temporalUnitMax,
    };
  }

  setTemporalUnit(value: EnumTemporalUnit): void { // cast time on temporal unit change
    this.temporalUnit = value;
    this.timeParams = {
      unit: this.temporalUnit,
      min: this.temporalUnitMin,
      max: this.temporalUnitMax,
    };
  }

  setInitialDate(date: { min: string; max: string; }): void { // cast time when datepicker mounts
    this.timeParams = {
      unit: this.temporalUnit,
      min: date.min,
      max: date.max,
    };
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_table.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
