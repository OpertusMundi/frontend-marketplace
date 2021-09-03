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
export default class BarChart extends Vue {
  chartOptions: any;

  constructor() {
    super();
    this.chartOptions = {
      title: false,
      credits: { enabled: false },
      chart: {
        type: 'column',
        height: 270,
      },
      series: [{
        showInLegend: false,
        borderRadius: '15px',
        color: '#BCBCBC',
        // data: [300, 400, 600, 550, 516, 150, 420],
        data: [],
        states: {
          hover: { color: '#190AFF' },
        },
      }],
      yAxis: {
        labels: { enabled: false },
        title: { text: null },
        visible: false,
      },
      xAxis: {
        categories: ['January 2020', 'February 2020', 'March 2020', 'April 2020', 'May 2020', 'June 2020', 'July 2020'],
        labels: { enabled: false },
        title: { text: null },
        visible: false,
      },
      tooltip: {
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'transparent',
        valueSuffix: '€',
        style: {
          color: '#190AFF',
          fontFamily: 'Roboto',
          fontSize: '13px',
        },
        formatter: (a) => {
          const point = a.chart.hoverPoint;
          console.log(point);
          return `${point.y}€ <br>${point.category}`;
        },
      },
    };
  }
}
</script>
