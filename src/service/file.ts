import { saveAs } from 'file-saver';
import { showApiErrorModal } from '@/helper/api-errors';
import Api from '@/service/api';

import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosServerResponse, ServerResponse, SimpleResponse } from '@/model/response';
import { DirectoryInfo, FilePathCommand, FileUploadCommand } from '@/model/file';
import { blobToJson } from '@/helper/file';

export default class FileSystemApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Browse file system. Returns the root directory of the user's remote file system
   */
  public async browse(): Promise<ServerResponse<DirectoryInfo>> {
    const url = '/action/file-system';

    return this.get<ServerResponse<DirectoryInfo>>(url)
      .then((response: AxiosServerResponse<DirectoryInfo>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Create a new folder. If parent directories do not exist, they are created too
   *
   * @param command Folder create command
   */
  public async createFolder(path: string): Promise<ServerResponse<DirectoryInfo>> {
    const url = '/action/file-system/folders';

    return this.post<FilePathCommand, ServerResponse<DirectoryInfo>>(url, { path })
      .then((response: AxiosServerResponse<DirectoryInfo>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Download an existing file
   *
   * @param path File path e.g. /tutorials/data.csv
   */
  public async downloadFile(path: string): Promise<SimpleResponse> {
    const url = `/action/file-system/files?path=${path}`;

    return this.get<Blob>(url, {
      responseType: 'blob',
    })
      .then((response: AxiosResponse<Blob>) => {
        const parts = path.split('/');

        saveAs(response.data, parts[parts.length - 1]);

        return Promise.resolve({
          success: true,
          messages: [],
        });
      })
      .catch((err: AxiosError) => blobToJson(err.response?.data));
  }

  /**
   * Delete a path. If the path is a non-empty directory, an error will be returned
   *
   * @param path Path to delete
   */
  public async deletePath(path: string): Promise<ServerResponse<DirectoryInfo>> {
    const url = `/action/file-system?path=${path}`;

    return this.delete<ServerResponse<DirectoryInfo>>(url)
      .then((response: AxiosServerResponse<DirectoryInfo>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Upload a file
   *
   * @param file File to upload
   * @param command Upload command with file metadata
   */
  public async uploadFile(file: File, command: FileUploadCommand, config?: AxiosRequestConfig): Promise<ServerResponse<DirectoryInfo>> {
    const url = '/action/file-system/files';

    const form = new FormData();

    form.append('file', file);
    form.append('data', new Blob([JSON.stringify(command)], {
      type: 'application/json',
    }));

    return this.post<FormData, ServerResponse<DirectoryInfo>>(url, form, config).then((response: AxiosServerResponse<DirectoryInfo>) => {
      const { data } = response;
      if (data.success === false) showApiErrorModal(data.messages);

      return data;
    });
  }
}
