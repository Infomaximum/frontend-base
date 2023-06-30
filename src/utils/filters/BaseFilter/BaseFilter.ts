import type React from "react";
import type { NFiltersStore } from "../../Store/FiltersStore/FiltersStore.types";
import type { IFilterAddComponentProps, IFilterEditComponentProps } from "./BaseFilter.types";
import type { Localization } from "@infomaximum/localization";
import type { IBaseFilter } from "@infomaximum/base-filter";

abstract class BaseFilter
  implements IBaseFilter<IFilterAddComponentProps, IFilterEditComponentProps>
{
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
    _: NFiltersStore.TFilterValue
  ) {
    return isSingle ? typename : `${lastFilterId}_${typename}`;
  }

  public abstract getTypename(): string;
  public abstract getCaption(
    localization: Localization,
    filterValue?: NFiltersStore.TFilterValue
  ): string;

  /**
   * Должен возвращать true, если фильтр имеет одиночный тип (т.е. заменяет аналогичный фильтр,
   * при добавлении) и false, если фильтр имеет множественный тип (т.е. при добавлении фильтра,
   * добавляется новый элемент в панели)
   */
  public abstract get isSingle(): boolean;

  public abstract getAddFilterComponent():
    | React.ComponentType<IFilterAddComponentProps>
    | undefined;
  public abstract getEditFilterComponent(
    filterValue: NFiltersStore.TFilterValue
  ): React.ComponentType<IFilterEditComponentProps> | undefined;
  public abstract prepareValueForServer(
    filterValue: NFiltersStore.TFilterValue
  ): NFiltersStore.TPreparedFilterValue;
  public abstract getQueryParamName(filterValue: NFiltersStore.TFilterValue): string;

  public abstract getFilterForPersist(
    state: NFiltersStore.TFilter
  ): NFiltersStore.TFilterPersistValue;

  public abstract getFilterSpoilerContent(
    filterValue: NFiltersStore.TFilterValue,
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
