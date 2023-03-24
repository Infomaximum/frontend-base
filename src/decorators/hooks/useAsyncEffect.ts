import { type DependencyList, useEffect, useRef } from "react";

type TEffect<V> = (isActive: () => boolean) => V | Promise<V>;
type TDestroy<V> = (result?: V) => void;

/**
 * Хук для выполнения асинхронных эффектов
 * @param effect - сам эффект
 * @param deps - список зависимостей эффекта
 * @param destroyCb - колбек вызываемый при отмене эффекта
 *
 * @example
 * useAsyncEffect(async (isActive) => {
 *  await query();
 *  if(!isActive()) {
 *    return;
 *  }
 *
 *  setState(...);
 *  setState(...)
 * }, [query])
 */
export const useAsyncEffect = <V = unknown>(
  effect: TEffect<V>,
  deps: DependencyList = [],
  destroyCb?: TDestroy<V>
) => {
  const effectRef = useRef<typeof effect>();
  const destroyRef = useRef<typeof destroyCb>();

  effectRef.current = effect;
  destroyRef.current = destroyCb;

  useEffect(
    () => {
      let result: V | undefined;
      let mounted = true;
      const maybePromise = effectRef.current?.(() => mounted);

      Promise.resolve(maybePromise).then((value) => {
        result = value;
      });

      return () => {
        mounted = false;
        const destroyCb = destroyRef.current;

        if (typeof destroyCb === "function") {
          destroyCb(result);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
};
