import { useEffect, useRef } from "react";

/**
 * хук для выполнение колбека при анмаунте компонента
 * @param fn - callback
 */
export const useUnmountEffect = (callback: () => any): void => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => () => callbackRef.current(), []);
};
