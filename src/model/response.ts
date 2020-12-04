import { AxiosResponse } from 'axios';
import { ServerMessage } from '@/model/error';
import { PageRequest } from '@/model/request';

export interface SimpleResponse {
  /**
  * Array of server messages
  */
  messages: ServerMessage[];
  /**
   * True if not messages with level higher than warning is present.
   * An operation may be successful and still contain messages with
   * level {@link EnumLevel#INFO} or {@link EnumLevel#WARN}
   */
  success: boolean;
}

export interface ServerResponse<R> extends SimpleResponse {
  /**
   * Response payload
   */
  result: R;
}

export type AxiosServerResponse<R> = AxiosResponse<ServerResponse<R>>;

export interface PageResult<R> {
  pageRequest: PageRequest;
  count: number;
  items: R[];
}

export type AxiosPageResponse<R> = AxiosResponse<ServerResponse<PageResult<R>>>;
