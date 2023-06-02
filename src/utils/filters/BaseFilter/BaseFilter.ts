import type { Localization } from "@infomaximum/base/src";
import type React from "react";
import type { NFiltersStore } from "../../Store/FiltersStore/FiltersStore.types";
import type {
  IBaseFilter,
  IFilterAddDrawerProps,
  IFilterEditDrawerProps,
} from "./BaseFilter.types";

abstract class BaseFilter implements IBaseFilter {
  /**
   * Получить имя фильтра. По умолчанию возвращает typename.
   * @param typename - typename фильтра
   * @param isSingle - может ли быть несколько значений фильтра
   * @param lastFilterId - id добавляемого фильтра
   * @param _ - значения фильтра. По умолчанию не используются. Нужна для переопределяющих этот метод наследников
   * @returns - имя фильтра
   */
  public static getFilterName(
    typename: NFiltersStore.TFilterTypename,
    isSingle: boolean,
    lastFilterId: number,
    _: NFiltersStore.TFilterValues
  ) {
    return isSingle ? typename : `${lastFilterId}_${typename}`;
  }

  public abstract getTypename(): string;
  public abstract getCaption(
    localization?: Localization,
    filterValue?: NFiltersStore.TFilterValues
  ): string;

  /**
   * Должен возвращать true, если фильтр имеет одиночный тип (т.е. заменяет аналогичный фильтр,
   * при добавлении) и false, если фильтр имеет множественный тип (т.е. при добавлении фильтра,
   * добавляется новый элемент в панели)
   */
  public abstract get isSingle(): boolean;

  public abstract getAddModalComponent(): React.ComponentType<IFilterAddDrawerProps> | undefined;
  public abstract getEditModalComponent(
    filterValues: NFiltersStore.TFilterValues
  ): React.ComponentType<IFilterEditDrawerProps> | undefined;
  public abstract prepareValuesForServer(
    filterValues: NFiltersStore.TFilterValues
  ): NFiltersStore.TPreparedFilterValue;
  public abstract getQueryParamName(filterValues: NFiltersStore.TFilterValues): string;

  public abstract getFilterForPersist(
    state: NFiltersStore.TFilter
  ): NFiltersStore.TFilterPersistValue;

  public abstract getFilterSpoilerContent(
    filterValues: NFiltersStore.TFilterValues,
    localization: Localization
  ): React.ReactNode;

  /**
   * Отображать ли данный фильтр в списке для ручного добавления. Если не переопределить, то всегда возвращает true
   * @returns boolean
   */
  public isShowInAddFilterList() {
    return true;
  }
}

export { BaseFilter };
