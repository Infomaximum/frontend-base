import type { BaseFilter } from "@infomaximum/base/src/utils";

export interface IDropdownAddFilterProps {
  onFilterClick: (filter: BaseFilter) => void;
  filterDescriptions: BaseFilter[];
  isHeaderFilter?: boolean;
  disabled?: boolean;
}
