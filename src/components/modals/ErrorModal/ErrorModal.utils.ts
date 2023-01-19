import { useCallback, useState } from "react";

/** Хук для получения высоты тайтла и футера модальной таблицы */
export const useFooterAndTitleHeight = () => {
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [titleHeight, setTitleHeight] = useState<number>(0);

  const footerCBRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      setFooterHeight(node?.parentElement?.clientHeight ?? 0);
    }
  }, []);

  const titleCBRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      setTitleHeight(node?.clientHeight ?? 0);
    }
  }, []);

  return { footerHeight, footerCBRef, titleHeight, titleCBRef };
};
