import type { DocumentNode } from "graphql";
import type { IDocumentNode, Model, TModelStruct } from "@im/utils";
import type { NBaseStore } from "../BaseStore/BaseStore.types";
import type { NRequests } from "@im/base/src/utils/Requests/Requests.types";
import type { NCore } from "@im/core";
import type { Store } from "./Store";

/** Пространство для типов базового стора */
export declare namespace NStore {
  type TPrepareDataFuncParams<S extends Store<M> = Store<any>, M extends Model = Model> = {
    data: TModelStruct | null;
    store: S;
    variables: TDictionary | undefined;
  };

  type TPrepareDataFunc<S extends Store<M>, M extends Model = Model> = (
    params: TPrepareDataFuncParams<S, M>
  ) => TModelStruct | null;

  type TPrepareData<S extends Store<M>, M extends Model = Model> =
    | TPrepareDataFunc<S, M>
    | TPrepareDataFunc<S, M>[];

  type TParamsGetterArg<S extends Store<M>, M extends Model = Model> = {
    /** Переменные запроса */
    variables: TDictionary;
    store: S;
  };

  type TQueryParamsGetter<S extends Store<M>, M extends Model = Model, T = unknown> = (
    this: S,
    params: TParamsGetterArg<S, M>
  ) => {
    /** Запрос */
    query: DocumentNode;
    /** Переменные запроса */
    variables?: TDictionary;
  } & T;

  type TStoreParams<
    S extends Store<M>,
    M extends Model = S extends Store<infer M> ? M : never
  > = M extends Model
    ? {
        /** Геттер запроса и переменных запроса */
        getQueryParams: TQueryParamsGetter<S, M, unknown>;
        /** Путь к данным которые приходят с сервера */
        dataPath: string;
        /** Инстанс класса для отправки запросов/мутаций на сервер */
        requestInstance?: NRequests.IRequest;
        /** Обработчики данных которые пришли с сервера перед записью их в стор */
        prepareData?: TPrepareData<S, M>;
        /** конфиг для подписок */
        subscriptionConfig?: TStoreSubscriptionConfig;
      } & NBaseStore.IBaseStoreParams
    : never;

  interface IActionRequestDataParams {
    /** Запрос */
    query?: DocumentNode;
    /** Переменные запроса */
    variables?: TDictionary | undefined;
    cancelable?: NRequests.TCancelable;
  }

  interface IActionSubmitDataParams<V extends TDictionary = never> {
    /** Мутация */
    mutation: IDocumentNode<V>;
    /** Переменные мутации */
    variables?: V extends never ? never : V;
    cancelable?: NRequests.TCancelable;
    /** Файлы для отправки на сервер */
    files?: unknown[];
    /** Сохранять ли ошибку в store
     * @default true */
    isSaveError?: boolean;
    /** Сохранять ли ответ в store
     * @default false */
    isSaveData?: boolean;
    /** Путь до данных ответа мутации. */
    dataPath?: string;
  }

  interface IActionSubscribeParams {
    onMessage: (params: { first: boolean; response: TDictionary; store: unknown }) => void;
  }

  export type TStoreSubscriptionConfig = {
    getParams: (params?: { store: unknown }) => {
      /** Запрос */
      query: DocumentNode;
      /** Переменные запроса */
      variables?: TDictionary;
    };
    onMessage?: (params: { first: boolean; response: TDictionary; store: unknown }) => void;
    onError?: (params: { error: NCore.TError; store: unknown }) => void;
  };

  export type TQueryGetterParams<S extends Store<Model> = Store<Model>> = {
    store: S;
  };
}
