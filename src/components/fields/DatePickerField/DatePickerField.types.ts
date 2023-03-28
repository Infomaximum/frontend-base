import type { DatePickerProps } from "antd/lib/date-picker";
import type { PickerDateProps } from "antd/lib/date-picker/generatePicker";
import type { Moment } from "moment";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

type TDatePickerFieldValue = NonNullable<DatePickerProps["value"]>;
type TOmitDatePickerProps = "onChange" | "onBlur" | "onFocus" | "format" | "value" | "name";

export interface IDatePickerProps
  extends IDatePickerOwnProps,
    FieldRenderProps<TDatePickerFieldValue> {}

export interface IDatePickerOwnProps extends Omit<DatePickerProps, TOmitDatePickerProps> {
  // Почему-то DatePickerProps не содержит данный тип
  showTime?: PickerDateProps<Moment>["showTime"];
  momentFormat?: DatePickerProps["format"];
  readOnly?: boolean;
}

export interface IDatePickerFieldProps
  extends Omit<IFieldProps<TDatePickerFieldValue>, "component">,
    IDatePickerOwnProps {
  name: string;
}

export interface IDatePickerFormFieldProps
  extends Omit<IFormFieldProps<TDatePickerFieldValue>, "component">,
    IDatePickerOwnProps {}
