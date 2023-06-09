import type { FiltersStore } from "../../Store/FiltersStore/FiltersStore";
import type { NFiltersStore } from "../../Store/FiltersStore/FiltersStore.types";
import { type BaseFilter } from "./BaseFilter";

export interface IBaseFilter {}

interface ICommonFilterComponentProps {
  filtersStore: FiltersStore;
  onCancel: () => void;
  filterDescription: BaseFilter;
  open: boolean;
  filterStorePath?: NFiltersStore.TFilterStorePath;
}

export interface IFilterAddComponentProps extends ICommonFilterComponentProps {
  filterValues?: NFiltersStore.TFilterValues;
  onSaveSuccess: () => void;
}

export interface IFilterEditComponentProps extends ICommonFilterComponentProps {
  filterName: string;
}
