import { useCallback } from "react";

const emptyDataMock = "{}";

export const useSessionStorage = (sessionStorageKey: string) => {
  const replaceSessionStorageData = useCallback(
    (additionalState?: object) => {
      const previousSavedData = sessionStorage.getItem(sessionStorageKey);
      const newData = {
        ...JSON.parse(previousSavedData ?? emptyDataMock),
        ...additionalState,
      };

      sessionStorage.setItem(sessionStorageKey, JSON.stringify(newData));
    },
    [sessionStorageKey]
  );

  const getSessionStorageData = useCallback(() => {
    return JSON.parse(sessionStorage.getItem(sessionStorageKey) ?? emptyDataMock);
  }, [sessionStorageKey]);

  const clearSessionStorage = useCallback(() => {
    sessionStorage.removeItem(sessionStorageKey);
  }, [sessionStorageKey]);

  return {
    replaceSessionStorageData,
    getSessionStorageData,
    clearSessionStorage,
  };
};
