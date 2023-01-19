import { useState, useCallback } from "react";

export const useFocus = () => {
  const [isFocus, setFocus] = useState(false);

  const onFocus = useCallback(() => {
    setFocus(true);
  }, [setFocus]);

  const onBlur = useCallback(() => {
    setFocus(false);
  }, [setFocus]);

  return { isFocus, onFocus, onBlur };
};
