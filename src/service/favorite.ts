import Api from '@/service/api';

import { Sorting } from '@/model/request';
import {
  AxiosPageResponse,
  AxiosServerResponse,
  PageResult,
  ServerResponse,
  SimpleResponse,
} from '@/model/response';
import {
  FavoriteAssetCommand, FavoriteProviderCommand, Favorite,
  EnumFavoriteType, EnumFavoriteSortField,
} from '@/model/favorite';
import { AxiosResponse } from 'axios';

const baseUri = '/action/favorites';

type FavoriteCommand = FavoriteAssetCommand | FavoriteProviderCommand;

export default class FavoriteApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(
    type: EnumFavoriteType | null = null, page = 0, size = 10, sorting: Sorting<EnumFavoriteSortField>,
  ): Promise<AxiosPageResponse<Favorite>> {
    const { id: field, order } = sorting;

    const endpoint = baseUri;
    const query = `page=${page}&size=${size}&orderBy=${field}&order=${order}type=${type || ''}`;
    const url = `${endpoint}?${query}`;

    return this.get<ServerResponse<PageResult<Favorite>>>(url);
  }

  public async add(command: FavoriteCommand): Promise<ServerResponse<Favorite>> {
    const url = baseUri;

    return this.post<FavoriteCommand, ServerResponse<Favorite>>(url, command)
      .then((response: AxiosServerResponse<Favorite>) => {
        const { data } = response;

        return data;
      });
  }

  public async remove(key: string): Promise<SimpleResponse> {
    const url = `${baseUri}/${key}`;

    return this.delete<SimpleResponse>(url)
      .then((response: AxiosResponse<SimpleResponse>) => {
        const { data } = response;

        return data;
      });
  }
}
