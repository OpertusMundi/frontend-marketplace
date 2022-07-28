<template>
  <div class="bar_chart">
    <div class="bar_chart__head">
      <div class="bar_chart__head__filters">
        <div class="bar_chart__head__filters__assets">
          <multiselect v-model="selectedAssets[0]" :options="assets" :searchable="true" :close-on-select="true" :show-labels="false" label="title" placeholder="Select asset">
            <template slot="option" slot-scope="props">
              <AssetMiniCardProvider :asset="props.option"></AssetMiniCardProvider>
            </template>
          </multiselect>
        </div>
        <div class="bar_chart__head__filters__time">
          <DataRangePicker :dataRangeMin.sync="temporalUnitMin" :dataRangeMax.sync="temporalUnitMax" v-on:triggerchange="getAnalytics()" />
        </div>
      </div>
    </div>
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
    <div class="placeholder" v-else></div>
  </div>
</template>
<script lang="ts">
import {
  Component, Watch, Vue, Prop,
} from 'vue-property-decorator';
import AssetSelector from '@/components/AssetSelector.vue';
import DataRangePicker from '@/components/DataRangePicker.vue';
import ProviderAssetsApi from '@/service/provider-assets';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import AnalyticsApi from '@/service/analytics';
import {
  EnumSalesQueryMetric, SalesQuery, DataSeries, EnumTemporalUnit,
} from '@/model/analytics';
import { Chart } from 'highcharts-vue';
import DataTransform from '@/helper/analytics';
import { CatalogueItem, CatalogueQueryResponse } from '@/model';
import { EnumProviderAssetSortField, ProviderDraftQuery } from '@/model/provider-assets';
import { EnumAssetType } from '@/model/enum';
import getPriceOrMinimumPrice, { renderedPriceAsString } from '@/helper/cards';
import AssetMiniCardProvider from '@/components/Assets/AssetMiniCardProvider.vue';

@Component({
  components: {
    AssetSelector,
    Multiselect,
    AssetMiniCardProvider,
    DataRangePicker,
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  @Prop({ default: null }) private salesQueryMetricType!: EnumSalesQueryMetric;

  @Prop({ default: null }) private symbol!: string;

  @Prop({ default: null }) private symbolTitle!: string;

  @Prop({ default: '' }) private cardHeading!: string;

  ProviderAssetsApi: ProviderAssetsApi;

  assets: CatalogueItem[];

  selectedAssets: CatalogueItem[];

  analyticsApi: AnalyticsApi;

  analyticsData: DataSeries;

  assetsQuery: string[];

  segmentsNames: string[];

  chartOptions: any | null;

  temporalUnit: EnumTemporalUnit;

  temporalUnitMin: string;

  temporalUnitMax: string;

  seriesData: any;

  constructor() {
    super();
    this.assets = [];
    this.selectedAssets = [];
    this.analyticsApi = new AnalyticsApi();
    this.analyticsData = {} as DataSeries;
    this.chartOptions = null;
    this.assetsQuery = [];
    this.segmentsNames = [];
    this.temporalUnitMin = '';
    this.temporalUnitMax = '';
    this.temporalUnit = EnumTemporalUnit.DAY;
    this.seriesData = [];
    this.ProviderAssetsApi = new ProviderAssetsApi();
  }

  async mounted(): Promise<any> {
    await this.getAssets();
    // await this.getAnalytics();
  }

  getAnalytics(): void {
    const segmentQuery: SalesQuery = {
      segments: {
        enabled: true,
      },
      assets: this.assetsQuery,
      metric: this.salesQueryMetricType,
      time: {
        unit: this.temporalUnit,
        min: this.temporalUnitMin,
        max: this.temporalUnitMax,
      },
    };

    this.analyticsApi.executeSalesQuery(segmentQuery).then((response) => {
      if (response.success) {
        // eslint-disable-next-line
        response.result!.points.reverse();
        // eslint-disable-next-line
        this.analyticsData = response.result!;
        this.segmentsNames = this.formatSegmentsNames();
        this.seriesData = this.formatSeries();
        this.chartOptions = this.getOptions();
      }
    });
  }

  @Watch('selectedAssets')
  selectedAssetsChanged(newVal: CatalogueItem[]): void {
    this.assetsQuery = newVal.filter((val) => val).map((a) => a.id);
    this.getAnalytics();
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

  getOptions(): any {
    if (!this.analyticsData) {
      return null;
    }
    // const name = 'Sales per segment';
    return {
      credits: {
        enabled: false,
      },
      chart: {
        type: 'column',
        height: '250px',
      },
      plotOptions: {
        series: {
          borderWidth: 0.5,
          borderColor: 'white',
          borderRadius: 6,
        },
      },
      showInLegend: true,
      colors: ['#190AFF', '#358F8B', '#A843B5'],
      title: {
        text: '',
      },
      xAxis: {
        categories: this.segmentsNames,
        labels: {
          allowOverlap: true,
          autoRotationLimit: 0,
          style: {
            fontFamily: 'Roboto',
            fontSize: '10px',
          },
        },
      },
      yAxis: {
        min: 0,
        gridLineWidth: 0,
        title: {
          text: this.symbolTitle,
        },
      },
      tooltip: {
        shadow: false,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#190AFF',
        valueSuffix: this.symbol,
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '13px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          return this.symbol === '' ? `${point.y} <br>${point.category}` : `${point.y}€ <br>${point.category}`;
        },
      },
      series: this.seriesData,
    };
  }

  formatSegmentsNames(): string[] {
    let names: Array<any> = [];
    names = [...new Map(this.analyticsData.points.map((item) => [item.segment, item])).values()].map((a) => a.segment);
    return names;
  }

  formatSeries(): any[] {
    const series: Array<any> = [];
    if (this.assetsQuery?.length > 1) {
      this.assetsQuery.forEach((assetName) => {
        const data: Array<number> = [];
        this.segmentsNames.forEach((segName) => {
          const value = this.analyticsData?.points.filter((item) => item?.asset === assetName && item?.segment === segName).map((a) => a.value);
          if (value.length > 0) {
            data.push(value[0]);
          } else {
            data.push(0);
          }
        });
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        const assetObj = {
          name: assetTitle?.title,
          showInLegend: true,
          data,
        };
        series.push(assetObj);
      });
    } else {
      this.assetsQuery.forEach((assetName) => {
        const assetTitle = this.assets.find(({ id }) => id === assetName);
        // const data = this.analyticsData?.points.map((a) => a.value);
        // Group by segments
        const data = DataTransform.groupBySegmentToBarData(this.analyticsData.points);
        const assetObj = {
          name: assetTitle?.title,
          showInLegend: true,
          data,
        };
        series.push(assetObj);
      });
    }
    return series;
  }

  setTemporalUnit(value: EnumTemporalUnit): void {
    this.temporalUnit = value;
    if (this.assetsQuery?.length) {
      this.getAnalytics();
    }
  }

  // upperCaseTransform(value: string): any {
  //   return value.toLowerCase().replace(/(?:_| |\b)(\w)/g, ($1) => $1.toUpperCase().replace('_', ' '));
  // }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_graphcard.scss';
@import '@/assets/styles/graphs/_table.scss';
@import '@/assets/styles/graphs/_bar-chart.scss';
.multiselect__option--highlight {
  background: none !important;
}
</style>
