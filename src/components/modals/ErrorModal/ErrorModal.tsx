import React, { useMemo } from "react";
import type { IErrorModalProps } from "./ErrorModal.types";
import Modal from "@im/base/src/components/modals/Modal/Modal";
import Button from "@im/base/src/components/Button/Button";
import { useLocalization } from "@im/base/src/decorators/hooks/useLocalization";
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
} from "@im/base/src/utils/TestIds";
import { CLOSE, CONTINUE, ERROR_MESSAGE } from "@im/base/src/utils/Localization/Localization";
import { kebabCase } from "lodash";
import { CloseCircleOutlined, InfoCircleOutlined } from "@im/base/src/components/Icons/Icons";
import { observer } from "mobx-react";
import { useFooterAndTitleHeight } from "./ErrorModal.utils";

export const ErrorModal: React.FC<IErrorModalProps> = observer(
  ({ error, showModal, onCloseModal, isDebugMode }) => {
    const localization = useLocalization();

    const { footerHeight, footerCBRef, titleHeight, titleCBRef } = useFooterAndTitleHeight();

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

    const modalWidth = !!error.message ? 458 : 416;

    return (
      <Modal
        key="modal-error"
        width={modalWidth}
        visible={showModal}
        centered={true}
        closable={false}
        zIndex={1050}
        css={modalStyle}
        bodyStyle={bodyModalStyle}
        footer={footer}
      >
        <div key="modal-icon-wrap" css={iconWrapStyle}>
          {isInfo ? (
            <InfoCircleOutlined key="info-icon-modal" css={infoIconStyle} />
          ) : (
            <CloseCircleOutlined key="close-icon-modal" css={errorIconStyle} />
          )}
        </div>
        <div key="modal-error-content" css={modalContentStyle}>
          <span
            key="title-error-modal"
            test-id={titleModalTestId}
            css={titleStyle}
            ref={titleCBRef}
          >
            {error.title || localization.getLocalized(ERROR_MESSAGE)}
          </span>
          {error.message ? (
            <p
              key="content-error-modal"
              test-id={contentModalTestId}
              css={textStyle(titleHeight, footerHeight)}
            >
              {error.message} {isDebugMode && error.traceId && `[${error.traceId}]`}
            </p>
          ) : null}
        </div>
      </Modal>
    );
  }
);
