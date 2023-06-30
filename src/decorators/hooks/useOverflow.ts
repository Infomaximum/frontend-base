import { useState, useEffect, type RefObject, type DependencyList } from "react";

export const useOverflow = (ref: RefObject<HTMLElement>, ...rest: DependencyList) => {
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, [ref, rest]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (ref.current) {
        setIsOverflow(ref.current.offsetWidth < ref.current.scrollWidth);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [ref]);

  return { isOverflow };
};
