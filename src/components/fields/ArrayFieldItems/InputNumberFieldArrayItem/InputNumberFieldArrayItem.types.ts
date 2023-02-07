import type { IFieldEntityComponentProps } from "../../ArrayField/ArrayField.types";
import type { IInputNumberFieldProps } from "../../InputNumberField/InputNumberField.types";

export interface InputNumberFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IInputNumberFieldProps, "name"> {}
