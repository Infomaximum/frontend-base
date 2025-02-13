import { useState, type FC, useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "../../Button/Button";
import { Modal } from "../../modals/Modal/Modal";
import {
  APPLY,
  CANCEL,
  CONTINUE_EDITING,
  DO_NOT_SAVE,
  EXIT,
} from "../../../utils/Localization/Localization";
import {
  bodyModalStyle,
  iconModalStyle,
  titleModalStyle,
  additionalButtonStyle,
  confirmationModalStyle,
  modalStyle,
  rightFooterButtonStyle,
} from "./ConfirmationModal.styles";
import type { Interpolation } from "@emotion/react";
import { isFunction } from "lodash";
import { ModalAnimationInterval } from "../../../utils/const";
import {
  confirmationModalAdditionalButtonTestId,
  confirmationModalCancelButtonTestId,
  confirmationModalConfirmButtonTestId,
} from "../../../utils/TestIds";
import { WarningOutlined } from "../../Icons/Icons";
import type { IConfirmationModalProps } from "./ConfirmationModal.types";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { useTheme } from "../../../decorators/hooks/useTheme";

const ConfirmationModalComponent: FC<IConfirmationModalProps> = (props) => {
  const {
    buttonOkType = "primary",
    disabledConfirmButton = false,
    withAdditionalButton = false,
    icon: Icon = WarningOutlined,
    buttonCancelText = CANCEL,
    buttonOkText = APPLY,
    additionalButtonCaption = DO_NOT_SAVE,
    zIndex,
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
            {localization.getLocalized(CONTINUE_EDITING)}
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
  ]);

  return (
    <Modal
      open={isShowModal}
      closable={false}
      styles={modalStyle}
      footer={footerModal}
      destroyOnClose={true}
      zIndex={zIndex}
    >
      {getContentBodyModal()}
    </Modal>
  );
};

export const ConfirmationModal = ConfirmationModalComponent;
