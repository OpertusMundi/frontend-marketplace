import csv from 'csv-parse/lib/es5/sync';

import { Sample } from '@/model/catalogue';

export type ParsedCsv = {
  records: { [prop: string]: string }[],
  samples: Sample[],
};

/**
 * Parse CSV file and return sample data
 *
 * [{
 *  "field1": [
 *    "value1",
 *    "value2",
 *    ...
 *  ],
 *  "field2": [
 *    "value1",
 *    "value2",
 *    ...
 *  ]
 * }]
 *
 * @param file
 * @param delimiter
 * @param quote
 * @returns
 */
export default async function csvToSample(file: File, delimiter = ',', quote = '"'): Promise<ParsedCsv | null> {
  const reader = new FileReader();

  const promise = new Promise((resolve: (data: ParsedCsv | null) => void) => {
    reader.onload = () => {
      const records: { [prop: string]: string }[] = csv(reader.result as string, {
        columns: true,
        skip_empty_lines: true,
        delimiter,
        quote,
      }) || [];

      if (records.length === 0) {
        resolve(null);
      } else {
        const result: Sample = {};
        // Add fields
        Object.keys(records[0]).forEach((field) => {
          result[field] = [];
        });
        // Add values
        for (let i = 0; i < records.length; i += 1) {
          Object.keys(records[i]).forEach((field) => {
            result[field].push(records[i][field]);
          });
        }

        resolve({ records, samples: [result] });
      }
    };
  });

  reader.readAsText(file);

  return promise;
}

export function blobToJson<T>(blob: Blob): Promise<T> {
  const reader = new FileReader();

  const promise = new Promise((resolve: (data: T) => void) => {
    reader.onload = () => {
      const data: T = JSON.parse(<string>reader.result);
      resolve(data);
    };
  });

  reader.readAsText(blob);

  return promise;
}
