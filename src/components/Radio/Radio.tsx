import { Radio as AntRadio } from "antd";
import { PureComponent } from "react";
import { radioButtonStyle } from "./Radio.style";
import type { IRadioProps } from "./Radio.types";

const { Group, Button } = AntRadio;

class RadioComponent extends PureComponent<IRadioProps> {
  public static Button = Button;
  public static Group = Group;

  public override render() {
    return (
      <span test-id={this.props["test-id"]}>
        <AntRadio {...this.props} css={radioButtonStyle} />
      </span>
    );
  }
}

export const Radio = RadioComponent;
