import type { IFormFieldProps } from "../FormField/FormField.types";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { FieldRenderProps } from "react-final-form";
import type { Dayjs } from "dayjs";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";
import type { WeekPickerProps } from "antd/lib/date-picker";
export type TWeekPickerFieldValue = Dayjs;

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
    TRemoveIndex<FieldRenderProps<TWeekPickerFieldValue>> {}

export interface IWeekPickerOwnProps
  extends Omit<WeekPickerProps, TOmitWeekPickerProps>,
    IWithLocProps {
  displayFormat?: string;
}

export interface IWeekPickerFieldProps
  extends Omit<IFieldProps<TWeekPickerFieldValue>, "component">,
    IWeekPickerOwnProps {
  name: string;
}

export interface IWeekPickerFormFieldProps
  extends Omit<IFormFieldProps<TWeekPickerFieldValue>, "component">,
    IWeekPickerOwnProps {}
