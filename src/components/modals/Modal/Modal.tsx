import React, { useMemo } from "react";
import type { IModalProps } from "./Modal.types";
import { Modal as AntModal } from "antd";
import { createSelector } from "reselect";
import { boldTitleStyle, modalStyle, titleStyle } from "./Modal.styles";
import { modalTitleTestId } from "../../../utils/TestIds";
import { useTheme } from "../../../decorators/hooks/useTheme";

export const getBoldTitleModal = createSelector(
  (title: React.ReactNode) => title,
  (title: React.ReactNode) => (
    <span test-id={modalTitleTestId} style={boldTitleStyle}>
      {title}
    </span>
  )
);

const ModalComponent: React.FC<IModalProps> = (props) => {
  const { title, width, ...rest } = props;
  const theme = useTheme();

  const boldTitle = useMemo(
    () => (
      <span test-id={modalTitleTestId} css={titleStyle(theme)}>
        {title}
      </span>
    ),
    [title, theme]
  );

  return (
    <AntModal
      // Не удалять до решения issue https://github.com/ant-design/ant-design/issues/41239
      getContainer={document.body}
      maskClosable={false}
      title={title && boldTitle}
      focusTriggerAfterClose={false}
      width={width ?? 480}
      css={modalStyle}
      {...rest}
    />
  );
};

export const Modal = ModalComponent;
