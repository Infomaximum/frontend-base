import { useCallback, useContext } from "react";
import ErrorModalContext, { IErrorModalContextContextData } from "../contexts/ErrorModalContext";

export const useModalError = () => {
  const { showModalError } = useContext(ErrorModalContext);

  const handleShowModalError = useCallback(
    (...params: Parameters<IErrorModalContextContextData["showModalError"]>) => {
      showModalError(...params);
    },
    [showModalError]
  );

  return { showModalError: handleShowModalError };
};
