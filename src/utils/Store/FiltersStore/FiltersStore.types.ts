import type { NBaseStore } from "@infomaximum/base/src/utils/Store/BaseStore/BaseStore.types";
import type { ObservableMap } from "mobx";
import { type BaseFilter } from "../../filters/BaseFilter/BaseFilter";

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
  type TFilterTypename = string;

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
  type TFilterValue = any;

  /**
   * Тип значений одного фильтра
   */
  type TFilterValues = TFilterValue[];

  /**
   * Тип структуры фильтра
   */
  type TFilter = {
    typename: TFilterTypename;
    values: TFilterValues;
  };

  /**
   * Тип структуры фильтра для сохранения в localStorage или url
   */
  type TFilterPersistValue = {
    type: TFilterTypename;
  };

  /**
   * Путь для хранения фильтров по сущностям
   */
  type TFilterStorePath = string;

  /**
   * Тип набора фильтров
   */
  type TFilters = ObservableMap<string, TFilter>;

  /**
   * Тип одного значения фильтра подготовленного, для отправки на сервер
   */
  type TPreparedFilterValue = any;

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
  type TFilterDescriptionGetter = (filter: TFilterPersistValue) => typeof BaseFilter;

  export interface IFilterDescriptionClass {
    new (...args: any[]): BaseFilter;

    restoreFilterByStruct(state: Record<string, any>): void;
  }
}
