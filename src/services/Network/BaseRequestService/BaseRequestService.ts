/* eslint-disable @typescript-eslint/no-this-alias */
import axios from "axios";
import { CancelRequest, XTraceIdHeaderKey } from "@infomaximum/utility";
import { isFunction } from "lodash";
import type { IRequestService, TRequestDataParams, TSubmitDataParams } from "../Requests.types";
import type { NCore } from "@infomaximum/module-expander";
import type { QueryOptions } from "@apollo/client";
import type {
  TCancelableCallback,
  TControlCancelableRequestsParams,
} from "./BaseRequestService.types";
import type { IErrorHandlerService } from "../../ErrorHandlers/ErrorHandlers.types";
import { BaseErrorHandlerService } from "../../ErrorHandlers";
import { apolloInstance } from "../../../utils/Store/Apollo";

type TRequestParams = {
  /** Инстанс обработчика ошибок */
  errorHandlerService?: IErrorHandlerService;
};

/** Служит для отправки запросов и мутаций на сервер */
export class BaseRequestService implements IRequestService {
  protected errorHandlerService: IErrorHandlerService;

  protected cancelCallbackRequest: TCancelableCallback = {
    callback: undefined,
  };

  protected cancelCallbackSubmit: TCancelableCallback = {
    callback: undefined,
  };

  constructor(params?: TRequestParams) {
    this.errorHandlerService = params?.errorHandlerService ?? new BaseErrorHandlerService();
  }

  /** Отмена запросов и мутаций */
  public cancelRequests(callback?: () => void) {
    this.cancelCallbackRequest.callback?.(callback);
    this.cancelCallbackSubmit.callback?.();

    this.cancelCallbackRequest.callback = undefined;
    this.cancelCallbackSubmit.callback = undefined;
  }

  /** Создает токен для отмены запроса */
  protected getCancelToken() {
    const cancelTokenSource = axios.CancelToken.source();
    const cancelToken = cancelTokenSource.token;

    const cancelCallback = (callback?: () => void) => {
      cancelTokenSource.cancel(CancelRequest);
      callback?.();
    };

    return {
      cancelToken,
      cancelCallback,
    };
  }

  /** Контролирует запросы и мутации и отменяет их если нужно */
  protected controlCancelableRequests({
    cancelCallbackCurrent,
    cancelCallbackPrev,
    cancelable,
  }: TControlCancelableRequestsParams) {
    if (!cancelable) {
      cancelCallbackPrev.callback = cancelCallbackCurrent;

      return;
    }

    if (isFunction(cancelCallbackPrev.callback)) {
      if (cancelable === "prev") {
        cancelCallbackPrev.callback();

        cancelCallbackPrev.callback = cancelCallbackCurrent;
      } else if (cancelable === "last") {
        cancelCallbackCurrent();
      }
    } else {
      cancelCallbackPrev.callback = cancelCallbackCurrent;
    }
  }

  /** Выполняет запросы на сервер */
  public async requestData({ query, variables, cancelable, additionalParams }: TRequestDataParams) {
    const apolloClient = apolloInstance.apolloClient;

    const { cancelToken, cancelCallback } = this.getCancelToken();

    this.controlCancelableRequests({
      cancelable,
      cancelCallbackCurrent: cancelCallback,
      cancelCallbackPrev: this.cancelCallbackRequest,
    });

    const config: QueryOptions = {
      query,
      variables,
      ...additionalParams,
      context: {
        imRequestData: {
          cancelToken,
        },
        http: {
          preserveHeaderCase: true,
        },
      },
    };

    let data = undefined;

    try {
      const response = await apolloClient.query(config);

      if (response?.data?.error || response?.error) {
        throw response?.data?.error || response?.error;
      } else {
        data = response?.data;
      }
    } catch (err) {
      const error: NCore.TError | undefined = await this.errorHandlerService.prepareError(err, {
        traceId: err.networkError?.response?.headers.get(XTraceIdHeaderKey),
      });

      throw error || err;
    } finally {
      this.cancelCallbackRequest.callback = undefined;
    }

    return data;
  }

  /** Отправляет мутации на сервер */
  public async submitData({ mutation, variables, cancelable, files }: TSubmitDataParams) {
    const apolloClient = apolloInstance.apolloClient;

    const { cancelToken, cancelCallback } = this.getCancelToken();

    this.controlCancelableRequests({
      cancelable,
      cancelCallbackCurrent: cancelCallback,
      cancelCallbackPrev: this.cancelCallbackSubmit,
    });

    const config = {
      mutation,
      variables,
      context: {
        imRequestData: {
          cancelToken,
          files,
        },
        http: {
          preserveHeaderCase: true,
        },
      },
    };

    let data = undefined;

    try {
      const response = await apolloClient.mutate(config);

      if (response?.data?.error) {
        throw response.data.error;
      } else {
        data = response?.data;
      }
    } catch (err) {
      const error: NCore.TError | undefined = await this.errorHandlerService.prepareError(err, {
        traceId: err.networkError?.response?.headers.get(XTraceIdHeaderKey),
      });

      throw error || err;
    } finally {
      this.cancelCallbackSubmit.callback = undefined;
    }

    return data;
  }
}
