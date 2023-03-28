import type { IFieldEntityComponentProps } from "../../ArrayField/ArrayField.types";
import type { IDatePickerFieldProps } from "../../DatePickerField/DatePickerField.types";

export interface IDatePickerFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IDatePickerFieldProps, "name"> {}
