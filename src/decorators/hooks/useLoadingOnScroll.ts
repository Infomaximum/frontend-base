import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ScrollParams } from "react-virtualized";
import { InvalidIndex } from "../../libs/utils";
import type { NTableStore } from "../../utils/Store/TableStore/TableStore.types";
import { ELimitsStateNames, defaultRestScrollTriggerHeight, type TableStore } from "../../utils";
import type { PagingGroup } from "../../models";
import { useUnmountEffect } from "./useUnmountEffect";
import { useFirstMountState } from "./useFirstMountState";

export function useNodeShowMoreParams(
  variables?: TDictionary<any>,
  nodeId = InvalidIndex
): NTableStore.TActionShowMoreParams {
  return useMemo(
    () => ({ limitsName: ELimitsStateNames.DEFAULT, variables: variables ?? {}, nodeId }),
    [variables, nodeId]
  );
}

export function useLoadingOnScroll(
  store: TableStore<PagingGroup>,
  showMoreParams: NTableStore.TActionShowMoreParams,
  recordsRestHeight: number = defaultRestScrollTriggerHeight
) {
  const isFirstMount = useFirstMountState();
  const scrollTopRef = useRef<number>(0);
  // id ноды, с которой уходим
  const nodeIdRef = useRef<number | null>(null);

  useUnmountEffect(() => {
    store.setScrollTop(scrollTopRef.current, showMoreParams?.nodeId || InvalidIndex);
  });

  useEffect(() => {
    // устанавливаем значение ноды, от которой уходим при монтировании
    if (isFirstMount) {
      nodeIdRef.current = showMoreParams.nodeId;

      return;
    }

    // установка значения скролла для ноды, с которой мы уходим при апдейтах
    if (nodeIdRef.current !== showMoreParams.nodeId) {
      nodeIdRef.current !== null &&
        store.setScrollTop(scrollTopRef.current, nodeIdRef.current || InvalidIndex);
      nodeIdRef.current = showMoreParams.nodeId;
    }
  }, [showMoreParams.nodeId]);

  return useCallback(
    ({ scrollHeight, scrollTop, clientHeight }: ScrollParams) => {
      scrollTopRef.current = scrollTop;

      if (store.isLoading || !store.model || !store.model.hasNext) {
        return;
      }

      if (scrollHeight - (scrollTop + clientHeight) < recordsRestHeight) {
        store.setShowMore(showMoreParams);
      }
    },
    [store, recordsRestHeight, showMoreParams]
  );
}
