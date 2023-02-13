import React, { useCallback, useMemo, useRef, useState } from "react";
import { Deferred } from "@im/utils";
import type { TLocalizationDescription } from "@im/localization";
import { useLocalization } from "./useLocalization";
import { ConfirmationModal } from "../../components/modals/ConfirmationModal/ConfirmationModal";
import { SAVE } from "../../utils/Localization/Localization";

type TConfirmationParams<T> = {
  /** Колбек который будет вызван после подтверждения выполняемого действия */
  handleConfirm: (data: T | null) => Promise<any>;
  /** Колбек который будет вызван после отмены выполняемого действия */
  handleCancel?: () => void;
  /** Локализация которая будет отображаться в модальном окне */
  loc: TLocalizationDescription | ((data: T | null) => React.ReactNode);
  /** Локализация описания модального окна */
  titleLoc: TLocalizationDescription | ((data: T | null) => React.ReactNode);
};

/** Отображает модальное окно подтверждения удаления данных  */
export const useConfirmationModal = <T,>(params: TConfirmationParams<T>) => {
  const localization = useLocalization();

  const arg = useRef(params);
  const deferred = useRef<Deferred>();

  const [isShowModal, setShowModal] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const handleAfterCancel = useCallback(() => {
    const { handleCancel } = arg.current;
    setData(null);
    setShowModal(false);

    // добавляем пустой обработчик, чтобы reject был обработан
    deferred.current?.catch(() => {});
    deferred.current?.reject();

    typeof handleCancel === "function" && handleCancel();
  }, []);

  const handleAction = useCallback((data: T) => {
    setShowModal(true);
    setData(data);

    deferred.current = new Deferred();

    return deferred.current as unknown as Promise<unknown>;
  }, []);

  const handleConfirm = useCallback(async () => {
    const { handleConfirm } = arg.current;

    try {
      await handleConfirm(data);

      return deferred.current?.resolve();
    } catch (error) {
      deferred.current?.reject(error);
    }
  }, [data]);

  const renderConfirmationModal = useMemo(() => {
    if (isShowModal && data) {
      const { loc, titleLoc } = params;

      const title =
        typeof titleLoc === "function"
          ? titleLoc(data)
          : localization.getLocalized(titleLoc);

      return (
        <ConfirmationModal
          title={title}
          onAfterCancel={handleAfterCancel}
          onConfirm={handleConfirm}
          buttonOkText={SAVE}
        >
          {typeof loc === "function"
            ? loc(data)
            : localization.getLocalized(loc)}
        </ConfirmationModal>
      );
    }
  }, [
    params,
    data,
    handleAfterCancel,
    handleConfirm,
    isShowModal,
    localization,
  ]);

  return { renderConfirmationModal, handleAction };
};
