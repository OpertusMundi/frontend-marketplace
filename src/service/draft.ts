import Api from '@/service/api';

import { PageRequest, Sorting } from '@/model/request';
import {
  AxiosServerResponse, AxiosPageResponse, ServerResponse, PageResult,
} from '@/model/response';
import {
  CatalogueItemCommand, DraftApiFromFileCommand, DraftApiFromAssetCommand,
  CatalogueItemVisibilityCommand, CatalogueItemSamplesCommand,
  //  Sample,
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
        // eslint-disable-next-line
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
   * @param lock True if the selected record must be also locked. If a lock already exists and
   *             belongs to another user, an error is returned.
   */
  public async findOne(key: string, lock = false): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}?lock=${lock}`;

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
   * @param lock True if the new record must be also locked
   */
  public async create(command: CatalogueItemCommand, lock = true, config?: AxiosRequestConfig): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts?lock=${lock}`;

    return this.post<CatalogueItemCommand, ServerResponse<AssetDraft>>(url, command, config)
      .then((response: AxiosServerResponse<AssetDraft>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a new draft from existing asset
   *
   * @param pid
   * @param lock True if the new record must be also locked
   */
  public async createFromAsset(pid: string, lock = true): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/asset?lock=${lock}`;

    const command = {
      pid,
    };

    return this.post<{ pid: string }, ServerResponse<AssetDraft>>(url, command).then((response: AxiosServerResponse<AssetDraft>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Create a new API draft
   *
   * @param command
   * @param lock True if the new record must be also locked
   */
  public async createApi(
    command: DraftApiFromAssetCommand | DraftApiFromFileCommand, lock = true, config?: AxiosRequestConfig,
  ): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/api?lock=${lock}`;

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
   * @param lock True if the record must remain locked after a successful save operation.
   *             If a lock already exists and belongs to another user, an error is returned.
   */
  public async update(key: string, command: CatalogueItemCommand, lock = false): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}?lock=${lock}`;


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
   * The lock on the record is also automatically released.
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
   * If the record is locked by another user, the operation will fail.
   *
   * @param key
   */
  public async updateDraftMetadataVisibility(key: string, command: CatalogueItemVisibilityCommand): Promise<AxiosServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}/metadata/visibility`;

    return this.post<CatalogueItemVisibilityCommand, ServerResponse<AssetDraft>>(url, command);
  }

  /**
   * Update draft samples. The draft status must be `PENDING_PROVIDER_REVIEW`
   *
   * If the record is locked by another user, the operation will fail.
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
   * If the record is locked by another user, the operation will fail.
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
   * If the record is locked by another user, the operation will fail.
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
   * If the record is locked by another user, the operation will fail.
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
   * If the record is locked by another user, the operation will fail.
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
   * If the record is locked by another user, the operation will fail.
   *
   * @param key Draft unique key
   * @param resource File to upload
   * @param command Command object with resource metadata
   */
  public async uploadAdditionalResource(
    key: string, resource: File, command: AssetFileAdditionalResourceCommand, config?: AxiosRequestConfig,
  ): Promise<ServerResponse<AssetDraft>> {
    const url = `/action/drafts/${key}/additional-resources`;

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
   * Downloads an additional resource file
   *
   * @param draftKey
   * @param resourceKey
   */
  public async downloadAdditionalResource(draftKey: string, resourceKey: string): Promise<AxiosServerResponse<BinaryType>> {
    const url = `/action/drafts/${draftKey}/additional-resources/${resourceKey}`;

    return this.get(url, { responseType: 'blob' });
  }

  /**
   * Release the record lock
   *
   * If the record is not locked, the request is ignored.
   * If a lock exists and belongs to another user, an error is returned.
   *
   * @param key
   */
  public async releaseLock(key: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/drafts/${key}/lock`;


    return this.delete<ServerResponse<void>>(url);
  }
}
