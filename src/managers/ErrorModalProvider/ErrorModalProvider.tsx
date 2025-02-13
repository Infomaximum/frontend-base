import type { NCore } from "@infomaximum/module-expander";
import {
  ErrorModalContext,
  type IErrorModalContextContextData,
} from "../../decorators/contexts/ErrorModalContext";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { handleErrorInternal } from "../Errors/Errors";
import { ModalAnimationInterval } from "../../utils/const";
import { ErrorModal } from "../../components/modals/ErrorModal/ErrorModal";
import type {
  IErrorModalProviderConfigState,
  IErrorModalProviderProps,
} from "./ErrorModalProvider.types";
import { useLocation } from "react-router";
import { usePrevious } from "../../decorators";

export const ErrorModalProvider: FC<IErrorModalProviderProps> = ({ children, isDebugMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [errorConfig, setErrorConfig] = useState<IErrorModalProviderConfigState | undefined>(
    undefined
  );
  const localization = useLocalization();
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    if (errorConfig && prevPathname !== pathname) {
      setErrorConfig(undefined);
    }
  }, [prevPathname, pathname, errorConfig]);

  useEffect(() => {
    setErrorConfig((prevErrorConfig) =>
      prevErrorConfig
        ? {
            ...prevErrorConfig,
            error: handleErrorInternal(prevErrorConfig?.error, localization),
          }
        : undefined
    );
  }, [localization]);

  const showModalError = useCallback(
    (
      e: NCore.TError | undefined,
      closeCb?: () => void,
      maskTransitionName?: string,
      footerButtons?: React.ReactNode[]
    ) => {
      setShowModal(true);
      setErrorConfig({
        error: handleErrorInternal(e, localization),
        closeCb,
        maskTransitionName,
        footerButtons,
      });
    },
    [localization]
  );

  const handleShowModal = useCallback(() => {
    if (errorConfig?.error?.reloadOnClose) {
      document.location.reload();
    }

    setErrorConfig(undefined);
    setShowModal(true);
  }, [errorConfig?.error?.reloadOnClose]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);

    setTimeout(() => {
      handleShowModal();
      errorConfig?.closeCb?.();
    }, ModalAnimationInterval);
  }, [errorConfig, handleShowModal]);

  const providerValue = useMemo<IErrorModalContextContextData>(
    () => ({
      showModalError,
    }),
    [showModalError]
  );

  const errorModalElement = useMemo(() => {
    return (
      <ErrorModal
        error={errorConfig?.error}
        maskTransitionName={errorConfig?.maskTransitionName}
        footerButtons={errorConfig?.footerButtons}
        showModal={showModal}
        onCloseModal={handleCloseModal}
        isDebugMode={isDebugMode}
      />
    );
  }, [
    errorConfig?.error,
    errorConfig?.maskTransitionName,
    errorConfig?.footerButtons,
    showModal,
    handleCloseModal,
    isDebugMode,
  ]);

  return (
    <ErrorModalContext.Provider value={providerValue}>
      {children}
      {errorModalElement}
    </ErrorModalContext.Provider>
  );
};
