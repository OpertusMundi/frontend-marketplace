import { AxiosRequestConfig } from 'axios';

import Api from '@/service/api';

import { PageRequest, Sorting } from '@/model/request';
import {
  AxiosServerResponse, AxiosPageResponse, ServerResponse, PageResult,
} from '@/model/response';
import { CatalogueItemCommand } from '@/model/catalogue';
import {
  EnumSortField, AssetDraft, AssetDraftQuery, AssetDraftReviewCommand,
} from '@/model/draft';

export default class DraftAssetApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Search drafts
   *
   * @param query
   * @param pageRequest
   * @param sorting
   */
  public async find(query: Partial<AssetDraftQuery>, pageRequest: PageRequest, sorting: Sorting<EnumSortField>): Promise<AxiosPageResponse<AssetDraft>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting;

    const queryString = (Object.keys(query) as Array<keyof AssetDraftQuery>)
      .reduce((result: string[], key: keyof AssetDraftQuery) => {
        const value = query[key] !== null ? [...result, `${key}=${query[key]}`] : result;
        return value;
      }, []);

    const url = `/action/provider/drafts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<AssetDraft>>>(url);
  }

  /**
   * Get a single draft by its key
   *
   * @param key
   */
  public async findOne(key: string): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/provider/drafts/${key}`;


    return this.get<ServerResponse<AssetDraft>>(url)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a new draft
   *
   * @param command
   */
  public async create(command: CatalogueItemCommand): Promise<ServerResponse<AssetDraft>> {
    const url = '/action/provider/drafts';


    return this.post<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update an existing draft
   *
   * @param key
   * @param command
   */
  public async update(key: string, command: CatalogueItemCommand): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/provider/drafts/${key}`;


    return this.put<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Crate and submit a new draft
   *
   * @param command
   * @param config
   */
  public async submitNew(command: CatalogueItemCommand, config?: AxiosRequestConfig): Promise<ServerResponse<AssetDraft>> {
    const url = '/action/provider/drafts';

    return this.put<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command, config)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update and submit an existing draft
   *
   * @param key
   * @param command
   */
  public async submitExisting(key: string, command: CatalogueItemCommand): Promise<ServerResponse<AssetDraft>> {
    const url = `/provider/drafts/${key}/submit`;

    return this.put<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Accept draft
   *
   * @param key
   */
  public async acceptDraft(key: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/provider/drafts/${key}/review"`;

    const command: AssetDraftReviewCommand = {
      rejected: false,
    };


    return this.put<AssetDraftReviewCommand, ServerResponse<void>>(url, command);
  }

  /**
   * Reject draft
   *
   * @param key
   * @param reason
   */
  public async rejectDraft(key: string, reason: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/provider/drafts/${key}/review"`;

    const command: AssetDraftReviewCommand = {
      rejected: true,
      reason,
    };

    return this.put<AssetDraftReviewCommand, ServerResponse<void>>(url, command);
  }

  /**
   * Delete draft. Draft status must be {@link EnumDraftStatus.DRAFT}
   *
   * @param key
   */
  public async deleteDraft(key: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/provider/drafts/${key}`;


    return this.delete<ServerResponse<void>>(url);
  }

  /**
   * Upload files
   *
   * @param key Draft unique key
   * @param files Files to upload
   * @param command Upload command with file metadata
   */
  public async uploadFile(key: string, files: File[]): Promise<ServerResponse<AssetDraft>> {
    const url = `/provider/drafts/${key}/files`;

    const form = new FormData();

    files.forEach((f) => form.append('file', f));

    return this.post<FormData, ServerResponse<AssetDraft>>(url, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response: AxiosServerResponse<AssetDraft>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Delete file
   *
   * @param key Draft unique key
   * @param path Path of the file to delete e.g., /data.zip
   */
  public async deletePath(key: string, path: string): Promise<ServerResponse<AssetDraft>> {
    const url = `/provider/drafts/${key}/files?path=${path}`;

    return this.delete<ServerResponse<AssetDraft>>(url)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }
}
