import type { IFormFieldProps } from "../FormField/FormField.types";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { WeekPickerProps } from "antd/lib/date-picker";
import type { FieldRenderProps } from "react-final-form";
import type { Moment } from "moment";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";

export type TWeekPickerFieldValue = Moment;

type TOmitWeekPickerProps =
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "format"
  | "value"
  | "name"
  | "defaultValue";

export interface IWeekPickerProps
  extends IWeekPickerOwnProps,
    FieldRenderProps<TWeekPickerFieldValue> {}

export interface IWeekPickerOwnProps
  extends Omit<WeekPickerProps, TOmitWeekPickerProps>,
    IWithLocProps {
  momentFormat?: string;
}

export interface IWeekPickerFieldProps
  extends Omit<IFieldProps<TWeekPickerFieldValue>, "component">,
    IWeekPickerOwnProps {
  name: string;
}

export interface IWeekPickerFormFieldProps
  extends Omit<IFormFieldProps<TWeekPickerFieldValue>, "component">,
    IWeekPickerOwnProps {}
