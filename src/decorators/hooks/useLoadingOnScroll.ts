import { useCallback, useMemo } from "react";
import type { ScrollParams } from "react-virtualized";
import type { Group } from "../../models";
import { InvalidIndex } from "../../libs/utils";
import type { NTableStore } from "../../utils/Store/TableStore/TableStore.types";
import { ELimitsStateNames, type TableStore } from "../../utils";

interface IPagingModel extends Group {
  nextCount: number;
}

export function useNodeShowMoreParams(
  variables: TDictionary<any>,
  nodeId = InvalidIndex
): NTableStore.TActionShowMoreParams {
  return useMemo(
    () => ({ limitsName: ELimitsStateNames.DEFAULT, variables, nodeId }),
    [variables, nodeId]
  );
}

export function useLoadingOnScroll(
  store: TableStore<IPagingModel>,
  showMoreParams: NTableStore.TActionShowMoreParams
) {
  return useCallback(
    ({ scrollHeight, scrollTop, clientHeight }: ScrollParams) => {
      store.setScrollTop(scrollTop);
      if (store.isLoading || !store.model || store.model.nextCount === 0) {
        return;
      }
      // подгрузка при прокручивании до 50%
      if (clientHeight + scrollTop >= scrollHeight / 2) {
        store.setShowMore(showMoreParams);
      }
    },
    [store, showMoreParams]
  );
}
