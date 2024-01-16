import type { NCore } from "@infomaximum/module-expander";
import type { DocumentNode } from "graphql";

export declare namespace NRequests {
  /** Интерфейс для инстансов выполнения запросов и мутаций из сторов */
  interface IRequest {
    /** Метод выполнения запросов */
    requestData<TData extends TDictionary>(params: TRequestDataParams): Promise<TData | null>;

    /** Метод выполнения мутаций */
    submitData<TData extends TDictionary>(params: TSubmitDataParams): Promise<TData | null>;
    /** Метод выполнения подписки */
    subscribe(params: TSubscribeParams): void;
    /** Отписывается от изменений с сервера */
    unsubscribe(): void;
    /** Метод отмены запросов и мутаций которые не завершились */
    cancelRequests(): void;
  }

  /** Тип отмены запросов
   *
   * `prev` - отменяются все предыдущие запросы, выполняется самый последний
   *
   * `last` - отменяются последующие запросы, выполняется самый первый
   */
  type TCancelable = false | "prev" | "last" | undefined;

  type TRequestDataParams<T extends TDictionary = TDictionary> = {
    /** Запрос */
    query: DocumentNode;
    /** Переменные запроса */
    variables?: TDictionary | undefined;
    cancelable?: TCancelable;
    /** дополнительный список параметров. Необходимо для различных реализаций Request */
    additionalParams?: T;
  };

  type TSubmitDataParams = {
    /** Мутация */
    mutation: DocumentNode;
    /** Переменные мутации */
    variables?: TDictionary | undefined;
    cancelable?: TCancelable;
    files?: unknown[] | undefined;
  };

  type TSubscribeParams = {
    onMessage: (params: { first: boolean; response: TDictionary }) => void;
    onError: (params: { error: NCore.TError }) => void;
    config: {
      /** Запрос */
      query: DocumentNode;
      /** Переменные запроса */
      variables?: TDictionary;
    };
  };
}
