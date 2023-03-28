import { useRef, useState, useCallback } from "react";
import { debounce } from "lodash";

// todo: Возможно, стоит предусмотреть касмомную задержку для debounce
export const useContainerWidth = () => {
  const containerRef = useRef<HTMLElement | null>();
  const [containerWidth, setContainerWidth] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const debouncedResizeHandler = useCallback(
    debounce(() => {
      handleResize();
    }, 500),
    []
  );

  const setRef = useCallback((node: HTMLElement | null) => {
    if (containerRef.current) {
      window.removeEventListener("resize", debouncedResizeHandler);
    }

    if (node) {
      window.addEventListener("resize", debouncedResizeHandler);
    }

    containerRef.current = node;

    handleResize();
  }, []);

  return [containerWidth, setRef, handleResize] as const;
};
