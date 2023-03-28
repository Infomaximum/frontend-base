import { isEqual } from "lodash";
import { useMemo, useRef, type DependencyList } from "react";

/** Если значение не поменялось, то возвращается старый результат.
 *  Таким образом не меняется ссылка на объект. */
export const useKeepingRefForEquals = <T>(
  factory: () => T,
  deps: DependencyList | undefined,
  equalityFn: (a: T, b: T) => boolean = isEqual
): T => {
  const ref = useRef<T | null>(null);

  const finalValue = useMemo(() => {
    const value = factory();

    if (ref.current === null || !equalityFn(ref.current, value)) {
      ref.current = value;
    }

    return ref.current;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return finalValue;
};
