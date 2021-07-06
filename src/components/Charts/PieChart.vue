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
    console.log('Pie Chart is MOUNTED!!!');
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
        text: 'Asset Name 1',
      },
      subtitle: {
        text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
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

      // chart: {
      //   type: 'areaspline',
      //   zoomType: 'x',
      // },
      // credits: {
      //   enabled: false,
      // },
      // title: {
      //   text: this.symbolTitle,
      // },

      // xAxis: {
      //   categories: this.lineChartDate,
      //   type: 'datetime',
      // },
      // yAxis: {
      //   gridLineDashStyle: 'Dot',
      //   gridLineWidth: 1,
      //   gridLineColor: '#6C6C6C',
      //   title: {
      //     text: this.symbolTitle,
      //   },
      // },
      // legend: {
      //   enabled: true,
      // },
      // colors: [
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#190AFF'],
      //       [1, 'rgba(25,10,255,0)'],
      //     ],
      //   },
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#358F8B'],
      //       [1, 'rgba(53,143,139,0)'],
      //     ],
      //   },
      //   {
      //     linearGradient: {
      //       x1: 0,
      //       x2: 0,
      //       y1: 0,
      //       y2: 1,
      //     },
      //     stops: [
      //       [0, '#A843B5'],
      //       [1, 'rgba(168,67,181,0)'],
      //     ],
      //   },
      // ],
      // plotOptions: {
      //   colorByPoint: true,
      //   area: {
      //     fillColor: [
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#190AFF'],
      //           [1, 'rgba(25,10,255,0)'],
      //         ],
      //       },
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#358F8B'],
      //           [1, 'rgba(53,143,139,0)'],
      //         ],
      //       },
      //       {
      //         linearGradient: {
      //           x1: 0,
      //           x2: 0,
      //           y1: 0,
      //           y2: 1,
      //         },
      //         stops: [
      //           [0, '#A843B5'],
      //           [1, 'rgba(168,67,181,0)'],
      //         ],
      //       },
      //     ],
      //     lineWidth: 0.2,
      //     states: {
      //       hover: {
      //         lineWidth: 1,
      //       },
      //     },
      //     threshold: null,
      //   },
      // },

      // tooltip: {
      //   shadow: false,
      //   borderWidth: 0,
      //   backgroundColor: 'transparent',
      //   valueSuffix: this.symbol,
      //   style: {
      //     color: '#190AFF',
      //     fontFamily: 'Roboto',
      //     fontSize: '13px',
      //   },
      //   formatter: (a) => {
      //     const point = a.chart.hoverPoint;
      //     return this.symbol === ''
      //       ? `${point.y} <br>${point.category}`
      //       : `${point.y
      //         .toString()
      //         .replace(/(\.\d{2})\d*/, '$1')
      //         .replace(/(\d)(?=(\d{3})+\b)/g, '$1,')}€ <br>${point.category}`;
      //   },
      // },
      // series: this.seriesData,
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
