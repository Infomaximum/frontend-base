import type { IFieldEntityComponentProps } from "@infomaximum/base/src/components/fields/ArrayField/ArrayField.types";
import type { IInputNumberFieldProps } from "@infomaximum/base/src/components/fields/InputNumberField/InputNumberField.types";

export interface InputNumberFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IInputNumberFieldProps, "name"> {}
