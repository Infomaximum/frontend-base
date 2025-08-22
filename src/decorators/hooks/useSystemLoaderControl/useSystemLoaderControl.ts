/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useId, useLayoutEffect, useRef } from "react";
import { useExecuteCallbackOnceOnCondition } from "../useExecuteCallbackOnceOnCondition";
import { SystemLoaderContext } from "@infomaximum/base/src/decorators/contexts/SystemLoaderContext";

type TParams = {
  model: unknown | null;
  error: unknown | null;
  isDataLoaded: boolean;
};

type TRequiredModelFromParams = TParams & {
  [K in keyof TParams as K extends "model" ? K : never]: NonNullable<TParams[K]>;
};

/**
 * Хук для управления видимостью системного лоадера(спиннера) на основе переданных параметров.
 *
 * @param {boolean | TParams} params - Либо булево значение, указывающее состояние загрузки, либо объект с полями `model`, `error`, `isDataLoaded`.
 *
 * * Если передано булево значение:
 *   * `true` означает, что система находится в состоянии загрузки, и лоадер будет отображён.
 *   * `false` означает, что загрузка завершена, и лоадер будет скрыт.
 *
 * * Если передан объект:
 *   * Загрузчик будет отображён, если `model` и `error` равны `null` или `undefined`.
 *   * Загрузчик будет скрыт, если `model` определён.
 *
 * @returns {boolean} Указывает, завершена ли загрузка:
 *   * `true`, если система завершила загрузку (`params` — булево значение и равно `false`, либо `params.model` определён).
 *   * `false`, если система всё ещё находится в процессе загрузки.
 *
 * @example
 * // Использование с булевым значением
 * const isLoaded = useSystemLoaderControl(true); // Показывает загрузчик
 *
 * // Использование с объектом
 * const isLoaded = useSystemLoaderControl({ model: null, error: null }); // Показывает загрузчик
 *
 * @example
 * // Использование со стором
 * const isLoaded = useSystemLoaderControl(store);
 *
 * if (!isLoaded) {
 *    return null;
 * }
 *
 * // тут для typescript store.model будет гарантированно присутствовать
 *  console.log("Система готова!", store.model);
 */

interface ISystemLoaderControlOptions {
  debugKey?: string;
}

export function useSystemLoaderControl(
  params: TParams,
  options?: ISystemLoaderControlOptions
): params is TRequiredModelFromParams;

export function useSystemLoaderControl(
  isLoading: boolean,
  options?: ISystemLoaderControlOptions
): boolean;

export function useSystemLoaderControl(
  params: boolean | TParams,
  options?: ISystemLoaderControlOptions
): boolean {
  const debugKey = options?.debugKey;

  const id = useId();

  const { hideSystemLoader } = useContext(SystemLoaderContext);

  const isLoading =
    typeof params === "boolean" ? params : !(params.model || params.error || params.isDataLoaded);

  const isLoaded = typeof params === "boolean" ? !params : !!params.model;

  useSystemLoaderControlMount(id, isLoading, debugKey);

  useExecuteCallbackOnceOnCondition(!isLoading, () => {
    hideSystemLoader({ debugKey, id });
  });

  return isLoaded;
}

/**
 * Обработать монтирование потребителя SystemLoaderContext
 * (повторно используемая часть для задачи BI-15183)
 */
export function useSystemLoaderControlMount(
  id: string,
  isLoading: boolean,
  debugKey: string | undefined
) {
  const {
    showSystemLoader,
    hideSystemLoader,
    isLoading: isLoadingProvider,
  } = useContext(SystemLoaderContext);

  /** Чтобы не отображать лоадер, если изначально пришло false */
  const shouldShowLoader = useRef(isLoadingProvider() || isLoading);
  /* Показывали ли уже лоадер при монтировании (чтобы не дублировать вызов), исправляет 
  проблему повторного отображения лоадера при HMR */
  const hasShownLoaderRef = useRef(false);

  useLayoutEffect(() => {
    if (hasShownLoaderRef.current || !shouldShowLoader.current) {
      return;
    }

    showSystemLoader({ debugKey, id });

    hasShownLoaderRef.current = true;

    return () => {
      hideSystemLoader({ debugKey, id });
    };
  }, []);
}
