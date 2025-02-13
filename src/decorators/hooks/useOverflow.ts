import { useState, type RefObject, type DependencyList, useCallback, useLayoutEffect } from "react";
import { useResizeObserver } from "./useResizeObserver";

/** Хук переполнения элемента */
export const useOverflow = (ref: RefObject<HTMLElement>, ...rest: DependencyList) => {
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, [ref, rest]);

  const onResize = useCallback(() => {
    if (ref.current) {
      setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, [ref]);

  useResizeObserver(ref, onResize);

  return { isOverflow };
};
