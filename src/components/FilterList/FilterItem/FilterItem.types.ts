import type React from "react";
import type { BaseFilter } from "../../../utils";
import type { NFiltersStore } from "../../../utils/Store/FiltersStore/FiltersStore.types";

export interface IFilterItemProps {
  caption: string;
  filterName: NFiltersStore.TFilterName;
  children?: React.ReactNode;
  onClick?: (filterDescription: BaseFilter, filterName: NFiltersStore.TFilterName) => void;
  onRemoveClick?: (filterName: NFiltersStore.TFilterName, index: number) => void;
  filterDescription: BaseFilter;
  index: number;
  disabled: boolean;
  isHeaderFilter?: boolean;
  withOverflow?: boolean;
}
