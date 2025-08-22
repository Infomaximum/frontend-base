import type { IFieldEntityComponentProps } from "@infomaximum/base/src/components/fields/ArrayField/ArrayField.types";
import type { IDatePickerFieldProps } from "@infomaximum/base/src/components/fields/DatePickerField/DatePickerField.types";

export interface IDatePickerFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IDatePickerFieldProps, "name"> {}
