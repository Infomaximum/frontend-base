import { useCallback, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (callback: EventListener) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);

      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot);
};
