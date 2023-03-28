import type { CheckboxProps } from "antd/lib/checkbox/Checkbox";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TCheckboxFieldValue = boolean;

export interface ICheckboxComponentProps
  extends ICheckboxComponentOwnProps,
    FieldRenderProps<TCheckboxFieldValue> {}

export interface ICheckboxComponentOwnProps
  extends Omit<CheckboxProps, "onBlur" | "value" | "indeterminate"> {
  value?: boolean;
  readOnly?: boolean;
  "test-id"?: string;
}

export interface ICheckboxFieldProps
  extends Omit<IFieldProps<TCheckboxFieldValue>, "component" | "onChange" | "name">,
    ICheckboxComponentOwnProps {
  name: string;
}

export interface ICheckboxFormFieldProps
  extends Omit<IFormFieldProps<TCheckboxFieldValue>, "component" | "name">,
    ICheckboxComponentOwnProps {
  name: string;
}
