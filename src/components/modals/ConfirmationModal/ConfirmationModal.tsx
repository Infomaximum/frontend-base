import { useState, FC, useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "../../Button/Button";
import { Modal } from "../../modals/Modal/Modal";
import {
  APPLY,
  CANCEL,
  DO_NOT_SAVE,
} from "../../../utils/Localization/Localization";
import type { TLocalizationDescription } from "@im/utils";
import {
  bodyModalStyle,
  bodyStyle,
  iconModalStyle,
  titleModalStyle,
  additionalButtonStyle,
  confirmationModalStyle,
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
    buttonOkText = APPLY,
    additionalButtonCaption = DO_NOT_SAVE,
    zIndex,
    title,
    iconStyle,
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
        {Icon ? <Icon css={styleIcon} /> : null}
        <div>
          <span css={titleModalStyle}>{title}</span>
          {children && <span css={bodyModalStyle}>{children}</span>}
        </div>
      </div>
    );
  };

  const footerModal = useMemo(() => {
    return (
      <div>
        {withAdditionalButton ? (
          <Button
            type="ghost"
            onClick={onAdditionalButtonClick}
            css={additionalButtonStyle}
            test-id={confirmationModalAdditionalButtonTestId}
          >
            {localization.getLocalized(additionalButtonCaption)}
          </Button>
        ) : null}
        <Button
          type="ghost"
          onClick={handleCancel}
          test-id={confirmationModalCancelButtonTestId}
        >
          {localization.getLocalized(CANCEL)}
        </Button>
        <Button
          onClick={handleConfirm}
          type={buttonOkType}
          loading={isLoading}
          test-id={confirmationModalConfirmButtonTestId}
          disabled={disabledConfirmButton}
        >
          {localization.getLocalized(buttonOkText as TLocalizationDescription)}
        </Button>
      </div>
    );
  }, [
    additionalButtonCaption,
    buttonOkText,
    buttonOkType,
    disabledConfirmButton,
    handleCancel,
    handleConfirm,
    isLoading,
    localization,
    onAdditionalButtonClick,
    withAdditionalButton,
  ]);

  return (
    <Modal
      width={416}
      visible={isShowModal}
      closable={false}
      centered={true}
      bodyStyle={bodyStyle}
      footer={footerModal}
      destroyOnClose={true}
      zIndex={zIndex}
    >
      {getContentBodyModal()}
    </Modal>
  );
};

export const ConfirmationModal = ConfirmationModalComponent;
