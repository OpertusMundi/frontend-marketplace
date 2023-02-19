import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { ServerResponse } from '@/model/response';
import { DiscoveryResult } from '@/model/discovery';

const baseUri = '/action/discovery';

export default class DiscoveryApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(assetId: string): Promise<ServerResponse<DiscoveryResult>> {
    const url = `${baseUri}/joinable/${assetId}`;

    return this.get<ServerResponse<DiscoveryResult>>(url)
      .then((response) => {
        const { data } = response;

        if (data.success === false) showApiErrorModal(data.messages);

        /*

        const dummyResult = {
          "joinableTables":[
             {
                "matches":[
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/ID",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/ID and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/LON",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon"
                      },
                      "related":{
                         "coma":0.83877826
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/LON and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon with a confidence threshold of 0.83877826 (1.0 being the best score)"
                   },
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/LAT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/LAT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/NAME",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/NAME and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/CITY",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/CITY and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"luxembourg-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/WKT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table luxembourg-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv/WKT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   }
                ],
                "tableName":"luxembourg-pois.osm.csv",
                "tablePath":"topio.another-company.326.VECTOR/resources/luxembourg-pois.osm.csv"
             },
             {
                "matches":[
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/ID",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/ID and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/LON",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon"
                      },
                      "related":{
                         "coma":0.83877826
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/LON and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon with a confidence threshold of 0.83877826 (1.0 being the best score)"
                   },
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/LAT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/LAT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/NAME",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/NAME and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/CITY",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/CITY and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"malta-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/WKT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table malta-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.325.VECTOR/resources/malta-pois.osm.csv/WKT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   }
                ],
                "tableName":"malta-pois.osm.csv",
                "tablePath":"topio.another-company.325.VECTOR/resources/malta-pois.osm.csv"
             },
             {
                "matches":[
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/NAME",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/NAME and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/CITY",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city"
                      },
                      "related":{
                         "coma":0.8399321
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/CITY and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city with a confidence threshold of 0.8399321 (1.0 being the best score)"
                   },
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/LON",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon"
                      },
                      "related":{
                         "coma":0.83877826
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/LON and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon with a confidence threshold of 0.83877826 (1.0 being the best score)"
                   },
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/ID",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/ID and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/ID with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/LAT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/LAT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   },
                   {
                      "tableName":"cyprus-pois.osm.csv",
                      "keys":{
                         "from":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/WKT",
                         "to":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT"
                      },
                      "related":{
                         "coma":0.8375282
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table cyprus-pois.osm.csv via the primary-key foreign-key constraint: keys - topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv/WKT and FK - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT with a confidence threshold of 0.8375282 (1.0 being the best score)"
                   }
                ],
                "tableName":"cyprus-pois.osm.csv",
                "tablePath":"topio.another-company.324.VECTOR/resources/cyprus-pois.osm.csv"
             },
             {
                "matches":[
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon",
                         "to":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/lon"
                      },
                      "related":{
                         "coma":0.83004713
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon and FK - topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/lon with a confidence threshold of 0.83004713 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat",
                         "to":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/lat"
                      },
                      "related":{
                         "coma":0.8287971
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat and FK - topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/lat with a confidence threshold of 0.8287971 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name",
                         "to":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/name"
                      },
                      "related":{
                         "coma":0.83120096
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name and FK - topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/name with a confidence threshold of 0.83120096 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city",
                         "to":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/city"
                      },
                      "related":{
                         "coma":0.83120096
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city and FK - topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/city with a confidence threshold of 0.83120096 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT",
                         "to":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/WKT"
                      },
                      "related":{
                         "coma":0.8287971
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT and FK - topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv/WKT with a confidence threshold of 0.8287971 (1.0 being the best score)"
                   }
                ],
                "tableName":"osm20_pois_corfu.csv",
                "tablePath":"topio.another-company.355.VECTOR/resources/osm20_pois_corfu.csv"
             },
             {
                "matches":[
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon",
                         "to":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/lon"
                      },
                      "related":{
                         "coma":0.83004713
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lon and FK - topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/lon with a confidence threshold of 0.83004713 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat",
                         "to":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/lat"
                      },
                      "related":{
                         "coma":0.8287971
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/lat and FK - topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/lat with a confidence threshold of 0.8287971 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name",
                         "to":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/name"
                      },
                      "related":{
                         "coma":0.83120096
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/name and FK - topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/name with a confidence threshold of 0.83120096 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city",
                         "to":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/city"
                      },
                      "related":{
                         "coma":0.83120096
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/city and FK - topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/city with a confidence threshold of 0.83120096 (1.0 being the best score)"
                   },
                   {
                      "tableName":"osm20_pois_corfu.csv",
                      "keys":{
                         "from":"topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT",
                         "to":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/WKT"
                      },
                      "related":{
                         "coma":0.8287971
                      },
                      "explanation":"Table topio.another-company.351.VECTOR/resources/DKV_Berlin.csv is joinable with table osm20_pois_corfu.csv via the primary-key foreign-key constraint: keys - topio.another-company.351.VECTOR/resources/DKV_Berlin.csv/WKT and FK - topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv/WKT with a confidence threshold of 0.8287971 (1.0 being the best score)"
                   }
                ],
                "tableName":"osm20_pois_corfu.csv",
                "tablePath":"topio.another-company.354.VECTOR/resources/osm20_pois_corfu.csv"
             }
          ]
       }

        return {
          success: true,
          result: dummyResult,
          messages: [],
        }

        */

        return data;
      });
  }
}
