import type { IFieldEntityComponentProps } from "../../ArrayField/ArrayField.types";
import type { IInputFieldProps } from "../../InputField/InputField.types";

export interface InputFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IInputFieldProps, "name"> {}
