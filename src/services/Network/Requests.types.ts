import type { DocumentNode } from "graphql";

/** Интерфейс для инстансов выполнения запросов и мутаций из сторов */
export interface IRequestService {
  /** Метод выполнения запросов */
  requestData<TData extends TDictionary>(params: TRequestDataParams): Promise<TData | null>;

  /** Метод выполнения мутаций */
  submitData<TData extends TDictionary>(params: TSubmitDataParams): Promise<TData | null>;

  /** Метод отмены запросов и мутаций которые не завершились
   * @param callback - функция обратного вызова в случае отмены запроса
   */
  cancelRequests(callback?: () => void): void;
}

/** Тип отмены запросов
 *
 * `prev` - отменяются все предыдущие запросы, выполняется самый последний
 *
 * `last` - отменяются последующие запросы, выполняется самый первый
 */
export type TCancelableRequest = false | "prev" | "last" | undefined;

export type TRequestDataParams<T extends TDictionary = TDictionary> = {
  /** Запрос */
  query: DocumentNode;
  /** Переменные запроса */
  variables?: TDictionary | undefined;
  cancelable?: TCancelableRequest;
  /** дополнительный список параметров. Необходимо для различных реализаций Request */
  additionalParams?: T;
};

export type TSubmitDataParams = {
  /** Мутация */
  mutation: DocumentNode;
  /** Переменные мутации */
  variables?: TDictionary | undefined;
  cancelable?: TCancelableRequest;
  files?: unknown[] | undefined;
};
