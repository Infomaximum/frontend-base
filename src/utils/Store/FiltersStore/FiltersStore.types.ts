import type { ObservableMap } from "mobx";
import { type BaseFilter } from "../../filters/BaseFilter/BaseFilter";
import type { NBaseStore } from "../BaseStore/BaseStore.types";
import type {
  TFilterState,
  TFilterValue as TBaseFilterValue,
  TFilterPersistValue as TBaseFilterPersistValue,
  TFilterTypename as TBaseFilterTypename,
  TPreparedFilterValue as TBasePreparedFilterValue,
} from "@infomaximum/base-filter";

// todo: описать типы через дженерики
/** Пространство для типов стора фильтров */
export declare namespace NFiltersStore {
  /**
   * Тип параметров конструктора класса FiltersStore
   */
  type TFiltersStoreParams = {
    /** Запускать ли автосохранение в localStorage (по-умолчанию true) */
    autoSave?: boolean;

    /** геттер для получения filterDescription*/
    filterDescriptionGetter?: TFilterDescriptionGetter;
  } & NBaseStore.IBaseStoreParams;

  /**
   * Тип имени фильтра
   */
  type TFilterName = string;

  /**
   * Тип имени типа фильтра
   */
  type TFilterTypename = TBaseFilterTypename;

  /**
   * Тип описания фильтра
   */
  type TFilterDescription = BaseFilter;

  /**
   * Тип набора описаний фильтров
   */
  type TFilterDescriptions = TFilterDescription[];

  /**
   * Тип одного значения фильтра
   */
  type TFilterValue = TBaseFilterValue;

  /**
   * Тип структуры фильтра
   */
  type TFilter = TFilterState;

  /**
   * Тип структуры фильтра для сохранения в localStorage или url
   */
  type TFilterPersistValue = TBaseFilterPersistValue;

  /**
   * Тип набора фильтров
   */
  type TFilters = ObservableMap<string, TFilter>;

  /**
   * Тип одного значения фильтра подготовленного, для отправки на сервер
   */
  type TPreparedFilterValue = TBasePreparedFilterValue;

  /**
   * Тип значений фильтров подготовленных, для отправки на сервер
   */
  type TPreparedFilters = TDictionary<TPreparedFilterValue>;

  /**
   * Тип сохраненной в localStorage структуры фильтров
   */
  type TRestoreStruct = (TFilterPersistValue & { multiple?: true })[];

  /**
   * Геттер для получения filterDescription по правилам модуля
   */
  type TFilterDescriptionGetter = (
    filter: TFilterPersistValue
  ) => IFilterDescriptionStaticStruct | undefined;

  export interface IFilterDescriptionStaticStruct {
    getFilterName?(
      typename: NFiltersStore.TFilterTypename,
      isSingle: boolean,
      lastFilterId: number,
      filterValue: NFiltersStore.TFilterValue
    ): NFiltersStore.TFilterName;

    restoreFilterByStruct(state: Record<string, any>): TFilter;
  }

  export type TFilterDescriptionStruct = {
    typename: string;
    FilterClass: IFilterDescriptionStaticStruct;
  };
}
