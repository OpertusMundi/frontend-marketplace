<template>
  <div class="barchart">
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Chart } from 'highcharts-vue';

@Component({
  components: {
    highcharts: Chart,
  },
})
export default class LineChart extends Vue {
  chartOptions: any;

  constructor() {
    super();
    this.chartOptions = {
      title: false,
      chart: {
        type: 'spline',
        height: 270,
      },
      credits: { enabled: false },
      series: [{
        color: '#BCBCBC',
        showInLegend: false,
        // data: [3, 3.2, 4.3, 4.5, 5],
        data: [],
        states: {
          hover: {
            lineWidth: 0,
            marker: {
              fillColor: '#000',
              lineColor: '#000',
            },
          },
        },
      }],
      plotOptions: {
        series: {
          marker: {
            states: {
              hover: {
                fillColor: '#190AFF',
                lineColor: '#190AFF',
              },
            },
          },
        },
      },
      yAxis: {
        labels: { enabled: false },
        title: { text: null },
        visible: false,
      },
      xAxis: {
        categories: ['January 2020', 'February 2020', 'March 2020', 'April 2020', 'May 2020'],
        labels: { enabled: false },
        title: { text: null },
        visible: false,
      },
      tooltip: {
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'transparent',
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '14px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          return `${point.y}/5 <br>${point.category}`;
        },
      },
    };
  }
}
</script>
