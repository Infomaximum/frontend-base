import type { RangePickerProps } from "antd/lib/date-picker";
import type { Dayjs } from "dayjs";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
export type TRangePickerFieldValue = [Dayjs, Dayjs];

type TOmitRangePickerProps =
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "format"
  | "value"
  | "name"
  | "defaultValue";

export type TPickerValue = RangePickerProps["picker"];

export interface IRangePickerProps
  extends IRangePickerOwnProps,
    FieldRenderProps<TRangePickerFieldValue> {}

export interface IRangePickerOwnProps extends Omit<RangePickerProps, TOmitRangePickerProps> {
  displayFormat?: string;
  readOnly?: boolean;
  testId?: string;
}

export interface IRangePickerFieldProps
  extends Omit<IFieldProps<TRangePickerFieldValue>, "component">,
    IRangePickerOwnProps {
  name: string;
}

export interface IRangePickerFormFieldProps
  extends Omit<IFormFieldProps<TRangePickerFieldValue>, "component">,
    IRangePickerOwnProps {}
