import type { BaseFilter, FiltersStore } from "@infomaximum/base/src/utils";
import { useWillMountEffect } from "./useWillMountEffect";

/**
 * Hook for setup filters before mounting components
 * @param filtersStore filters store instance
 * @param filterDescriptions list of filter descriptions
 */
export const useFilterDescriptionsSetup = (
  filtersStore: FiltersStore | undefined,
  filterDescriptions: BaseFilter[] | undefined
) => {
  useWillMountEffect(() => {
    if (filtersStore && filterDescriptions) {
      filtersStore.setFilterDescriptions(filterDescriptions);
    }
  });
};
