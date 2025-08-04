import { memo, useCallback, useMemo, useState, type FC } from "react";
import { Popover } from "antd";
import type { IFieldTooltipProps } from "./FieldTooltip.types";
import {
  captionStyle,
  getFieldTooltipContainerStyle,
  popoverStyle,
  questionIconShowPopoverStyle,
  questionIconStyle,
} from "./FieldTooltip.styles";
import { fieldTooltipPromptTestId, fieldTooltipPromptButtonTestId } from "../../utils/TestIds";
import { QuestionCircleOutlined } from "../Icons/Icons";

const align = {
  offset: [16, -16],
};

export const FieldTooltip: FC<IFieldTooltipProps> = memo(
  ({
    trigger = "click",
    placement = "rightTop",
    arrowPointAtCenter = true,
    promptText,
    promptTestId,
    caption,
    iconStyle,
    getPopupContainer,
    isWithoutPadding,
  }) => {
    const [isShowPopover, setIsShowPopover] = useState(false);

    const handleVisiblePopover = useCallback(() => {
      setIsShowPopover((showPopover) => {
        return !showPopover;
      });
    }, []);

    const prompt = useMemo(() => {
      return <div test-id={`${fieldTooltipPromptTestId}_${promptTestId}`}>{promptText}</div>;
    }, [promptTestId, promptText]);

    const arrowConfig = useMemo(() => {
      return {
        pointAtCenter: arrowPointAtCenter,
      };
    }, [arrowPointAtCenter]);

    return (
      <span css={getFieldTooltipContainerStyle(isWithoutPadding)}>
        {caption ? (
          <span key="label" css={captionStyle}>
            {caption}
          </span>
        ) : null}
        {promptText ? (
          <Popover
            open={isShowPopover}
            key="prompt-notification-popover"
            trigger={trigger}
            placement={placement}
            content={prompt}
            onOpenChange={handleVisiblePopover}
            arrow={arrowConfig}
            align={align}
            getPopupContainer={getPopupContainer}
            styles={popoverStyle}
          >
            <QuestionCircleOutlined
              style={iconStyle}
              key="question-circle-popover-icon"
              css={isShowPopover ? questionIconShowPopoverStyle : questionIconStyle}
              role="button"
              test-id={`${fieldTooltipPromptButtonTestId}_${promptTestId}`}
            />
          </Popover>
        ) : null}
      </span>
    );
  }
);
