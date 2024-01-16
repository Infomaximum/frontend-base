/* eslint-disable @typescript-eslint/no-this-alias */
import type { NCore } from "@infomaximum/module-expander";
import { cloneDeep, get, isArray, isNil, reduce } from "lodash";
import { action, computed, makeObservable, observable } from "mobx";
import { typenameToModel } from "../../../models/typenameToModel";
import { type TInferredVariables } from "@infomaximum/utility";
import { BaseRequest } from "../../Requests/BaseRequest/BaseRequest";
import { BaseErrorHandler } from "../../ErrorHandlers/BaseErrorHandler/BaseErrorHandler";
import type { NStore } from "./Store.types";
import type { DocumentNode } from "graphql";
import { BaseStore } from "../BaseStore/BaseStore";
import type { NRequests } from "../../Requests/Requests.types";
import type { Model, TModelStruct } from "@infomaximum/graphql-model";
import { assertSimple } from "@infomaximum/assert";
import { ApolloDataCache } from "../ApolloDataCache";

type TPrivateStoreField =
  | "_data"
  | "_isDataLoaded"
  | "_loading"
  | "_model"
  | "_cachedModel"
  | "_error"
  | "_searchValue"
  | "_submitting"
  | "receiveError"
  | "setIsDataLoaded"
  | "setLoading"
  | "setSubmitting"
  | "receiveData"
  | "_isSubscribed";

/**
 * Базовый стор
 *
 * **Обязательно нужно передавать модель в generic при создании экземпляра**
 *
 * @example
 * const personStore = new Store<PersonModel>({
 *    dataPath: "employee.employee",
 *    getQueryParams({ variables }) {
 *      return {
 *        query: personQuery,
 *        ...variables
 *      }
 *    }
 * })
 *
 */
export class Store<M extends Model = never> extends BaseStore {
  // ----------------------------------------OBSERVABLE------------------------------------//
  protected _data: TModelStruct | undefined | null = undefined;
  private _isDataLoaded = false;
  private _loading = false;
  private _submitting = false;
  private _error: NCore.TError | undefined = undefined;
  protected _model: M | null = null;
  protected _cachedModel: M | null = null;
  protected _searchValue: string | null = null;
  private _isSubscribed: boolean = false;

  private dataPath: string;
  private requestInstance: NRequests.IRequest;
  private dataCacheInstance: NStore.IDataCache;
  private getQueryParams: NStore.TQueryParamsGetter<Store<M>>;
  private prepareData: NStore.TPrepareData<Store<M>> | undefined;
  private subscriptionConfig: NStore.TStoreSubscriptionConfig | undefined;
  public isHasSubscription: boolean = false;

  constructor(params: NStore.TStoreParams<Store<M>>) {
    super({ name: params.name });

    makeObservable<this, TPrivateStoreField>(this, {
      _data: observable.ref,
      _isDataLoaded: observable,
      _loading: observable,
      _submitting: observable,
      _model: observable.ref,
      _cachedModel: observable.ref,
      _error: observable.ref,
      _searchValue: observable,
      _isSubscribed: observable,
      clearData: action.bound,
      clearError: action.bound,
      requestData: action.bound,
      receiveData: action.bound,
      receiveError: action.bound,
      submitData: action.bound,
      setLoading: action.bound,
      setSubmitting: action.bound,
      setSubscribed: action.bound,
      setIsDataLoaded: action.bound,
      searchValueChange: action.bound,
      subscribe: action.bound,
      unsubscribe: action.bound,
      data: computed,
      isDataLoaded: computed,
      isLoadedNilData: computed,
      isLoading: computed,
      isSubmitting: computed,
      model: computed,
      cachedModel: computed,
      error: computed,
      searchValue: computed,
      isSubscribed: computed,
    });

    this.getQueryParams = params.getQueryParams;
    this.dataPath = params.dataPath;
    this.prepareData = params.prepareData;
    this.requestInstance =
      params.requestInstance ?? new BaseRequest({ errorHandlerInstance: new BaseErrorHandler() });
    this.dataCacheInstance = params.dataCacheInstance ?? new ApolloDataCache();
    this.subscriptionConfig = params.subscriptionConfig;
    this.isHasSubscription = Boolean(params.subscriptionConfig);
  }

  // ----------------------------------------COMPUTED------------------------------------//
  /** Возвращает данные полученные с сервера (после применения `prepareData`) */
  public get data() {
    return this._data;
  }

  /** Загружена ли data */
  public get isDataLoaded() {
    return this._isDataLoaded;
  }

  public get isLoadedNilData() {
    return this.isDataLoaded && isNil(this._data);
  }

  /** Возвращает модель */
  public get model(): M | null {
    return this._model;
  }

  /** Возвращает кэшированную модель */
  public get cachedModel(): M | null {
    return this._cachedModel;
  }

  /** Возвращает ошибку */
  public get error() {
    return this._error;
  }

  /** Выполняется ли запрос */
  public get isLoading() {
    return this._loading;
  }

  /** Выполняется ли мутация */
  public get isSubmitting() {
    return this._submitting;
  }

  /** Возвращает значение поиска */
  public get searchValue() {
    return this._searchValue;
  }

  /** Возвращает состояние подписки */
  public get isSubscribed() {
    return this._isSubscribed;
  }

  // ----------------------------------------ACTIONS------------------------------------//

  /** Управление флагом выполняющегося запроса */
  protected setLoading(isLoading: boolean) {
    this._loading = isLoading;
  }

  /** Управляет флагом загруженности данных */
  protected setIsDataLoaded(isLoaded: boolean) {
    this._isDataLoaded = isLoaded;
  }

  /** Управление флагом выполнения мутаций */
  private setSubmitting(isSubmitting: boolean) {
    this._submitting = isSubmitting;
  }

  /** Управление флагом открытой подписки */
  public setSubscribed(isSubscribed: boolean) {
    this._isSubscribed = isSubscribed;
  }

  /** Записывает данные и модель в стор */
  public receiveData(data: TModelStruct | null) {
    this._data = data;
    this._model = this.getModel(this._data);
    this._cachedModel = this._model;
  }

  /** Записывает ошибку в стор */
  protected receiveError(error: any) {
    this._error = error;
  }

  /** Изменяет значение поиска */
  public searchValueChange(value: string | undefined) {
    this._searchValue = value ?? null;
  }

  /** Очищает данные в сторе */
  public clearData() {
    this._data = undefined;
    this._isDataLoaded = false;
    this._model = null;
    this._cachedModel = null;
    this._error = undefined;
    this._searchValue = null;
    this._submitting = false;
    this._loading = false;
  }

  /** Очищает ошибку */
  public clearError() {
    this._error = undefined;
  }

  /** Подготавливает данные для запроса на сервер и обрабатывает ответ */
  public async requestData<Data extends TDictionary = any>(
    params?: NStore.IActionRequestDataParams
  ): Promise<Data | null> {
    this.setLoading(true);

    if (!this._cachedModel) {
      try {
        this._cachedModel = this.getCachedModel(params);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    const { query, variables, ...rest } = params?.query
      ? params
      : this.getQueryParams({
          variables: params?.variables ?? {},
          store: this,
        });

    let data: Data | null;

    try {
      data = await this.requestInstance.requestData<Data>({
        query: query as DocumentNode,
        variables,
        cancelable: params?.cancelable ?? "prev",
        additionalParams: rest,
      });
      this.setIsDataLoaded(true);

      /** Если передали в requestData параметр query, то сохранять данные в стор не нужно */
      if (data && !params?.query) {
        this.receiveData(this.getPreparedData(data, this.dataPath, variables));
      }
    } catch (error) {
      this.receiveError(error);

      throw error;
    } finally {
      this.setLoading(false);
    }

    return data;
  }

  /** Возвращает модель по данным из кэша */
  public getCachedModel(params?: NStore.IActionRequestDataParams): M | null {
    const { query, variables } = params?.query
      ? params
      : this.getQueryParams({
          variables: params?.variables ?? {},
          store: this,
        });

    const cachedData = this.dataCacheInstance.getData({
      query,
      variables,
      dataPath: this.dataPath,
    });

    return this.getModel(cachedData);
  }

  /** Подготавливает данные для мутации на сервер и обрабатывает ответ */
  public async submitData<
    T extends NStore.IActionSubmitDataParams<TDictionary>,
    Variables extends TDictionary = TInferredVariables<T, "mutation">
  >({
    mutation,
    variables,
    cancelable,
    files,
    isSaveError = true,
    isSaveData = false,
    dataPath,
  }: NStore.IActionSubmitDataParams<Variables>): Promise<TDictionary | null> {
    this.setSubmitting(true);

    let data: TDictionary | null;

    try {
      data = await this.requestInstance.submitData({
        mutation,
        variables,
        cancelable: cancelable ?? false,
        files,
      });
      this.setIsDataLoaded(true);

      if (dataPath) {
        data = this.getPreparedData(data, dataPath, variables);
      }

      if (isSaveData) {
        this.receiveData(data as TModelStruct);
      }
    } catch (error) {
      if (isSaveError) {
        this.receiveError(error);
      }

      throw error;
    } finally {
      this.setSubmitting(false);
    }

    return data;
  }

  /** Подписывается на изменения с сервера */
  public subscribe(params?: NStore.IActionSubscribeParams) {
    const self = this;

    assertSimple(
      !!self.subscriptionConfig,
      `для использования подписок нужно передать в стор ${self.name} subscriptionConfig`
    );

    this._isSubscribed = true;

    this.requestInstance.subscribe({
      onMessage: ({ first, response }) => {
        const onMessage = params?.onMessage || self.subscriptionConfig?.onMessage;

        onMessage?.({
          first,
          response,
          store: self,
        });
      },
      config: self.subscriptionConfig.getParams({ store: self }),
      onError: ({ error }) => {
        self.subscriptionConfig?.onError?.({
          error,
          store: self,
        });
      },
    });
  }

  // --------------------------------------HELPERS------------------------------------//

  /** Отменяет запросы и мутации которые не успели завершиться */
  public cancelRequest() {
    this.requestInstance.cancelRequests();
  }

  /** Отменяет запросы и мутации которые не успели завершиться */
  public unsubscribe() {
    this._isSubscribed = false;
    this.requestInstance.unsubscribe();
  }

  /** Подготавливает данные для сохранения */
  protected getPreparedData(data: TDictionary | null, dataPath: string, variables?: TDictionary) {
    const prepareDataGetters =
      this.prepareData && (isArray(this.prepareData) ? this.prepareData : [this.prepareData]);

    data = get(data, dataPath);
    if (!prepareDataGetters?.length) {
      return data as TModelStruct | null;
    }

    data = cloneDeep(data);

    return reduce(
      prepareDataGetters,
      (acc, func) =>
        typeof func === "function" ? func({ data: acc, store: this, variables }) : acc,
      data as TModelStruct | null
    );
  }

  /** Получает модель из хранилища моделей */
  protected getModel(_struct: TModelStruct | null): M {
    let modelClass: any;

    const struct = _struct as TNullable<TModelStruct>;

    if (struct?.__typename) {
      modelClass = typenameToModel.get<typeof Model>(struct.__typename);
    }

    return modelClass && struct ? new modelClass({ struct }) : null;
  }

  public reset() {
    this.unsubscribe();
    this.clearData();
  }
}
