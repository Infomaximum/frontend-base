import React from "react";
import type {
  ISwitcherFieldProps,
  ISwitcherProps,
  ISwitcherState,
  ISwitcherFormFieldProps,
} from "./SwitcherField.types";
import { switchStyle, switcherFieldStyle } from "./SwitcherField.styles";
import { Switch } from "../../Switch";
import { Field, FormField } from "../FormField";

class Switcher extends React.PureComponent<ISwitcherProps, ISwitcherState> {
  private handleChange = (checked: boolean): void => {
    const {
      input: { onChange },
      onChangeCallback,
    } = this.props;

    if (onChange) {
      onChange(checked);
    }

    if (onChangeCallback) {
      onChangeCallback(checked);
    }
  };

  public override render(): React.ReactNode {
    const {
      disabled,
      readOnly,
      size,
      input: { value },
      additionalStyle,
    } = this.props;

    return (
      <Switch
        onChange={this.handleChange}
        checked={Boolean(value)}
        disabled={readOnly || disabled}
        size={size ? size : "small"}
        css={[switchStyle, additionalStyle]}
      />
    );
  }
}

const SwitcherField: React.FC<ISwitcherFieldProps> = (props) => {
  return (
    <div css={switcherFieldStyle}>
      <Field component={Switcher} {...props} />
    </div>
  );
};

const SwitcherFormField: React.FC<ISwitcherFormFieldProps> = (props) => {
  return <FormField component={SwitcherField} {...props} />;
};

export { SwitcherFormField, SwitcherField };
