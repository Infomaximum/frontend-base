import { createContext } from "react";
import type { NFiltersStore } from "@infomaximum/base/src/utils/Store/FiltersStore/FiltersStore.types";
import type { FiltersStore } from "@infomaximum/base/src/utils";

export const defaultFiltersContext = {};

export interface IFiltersContext {
  filtersStore?: FiltersStore;
  filterDescriptions?: NFiltersStore.TFilterDescriptions;
}

export const FiltersContext = createContext<IFiltersContext>(defaultFiltersContext);
