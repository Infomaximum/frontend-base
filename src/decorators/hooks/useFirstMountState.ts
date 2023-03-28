import { useRef } from "react";

/**
 * хук который позволяющий узнать выполняется ли первый рендер или нет
 */
export const useFirstMountState = () => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};
