import Api from '@/service/api';

import { Sorting } from '@/model/request';
import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import {
  EnumMasterContractSortField, MasterContract, EnumProviderContractSortField, ProviderTemplateContract, ProviderTemplateContractCommand,
} from '@/model/provider-contract';

/**
 * Provider contract API.
 *
 * All methods requires ROLE_PROVIDER role.
 */
export default class ContractApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  basePath = '/action/contract/provider';

  /**
   * Search all published MASTER contracts
   *
   * @param title
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAllMasterContracts(title: string | null = null, page = 0, size = 10, sorting: Sorting<EnumMasterContractSortField>): Promise<AxiosPageResponse<MasterContract>> {
    const { id: field, order } = sorting;

    const endpoint = `${this.basePath}/master`;
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const filters = `title=${title || ''}`;
    const url = `${endpoint}?${filters}&${pagination}`;

    return this.get<ServerResponse<PageResult<MasterContract>>>(url);
  }

  /**
   * Get MASTER contract details
   *
   * @param key A unique MASTER contract key
   * @returns
   */
  public async findOneMasterContract(key: string): Promise<ServerResponse<MasterContract>> {
    const url = `${this.basePath}/master/${key}`;

    return this.get<ServerResponse<MasterContract>>(url).then((response: AxiosServerResponse<MasterContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Browser provider contract template drafts
   *
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAllDrafts(page = 0, size = 10, sorting: Sorting<EnumProviderContractSortField>): Promise<AxiosPageResponse<ProviderTemplateContract>> {
    const { id: field, order } = sorting;

    const endpoint = `${this.basePath}/drafts`;
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const url = `${endpoint}?${pagination}`;

    return this.get<ServerResponse<PageResult<ProviderTemplateContract>>>(url);
  }

  /**
   * Get one provider contract template draft
   *
   * @param key A unique contract draft key
   * @returns
   */
  public async findOneDraft(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/drafts/${key}`;

    return this.get<ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Create new contract template draft
   *
   * @param command
   * @returns
   */
  public async createDraft(command: ProviderTemplateContractCommand): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/drafts`;

    return this.post<ProviderTemplateContractCommand, ServerResponse<ProviderTemplateContract>>(url, command).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Update existing contract template draft
   *
   * @param key Draft unique key
   * @param command
   * @returns
   */
  public async updateDraft(key: string, command: ProviderTemplateContractCommand): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/drafts/${key}`;

    return this.post<ProviderTemplateContractCommand, ServerResponse<ProviderTemplateContract>>(url, command).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Delete contract template draft
   *
   * @param key
   * @returns
   */
  public async deleteDraft(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/drafts/${key}`;

    return this.delete<ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Update existing contract template draft
   *
   * @param key Draft unique key
   * @param command
   * @returns
   */
  public async publishDraft(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/drafts/${key}`;

    return this.put<unknown, ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Search all published provider contract templates
   *
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAllTemplates(page = 0, size = 10, sorting: Sorting<EnumProviderContractSortField>): Promise<AxiosPageResponse<ProviderTemplateContract>> {
    const { id: field, order } = sorting;

    const endpoint = `${this.basePath}/templates`;
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const url = `${endpoint}?${pagination}`;

    return this.get<ServerResponse<PageResult<ProviderTemplateContract>>>(url);
  }

  /**
   * Get provider contract template details
   *
   * @param key
   * @returns
   */
  public async findOneTemplate(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/templates/${key}`;

    return this.get<ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Deactivate contract template
   *
   * @param key
   * @returns
   */
  public async deactivate(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/templates/${key}`;

    return this.delete<ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Create a new draft from an existing template.
   *
   * @param key
   * @returns
   */
  public async createDraftFromTemplate(key: string): Promise<ServerResponse<ProviderTemplateContract>> {
    const url = `${this.basePath}/history/${key}`;

    return this.post<unknown, ServerResponse<ProviderTemplateContract>>(url).then((response: AxiosServerResponse<ProviderTemplateContract>) => {
      const { data } = response;

      return data;
    });
  }
}
