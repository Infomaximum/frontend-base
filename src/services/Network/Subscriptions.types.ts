import type { NCore } from "@infomaximum/module-expander";
import type { DocumentNode } from "graphql";

export type TSubscribeParams = {
  onMessage: (params: { first: boolean; response: TDictionary }) => void;
  onError: (params: { error: NCore.TError }) => void;
  config: {
    /** Запрос */
    query: DocumentNode;
    /** Переменные запроса */
    variables?: TDictionary;
  };
};

export interface ISubscriptionService {
  /** Метод выполнения подписки */
  subscribe(params: TSubscribeParams): void;
  /** Отписывается от изменений с сервера */
  unsubscribe(): void;
}
