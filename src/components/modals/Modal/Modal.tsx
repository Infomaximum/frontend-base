import React, { useMemo } from "react";
import type { IModalProps } from "./Modal.types";
import { Modal as AntModal } from "antd";
import { createSelector } from "reselect";
import { boldTitleStyle, titleStyle } from "./Modal.styles";
import { modalTitleTestId } from "src/utils/TestIds";

export const getBoldTitle = createSelector(
  (title: React.ReactNode) => title,
  (title: React.ReactNode) => (
    <span test-id={modalTitleTestId} style={boldTitleStyle}>
      {title}
    </span>
  )
);

const Modal: React.FC<IModalProps> = (props) => {
  const { title, ...rest } = props;

  const boldTitle = useMemo(
    () => (
      <span test-id={modalTitleTestId} css={titleStyle}>
        {title}
      </span>
    ),
    [title]
  );

  return (
    <AntModal
      maskClosable={false}
      title={title && boldTitle}
      focusTriggerAfterClose={false}
      {...rest}
    />
  );
};

export default Modal;
