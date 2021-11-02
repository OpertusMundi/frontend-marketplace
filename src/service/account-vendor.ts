import Api from '@/service/api';

import { Sorting } from '@/model/request';
import { AxiosServerResponse, AxiosPageResponse, ServerResponse, PageResult } from '@/model/response';
import {
  EnumAccountSortField, Account, VendorAccountCommand, JoinVendorCommand,
} from '@/model/account';

export default class AccountVendorApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Search vendor accounts. Role ROLE_PROVIDER is required
   *
   * @param active
   * @param email
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAccounts(
    active: boolean | null = null, email: string | null = null,
    page = 0, size = 10, sorting: Sorting<EnumAccountSortField>,
  ): Promise<AxiosPageResponse<Account>> {
    const { id: field, order } = sorting;

    const endpoint = '/action/vendor-accounts';
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const filters = `active=${active === null ? '' : active}&email=${email || ''}`;
    const url = `${endpoint}?${filters}&${pagination}`;

    return this.get<ServerResponse<PageResult<Account>>>(url);
  }

  /**
   * Create a new vendor account. Role ROLE_PROVIDER is required
   *
   * @param command
   * @returns
   */
  public async create(command: VendorAccountCommand): Promise<ServerResponse<Account>> {
    const url = '/action/vendor-accounts';

    return this.post<VendorAccountCommand, ServerResponse<Account>>(url, command)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update an existing vendor account. Role ROLE_PROVIDER is required
   *
   * @param key Account unique key
   * @param command
   * @returns
   */
  public async update(key: string, command: VendorAccountCommand): Promise<ServerResponse<Account>> {
    const url = `/action/vendor-accounts/${key}`;

    return this.put<VendorAccountCommand, ServerResponse<Account>>(url, command)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Invite a user to activate her vendor account.
   * An email is sent with a new activation token.
   * Role ROLE_PROVIDER is required
   *
   * @param key Account unique key
   */
  public async invite(key: string): Promise<ServerResponse<Account>> {
    const url = `/action/vendor-accounts/${key}/invites`;

    return this.post<unknown, ServerResponse<Account>>(url, null)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Accept vendor invitation to join an organization
   *
   * When an invite is sent, an email with an activation link is sent to the vendor account.
   * The client routing system must handle the path `/vendor-account/join` and extract the
   * activation token from the query parameter `token`.
   *
   * @param token Activation token received by email (the token must be extracted from the active route)
   * @param command Join organization command
   * @returns
   */
  public async join(token: string, command: JoinVendorCommand): Promise<ServerResponse<void>> {
    const url = `/action/vendor-accounts/invites/${token}`;

    return this.post<JoinVendorCommand, ServerResponse<void>>(url, command)
      .then((response: AxiosServerResponse<void>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Enable vendor account. Role ROLE_PROVIDER is required
   *
   * A vendor can enable only accounts with activation status `COMPLETED`.
   * If the account activation status is `UNDEFINED` an error is returned.
   * If the status is either `PENDING` or `PROCESSING`, the action is ignored.
   *
   * @param key Account unique key
   * @returns
   */
  public async enable(key: string): Promise<ServerResponse<Account>> {
    const url = `/action/vendor-accounts/${key}/status`;

    return this.put<unknown, ServerResponse<Account>>(url, null)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Disable vendor account. Role ROLE_PROVIDER is required
   *
   * Disable vendor account. If the account activation status is either `PENDING` or `PROCESSING`,
   * the action is ignored.
   *
   * @param key Account unique key
   * @returns
   */
  public async disable(key: string): Promise<ServerResponse<Account>> {
    const url = `/action/vendor-accounts/${key}/status`;

    return this.delete<ServerResponse<Account>>(url)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }
}
