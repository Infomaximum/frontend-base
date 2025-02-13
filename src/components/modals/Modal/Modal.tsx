import React from "react";
import type { IModalProps } from "./Modal.types";
import { Modal as AntModal } from "antd";
import { createSelector } from "reselect";
import { boldTitleStyle, modalStyle, getModalStyle, titleStyle } from "./Modal.styles";
import { modalTitleTestId } from "../../../utils/TestIds";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { merge } from "lodash";

export const getBoldTitleModal = createSelector(
  (title: React.ReactNode) => title,
  (title: React.ReactNode) => (
    <span test-id={modalTitleTestId} style={boldTitleStyle}>
      {title}
    </span>
  )
);

const ModalComponent: React.FC<IModalProps> = (props) => {
  const { title, width, styles: stylesProps, height, ...rest } = props;
  const theme = useTheme();

  const boldTitle = (
    <span test-id={modalTitleTestId} css={titleStyle(theme)}>
      {title}
    </span>
  );

  return (
    <AntModal
      getContainer={document.body} // todo: Не удалять до решения issue https://github.com/ant-design/ant-design/issues/41239
      maskClosable={false}
      title={title && boldTitle}
      focusTriggerAfterClose={false}
      width={width ?? 480}
      css={modalStyle}
      styles={merge({}, getModalStyle(height), stylesProps)}
      centered={true}
      {...rest}
    />
  );
};

export const Modal = ModalComponent;
