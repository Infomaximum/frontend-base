import { PureComponent } from "react";
import { Popover } from "antd";
import type { IFieldTooltipProps, IFieldTooltipState } from "./FieldTooltip.types";
import {
  captionStyle,
  getFieldTooltipContainerStyle,
  popoverStyle,
  questionIconShowPopoverStyle,
  questionIconStyle,
} from "./FieldTooltip.styles";
import { fieldTooltipPromptTestId, fieldTooltipPromptButtonTestId } from "../../utils/TestIds";
import { QuestionCircleOutlined } from "../Icons/Icons";

class FieldTooltipComponent extends PureComponent<IFieldTooltipProps, IFieldTooltipState> {
  private static readonly align = {
    offset: [16, -16],
  };

  public override readonly state = {
    showPopover: false,
  };

  public static defaultProps = {
    trigger: "click",
    placement: "rightTop",
    arrowPointAtCenter: true,
  };

  private handleVisiblePopover = () => {
    this.setState(({ showPopover }) => {
      return {
        showPopover: !showPopover,
      };
    });
  };

  private get prompt() {
    const { promptText, promptTestId } = this.props;

    return <div test-id={`${fieldTooltipPromptTestId}_${promptTestId}`}>{promptText}</div>;
  }

  public override render() {
    const {
      caption,
      promptText,
      promptTestId,
      trigger,
      placement,
      iconStyle,
      arrowPointAtCenter,
      getPopupContainer,
      isWithoutPadding,
    } = this.props;

    return (
      <span css={getFieldTooltipContainerStyle(isWithoutPadding)}>
        {caption ? (
          <span key="label" css={captionStyle}>
            {caption}
          </span>
        ) : null}
        {promptText ? (
          <Popover
            open={this.state.showPopover}
            key="prompt-notification-popover"
            trigger={trigger}
            placement={placement}
            content={this.prompt}
            onOpenChange={this.handleVisiblePopover}
            arrow={{ pointAtCenter: arrowPointAtCenter }}
            align={FieldTooltipComponent.align}
            getPopupContainer={getPopupContainer}
            overlayStyle={popoverStyle}
          >
            <QuestionCircleOutlined
              style={iconStyle}
              key="question-circle-popover-icon"
              css={this.state.showPopover ? questionIconShowPopoverStyle : questionIconStyle}
              role="button"
              test-id={`${fieldTooltipPromptButtonTestId}_${promptTestId}`}
            />
          </Popover>
        ) : null}
      </span>
    );
  }
}

export const FieldTooltip = FieldTooltipComponent;
