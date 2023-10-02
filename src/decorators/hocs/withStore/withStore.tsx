import type { Store } from "../../../utils/Store/Store/Store";
import hoistNonReactStatics from "hoist-non-react-statics";
import { type FC, useCallback } from "react";
import type { TPropInjector } from "@infomaximum/utility";
import { observer } from "mobx-react";
import { useMountEffect } from "../../hooks/useMountEffect";
import { useUnmountEffect } from "../../hooks/useUnmountEffect";
import type {
  IWithStoreProps,
  IFormMutateParams,
  IMutateParams,
  TQueryParams,
  TWithStoreParams,
} from "./withStore.types";
import type { Model } from "@infomaximum/graphql-model";

export const withStore =
  (
    store: Store<Model>,
    params: TWithStoreParams = {}
  ): TPropInjector<IWithStoreProps<Store<Model>>> =>
  (Component: any) => {
    const {
      requestOnMount = true,
      clearOnUnmount = true,
      cancelRequestOnUnmount = true,
      subscribeOnMount = false,
      unsubscribeOnUnmount = false,
    } = params;

    const subscribe = store.subscribe;
    const unsubscribe = store.unsubscribe;

    const WithStoreComponent: FC = observer((props) => {
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

      const query = useCallback((params?: TQueryParams) => {
        return store.requestData({
          query: params?.query,
          variables: params?.variables,
          cancelable: params?.cancelable ?? "prev",
        });
      }, []);

      const mutate = useCallback(
        ({
          mutation,
          variables,
          cancelable = false,
          files,
          isSaveError = true,
          isSaveData = false,
          dataPath,
        }: IMutateParams) => {
          return store.submitData({
            mutation,
            variables,
            cancelable,
            files,
            isSaveError,
            isSaveData,
            dataPath,
          });
        },
        []
      );

      const formMutate = useCallback(
        ({
          mutation,
          variables,
          cancelable = false,
          files,
          isSaveData = false,
          dataPath,
        }: IFormMutateParams) => {
          return store.submitData({
            mutation,
            variables,
            cancelable,
            files,
            isSaveError: false,
            isSaveData,
            dataPath,
          });
        },
        []
      );

      const withStoreProps = {
        error: store.error,
        store,
        query,
        model: store.model,
        cachedModel: store.cachedModel,
        mutate,
        formMutate,
        subscribe,
        unsubscribe,
      };

      return <Component {...props} {...withStoreProps} />;
    });

    return hoistNonReactStatics(WithStoreComponent, Component);
  };
