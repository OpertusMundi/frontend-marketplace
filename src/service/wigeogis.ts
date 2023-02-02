import Api from '@/service/api';
import { AxiosServerResponse, ServerResponse } from '@/model/response';

export default class WiGeoGISApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Login to the authenticated user's WiGeoGIS account and return a redirect link. If the operation fails, a null string is returned. Required role: ROLE_WIGEOGIS
   *
   */
  public async login(): Promise<ServerResponse<string>> {
    const url = '/action/integration/wigeogis/login';

    return this.post<null, ServerResponse<string>>(url, null)
      .then((response: AxiosServerResponse<string>) => {
        const { data } = response;

        return data;
      });
  }
}
