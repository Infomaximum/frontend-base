import React from "react";
import { DatePicker } from "antd";
import type {
  IMonthPickerProps,
  IMonthPickerFieldProps,
  IMonthPickerFormFieldProps,
} from "./MonthPickerField.types";
import { FormField, Field } from "../FormField";

const AntMonthPicker = DatePicker.MonthPicker;

class MonthPicker extends React.PureComponent<IMonthPickerProps> {
  public override render() {
    const {
      momentFormat,
      input,
      meta,
      input: { value, onChange },
      readOnly,
      disabled,
      ...rest
    } = this.props;

    return (
      <AntMonthPicker
        key="ant-month-picker"
        format={momentFormat || "MMMM YYYY"}
        {...rest}
        onChange={onChange}
        value={value}
        disabled={readOnly || disabled}
      />
    );
  }
}

const MonthPickerField: React.FC<IMonthPickerFieldProps> = (props) => {
  return <Field component={MonthPicker} {...props} />;
};

const MonthPickerFormField: React.FC<IMonthPickerFormFieldProps> = (props) => {
  return <FormField component={MonthPickerField} {...props} />;
};

export { MonthPickerFormField };
