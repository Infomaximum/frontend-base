import type { MonthPickerProps } from "antd/lib/date-picker";
import type { FieldRenderProps } from "react-final-form";
import type { Moment } from "moment";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TMonthPickerFieldValue = Moment | undefined;

type TOmitMonthPickerProps =
  | "onBlur"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "format"
  | "value"
  | "name"
  | "defaultValue";

export interface IMonthPickerProps
  extends IMonthPickerOwnProps,
    FieldRenderProps<TMonthPickerFieldValue> {}

export interface IMonthPickerOwnProps extends Omit<MonthPickerProps, TOmitMonthPickerProps> {
  momentFormat?: string;
  readOnly?: boolean;
}

export interface IMonthPickerFieldProps
  extends Omit<IFieldProps<TMonthPickerFieldValue>, "component">,
    IMonthPickerOwnProps {
  name: string;
}

export interface IMonthPickerFormFieldProps
  extends Omit<IFormFieldProps<TMonthPickerFieldValue>, "component">,
    IMonthPickerOwnProps {}
