import { action, makeObservable, observable, override, computed } from "mobx";
import type { IModel, Model } from "@infomaximum/graphql-model";
import { Store } from "../Store/Store";
import type { NTableStore } from "./TableStore.types";
import { isNumber, setWith } from "lodash";

type TPrivateTableStoreField =
  | "_checkedState"
  | "_expandedState"
  | "receiveData"
  | "_topRowsModels"
  | "_showMore"
  | "_scrollTop"
  | "_isPageLoading";

/**
 * Стор используемый в таблицах
 *
 * **Обязательно нужно передавать модель в generic при создании экземпляра**
 *
 * @example
 * const apiKeysStore = new TableStore<ApiKeysModel>({
 *    dataPath: "api_key.api_key_list",
 *    getQueryParams({ variables }) {
 *      return {
 *        query: apiKeysQuery,
 *        ...variables
 *      }
 *    }
 * })
 *
 */
export class TableStore<M extends Model = never> extends Store<M> {
  private _checkedState: NTableStore.TCheckedRows = {};
  protected _expandedState: string[] = [];
  private _showMore: NTableStore.TShowMore = {};
  private _topRowsModels: IModel[] = [];
  private _isPageLoading: boolean = false;
  private _scrollTop: number = 0;

  private _isTree: boolean;

  constructor(params: NTableStore.TTableStoreParams<TableStore<M>>) {
    super(params);

    makeObservable<this, TPrivateTableStoreField>(this, {
      _checkedState: observable.ref,
      _expandedState: observable.ref,
      _showMore: observable.ref,
      _topRowsModels: observable.ref,
      _scrollTop: observable.ref,
      _isPageLoading: observable,
      setCheckState: action.bound,
      expandRows: action.bound,
      setShowMore: action.bound,
      setTopRowsModels: action.bound,
      setScrollTop: action.bound,
      checkedState: computed,
      expandedState: computed,
      showMore: computed,
      topRowsModels: computed,
      isPageLoading: computed,
      scrollTop: computed,
      clearData: override,
      searchValueChange: override,
      receiveData: override,
    });

    this._isTree = params.isTree;
  }

  //----------------------------------------COMPUTED------------------------------------//

  public get checkedState() {
    return this._checkedState;
  }

  public get expandedState() {
    return this._expandedState;
  }

  public get showMore() {
    return this._showMore;
  }

  public get topRowsModels() {
    return this._topRowsModels;
  }

  public get scrollTop() {
    return this._scrollTop;
  }

  public get isPageLoading() {
    return this._isPageLoading;
  }

  //----------------------------------------ACTIONS------------------------------------//

  public setCheckState(checkedRows: NTableStore.TCheckedRows) {
    this._checkedState = checkedRows;
  }

  public expandRows(keys: string[]) {
    this._expandedState = keys;
  }

  public setScrollTop(scrollTop: number) {
    this._scrollTop = scrollTop;
  }

  public async setShowMore(showMoreParams: NTableStore.TActionShowMoreParams) {
    const currentLimits = this.showMore?.[showMoreParams.limitsName];
    const nodeLimit = isNumber(showMoreParams.nodeId)
      ? currentLimits?.[showMoreParams.nodeId] || 0
      : 0;
    const pages = showMoreParams.pages ?? 1;

    setWith(
      this._showMore,
      `${showMoreParams.limitsName}.${showMoreParams.nodeId}`,
      nodeLimit + pages,
      Object
    );

    this._isPageLoading = true;
    await this.requestData({ variables: showMoreParams.variables });
    this._isPageLoading = false;
  }

  public setTopRowsModels(models: IModel[]) {
    this._topRowsModels = models;
  }

  public setSearchValue(value: string | undefined) {
    super.searchValueChange(value);
  }

  // Override
  public override clearData(excludedKeys?: NTableStore.TExcludeClearDataKeys) {
    const searchValue = this.searchValue;

    super.clearData();

    this._showMore = {};
    this._topRowsModels = [];

    if (excludedKeys) {
      if (!excludedKeys.includes("expandedState")) {
        this._expandedState = [];
      }

      if (!excludedKeys.includes("checkedState")) {
        this._checkedState = {};
      }

      if (excludedKeys.includes("searchValue")) {
        this._searchValue = searchValue;
      }
    } else {
      this._checkedState = {};
      this._expandedState = [];
    }
  }

  // Override
  public override searchValueChange(value: string | undefined, variables?: TDictionary) {
    super.searchValueChange(value);
    this.requestData({ variables });
  }

  //----------------------------------------HELPERS------------------------------------//

  /** Дерево? */
  public get isTree() {
    return this._isTree;
  }
}
