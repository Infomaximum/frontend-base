import { useState, type FC, useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "@infomaximum/base/src/components/Button/Button";
import { Modal } from "@infomaximum/base/src/components/modals/Modal/Modal";
import {
  APPLY,
  CANCEL,
  CONTINUE_EDITING,
  DO_NOT_SAVE,
  EXIT,
} from "@infomaximum/base/src/utils/Localization/Localization";
import {
  bodyModalStyle,
  iconModalStyle,
  titleModalStyle,
  additionalButtonStyle,
  confirmationModalStyle,
  getModalStyle,
  rightFooterButtonStyle,
} from "./ConfirmationModal.styles";
import type { Interpolation } from "@emotion/react";
import { isFunction } from "lodash";
import { ModalAnimationInterval } from "@infomaximum/base/src/utils/const";
import {
  confirmationModalAdditionalButtonTestId,
  confirmationModalCancelButtonTestId,
  confirmationModalConfirmButtonTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { WarningFilled } from "@infomaximum/base/src/components/Icons/Icons";
import type { IConfirmationModalProps } from "./ConfirmationModal.types";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";

const ConfirmationModalComponent: FC<IConfirmationModalProps> = (props) => {
  const {
    buttonOkType = "primary",
    disabledConfirmButton = false,
    withAdditionalButton = false,
    disabledAdditionalButton,
    icon: Icon = WarningFilled,
    buttonCancelText = CANCEL,
    buttonOkText = APPLY,
    buttonContinueText = CONTINUE_EDITING,
    additionalButtonCaption = DO_NOT_SAVE,
    zIndex = 2000,
    title,
    iconStyle,
    isWithoutSaveMode,
    withoutCancelButton,
    children,
    onAdditionalButtonClick,
    onAfterCancel,
    onConfirm,
    onAfterConfirm,
  } = props;

  const localization = useLocalization();
  const theme = useTheme();

  const [isShowModal, setShowModal] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const hideModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const afterCloseModal = useCallback((callback: () => void) => {
    if (isFunction(callback)) {
      setTimeout(callback, ModalAnimationInterval);
    }
  }, []);

  const handleCancel = useCallback(() => {
    hideModal();
    afterCloseModal(onAfterCancel);
  }, [afterCloseModal, hideModal, onAfterCancel]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);

    try {
      await onConfirm();
      isMountedRef.current && hideModal();

      afterCloseModal(onAfterConfirm ?? onAfterCancel);
    } finally {
      isMountedRef.current && setLoading(false);
    }
  }, [afterCloseModal, hideModal, onAfterCancel, onAfterConfirm, onConfirm]);

  const getContentBodyModal = () => {
    const styleIcon = [
      iconModalStyle(theme),
      isFunction(iconStyle) ? iconStyle(theme) : iconStyle,
    ] as Interpolation<TTheme>;

    return (
      <div css={confirmationModalStyle}>
        <Icon css={styleIcon} />
        <div>
          <div css={titleModalStyle(theme)}>{title}</div>
          {children && <span css={bodyModalStyle(theme)}>{children}</span>}
        </div>
      </div>
    );
  };

  const footerModal = useMemo(() => {
    const getCancelAndOkButtons = () => {
      return (
        <>
          {!withoutCancelButton && (
            <Button
              type="common"
              onClick={handleCancel}
              test-id={confirmationModalCancelButtonTestId}
            >
              {localization.getLocalized(buttonCancelText)}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            type={buttonOkType}
            loading={isLoading}
            test-id={confirmationModalConfirmButtonTestId}
            disabled={disabledConfirmButton}
            css={rightFooterButtonStyle}
          >
            {localization.getLocalized(buttonOkText)}
          </Button>
        </>
      );
    };

    const getContinueAndExitButtons = () => {
      return (
        <>
          <Button
            type="common"
            ghost={true}
            onClick={handleCancel}
            test-id={confirmationModalCancelButtonTestId}
          >
            {localization.getLocalized(buttonContinueText)}
          </Button>
          <Button
            onClick={onAdditionalButtonClick}
            type="common"
            ghost={true}
            test-id={confirmationModalAdditionalButtonTestId}
            css={rightFooterButtonStyle}
          >
            {localization.getLocalized(EXIT)}
          </Button>
        </>
      );
    };

    return (
      <div>
        {withAdditionalButton ? (
          <Button
            type="common"
            onClick={onAdditionalButtonClick}
            css={additionalButtonStyle}
            test-id={confirmationModalAdditionalButtonTestId}
            disabled={disabledAdditionalButton}
          >
            {localization.getLocalized(additionalButtonCaption)}
          </Button>
        ) : null}
        {isWithoutSaveMode ? getContinueAndExitButtons() : getCancelAndOkButtons()}
      </div>
    );
  }, [
    additionalButtonCaption,
    buttonOkText,
    buttonCancelText,
    buttonOkType,
    disabledConfirmButton,
    handleCancel,
    handleConfirm,
    isLoading,
    localization,
    onAdditionalButtonClick,
    withAdditionalButton,
    isWithoutSaveMode,
    withoutCancelButton,
    buttonContinueText,
    disabledAdditionalButton,
  ]);

  return (
    <Modal
      open={isShowModal}
      closable={false}
      styles={getModalStyle(zIndex)}
      footer={footerModal}
      destroyOnClose={true}
    >
      {getContentBodyModal()}
    </Modal>
  );
};

export const ConfirmationModal = ConfirmationModalComponent;
