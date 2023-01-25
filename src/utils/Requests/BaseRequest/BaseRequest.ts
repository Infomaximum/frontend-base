/* eslint-disable @typescript-eslint/no-this-alias */
import axios from "axios";
import { CancelRequest, XTraceIdHeaderKey } from "@im/utils";
import { isFunction } from "lodash";
import { apolloInstance } from "../../Store/Apollo";
import type { NBaseRequest } from "./BaseRequest.types";
import type { NRequests } from "../Requests.types";
import { BaseErrorHandler } from "../../ErrorHandlers/BaseErrorHandler/BaseErrorHandler";
import type { NErrorHandlers } from "../../ErrorHandlers/ErrorHandlers.types";
import type { Subscription } from "zen-observable-ts";
import type { NCore } from "@im/core";
import { v4 as uuid4 } from "uuid";

type TRequestParams = {
  /** Инстанс обработчика ошибок */
  errorHandlerInstance?: NErrorHandlers.IErrorHandler;
};

/** Служит для отправки запросов и мутаций на сервер */
export class BaseRequest implements NRequests.IRequest {
  protected errorHandlerInstance: NErrorHandlers.IErrorHandler;
  protected isFirstMessage: boolean = true;
  protected subscription: Subscription | undefined = undefined;

  protected cancelCallbackRequest: NBaseRequest.TCallback = {
    callback: undefined,
  };

  protected cancelCallbackSubmit: NBaseRequest.TCallback = {
    callback: undefined,
  };

  constructor(params: TRequestParams) {
    this.errorHandlerInstance =
      params.errorHandlerInstance ?? new BaseErrorHandler();
  }

  /** Отмена запросов и мутаций */
  public cancelRequests() {
    this.cancelCallbackRequest.callback?.();
    this.cancelCallbackSubmit.callback?.();

    this.cancelCallbackRequest.callback = undefined;
    this.cancelCallbackSubmit.callback = undefined;
  }

  public unsubscribe() {
    this.subscription?.unsubscribe?.();

    this.subscription = undefined;
  }

  /** Создает токен для отмены запроса */
  protected getCancelToken() {
    const cancelTokenSource = axios.CancelToken.source();
    const cancelToken = cancelTokenSource.token;

    const cancelCallback = () => cancelTokenSource.cancel(CancelRequest);

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
  }: NBaseRequest.TControlCancelableRequestsParams) {
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
  public async requestData({
    query,
    variables,
    cancelable,
  }: NRequests.TRequestDataParams) {
    const apolloClient = apolloInstance.apolloClient;

    const { cancelToken, cancelCallback } = this.getCancelToken();
    const traceId = uuid4();

    this.controlCancelableRequests({
      cancelable,
      cancelCallbackCurrent: cancelCallback,
      cancelCallbackPrev: this.cancelCallbackRequest,
    });

    const config = {
      query,
      variables,
      context: {
        imRequestData: {
          cancelToken,
        },
        headers: {
          [XTraceIdHeaderKey]: traceId,
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
      const error: NCore.TError | undefined =
        await this.errorHandlerInstance.prepareError(err, {
          traceId,
        });

      throw error || err;
    } finally {
      this.cancelCallbackRequest.callback = undefined;
    }

    return data;
  }

  /** Отправляет мутации на сервер */
  public async submitData({
    mutation,
    variables,
    cancelable,
    files,
  }: NRequests.TSubmitDataParams) {
    const apolloClient = apolloInstance.apolloClient;

    const { cancelToken, cancelCallback } = this.getCancelToken();
    const traceId = uuid4();

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
        headers: {
          [XTraceIdHeaderKey]: traceId,
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
      const error: NCore.TError | undefined =
        await this.errorHandlerInstance.prepareError(err, {
          traceId,
        });

      throw error || err;
    } finally {
      this.cancelCallbackSubmit.callback = undefined;
    }

    return data;
  }

  public subscribe(params: NRequests.TSubscribeParams) {
    const self = this;
    const apolloClient = apolloInstance.apolloClient;

    const observer = apolloClient.subscribe(params.config);

    this.subscription = observer.subscribe(
      (response) => {
        if (isFunction(params.onMessage)) {
          params.onMessage({
            response,
            first: self.isFirstMessage,
          });
        }

        if (self.isFirstMessage) {
          self.isFirstMessage = false;
        }
      },
      (err) => {
        this.errorHandlerInstance
          .prepareError(err.originalError, {})
          .then((error) => {
            if (isFunction(params.onError)) {
              (params.onError as (typeof params)["onError"])({
                error: error || err,
              });
            }
          });
      }
    );
  }
}
