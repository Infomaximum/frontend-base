import React from "react";
import { isFunction } from "lodash";
import type {
  ICheckboxFieldProps,
  ICheckboxComponentProps,
  ICheckboxFormFieldProps,
} from "./CheckboxField.types";
import type { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import { Checkbox } from "../../Checkbox/Checkbox";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";

class CheckboxComponent extends React.PureComponent<ICheckboxComponentProps> {
  private handleChange = (e: CheckboxChangeEvent): void => {
    const { input } = this.props;

    if (isFunction(input?.onChange)) {
      input.onChange(e?.target?.checked);
    }
  };

  public override render(): React.ReactNode {
    const {
      disabled,
      readOnly,
      input: { value },
      children,
    } = this.props;

    return (
      <Checkbox
        onChange={this.handleChange}
        checked={Boolean(value)}
        disabled={readOnly || disabled}
      >
        {children}
      </Checkbox>
    );
  }
}

const CheckboxField: React.FC<ICheckboxFieldProps> = (props) => {
  return <Field component={CheckboxComponent} {...props} />;
};

const CheckboxFormField: React.FC<ICheckboxFormFieldProps> = (props) => {
  return <FormField component={CheckboxField} {...props} />;
};

export { CheckboxFormField };
