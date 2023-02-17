import { useCallback, useContext } from "react";
import {
  type IErrorModalContextContextData,
  ErrorModalContext,
} from "../contexts/ErrorModalContext";

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
