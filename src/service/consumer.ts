import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import { Sorting } from '@/model/request';
import {
  AxiosPageResponse,
  AxiosServerResponse,
  PageResult,
  ServerResponse,
} from '@/model/response';
import { ConsumerIndividualCommand, ConsumerProfessionalCommand, Profile } from '@/model/account';
import {
  AccountAsset, ConsumerAccountSubscription,
  EnumConsumerAssetSortField, EnumConsumerSubSortField,
} from '@/model/account-asset';

export default class ConsumerApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Update consumer data.
   *
   * If a draft request already exists, it is updated; Otherwise a new request is created. A
   * draft request is locked once the submitRegistration method is called.
   *
   * @param command Consumer update command
   */
  public async updateRegistration(command: ConsumerIndividualCommand | ConsumerProfessionalCommand): Promise<ServerResponse<Profile>> {
    const url = '/action/consumer/registration';

    return this.post<ConsumerIndividualCommand | ConsumerProfessionalCommand, ServerResponse<Profile>>(url, command)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Update and submit for review consumer data.
   *
   * If a draft request already exists, it is updated; Otherwise a new request is created. The
   * request is locked and submitted for review by the HelpDesk users.
   *
   * @param command Consumer update command
   */
  public async submitRegistration(command: ConsumerIndividualCommand | ConsumerProfessionalCommand): Promise<ServerResponse<Profile>> {
    const url = '/action/consumer/registration';

    return this.put<ConsumerIndividualCommand | ConsumerProfessionalCommand, ServerResponse<Profile>>(url, command)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Cancel any pending registration request
   */
  public async cancelRegistration(): Promise<ServerResponse<Profile>> {
    const url = '/action/consumer/registration';

    return this.delete<ServerResponse<Profile>>(url)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Search purchased assets
   *
   * @param type
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAssets(
    type: EnumAssetType | null = null, page = 0, size = 10, sorting: Sorting<EnumConsumerAssetSortField>,
  ): Promise<AxiosPageResponse<AccountAsset>> {
    const { id: field, order } = sorting;

    const url = `/action/consumer/assets?page=${page}&size=${size}&type=${type || ''}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<AccountAsset>>>(url);
  }

  /**
   * Search registered subscriptions
   *
   * @param type
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findAllSubscriptions(
    type: EnumSpatialDataServiceType | null = null, page = 0, size = 10, sorting: Sorting<EnumConsumerSubSortField>,
  ): Promise<AxiosPageResponse<ConsumerAccountSubscription>> {
    const { id: field, order } = sorting;

    const url = `/action/consumer/subscriptions?page=${page}&size=${size}&type=${type || ''}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<ConsumerAccountSubscription>>>(url);
  }

  /**
   * Get registered subscription
   *
   * @param key
   * @returns
   */
  public async getSubscription(key: string): Promise<AxiosServerResponse<ConsumerAccountSubscription>> {
    const url = `/action/consumer/subscriptions/${key}`;

    return this.get<ServerResponse<ConsumerAccountSubscription>>(url);
  }

  /**
   * Get registered subscription
   *
   * @param key
   */
  public async cancelSubscription(key: string): Promise<ServerResponse<ConsumerAccountSubscription>> {
    const url = `/action/consumer/subscriptions/${key}`;

    return this.delete<ServerResponse<ConsumerAccountSubscription>>(url).then((response) => {
      const { data } = response;

      return data;
    });
  }
}
