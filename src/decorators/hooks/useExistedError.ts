import { useRef } from "react";
import type { NCore } from "@infomaximum/base/src/libs/core";

/**
 * Сигнализирует о том, что ошибка была,
 * защищает от того, что вложенный в обертку контейнер может очистить стор с ошибкой,
 * и запросы будут повторятся при монтировании контейнера
 */
export const useExistedError = (error: NCore.TError | undefined, code?: string) => {
  const isError = useRef(false);

  if (!isError.current && error && (!code || error?.code === code)) {
    isError.current = true;
  }

  return isError.current;
};
