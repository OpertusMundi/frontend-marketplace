import Api from '@/service/api';

import { PageRequest, Sorting } from '@/model/request';
import {
  AxiosServerResponse, AxiosPageResponse, ServerResponse, PageResult,
} from '@/model/response';
import {
  CatalogueItemCommand, DraftApiFromFileCommand, DraftApiFromAssetCommand,
  CatalogueItemVisibilityCommand, CatalogueItemSamplesCommand, Sample,
} from '@/model/catalogue';
import {
  EnumSortField, AssetDraft, AssetDraftQuery, AssetDraftReviewCommand,
} from '@/model/draft';
import {
  AssetFileAdditionalResourceCommand, FileResourceCommand,
} from '@/model/asset';
import { AxiosRequestConfig } from 'axios';

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
  public async find(
    query: Partial<AssetDraftQuery>, pageRequest: PageRequest, sorting: Sorting<EnumSortField>,
  ): Promise<AxiosPageResponse<AssetDraft>> {
    const { page, size } = pageRequest;
    const { id: field, order } = sorting;

    const queryString = (Object.keys(query) as Array<keyof AssetDraftQuery>)
      .reduce((result: string[], k: keyof AssetDraftQuery) => {
        const value = query[k] ? [...result, `${k}=${Array.isArray(query[k]) ? query[k]!.join(',') : query[k]}`] : result;
        return value;
      }, []);

    const url = `/action/drafts?page=${page}&size=${size}&${queryString.join('&')}&orderBy=${field}&order=${order}`;

    const config = {
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    };

    return this.get<ServerResponse<PageResult<AssetDraft>>>(url, config);
  }

  /**
   * Get a single draft by its key
   *
   * @param key
   */
  public async findOne(key: string): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}`;

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
  public async create(command: CatalogueItemCommand, config?: AxiosRequestConfig): Promise<ServerResponse<AssetDraft>> {
    const url = '/action/drafts';

    return this.post<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command, config)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a new API draft
   *
   * @param command
   */
  public async createApi(
    command: DraftApiFromAssetCommand | DraftApiFromFileCommand, config?: AxiosRequestConfig,
  ): Promise<ServerResponse<AssetDraft>> {
    const url = '/action/drafts/api';

    return this.post<DraftApiFromAssetCommand | DraftApiFromFileCommand, ServerResponse<AssetDraft>>(url, command, config)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update an existing draft
   *
   * If a resource file or an additional file resource entry is deleted from {@link CatalogueItemCommand#resources}
   * or {@link CatalogueItemCommand#additionalResources} arrays, it will be also be deleted at the server.
   *
   * @param key
   * @param command
   */
  public async update(key: string, command: CatalogueItemCommand): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}`;


    return this.put<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update and submit an existing draft.
   *
   * If a resource file or an additional file resource entry is deleted from {@link CatalogueItemCommand#resources}
   * or {@link CatalogueItemCommand#additionalResources} arrays, it will be also be deleted at the server.
   *
   * @param key
   * @param command
   */
  public async updateAndSubmit(key: string, command: CatalogueItemCommand): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}/submit`;

    return this.put<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update draft metadata property visibility. The draft status
   * must be `PENDING_PROVIDER_REVIEW`
   *
   * @param key
   */
  public async updateDraftMetadataVisibility(key: string, command: CatalogueItemVisibilityCommand): Promise<AxiosServerResponse<void>> {
    const url = `/action/drafts/${key}/metadata/visibility`;

    return this.post<CatalogueItemVisibilityCommand, ServerResponse<void>>(url, command);
  }

  /**
   * Update draft samples. The draft status must be `PENDING_PROVIDER_REVIEW`
   *
   * @param key
   */
  public async updateDraftSamples(key: string, command: CatalogueItemSamplesCommand): Promise<AxiosServerResponse<void>> {
    const url = `/action/drafts/${key}/metadata/samples`;

    return this.post<CatalogueItemSamplesCommand, ServerResponse<void>>(url, command);
  }

  /**
   * Accept draft
   *
   * @param key
   */
  public async acceptDraft(key: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/drafts/${key}/review`;

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
    const url = `/action/drafts/${key}/review`;

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
    const url = `/action/drafts/${key}`;


    return this.delete<ServerResponse<void>>(url);
  }

  /**
   * Upload resource file
   *
   * @param key Draft unique key
   * @param resource File to upload
   * @param command Command object with resource metadata
   */
  public async uploadResource(key: string, resource: File, command: FileResourceCommand, config?: AxiosRequestConfig): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}/resources`;

    const form = new FormData();

    form.append('file', resource);
    form.append('data', new Blob([JSON.stringify(command)], {
      type: 'application/json',
    }));

    return this.post<FormData, ServerResponse<AssetDraft>>(url, form, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response: AxiosServerResponse<AssetDraft>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Upload additional file resource
   *
   * @param key Draft unique key
   * @param resource File to upload
   * @param command Command object with resource metadata
   */
  public async uploadAdditionalResource(
    key: string, resource: File, command: AssetFileAdditionalResourceCommand,
  ): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}/additional-resources`;

    const form = new FormData();

    form.append('file', resource);
    form.append('data', new Blob([JSON.stringify(command)], {
      type: 'application/json',
    }));

    return this.post<FormData, ServerResponse<AssetDraft>>(url, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response: AxiosServerResponse<AssetDraft>) => {
      const { data } = response;

      return data;
    });
  }
}
