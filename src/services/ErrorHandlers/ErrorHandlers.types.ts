import type { NCore } from "@infomaximum/module-expander";

/** Интерфейс сервисов обработки ошибок */
export interface IErrorHandlerService {
  prepareError(
    graphqlError: NCore.TGraphqlError,
    params: NCore.TErrorHandlerParams
  ): Promise<NCore.TError | undefined>;
}
