import { useState, useCallback } from "react";

export const useHover = () => {
  const [isHover, setHover] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHover(true);
  }, [setHover]);

  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, [setHover]);

  return { isHover, onMouseEnter, onMouseLeave };
};
