import React, { useCallback } from "react";
import { ExclamationCircleFilled } from "../Icons/Icons";
import { Row, Col, Popover } from "antd";
import { Button } from "../Button/Button";
import { withLoc } from "../../decorators/hocs/withLoc/withLoc";
import type { IConfirmPopoverProps } from "./ConfirmPopover.types";
import { CANCEL, CONFIRM } from "../../utils/Localization/Localization";
import {
  popoverPrimaryButtonStyle,
  popoverTitleIconStyle,
  popoverTitleRowStyle,
} from "./ConfirmPopover.styles";
import {
  confirmPopoverOkButtonTestId,
  confirmPopoverCancelButtonTestId,
} from "../../utils/TestIds";
import { useTheme } from "../../decorators/hooks/useTheme";

const buttonsSize = "small";

const ConfirmPopoverComponent: React.FC<IConfirmPopoverProps> = ({
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
  const theme = useTheme();

  const onCancel = useCallback(() => onVisibleChange?.(false), [onVisibleChange]);

  const content = (
    <>
      <Row align="middle" gutter={8} css={popoverTitleRowStyle(theme)}>
        <Col>
          <ExclamationCircleFilled css={popoverTitleIconStyle(theme)} />
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
            css={popoverPrimaryButtonStyle(theme)}
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
    <Popover trigger={trigger} content={content} onVisibleChange={onVisibleChange} {...rest} />
  );
};

export const ConfirmPopover = withLoc(ConfirmPopoverComponent);
