import type { IDocumentNode, TInferredVariables } from "@infomaximum/utility";
import type { Store } from "../../../utils/Store/Store/Store";
import type { Model } from "@infomaximum/graphql-model";
import type { TCancelableRequest } from "../../../services/Network/Requests.types";

export type TQueryParams = {
  /** Запрос */
  query?: IDocumentNode<TDictionary>;
  /** Переменные запроса */
  variables?: TDictionary;
  cancelable?: TCancelableRequest;
};

interface ICommonMutateParams<Variables extends TDictionary = never> {
  /** Мутация */
  mutation: IDocumentNode<Variables>;
  /** Переменные мутации */
  variables?: Variables extends never ? never : Variables;
  cancelable?: TCancelableRequest;
  /** Загружаемые на сервер файлы */
  files?: unknown[];
  /** Сохранять ли ошибку в сторе
   * @default true */
  isSaveError?: boolean;
  /** Сохранять ли ответ в store
   * @default false */
  isSaveData?: boolean;
  /** Путь до данных ответа мутации. */
  dataPath?: string;
}

export interface IMutateParams<Variables extends TDictionary = never>
  extends ICommonMutateParams<Variables> {}

export interface IFormMutateParams<Variables extends TDictionary = never>
  extends ICommonMutateParams<Variables> {}

export interface IWithStoreProps<S extends Store<Model>> {
  /** Отправляет запрос на сервер */
  query<T extends TDictionary = TDictionary>(params?: TQueryParams): Promise<T | null>;
  /** Отправляет мутацию на сервер */
  mutate<
    T extends IMutateParams<TDictionary>,
    Variable extends TDictionary = TInferredVariables<T, "mutation">,
  >(
    params: IMutateParams<Variable>
  ): Promise<TDictionary | null>;
  /** Отправляет мутацию от формы на сервер */
  formMutate<
    T extends IFormMutateParams<TDictionary>,
    Variable extends TDictionary = TInferredVariables<T, "mutation">,
  >(
    params: IFormMutateParams<Variable>
  ): Promise<TDictionary | null>;
  /** Подписывается на изменения сервера */
  subscribe: S["subscribe"];
  /** Отписывается от изменений сервера */
  unsubscribe: S["unsubscribe"];
  /** Экземпляр стора переданный в параметры HOCa */
  store: S;
  /** Модель */
  model: S["model"];
  /** Модель из кэша */
  cachedModel: S["cachedModel"];
}

export type TWithStoreParams = {
  /** Выполнять ли запрос при маунте компонента (**только если нет variables у запроса**) */
  requestOnMount?: boolean;
  /** Очищать ли данные (_data, model, error_) при анмаунте компонента  */
  clearOnUnmount?: boolean;
  /** Отменять ли отправленные, но не обработанные запросы и мутации на сервер при анмаунте компонента */
  cancelRequestOnUnmount?: boolean;
  /** Подписываться ли на изменения с сервера при маунте компонента */
  subscribeOnMount?: boolean;
  /** Отписываться ли от изменений с сервера при анмаунте компонента */
  unsubscribeOnUnmount?: boolean;
};
