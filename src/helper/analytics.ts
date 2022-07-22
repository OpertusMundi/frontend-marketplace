import { DataPoint, PopularTerm } from '@/model/analytics';
import { AssetDraft } from '@/model/draft';

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
    }, {}))
      .map((data) => data[1]); // return data series for highcharts
  }

  static groupByAssetsToSeriesData(points: DataPoint[], key: string): Array<any> {
    return Object.entries(points.reduce((previousValue, currentValue) => {
      // eslint-disable-next-line no-param-reassign
      (previousValue[currentValue[key]] = previousValue[currentValue[key]] || []).push(currentValue.value);
      return previousValue;
    }, {}))
      .map((point) => ({
        name: point[0], // name is the asset type from API response
        data: point[1], // data array grouped by asset type
        showInLegend: true,
        marker: {
          enabled: true,
          symbol: 'circle',
          lineWidth: 1,
          radius: 4,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      }));
  }

  static groupByPopularAssetsSeriesData(result: PopularTerm[], assets: AssetDraft[]): Array<any> {
    return Object.entries(result.reduce((previousValue, currentValue) => {
      // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-non-null-assertion
      previousValue[Object.keys(currentValue)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .toString()!] = (previousValue[Object.keys(currentValue)
        .toString()!] || 0) + Object.values(currentValue)[0] || 1;
      return previousValue;
    }, {}))
      .map((asset) => ({
        name: assets.find(({ assetPublished }) => assetPublished === asset[0])?.title,
        data: asset[1],
      }));
  }
}
