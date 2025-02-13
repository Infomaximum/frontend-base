import type { SwitchProps } from "antd/lib/switch";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { Interpolation, Theme } from "@emotion/react";

export type TSwitcherFieldValue = boolean;

export interface ISwitcherProps extends ISwitcherOwnProps, FieldRenderProps<TSwitcherFieldValue> {}

export interface ISwitcherOwnProps extends Omit<SwitchProps, "onBlur" | "value"> {
  value?: boolean;
  readOnly?: boolean;
  additionalStyle?: Interpolation<Theme>;
  "test-id"?: string;
  onChangeCallback?: (checked: boolean) => void;
}

export interface ISwitcherState {}

export interface ISwitcherFieldProps
  extends Omit<IFieldProps<TSwitcherFieldValue>, "component" | "onChange">,
    ISwitcherOwnProps {
  name: string;
}

export interface ISwitcherFormFieldProps
  extends Omit<IFormFieldProps<TSwitcherFieldValue>, "component">,
    ISwitcherOwnProps {}
