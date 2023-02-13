import type { NCore } from "@im/core";

export declare namespace NErrorHandlers {
  /** Интерфейс для инстансов обработки ошибок */
  interface IErrorHandler {
    prepareError(
      graphqlError: NCore.TGraphqlError,
      params: NCore.TErrorHandlerParams
    ): Promise<NCore.TError | undefined>;
  }
}
