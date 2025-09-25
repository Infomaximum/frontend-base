import { Radio as UiKitRadio } from "@infomaximum/ui-kit";
import { PureComponent } from "react";
import { radioWrapperStyle } from "./Radio.styles";
import type { IRadioProps } from "./Radio.types";

const { Group } = UiKitRadio;

class RadioComponent extends PureComponent<IRadioProps> {
  public static Group = Group;

  public override render() {
    return (
      <span test-id={this.props["test-id"]} css={radioWrapperStyle}>
        <UiKitRadio {...this.props} />
      </span>
    );
  }
}

export const Radio = RadioComponent;
