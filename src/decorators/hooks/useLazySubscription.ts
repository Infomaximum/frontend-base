import { useState, useCallback } from "react";
import type { DocumentNode } from "@apollo/client";
import { useUnmountEffect } from "../../decorators";
import type { NCore } from "../../libs/core";
import { BaseSubscriptionService } from "../../services/Network/BaseSubscriptionService";

export type TLazySubscriptionParams = {
  onMessage?: (params: { first: boolean; response: TDictionary }) => void;
  onError?: (params: { error: NCore.TError }) => void;
};

type TLazySubscriptionConfig = {
  /** Запрос */
  query: DocumentNode;
  /** Переменные запроса */
  variables?: TDictionary;
};

/** Хук для выполнения подписки без привязки с какому-либо хранилищу.
 *
 * @example
 * const [lazySubscribeOnCreate, isSubscribedOnCreate] = useLazySubscription({
 *   query: workspaceCreateSubscription,
 * });
 *
 * useMountEffect(() => {
 *     if (!isSubscribedOnCreate) {
 *      lazySubscribeOnCreate({
 *       onMessage({ response }) {
 *         какие-то действия
 *       },
 *      });
 *    }
 * })
 */

export const useLazySubscription = (
  config: TLazySubscriptionConfig,
  unsubscribeOnUnmount: boolean = true
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionService] = useState(() => new BaseSubscriptionService());

  useUnmountEffect(() => {
    unsubscribeOnUnmount && lazyUnsubscribe();
  });

  /** Подписывается на изменения с сервера */
  const lazySubscribe = useCallback(
    (params: TLazySubscriptionParams) => {
      subscriptionService.subscribe({
        config,
        onMessage: ({ first, response }) => {
          const onMessage = params?.onMessage;

          onMessage?.({
            first,
            response,
          });
        },

        onError: ({ error }) => {
          params?.onError?.({
            error,
          });
        },
      });
      setIsSubscribed(true);
    },
    [config, subscriptionService]
  );

  const lazyUnsubscribe = useCallback(() => {
    setIsSubscribed(false);
    subscriptionService.unsubscribe();
  }, [subscriptionService]);

  return [lazySubscribe, isSubscribed, lazyUnsubscribe] as const;
};
