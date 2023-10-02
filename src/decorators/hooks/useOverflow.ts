import { useState, useEffect, type RefObject, type DependencyList, useLayoutEffect } from "react";

export const useOverflow = (ref: RefObject<HTMLElement>, ...rest: DependencyList) => {
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, [ref, rest]);

  useEffect(() => {
    const handleWindowResize = () => {
      // без setTimeout isOverflow передаётся в компоненты некорректно,
      // т.к. высчитывается от предыдущих значений до увеличения масштаба
      setTimeout(() => {
        if (ref.current) {
          setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
        }
      }, 10);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [ref]);

  return { isOverflow };
};
