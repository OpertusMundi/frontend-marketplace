<template>
  <div class="pie-container__chart">
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import { AssetDraft } from '@/model/draft';
import DataTransform from '@/helper/analytics';
import {
  DataSeries,
  EnumSubscribersQueryMetric,
  EnumTemporalUnit, SubscribersQuery,
} from '@/model/analytics';
import AnalyticsApi from '@/service/analytics';

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
    highcharts: Chart,
  },
})
export default class PieChartSubscriberApi extends Vue {
  @Prop({ default: null }) private pieColor!: string[];

  @Prop({ default: [] })
  private assetQuery!: AssetDraft[];

  @Prop({ default: null })
  private index!: number;

  @Prop({
    default: {
      unit: EnumTemporalUnit.DAY,
      min: '',
      max: '',
    },
  })
  private time!: TemporalDimension

  chartOptions: any | null;

  analyticsApi: AnalyticsApi;

  dataSeriesPie: any;

  analyticsData: DataSeries;

  constructor() {
    super();

    this.chartOptions = null;
    this.analyticsApi = new AnalyticsApi();
    this.dataSeriesPie = [];
    this.analyticsData = {} as DataSeries;
  }

  @Watch('assetQuery')
  onAssetChange(asset: AssetDraft[]): void {
    this.getAnalytics();
    console.log('asset watcher => ', asset);
  }

  @Watch('time', { immediate: true, deep: true })
  onTimeChange(time: TemporalDimension): void {
    this.getAnalytics();
    console.log('TIME watcher => ', time);
  }

  getAnalytics(): void {
    const subscribersQuery: SubscribersQuery = {
      segments: {
        enabled: true,
      },
      assets: this.setSingleAsset(this.assetQuery),
      metric: EnumSubscribersQueryMetric.SUBSCRIBER_SEGMENT,
      time: this.time,
      areas: {
        enabled: false,
        codes: [],
      },
    };

    this.analyticsApi.executeSubscribersQuery(subscribersQuery).then((response) => {
      console.log('response: ', response);
      if (response.success) {
        response.result.points.reverse();
        this.analyticsData = response.result;
        this.dataSeriesPie = DataTransform.groupBySegmentToPie(response.result.points);
        this.chartOptions = this.getOptions();
      }
    });
  }

  setSingleAsset(query: AssetDraft[]): string[] | null {
    return query.filter((asset, index) => (index === this.index)).map((asset) => asset.assetPublished);
  }

  setSingleAssetTitle(query: AssetDraft[]): string {
    return query.filter((asset, index) => (index === this.index)).map((asset) => asset.title)[0];
  }

  getOptions(): any {
    if (!this.analyticsData) {
      return null;
    }

    return {
      chart: {
        type: 'pie',
      },
      colorByPoint: true,
      credits: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false,
        },
      },
      colors: this.pieColor,
      title: {
        text: '',
      },
      subtitle: {
        text: this.setSingleAssetTitle(this.assetQuery),
      },

      accessibility: {
        announceNewData: {
          enabled: true,
        },
        point: {
          valueSuffix: '%',
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.1f}%',
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },

      series: [
        {
          name: 'Browsers',
          colorByPoint: true,
          dataLabels: {
            connectorShape: 'straight',
            style: {
              fontSize: 8,
            },
          },
          data: this.dataSeriesPie,
        },
      ],
    };
  }
}
</script>
<style lang="scss">
.pie-container {
  display: flex;
  justify-content: center;
  &__chart {
    flex: 0 1 33.333%;
    div {
      width: 100%;
    }
  }
}
.multiselect__option--highlight {
  background: none !important;
}
</style>
