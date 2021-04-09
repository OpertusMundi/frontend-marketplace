import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { QuotationCommand, EffectivePricingModel } from '@/model/pricing-model';

export default class QuotationApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Computes the effective pricing model for a specific asset, pricing model and collection of parameters
   *
   * @param command Quotation parameters
   * @returns
   */
  public async create(command: QuotationCommand): Promise<ServerResponse<EffectivePricingModel>> {
    const url = '/action/quotation';

    return this.post<QuotationCommand, ServerResponse<EffectivePricingModel>>(url, command)
      .then((response: AxiosServerResponse<EffectivePricingModel>) => {
        const { data } = response;

        return data;
      });
  }
}
