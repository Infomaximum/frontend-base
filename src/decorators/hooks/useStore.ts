import type { Store } from "../../utils/Store/Store/Store";
import type { IDocumentNode, TInferredVariables } from "@im/utils";
import type { Model } from "@im/models";
import type { NStore } from "../../utils/Store/Store/Store.types";
import { useCallback, useEffect } from "react";
import { useMountEffect } from "./useMountEffect";
import { useUnmountEffect } from "./useUnmountEffect";
import { useModalError } from "./useModalError";
import { EErrorCode } from "../../utils/const";

export type TStoreParams = {
  /** Выполнять ли запрос при маунте компонента `(false)` */
  requestOnMount?: boolean;
  /** Очищать ли данные (_data, model, error_) при анмаунте компонента  */
  clearOnUnmount?: boolean;
  /** Отменять ли отправленные, но не обработанные запросы и мутации на сервер при анмаунте компонента */
  cancelRequestOnUnmount?: boolean;
  /** Подписываться ли на изменения с сервера при маунте компонента */
  subscribeOnMount?: boolean;
  /** Отписываться ли от изменений с сервера при анмаунте компонента */
  unsubscribeOnUnmount?: boolean;
  /** Выполнять ли обработку ошибок */
  isHandleError?: boolean;
};

export interface IMutation<V extends TDictionary = never>
  extends NStore.IActionSubmitDataParams<V> {
  mutation: IDocumentNode<V>;
  variables?: V;
}

export const useStore = <S extends Store<Model>>(store: S, params?: TStoreParams) => {
  const requestOnMount = params?.requestOnMount ?? false;
  const clearOnUnmount = params?.clearOnUnmount ?? true;
  const cancelRequestOnUnmount = params?.cancelRequestOnUnmount ?? true;
  const subscribeOnMount = params?.subscribeOnMount ?? false;
  const unsubscribeOnUnmount = params?.unsubscribeOnUnmount ?? false;
  const isHandleError = params?.isHandleError ?? true;

  const { showModalError } = useModalError();

  const query = store.requestData;
  const subscribe = store.subscribe;
  const unsubscribe = store.unsubscribe;

  const mutate = useCallback(
    <T extends NStore.IActionSubmitDataParams, Variables = TInferredVariables<T, "mutation">>(
      params: IMutation<Variables>
    ) => store.submitData(params),
    [store]
  );

  useEffect(() => {
    if (
      (store.error === EErrorCode.CONNECTION_ERROR ||
        store.error === EErrorCode.BAD_GATEWAY ||
        store.error === EErrorCode.GATEWAY_TIMEOUT) &&
      showModalError &&
      isHandleError
    ) {
      showModalError(store.error);
    }
  }, [isHandleError, showModalError, store.error]);

  useMountEffect(() => {
    if (requestOnMount) {
      query();
    }

    if (subscribeOnMount && store.isHasSubscription && !store.isSubscribed) {
      subscribe();
    }
  });

  useUnmountEffect(() => {
    if (clearOnUnmount) {
      store.clearData();
    }

    if (cancelRequestOnUnmount) {
      store.cancelRequest();
    }

    if (unsubscribeOnUnmount && store.isHasSubscription && store.isSubscribed) {
      unsubscribe();
    }
  });

  return { query, mutate, formMutate: mutate, subscribe, unsubscribe, store };
};
