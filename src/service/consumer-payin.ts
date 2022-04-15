import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  ConsumerOrder,
} from '@/model/order';
import {
  ConsumerBankwirePayIn, ConsumerCardDirectPayIn,
  Card, CardDirectPayInCommand, CardRegistration, CardRegistrationCommand, CardDetailsCommand,
  EnumPayInSortField,
  EnumTransactionStatus,
  ConsumerPayIn,
  BrowserInfo,
} from '@/model/payin';
import { AxiosRequestConfig } from 'axios';

/**
 * All service methods require user to have role ROLE_CONSUMER unless otherwise noted
 */
export default class ConsumerPayInApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Create a new order from the content of the authenticated user's cart.
   * The method requires user to have  role ROLE_CONSUMER.
   *
   * Invoking checkout method multiple times will always return a new order. Only the last created order
   * is valid.
   */
  public async checkout(): Promise<ServerResponse<ConsumerOrder>> {
    const url = '/action/cart/checkout';

    return this.post<void, ServerResponse<ConsumerOrder>>(url)
      .then((response: AxiosServerResponse<ConsumerOrder>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Get all user registered cards
   *
   * For details on integration of the platform with MANGOPAY see:
   * https://docs.mangopay.com/endpoints/v2.01/cards#e177_the-card-registration-object
   *
   * @param page
   * @param size
   * @returns
   */
  public async getCards(page = 0, size = 10): Promise<ServerResponse<Card[]>> {
    const url = `/action/consumer/cards?page=${page}&size=${size}`;

    return this.get<ServerResponse<Card[]>>(url)
      .then((response: AxiosServerResponse<Card[]>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Initialize a new card registration.
   *
   * For details on integration of the platform with MANGOPAY see:
   * https://docs.mangopay.com/endpoints/v2.01/cards#e177_the-card-registration-object
   *
   * It is imperative to inform users, that we are registering their card.
   */
  public async createCardRegistration(): Promise<ServerResponse<CardRegistration>> {
    const url = '/action/consumer/cards';

    return this.post<void, ServerResponse<CardRegistration>>(url)
      .then((response: AxiosServerResponse<CardRegistration>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Post card info to MangoPay tokenization server.
   *
   * For details on integration of the platform with MANGOPAY see:
   * https://docs.mangopay.com/endpoints/v2.01/cards#e1042_post-card-info
   *
   * It is imperative to inform users, that we are registering their card.
   */
  // public async postCardInfoToTokenizationServer(url: string, command: CardDetailsCommand, config?: AxiosRequestConfig): Promise<ServerResponse<string>> {
  //   const form = new URLSearchParams();

  //   form.append('data', command.data);
  //   form.append('accessKeyRef', command.accessKeyRef);
  //   form.append('returnURL', '');
  //   form.append('cardNumber', command.cardNumber);
  //   form.append('cardExpirationDate', command.cardExpirationDate);
  //   form.append('cardCvx', command.cardCvx);

  //   return this.post<FormData, ServerResponse<string>>(url, form, {
  //     ...config,
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/x-www-form-urlencoded' },
  //     withCredentials: false,
  //   }).then((response: AxiosServerResponse<string>) => {
  //     const { data } = response;
  //     return data;
  //   });
  // }
  public async postCardInfoToTokenizationServer(url: string, command: CardDetailsCommand, config?: AxiosRequestConfig): Promise<string> {
    const form = new URLSearchParams();

    form.append('data', command.data);
    form.append('accessKeyRef', command.accessKeyRef);
    form.append('returnURL', '');
    form.append('cardNumber', command.cardNumber);
    form.append('cardExpirationDate', command.cardExpirationDate);
    form.append('cardCvx', command.cardCvx);

    return this.post<FormData, string>(url, form, {
      ...config,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/x-www-form-urlencoded' },
      withCredentials: false,
    }).then((response) => {
      const { data } = response;
      return data;
    });
  }

  /**
   * Complete card registration
   *
   * For details on integration of the platform with MANGOPAY see:
   * https://docs.mangopay.com/endpoints/v2.01/cards#e177_the-card-registration-object
   *
   * It is imperative to inform users, that we are registering their card.
   *
   * @param command Card registration command
   * @returns
   */
  public async completeCardRegistration(command: CardRegistrationCommand): Promise<ServerResponse<Card>> {
    const url = '/action/consumer/cards';

    return this.put<CardRegistrationCommand, ServerResponse<Card>>(url, command)
      .then((response: AxiosServerResponse<Card>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a free PayIn for a specific order.
   * On successful execution, the server resets the user cart; Hence, the client
   * must either reset the cart locally or invoke [Get Cart](#operation/cart-01).
   *
   * A free PayOn always executes and succeeds immediately.
   *
   * @param orderKey A unique order key generated by a checkout operation
   * @returns
   */
  public async createFreePayIn(orderKey: string): Promise<ServerResponse<ConsumerPayIn>> {
    const url = `/action/consumer/payins/free/${orderKey}`;

    return this.post<void, ServerResponse<ConsumerPayIn>>(url)
      .then((response: AxiosServerResponse<ConsumerPayIn>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a card direct PayIn for a specific order.
   * On successful execution, the server resets the user cart; Hence, the client
   * must either reset the cart locally or invoke [Get Cart](#operation/cart-01).
   * If 3-D Secure validation is required or the operation fails, the cart is not updated.
   *
   * If property secureModeRedirectURL in the response is not empty, 3-D Secure validation
   * is required and the client application must be redirected to the specified link.
   *
   * Once validation is completed, the application is redirected to:
   * https://api.dev.opertusmundi.eu/webhooks/payins/{payInKey}?transactionId={transactionId}
   *
   * The payInKey is the platform unique PayIn key associated with the order. The transactionId
   * is the MANGOPAY unique resource identifier for the new PayIn. The client must query the status
   * of the PayIn using the payInKey.
   *
   * For details on MANGOPAY card direct PayIn see:
   * https://docs.mangopay.com/endpoints/v2.01/payins#e278_create-a-card-direct-payin
   *
   * For details on testing card direct payments see:
   * https://docs.mangopay.com/guide/3ds2-overview
   * https://docs.mangopay.com/guide/3ds2-testing-in-sandbox
   *
   * @param orderKey A unique order key generated by a checkout operation
   * @param command Card direct PayIn command
   * @returns
   */
  public async createCardDirectPayIn(
    orderKey: string, command: CardDirectPayInCommand,
  ): Promise<ServerResponse<ConsumerCardDirectPayIn>> {
    const url = `/action/consumer/payins/card-direct/${orderKey}`;

    const postData: CardDirectPayInCommand = {
      ...command,
      browserInfo: this.getBrowserInfo(),
    };

    return this.post<CardDirectPayInCommand, ServerResponse<ConsumerCardDirectPayIn>>(url, postData)
      .then((response: AxiosServerResponse<ConsumerCardDirectPayIn>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Create a bankwire PayIn for a specific order
   * On successful execution, the server resets the user cart; Hence, the client
   * must either reset the cart locally or invoke [Get Cart](#operation/cart-01).
   *
   * For details on MANGOPAY bankwire PayIn see:
   * https://docs.mangopay.com/endpoints/v2.01/payins#e280_create-a-bankwire-direct-payin
   *
   * @param orderKey A unique order key generated by a checkout operation
   * @returns
   */
  public async createBankwirePayIn(orderKey: string): Promise<ServerResponse<ConsumerBankwirePayIn>> {
    const url = `/action/consumer/payins/bankwire/${orderKey}`;

    return this.put<void, ServerResponse<ConsumerBankwirePayIn>>(url)
      .then((response: AxiosServerResponse<ConsumerBankwirePayIn>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Get PayIn details
   *
   * @param payInKey A unique PayIn key
   * @returns
   */
  public async getPayIn(payInKey: string): Promise<ServerResponse<ConsumerPayIn | ConsumerBankwirePayIn | ConsumerCardDirectPayIn>> {
    const url = `/action/consumer/payins/${payInKey}`;

    return this.get<ServerResponse<ConsumerPayIn | ConsumerBankwirePayIn | ConsumerCardDirectPayIn>>(url)
      .then((response: AxiosServerResponse<ConsumerPayIn | ConsumerBankwirePayIn | ConsumerCardDirectPayIn>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Search consumer PayIn records (ROLE_CONSUMER is required)
   *
   * @param status
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findPayIns(
    status: EnumTransactionStatus | null = null, page = 0, size = 10, sorting: Sorting<EnumPayInSortField>,
  ): Promise<AxiosPageResponse<ConsumerPayIn | ConsumerBankwirePayIn | ConsumerCardDirectPayIn>> {
    const { id: field, order } = sorting;

    const url = `/action/consumer/payins?page=${page}&size=${size}&status=${status || ''}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<ConsumerPayIn | ConsumerBankwirePayIn | ConsumerCardDirectPayIn>>>(url);
  }

  /**
   * Collect browser information
   *
   * Since navigator.javaEnabled() is deprecated, we always the set property to false
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/javaEnabled
   *
   * @returns
   */
  private getBrowserInfo(): BrowserInfo {
    const result: BrowserInfo = {
      colorDepth: window.screen.colorDepth,
      javaEnabled: false,
      javaScriptEnabled: true,
      language: navigator.language,
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      timeZoneOffset: (new Date()).getTimezoneOffset(),
      userAgent: navigator.userAgent,
    };

    return result;
  }
}
