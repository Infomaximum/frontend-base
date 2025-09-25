import React from "react";
import { DatePicker as UiKitDatePicker } from "@infomaximum/ui-kit";
import type {
  IMonthPickerProps,
  IMonthPickerFieldProps,
  IMonthPickerFormFieldProps,
} from "./MonthPickerField.types";
import { FormField, Field } from "../FormField";

class MonthPicker extends React.PureComponent<IMonthPickerProps> {
  public override render() {
    const {
      displayFormat,
      input,
      meta,
      input: { value, onChange },
      readOnly,
      disabled,
      ...rest
    } = this.props;

    return (
      <UiKitDatePicker
        key="month-picker"
        format={displayFormat || "MMMM YYYY"}
        picker="month"
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
