import type { IFieldProps } from "../FormField/Field/Field.types";
import type { InputNumberProps } from "antd/lib/input-number";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { FieldRenderProps } from "react-final-form";

export type TInputNumberFieldValue = number | string;

export interface IInputNumberProps
  extends IInputNumberOwnProps,
    FieldRenderProps<TInputNumberFieldValue> {}

export interface IInputNumberOwnProps
  extends Omit<
    InputNumberProps<any>,
    "onChange" | "onBlur" | "value" | "name" | "defaultValue"
  > {
  readOnly?: boolean;
}

export interface IInputNumberFieldProps
  extends Omit<IFieldProps<TInputNumberFieldValue>, "component">,
    IInputNumberOwnProps {
  name: string;
}

export interface IInputNumberFormFieldProps
  extends Omit<IFormFieldProps<TInputNumberFieldValue>, "component">,
    IInputNumberOwnProps {}
