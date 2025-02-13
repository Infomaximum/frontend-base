import { EHttpCodes } from "@infomaximum/utility";
import { Expander, type NCore, showGlobalErrorModal } from "@infomaximum/module-expander";
import { filter, find, get, isArray, isMatch, isPlainObject } from "lodash";
import { EErrorCode, PARAMETERS_FIELD_NAME, rootDomNodeName } from "../../../utils/const";
import type { IErrorHandlerService } from "../ErrorHandlers.types";
import { assertSimple } from "@infomaximum/assert";

export class BaseErrorHandlerService implements IErrorHandlerService {
  private prepareInitialServerError(error: any) {
    /* если приложение еще не отрисовалось, то и ошибку отображать негде,
       поэтому показываем глобальную ошибку, необходимо при таких ошибках как: 
       server_overloaded, server_timeout
    */
    if (document.getElementById(rootDomNodeName)?.childElementCount === 0) {
      const err = get(error, "networkError.result.error");

      let isShowError = true;

      if (err && this.createNormalizedError(err)?.code === EErrorCode.INVALID_CREDENTIALS) {
        isShowError = false;
      }

      if (isShowError) {
        showGlobalErrorModal();
      }
    }
  }

  public async prepareError(graphqlError: NCore.TGraphqlError, params?: NCore.TErrorHandlerParams) {
    this.prepareInitialServerError(graphqlError);
    const errorStatusCode = get(graphqlError, "networkError.statusCode");

    if (errorStatusCode === EHttpCodes.CLIENT_CLOSED_REQUEST) {
      return;
    }

    let preparedError: NCore.TGraphqlError;

    if (get(graphqlError, "code")) {
      preparedError = graphqlError;
    } else if (!errorStatusCode) {
      preparedError = { code: EErrorCode.CONNECTION_ERROR };
    } else {
      switch (errorStatusCode) {
        case EHttpCodes.BAD_GATEWAY:
          preparedError = { code: EErrorCode.BAD_GATEWAY };
          break;
        case EHttpCodes.GATEWAY_TIMEOUT:
          preparedError = { code: EErrorCode.GATEWAY_TIMEOUT };
          break;
        default:
          preparedError = get(graphqlError, "networkError.result.error") ?? {
            code: EErrorCode.NETWORK_FAILURE_OCCURRED,
          };
      }
    }

    const normalizedError = this.createNormalizedError(preparedError, params);
    await this.handleError(normalizedError);

    return normalizedError;
  }

  /** Находит ошибку и вызывает обработчик */
  protected async handleError(normalizedError: NCore.TError) {
    const error = find(
      Expander.getInstance().getErrorsHandlers(),
      (e) => e.code === normalizedError.code && isMatch(normalizedError.params, e.params!)
    );

    // Формируем список из ошибок с кодом ошибки кроме той у которой вызываем handle
    const errorsByCode = filter(
      Expander.getInstance().getErrorsHandlers(),
      (e) => e.code === normalizedError.code && !!error && e !== error
    );

    try {
      await error?.handle?.({ error: normalizedError, errorsByCode });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  /**
   * Возвращает ошибку в нормализованном виде
   */
  protected createNormalizedError = (
    graphqlError: NCore.TGraphqlError,
    parameters?: NCore.TErrorHandlerParams
  ): NCore.TError => {
    const code = get(graphqlError, "code");
    const message = get(graphqlError, "message");
    const params = get(graphqlError, PARAMETERS_FIELD_NAME);

    assertSimple(code !== undefined, "Код ошибки должен быть задан");
    assertSimple(
      params === undefined || isPlainObject(params) || isArray(params),
      "params должны быть объектом или массивом"
    );

    return {
      code,
      params,
      message,
      traceId: parameters?.traceId,
    };
  };
}
