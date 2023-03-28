import React, { useMemo } from "react";
import type { IErrorModalProps } from "./ErrorModal.types";
import { Modal } from "../../modals/Modal/Modal";
import { Button } from "../../Button/Button";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import {
  modalFooterStyle,
  bodyModalStyle,
  iconWrapStyle,
  modalContentStyle,
  errorIconStyle,
  infoIconStyle,
  titleStyle,
  textStyle,
  modalStyle,
} from "./ErrorModal.styles";
import {
  modalErrorCloseButtonTestId,
  modalErrorTitleErrorTestId,
  modalErrorContentErrorTestId,
} from "../../../utils/TestIds";
import { CLOSE, CONTINUE, ERROR_MESSAGE } from "../../../utils/Localization/Localization";
import { kebabCase } from "lodash";
import { CloseCircleFilled, CloseOutlined, InfoCircleOutlined } from "../../Icons/Icons";
import { observer } from "mobx-react";
import { useFooterAndTitleHeight } from "./ErrorModal.utils";
import { useTheme } from "../../../decorators/hooks/useTheme";

const ErrorModalComponent: React.FC<IErrorModalProps> = observer(
  ({ error, showModal, onCloseModal, isDebugMode }) => {
    const localization = useLocalization();
    const theme = useTheme();

    const { footerCBRef, titleCBRef } = useFooterAndTitleHeight();

    const isInfo = error?.typeDisplayedComponent === "info";

    const footer = useMemo(
      () => (
        <div key="modal-error-footer" css={modalFooterStyle} ref={footerCBRef}>
          <Button
            key="modal-error-close-button"
            test-id={modalErrorCloseButtonTestId}
            onClick={onCloseModal}
            type={isInfo ? "primary" : "ghost"}
          >
            {localization.getLocalized(isInfo ? CONTINUE : CLOSE)}
          </Button>
        </div>
      ),
      [footerCBRef, isInfo, localization, onCloseModal]
    );

    if (!error) {
      return null;
    }

    const titleModalTestId = `${modalErrorTitleErrorTestId}_${kebabCase(error.code)}`;
    const contentModalTestId = `${modalErrorContentErrorTestId}_${kebabCase(error.code)}`;

    const modalWidth = !!error.message ? 480 : 416;

    return (
      <Modal
        key="modal-error"
        width={modalWidth}
        open={showModal}
        centered={true}
        closable={false}
        zIndex={1050}
        css={modalStyle(theme)}
        bodyStyle={bodyModalStyle}
        footer={footer}
        closeIcon={<CloseOutlined />}
      >
        <div key="modal-icon-wrap" css={iconWrapStyle}>
          {isInfo ? (
            <InfoCircleOutlined key="info-icon-modal" css={infoIconStyle(theme)} />
          ) : (
            <CloseCircleFilled key="close-icon-modal" css={errorIconStyle(theme)} />
          )}
        </div>
        <div key="modal-error-content" css={modalContentStyle}>
          <span
            key="title-error-modal"
            test-id={titleModalTestId}
            css={titleStyle(theme)}
            ref={titleCBRef}
          >
            {error.title || localization.getLocalized(ERROR_MESSAGE)}
          </span>
          {error.message ? (
            <p key="content-error-modal" test-id={contentModalTestId} css={textStyle(theme)}>
              {error.message} {isDebugMode && error.traceId && `[${error.traceId}]`}
            </p>
          ) : null}
        </div>
      </Modal>
    );
  }
);

export const ErrorModal = ErrorModalComponent;
