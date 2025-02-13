import type { BaseFilter, FiltersStore } from "../../utils";
import type { NFiltersStore } from "../../utils/Store/FiltersStore/FiltersStore.types";
import type { IPositionConfig } from "../../utils/filters/BaseFilter/BaseFilter.types";

export interface IFiltersPanelContext {
  showFilterAddComponent(
    filterDescription: BaseFilter,
    filterValue: NFiltersStore.TFilterValue,
    afterConfirmCallback?: () => void,
    positionConfig?: IPositionConfig
  ): void;
  showFilterEditComponent(
    filterDescription: BaseFilter,
    filterValue: NFiltersStore.TFilterValue,
    filterName: NFiltersStore.TFilterName,
    afterConfirmCallback?: () => void
  ): void;
}

export interface IFiltersPanelProps {
  filterStore: FiltersStore;
  filterDescriptions?: NFiltersStore.TFilterDescriptions;
  /**
   * Метод для того, что бы передать методы по изменению состояния панели фильтров выше
   */
  filtersPanelProviderGetter?: (providerData: IFiltersPanelContext) => void;
  isVisibleAddFilterButton?: boolean;
  addingDropdown?: React.ReactNode;
  isHeaderFilter?: boolean;
}

/**
 * Структура для получения описания фильтра по typename
 */
export type TFilterClassByTypenameCache = { [filterTypename: string]: BaseFilter };
