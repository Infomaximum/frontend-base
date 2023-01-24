import React, { useCallback } from "react";
import { ExclamationCircleFilled } from "src/components/Icons/Icons";
import { Row, Col, Popover } from "antd";
import Button from "src/components/Button/Button";
import withLoc from "src/decorators/hocs/withLoc/withLoc";
import type { IConfirmPopoverProps } from "./ConfirmPopover.types";
import { CANCEL, CONFIRM } from "src/utils/Localization/Localization";
import {
  popoverPrimaryButtonStyle,
  popoverTitleIconStyle,
  popoverTitleRowStyle,
} from "./ConfirmPopover.styles";
import {
  confirmPopoverOkButtonTestId,
  confirmPopoverCancelButtonTestId,
} from "src/utils/TestIds";

const buttonsSize = "small";

const ConfirmPopover: React.FC<IConfirmPopoverProps> = ({
  localization,
  loading,
  okText,
  cancelText,
  text,
  onVisibleChange,
  onSubmit,
  trigger = "click",
  ...rest
}) => {
  const onCancel = useCallback(
    () => onVisibleChange?.(false),
    [onVisibleChange]
  );

  const content = (
    <>
      <Row align="middle" gutter={8} css={popoverTitleRowStyle}>
        <Col>
          <ExclamationCircleFilled css={popoverTitleIconStyle} />
        </Col>
        <Col>{text}</Col>
      </Row>
      <Row justify="end" gutter={8}>
        <Col>
          <Button
            type="ghost"
            size={buttonsSize}
            onClick={onCancel}
            test-id={confirmPopoverCancelButtonTestId}
          >
            {cancelText ?? localization.getLocalized(CANCEL)}
          </Button>
        </Col>
        <Col>
          <Button
            size={buttonsSize}
            css={popoverPrimaryButtonStyle}
            onClick={onSubmit}
            loading={loading}
            test-id={confirmPopoverOkButtonTestId}
          >
            {okText ?? localization.getLocalized(CONFIRM)}
          </Button>
        </Col>
      </Row>
    </>
  );

  return (
    <Popover
      trigger={trigger}
      content={content}
      onVisibleChange={onVisibleChange}
      {...rest}
    />
  );
};

export default withLoc(ConfirmPopover);
