import type { IFieldEntityComponentProps } from "@infomaximum/base/src/components/fields/ArrayField/ArrayField.types";
import type { ISwitcherFieldProps } from "@infomaximum/base/src/components/fields/SwitcherField/SwitcherField.types";

export interface ISwitcherFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<ISwitcherFieldProps, "name"> {}
