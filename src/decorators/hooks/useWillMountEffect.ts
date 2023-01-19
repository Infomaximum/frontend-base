import type { EffectCallback } from "react";
import { useFirstMountState } from "./useFirstMountState";

/**
 * Хук для выполнения эффекта перед монтированием компонента
 * @param effect - эффект
 */
export const useWillMountEffect = (effect: EffectCallback) => {
  const isFirstMount = useFirstMountState();

  if (isFirstMount) {
    effect();
  }
};
