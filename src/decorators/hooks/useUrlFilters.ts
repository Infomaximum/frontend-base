import { useCallback } from "react";
import { UrlParamAccessor, type FiltersStore } from "../../utils";
import { useFiltersSubscribe } from "./useFiltersSubscribe";
import { useWillMountEffect } from "./useWillMountEffect";
import { useMountEffect } from "./useMountEffect";

export const useUrlFilters = (filtersStore: FiltersStore) => {
  const subscribeFilters = useFiltersSubscribe(filtersStore);

  const updateUrl = useCallback(() => {
    UrlParamAccessor.set("filters", filtersStore.toJSON());
  }, [filtersStore]);

  useWillMountEffect(() => {
    UrlParamAccessor.get("filters").then((filters) => {
      if (filters) {
        let filtersStruct;

        try {
          filtersStruct = JSON.parse(filters);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }

        if (filtersStruct) {
          filtersStore.restoreByStruct(filtersStruct);
        }
      } else {
        updateUrl();
      }
    });
  });

  useMountEffect(() => {
    subscribeFilters(updateUrl);
  });
};
