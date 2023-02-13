import type { EffectCallback } from "react";
import { useEffect } from "react";

/**
 * хук для выполнения эффекта при монтировании компонента
 * @param effect - эффект
 */
export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};
