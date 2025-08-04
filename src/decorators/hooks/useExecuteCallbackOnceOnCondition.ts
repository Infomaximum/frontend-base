import { useEffect, type useLayoutEffect, useRef } from "react";

/**
 * Выполняет однократно колбек когда условие станет истинным
 * @param condition - когда условие станет истинным то колбек будет выполнен
 * @param cb - колбек
 * @param effect - Использовать useEffect или useLayoutEffect (по умолчанию useEffect).
 *                 Должен быть **один и тот же** между рендерами - нельзя передавать условно.
 */
export const useExecuteCallbackOnceOnCondition = (
  condition: boolean,
  callback: () => void,
  effect: typeof useEffect | typeof useLayoutEffect = useEffect
) => {
  const isExecutedRef = useRef(false);

  const cbRef = useRef(callback);
  cbRef.current = callback;

  effect(() => {
    if (condition && !isExecutedRef.current) {
      isExecutedRef.current = true;

      cbRef.current();
    }
  }, [condition]);
};
