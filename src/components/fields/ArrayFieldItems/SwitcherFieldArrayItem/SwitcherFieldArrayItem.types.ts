import type { IFieldEntityComponentProps } from "../../ArrayField/ArrayField.types";
import type { ISwitcherFieldProps } from "../../SwitcherField/SwitcherField.types";

export interface ISwitcherFieldArrayItemProps
  extends IFieldEntityComponentProps,
    Omit<ISwitcherFieldProps, "name"> {}
