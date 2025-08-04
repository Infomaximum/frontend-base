import type { FetchPolicy } from "@apollo/client";
import type { NCore } from "../../libs/core";
import type { DocumentNode } from "graphql";

export type TSubscribeParams = {
  onMessage: (params: { first: boolean; response: TDictionary }) => void;
  onError: (params: { error: NCore.TError }) => void;
  config: {
    /** Запрос */
    query: DocumentNode;
    /** Переменные запроса */
    variables?: TDictionary;
    /** Параметр работы внутреннего кеша
     * @default "no-cache"
     */
    fetchPolicy?: FetchPolicy;
  };
};

export interface ISubscriptionService {
  /** Метод выполнения подписки */
  subscribe(params: TSubscribeParams): void;
  /** Отписывается от изменений с сервера */
  unsubscribe(): void;
}
