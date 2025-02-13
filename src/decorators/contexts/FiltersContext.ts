import { createContext } from "react";
import type { NFiltersStore } from "../../utils/Store/FiltersStore/FiltersStore.types";
import type { FiltersStore } from "../../utils";

export const defaultFiltersContext = {};

export interface IFiltersContext {
  filtersStore?: FiltersStore;
  filterDescriptions?: NFiltersStore.TFilterDescriptions;
}

export const FiltersContext = createContext<IFiltersContext>(defaultFiltersContext);
