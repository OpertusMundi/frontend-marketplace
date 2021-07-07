<template>
  <div class="pie-container__chart">
    <highcharts v-if="chartOptions" :options="chartOptions"></highcharts>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';

exportingInit(Highcharts);

@Component({
  components: {
    highcharts: Chart,
  },
})
export default class SalesBarGraphCard extends Vue {
  @Prop({ default: null }) private pieColor!: string[];

  @Prop({ default: null }) private analyticsData!: any;

  chartOptions: any | null;

  constructor() {
    super();

    this.chartOptions = null;
  }

  async mounted(): Promise<any> {
    this.chartOptions = this.getOptions();
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
        text: 'Asset',
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
          data: [
            {
              name: 'BIOTA',
              y: 45.74,
            },
            {
              name: 'ECONOMY',
              y: 10.57,
            },
            {
              name: 'ELEVATION',
              y: 7.23,
            },
            {
              name: 'PLANNING_CADASTRE',
              y: 5.58,
            },
            {
              name: 'STRUCTURE',
              y: 22.02,
            },
            {
              name: 'TRANSPORTATION',
              y: 3.92,
              drilldown: 'Opera',
            },
            {
              name: 'BOUNDARIES',
              y: 7.62,
              drilldown: null,
            },
            {
              name: 'CLIMA',
              y: 2.62,
              drilldown: null,
            },
          ],
        },
      ],
    };
  }
}
</script>
<style lang="scss">
.pie-container {
  display: flex;
  flex-direction: row;
  &__chart {
    flex: 0 1 33%;
    div {
      width: 100%;
    }
  }
}
.multiselect__option--highlight {
  background: none !important;
}
</style>
