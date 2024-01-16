import type { InputProps } from "antd/lib/input";
import type { Duration } from "moment";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TDuration = Duration | null | undefined;

export type TTimeInputsRangeValue = [Duration, Duration];

type TOmitTimeInputsRangeProps =
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "format"
  | "value"
  | "name"
  | "picker"
  | "defaultValue";

export interface ITimeInputsRangeProps
  extends ITimeInputsRangeOwnProps,
    FieldRenderProps<TTimeInputsRangeValue> {
  withSeconds?: boolean;
  /** Исключать значения от 1 до 9 миллисекунд? По умолчанию true */
  isExcludeLowValues?: boolean;
  fixMidnightTime?: boolean;
}

export interface ITimeInputsRangeOwnProps extends Omit<InputProps, TOmitTimeInputsRangeProps> {}

export interface ITimeInputsRangeFieldProps
  extends Omit<IFieldProps<TTimeInputsRangeValue>, "component">,
    ITimeInputsRangeOwnProps {
  name: string;
}

export interface ITimeInputsRangeFormFieldProps
  extends Omit<IFormFieldProps<TTimeInputsRangeValue>, "component">,
    ITimeInputsRangeOwnProps {}
