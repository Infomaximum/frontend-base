import type { NCore } from "@infomaximum/module-expander";

export declare namespace NErrorHandlers {
  /** Интерфейс для инстансов обработки ошибок */
  interface IErrorHandler {
    prepareError(
      graphqlError: NCore.TGraphqlError,
      params: NCore.TErrorHandlerParams
    ): Promise<NCore.TError | undefined>;
  }
}
