import type { NFiltersStore } from "./FiltersStore.types";
import { action, makeObservable, observable, computed, ObservableMap } from "mobx";
import { find, forEach, isEmpty, isFunction, isNil } from "lodash";
import { type BaseFilter } from "../../filters/BaseFilter/BaseFilter";
import { FilterStorage } from "./FiltersStorage";
import { StorePersist } from "../StorePersist";
import { BaseStore } from "../BaseStore";
import { assertSimple } from "@infomaximum/assert";

type TPrivateFiltersStoreField = "_filters" | "_lastFilterId" | "_filterDescriptions";

/**
 * Стор хранения фильтров
 *
 * @example
 * const entitiesFiltersStore = new FiltersStore({
 *   name: "EntitiesFiltersStore"
 * })
 */
class FiltersStore extends BaseStore {
  private static typenameFilterFieldName = "typename" as const;

  /**
   * Возвращает сгенерированное имя фильтра.
   * Если передано описание фильтра, то используется его метод определения имени (В этом случае фильтр всегда работает в isSingle режиме).
   * @param typename - typename фильтра
   * @param isSingle - может ли быть несколько значений фильтра
   * @param lastFilterId - id добавляемого фильтра
   * @param filterValue - значение фильтра
   * @returns string
   */
  public static getFilterNameByTypename({
    typename,
    isSingle,
    lastFilterId,
    filterValue,
    store,
  }: NFiltersStore.TFilterNameByTypenameParams): NFiltersStore.TFilterName {
    const filterSet = FilterStorage.getFilterSet(store);

    const FilterDescriptionClass = filterSet[typename];

    if (typeof FilterDescriptionClass?.getFilterName === "function") {
      return FilterDescriptionClass.getFilterName(typename, isSingle, lastFilterId, filterValue);
    }

    return isSingle ? typename : `${lastFilterId}_${typename}`;
  }

  private readonly filterDescriptionGetter: NFiltersStore.TFilterDescriptionGetter | undefined;

  // ----------------------------------------OBSERVABLE------------------------------------//
  /**
   * Набор описаний фильтров
   */
  private _filterDescriptions: NFiltersStore.TFilterDescriptions = [];

  /**
   * Набор данных для фильтров
   */
  private _filters = new ObservableMap<string, NFiltersStore.TFilter & { id: number }>();

  /**
   * Идентификатор последнего созданного фильтра, должен инкрементироваться
   * при каждом добавлении фильтра, если набор фильтров не фиксирован
   */
  private _lastFilterId: number = 0;

  constructor({
    name,
    autoSave = true,
    filterDescriptionGetter,
  }: NFiltersStore.TFiltersStoreParams) {
    super({ name });

    makeObservable<this, TPrivateFiltersStoreField>(this, {
      _filterDescriptions: observable.ref,
      _filters: observable,
      _lastFilterId: observable.ref,
      resetAllFilters: action.bound,
      resetFilterByName: action.bound,
      setFilterByName: action.bound,
      addFilter: action.bound,
      setFilterDescriptions: action.bound,
      reset: action.bound,
      restoreByStruct: action.bound,
      filters: computed,
      filterDescriptions: computed,
      preparedFiltersForServer: computed,
      isFiltersEmpty: computed,
    });

    this.filterDescriptionGetter = filterDescriptionGetter;

    this.toJSON = this.toJSON.bind(this);

    if (autoSave) {
      // setTimeout нужен для того, чтобы классы описания фильтров могли быть
      // ассоциированы с хранилищами и зарегистрированы после их создания.
      setTimeout(() => {
        StorePersist.autoSave(this, name);
      }, 0);
    }
  }

  // ----------------------------------------COMPUTED------------------------------------//

  public get filters() {
    return this._filters;
  }

  public get filterDescriptions() {
    return this._filterDescriptions;
  }

  public getFilterValueByName(filterName: NFiltersStore.TFilterName | undefined) {
    return filterName ? this.filters.get(filterName)?.value : undefined;
  }

  public getFilterValueByTypename(typename: NFiltersStore.TFilterTypename) {
    const filter = this.filters.get(typename);

    return filter?.value || null;
  }

  public get preparedFiltersForServer() {
    const preparedFilters: NFiltersStore.TPreparedFilters = {};

    forEach(this.filterDescriptions, (filterDescription: NFiltersStore.TFilterDescription) => {
      const filterValue = this.getFilterValueByTypename(filterDescription.getTypename());

      assertSimple(
        isFunction(filterDescription.prepareValueForServer),
        `В описании фильтра "${filterDescription.getTypename()}" не задана функция prepareValueForServer для формирования данных запроса!`
      );

      const preparedValues = filterDescription.prepareValueForServer(filterValue);

      if (!isNil(preparedValues)) {
        assertSimple(
          isFunction(filterDescription.getQueryParamName),
          `В описании фильтра "${filterDescription.getTypename()}" не задана функция getQueryParamName для получения имени параметра запроса!`
        );

        const queryParamName = filterDescription.getQueryParamName(filterValue);

        if (preparedFilters[queryParamName]) {
          preparedFilters[queryParamName].push(...preparedValues);
        } else {
          preparedFilters[queryParamName] = preparedValues;
        }
      }
    });

    return preparedFilters;
  }

  public get isFiltersEmpty() {
    return isEmpty(this.filters);
  }

  // ----------------------------------------ACTIONS-------------------------------------//

  /**
   * Сбросить все значения фильтров
   */
  public resetAllFilters() {
    this._filters = new ObservableMap();
  }

  /**
   * Сбросить значение фильтра по имени
   */
  public resetFilterByName(filterName: NFiltersStore.TFilterName) {
    this._filters.delete(filterName);
  }

  /**
   * Установить значение фильтра по имени
   */
  public setFilterByName(filterName: NFiltersStore.TFilterName, value: NFiltersStore.TFilterValue) {
    const oldFilter = this.filters.get(filterName);

    if (oldFilter) {
      const newFilterState = { ...oldFilter, value };

      this._filters.set(filterName, newFilterState);
    }
  }

  /**
   * Добавить фильтр
   */
  public addFilter(
    filterTypename: NFiltersStore.TFilterTypename,
    value: NFiltersStore.TFilterValue,
    isSingle: boolean = true
  ) {
    if (!isSingle) {
      this._lastFilterId++;
    }

    const filterName = FiltersStore.getFilterNameByTypename({
      typename: filterTypename,
      isSingle,
      lastFilterId: this._lastFilterId,
      filterValue: value,
      store: this,
    });

    const filterState = {
      [FiltersStore.typenameFilterFieldName]: filterTypename,
      value,
      id: this._lastFilterId,
    };

    this._filters.set(filterName, filterState);
  }

  /**
   * Установить набор описаний фильтров
   */
  public setFilterDescriptions(filterDescriptions: NFiltersStore.TFilterDescriptions) {
    this._filterDescriptions = filterDescriptions;
  }

  // ----------------------------------------HELPERS-------------------------------------//

  public reset() {
    this._filterDescriptions = [];
    this._filters = new ObservableMap();
    this._lastFilterId = 0;
    localStorage.removeItem(this.name);
  }

  public getPersistStruct(): NFiltersStore.TRestoreStruct {
    const persistFilters: NFiltersStore.TRestoreStruct = [];

    const filterDescriptionsCache: TDictionary<BaseFilter> = {};
    const filtersArr = Array.from(this.filters);

    forEach(filtersArr, ([, filter]) => {
      if (filter) {
        const filterTypename = filter.typename;
        let filterDescriptionCache = filterDescriptionsCache[filterTypename];

        if (!filterDescriptionCache) {
          const filterDescription = find(
            this.filterDescriptions,
            (filterDescription) => filterDescription.getTypename() === filterTypename
          );

          if (filterDescription) {
            filterDescriptionCache = filterDescription;

            filterDescriptionsCache[filterTypename] = filterDescription;
          }
        }

        if (filterDescriptionCache) {
          const persistStruct = filterDescriptionCache.getFilterForPersist(filter);

          if (persistStruct) {
            persistFilters.push(
              filterDescriptionCache.isSingle ? persistStruct : { ...persistStruct, multiple: true }
            );
          }
        }
      }
    });

    return persistFilters;
  }

  public override toJSON(): string {
    const persistStruct: NFiltersStore.TRestoreStruct = this.getPersistStruct();

    return !isEmpty(persistStruct) ? JSON.stringify(persistStruct) : "";
  }

  public override restoreByStruct(restoreStruct: NFiltersStore.TRestoreStruct) {
    const filterSet = FilterStorage.getFilterSet(this);
    this.resetAllFilters();

    forEach(restoreStruct, (filter) => {
      let filterDescription = filterSet[filter.type];

      if (!filterDescription && isFunction(this.filterDescriptionGetter)) {
        filterDescription = this.filterDescriptionGetter(filter);
      }

      if (filterDescription) {
        const isSingle = !filter.multiple;

        if (!isSingle) {
          this._lastFilterId++;
        }

        const restoredFilter = filterDescription.restoreFilterByStruct?.(filter);

        const filterName = FiltersStore.getFilterNameByTypename({
          typename: filter.type,
          isSingle,
          lastFilterId: this._lastFilterId,
          filterValue: restoredFilter?.value,
          store: this,
        });

        this._filters.set(filterName, { ...restoredFilter, id: this._lastFilterId });
      }
    });
  }
}

export { FiltersStore };
