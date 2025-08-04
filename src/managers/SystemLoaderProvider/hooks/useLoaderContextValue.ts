/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  SystemLoaderContext,
  type ISystemLoaderCallbackOptions,
  type TSystemLoaderContextValue,
} from "../../../decorators/contexts/SystemLoaderContext";
import type {
  TSystemLoaderCallbackExternalControlOptions,
  TSystemLoaderProviderExternalHandlers,
} from "../SystemLoaderProvider.types";

type TLoaderContextValueParams = {
  providerId: string;
  debugKey: string | undefined;
  timeout: number | undefined;
};

export const useLoaderContextValue = ({
  debugKey,
  timeout,
  providerId,
}: TLoaderContextValueParams) => {
  const [isLoading, setLoadingState] = useState(true);

  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const isDebugHook = process.env.NODE_ENV !== "production" && debugKey;

  const ids = useRef(new Set<string>());

  const systemLoaderContext = useContext(SystemLoaderContext);

  const showSystemLoader = useCallback((options: ISystemLoaderCallbackOptions) => {
    setLoadingState(true);

    ids.current.add(options.id);

    isDebugHook &&
      console.warn("showSystemLoader ", {
        provider: debugKey,
        consumer: options?.debugKey,
        size: ids.current.size,
      });
  }, []);

  const handleComplete = useCallback(() => {
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    setLoadingState(false);
    isDebugHook && console.warn("hide loader", { provider: debugKey });

    // сообщаем родительскому провайдеру, что контент внутри текущего провайдера готов к отображению
    systemLoaderContext?.hideSystemLoader({ debugKey, id: providerId });
  }, [systemLoaderContext]);

  const hideSystemLoader = useCallback(
    (options: ISystemLoaderCallbackOptions) => {
      ids.current.delete(options.id);

      isDebugHook &&
        console.warn("hideSystemLoader ", {
          provider: debugKey,
          consumer: options?.debugKey,
          size: ids.current.size,
        });

      // скрываем спиннер, только если все дочерние контейнеры готовы отобразить контент
      if (ids.current.size === 0) {
        handleComplete();
      }
    },
    [handleComplete]
  );

  const handleCompleteRef = useRef(handleComplete);
  handleCompleteRef.current = handleComplete;

  useEffect(() => {
    if (timeout === undefined) {
      return;
    }

    const timeoutId = setTimeout(() => {
      isDebugHook && console.warn("timeout expired", { provider: debugKey });
      handleCompleteRef.current();
    }, timeout);

    timeoutIdRef.current = timeoutId;

    return () => clearTimeout(timeoutId);
  }, [timeout]);

  const isLoadingContainer = useCallback(() => isLoading, [isLoading]);

  const contextValue = useMemo(
    () =>
      ({
        isLoading: isLoadingContainer,
        showSystemLoader,
        hideSystemLoader,
      }) satisfies TSystemLoaderContextValue,
    [showSystemLoader, hideSystemLoader, isLoadingContainer]
  );

  const externalControlHandlers = useMemo(() => {
    return {
      isLoading: isLoadingContainer,
      showSystemLoader: (options?: TSystemLoaderCallbackExternalControlOptions) =>
        showSystemLoader({ ...options, id: providerId }),
      hideSystemLoader: (options?: TSystemLoaderCallbackExternalControlOptions) => {
        // вызывая вручную скрытие лоадера у провайдера,
        // очищаем список id потребителей и делегируем им показ лоадеров
        ids.current.clear();

        hideSystemLoader({ ...options, id: providerId });
      },
    } satisfies TSystemLoaderProviderExternalHandlers;
  }, [hideSystemLoader, isLoadingContainer, showSystemLoader]);

  return {
    isLoading,
    contextValue,
    handleComplete,
    externalControlHandlers,
  };
};
