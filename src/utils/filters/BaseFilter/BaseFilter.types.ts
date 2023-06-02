import type { FiltersStore } from "../../Store/FiltersStore/FiltersStore";
import type { NFiltersStore } from "../../Store/FiltersStore/FiltersStore.types";
import { type BaseFilter } from "./BaseFilter";

export interface IBaseFilter {}

interface ICommonFilterDrawerProps {
  filtersStore: FiltersStore;
  onCancel: () => void;
  filterDescription: BaseFilter;
  open: boolean;
  filterStorePath?: NFiltersStore.TFilterStorePath;
}

export interface IFilterAddDrawerProps extends ICommonFilterDrawerProps {
  filterValues?: NFiltersStore.TFilterValues;
  onSaveSuccess: () => void;
}

export interface IFilterEditDrawerProps extends ICommonFilterDrawerProps {
  filterName: string;
}
