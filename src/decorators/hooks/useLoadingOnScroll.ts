import { useCallback, useMemo } from "react";
import type { ScrollParams } from "react-virtualized";
import { InvalidIndex } from "../../libs/utils";
import type { NTableStore } from "../../utils/Store/TableStore/TableStore.types";
import { ELimitsStateNames, defaultRestScrollTriggerHeight, type TableStore } from "../../utils";
import type { IPagingModel } from "../../components/DataTable/DataTable.types";

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
  showMoreParams: NTableStore.TActionShowMoreParams,
  recordsRestHeight: number = defaultRestScrollTriggerHeight
) {
  return useCallback(
    ({ scrollHeight, scrollTop, clientHeight }: ScrollParams) => {
      if (store.isLoading || !store.model || store.model.nextCount === 0) {
        return;
      }

      if (scrollHeight - (scrollTop + clientHeight) < recordsRestHeight) {
        store.setShowMore(showMoreParams);
      }
    },
    [store, recordsRestHeight, showMoreParams]
  );
}
