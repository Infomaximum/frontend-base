import type { RangePickerProps } from "antd/lib/date-picker";
import type { RangePickerDateProps } from "antd/lib/date-picker/generatePicker";
import type { Moment } from "moment";
import type { FieldRenderProps } from "react-final-form";
import type { PickerMode } from "rc-picker/lib/interface";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TRangePickerFieldValue = [Moment, Moment];

type TOmitRangePickerProps =
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "format"
  | "value"
  | "name"
  | "defaultValue";

export type TPickerValue = PickerMode;

export interface IRangePickerProps
  extends IRangePickerOwnProps,
    FieldRenderProps<TRangePickerFieldValue> {}

export interface IRangePickerOwnProps
  extends Omit<RangePickerProps, TOmitRangePickerProps> {
  // Почему-то RangePickerProps не содержит данный тип
  showTime?: RangePickerDateProps<Moment>["showTime"];
  momentFormat?: string;
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
