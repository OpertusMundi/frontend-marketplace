import { DataPoint } from '@/model/analytics';

export default class DataTransform {
  static groupBySegmentToPie(points: DataPoint[]): Array<any> {
    return Object.entries(points.reduce((previousValue, currentValue) => {
      // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-non-null-assertion
      previousValue[currentValue.segment!] = (previousValue[currentValue.segment!] || 0) + currentValue.value || 1;
      return previousValue;
    }, {}))
      .map((point) => ({
        name: point[0],
        y: point[1],
      }));
  }

  static groupBySegmentToBarData(points: DataPoint[]): Array<any> {
    return Object.entries(points.reduce((previousValue, currentValue) => {
      // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-non-null-assertion
      previousValue[currentValue.segment!] = (previousValue[currentValue.segment!] || 0) + currentValue.value || 1;
      return previousValue;
    }, {})).map((data) => data[1]); // return data series for highcharts
  }
}
