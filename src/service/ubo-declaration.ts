import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse, SimpleResponse } from '@/model/response';
import { AxiosResponse } from 'axios';
import {
  UboDeclaration, UboDeclarationQueryResponse, UboCommand, Ubo,
} from '@/model/ubo-declaration';

export default class UboDeclarationApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async findAll(page = 0, size = 10): Promise<UboDeclarationQueryResponse> {
    const params = {
      page,
      size,
    };

    const keyValues = Object.keys(params).filter((k) => !!params[k]).map((k) => `${k}=${params[k]}`);

    const url = `/action/ubo-declarations?${keyValues.join('&')}`;

    return this.get<UboDeclarationQueryResponse>(url)
      .then((response: AxiosResponse<UboDeclarationQueryResponse>) => {
        const { data } = response;

        return data;
      });
  }

  public async findOne(uboDeclarationId: string): Promise<ServerResponse<UboDeclaration>> {
    const url = `/action/ubo-declarations/${uboDeclarationId}`;

    return this.get<ServerResponse<UboDeclaration>>(url)
      .then((response: AxiosServerResponse<UboDeclaration>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Creates a draft UBO declaration with status `CREATED`. Only a single UBO
   * declaration with status `CREATED`, `INCOMPLETE` or `VALIDATION_ASKED` can exist
   *
   * @returns
   */
  public async createDeclaration(): Promise<ServerResponse<UboDeclaration>> {
    const url = '/action/ubo-declarations';

    return this.post<unknown, ServerResponse<UboDeclaration>>(url, null)
      .then((response: AxiosServerResponse<UboDeclaration>) => {
        const { data } = response;

        return data;
      });
  }

  public async addUbo(uboDeclarationId: string, command: UboCommand): Promise<ServerResponse<Ubo>> {
    const url = `/action/ubo-declarations/${uboDeclarationId}/ubos`;

    return this.post<UboCommand, ServerResponse<Ubo>>(url, command).then((response: AxiosServerResponse<Ubo>) => {
      const { data } = response;

      return data;
    });
  }

  public async updateUbo(uboDeclarationId: string, uboId: string, command: UboCommand): Promise<ServerResponse<Ubo>> {
    const url = `/action/ubo-declarations/${uboDeclarationId}/ubos/${uboId}`;

    return this.put<UboCommand, ServerResponse<Ubo>>(url, command).then((response: AxiosServerResponse<Ubo>) => {
      const { data } = response;

      return data;
    });
  }

  public async removeUbo(uboDeclarationId: string, uboId: string): Promise<SimpleResponse> {
    const url = `/action/ubo-declarations/${uboDeclarationId}/ubos/${uboId}`;

    return this.delete<SimpleResponse>(url).then((response: AxiosResponse<SimpleResponse>) => {
      const { data } = response;

      return data;
    });
  }

  public async submitDeclaration(uboDeclarationId: string): Promise<ServerResponse<UboDeclaration>> {
    const url = `/action/ubo-declarations/${uboDeclarationId}`;

    return this.post<unknown, ServerResponse<UboDeclaration>>(url, null).then((response: AxiosServerResponse<UboDeclaration>) => {
      const { data } = response;

      return data;
    });
  }
}
