import React, { useMemo } from "react";
import type { IModalProps } from "./Modal.types";
import { Modal as AntModal } from "antd";
import { createSelector } from "reselect";
import { boldTitleStyle, titleStyle } from "./Modal.styles";
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
      maskClosable={false}
      title={title && boldTitle}
      focusTriggerAfterClose={false}
      width={width ?? 480}
      {...rest}
    />
  );
};

export const Modal = ModalComponent;
