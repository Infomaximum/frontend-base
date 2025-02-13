import type { BaseFilter } from "../../../../utils";

export interface IDropdownAddFilterProps {
  onFilterClick: (filter: BaseFilter) => void;
  filterDescriptions: BaseFilter[];
  isHeaderFilter?: boolean;
  disabled?: boolean;
}
