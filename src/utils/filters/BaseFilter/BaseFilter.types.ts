import type { FiltersStore } from "../../Store/FiltersStore/FiltersStore";
import type { NFiltersStore } from "../../Store/FiltersStore/FiltersStore.types";
import type { EFilteringMethods, IBaseFilter } from "@infomaximum/base-filter";

interface ICommonFilterComponentProps {
  mode: EFilteringMethods;
  filtersStore: FiltersStore;
  onCancel: () => void;
  filterDescription: IBaseFilter<IFilterAddComponentProps, IFilterEditComponentProps>;
  open: boolean;
}

export interface IClickPosition {
  x: number;
  y: number;
  elementWidth: number;
  elementHeight: number;
}
export interface IPositionConfig extends IClickPosition {
  type: string;
}

export interface IFilterAddComponentProps extends ICommonFilterComponentProps {
  filterValue?: NFiltersStore.TFilterValue;
  onSaveSuccess: () => void;
  positionConfig?: TNullable<IPositionConfig>;
}

export interface IFilterEditComponentProps extends ICommonFilterComponentProps {
  filterName: string;
}
