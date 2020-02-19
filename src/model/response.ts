import {
  ServerError,
} from './error';

export interface ServerResponse<T> {
  errors: ServerError[];
  result: T;
  success: boolean;
}
