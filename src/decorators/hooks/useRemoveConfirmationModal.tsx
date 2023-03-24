import React, { useCallback, useMemo, useRef, useState } from "react";
import { Deferred } from "@infomaximum/utility";
import type { TLocalizationDescription } from "@infomaximum/localization";
import { useLocalization } from "./useLocalization";
import { RemoveConfirmationModal } from "../../components/modals/RemoveConfirmationModal/RemoveConfirmationModal";

type TRemoveConfirmationParams<T> = {
  /** Колбек который будет вызван после подтверждения удаления данных */
  handleRemoveConfirm: (data: T | null) => Promise<any>;
  /** Локализация которая будет отображаться в модальном окне */
  titleLoc: TLocalizationDescription | ((data: T | null) => React.ReactNode);
  bodyLoc?: TLocalizationDescription | ((data: T | null) => React.ReactNode);
};

/** Отображает модальное окно подтверждения удаления данных  */
export const useRemoveConfirmationModal = <T,>(params: TRemoveConfirmationParams<T>) => {
  const localization = useLocalization();

  const arg = useRef(params);
  const deferred = useRef<Deferred>();

  const [isShowRemoveModal, setShowRemoveModal] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const handleAfterCancel = useCallback(() => {
    setData(null);
    setShowRemoveModal(false);

    // добавляем пустой обработчик, чтобы reject был обработан
    deferred.current?.catch(() => {});
    deferred.current?.reject();
  }, []);

  const handleRemoveEntity = useCallback((data: T) => {
    setShowRemoveModal(true);
    setData(data);

    deferred.current = new Deferred();

    return deferred.current as unknown as Promise<unknown>;
  }, []);

  const handleConfirm = useCallback(async () => {
    const { handleRemoveConfirm } = arg.current;

    try {
      await handleRemoveConfirm(data);

      return deferred.current?.resolve();
    } catch (error) {
      deferred.current?.reject(error);
    }
  }, [data]);

  const renderRemoveModal = useMemo(() => {
    if (isShowRemoveModal && data) {
      const { titleLoc, bodyLoc } = params;

      return (
        <RemoveConfirmationModal
          onAfterCancel={handleAfterCancel}
          onConfirm={handleConfirm}
          title={
            typeof titleLoc === "function" ? titleLoc(data) : localization.getLocalized(titleLoc)
          }
        >
          {typeof bodyLoc === "function"
            ? bodyLoc(data)
            : bodyLoc
            ? localization.getLocalized(bodyLoc)
            : null}
        </RemoveConfirmationModal>
      );
    }
  }, [params, data, handleAfterCancel, handleConfirm, isShowRemoveModal, localization]);

  return { renderRemoveModal, handleRemoveEntity };
};
