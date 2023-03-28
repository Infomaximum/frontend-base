import { useEffect, useRef } from "react";

/**
 * хук для получения предыдущего значения передаваемого параметра
 * @param value - сохраняемый параметр (пропс, стейт, или другой параметр)
 * @param initialValue - первичное состояние предыдущего значения
 * @returns предыдущее значение
 */
export const usePrevious = <T>(value: T, initialValue?: T): T | undefined => {
  const ref = useRef<T | undefined>(initialValue);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
