import type { ObservableMap } from "mobx";
import type { TFilterClassByTypenameCache } from "../FiltersPanel.types";
import type { NFiltersStore } from "@infomaximum/base/src/utils/Store/FiltersStore/FiltersStore.types";
import type { BaseFilter } from "@infomaximum/base/src/utils";

export interface IInlineFilterTagsProps {
  filters: ObservableMap<string, NFiltersStore.TFilter & { id: number }>;
  filterClassByTypenameCache?: TFilterClassByTypenameCache;
  handleEditFilterClick: (
    filterDescription: BaseFilter,
    filterName: NFiltersStore.TFilterName
  ) => void;
  handleRemoveFilterClick: (filterName: NFiltersStore.TFilterName, index: number) => void;
  isDisabledByOpenFilter: boolean;
  handleRemoveFilters: () => void;
}

export type TInlineFilterTagsConfig = {
  tagSidePadding: number;
  tagsGutter: number;
  tagFontSize: number;
  tagBorderWidth: number;
  tagHeight: number;
  outerEllipsisFontSize: number;
  outerEllipsisPaddingLeft: number;
  closeIconWidth: number;
};
