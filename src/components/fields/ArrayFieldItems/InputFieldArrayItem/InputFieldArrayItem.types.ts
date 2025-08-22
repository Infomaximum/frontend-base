import type { IFieldEntityComponentProps } from "@infomaximum/base/src/components/fields/ArrayField/ArrayField.types";
import type { IInputFieldProps } from "@infomaximum/base/src/components/fields/InputField/InputField.types";

export interface InputFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<IInputFieldProps, "name"> {}
