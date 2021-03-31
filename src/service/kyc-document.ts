import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse, SimpleResponse } from '@/model/response';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { EnumCustomerType } from '@/model/account';
import {
  KycDocumentQueryResponse, KycDocument, KycDocumentCommand, KycDocumentPageCommand,
} from '@/model/kyc-document';

export default class KycDocumentApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async findAll(type: EnumCustomerType, page = 0, size = 10): Promise<KycDocumentQueryResponse> {
    const params = {
      type,
      page,
      size,
    };

    const keyValues = Object.keys(params).filter((k) => !!params[k]).map((k) => `${k}=${params[k]}`);

    const url = `/action/kyc-documents?${keyValues.join('&')}`;

    return this.get<KycDocumentQueryResponse>(url)
      .then((response: AxiosResponse<KycDocumentQueryResponse>) => {
        const { data } = response;

        return data;
      });
  }

  public async findOne(type: EnumCustomerType, kycDocumentId: string): Promise<ServerResponse<KycDocument>> {
    const url = `/action/kyc-documents/${kycDocumentId}?type=${type}`;

    return this.get<ServerResponse<KycDocument>>(url)
      .then((response: AxiosServerResponse<KycDocument>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Creates a new document of the specified type with status `CREATED`
   *
   * @param command
   * @returns
   */
  public async createDocument(command: KycDocumentCommand): Promise<ServerResponse<KycDocument>> {
    const url = '/action/kyc-documents';

    return this.post<KycDocumentCommand, ServerResponse<KycDocument>>(url, command)
      .then((response: AxiosServerResponse<KycDocument>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Adds a new page to a draft KYC document.
   *
   * Pages can be added only to documents with status `CREATED`.
   * The maximum size per page is `7MB`. The supported formats for the documents
   * are `pdf`, `jpeg`, `jpg` and `png`. The minimum size is `1Kb`
   *
   * @param command
   * @param file
   * @param config
   * @returns
   */
  public async addPage(kycDocumentId: string, command: KycDocumentPageCommand, file: File, config?: AxiosRequestConfig): Promise<SimpleResponse> {
    const url = `/action/kyc-documents/${kycDocumentId}/pages`;

    const form = new FormData();

    form.append('file', file);
    form.append('data', new Blob([JSON.stringify(command)], {
      type: 'application/json',
    }));

    return this.post<FormData, SimpleResponse>(url, form, config).then((response: AxiosResponse<SimpleResponse>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Submit a draft KYC document for validation. The document status must be `CREATED`
   *
   * @param command
   * @returns
   */
  public async submitDocument(kycDocumentId: string, command: KycDocumentCommand): Promise<ServerResponse<KycDocument>> {
    const url = `/action/kyc-documents/${kycDocumentId}`;

    return this.put<KycDocumentCommand, ServerResponse<KycDocument>>(url, command).then((response: AxiosServerResponse<KycDocument>) => {
      const { data } = response;

      return data;
    });
  }
}
