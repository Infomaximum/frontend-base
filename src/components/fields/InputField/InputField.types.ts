import type { ComponentType } from "react";
import type { InputProps } from "antd/lib/input";
import type { FieldRenderProps } from "react-final-form";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";
import type { Input } from "../../Input/Input";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
export type TInputFieldValue = string | number | string[];

export interface IInputComponentProps
  extends IInputComponentOwnProps,
    FieldRenderProps<TInputFieldValue> {}

export interface IInputComponentOwnProps extends Omit<InputProps, "name">, Partial<IWithLocProps> {
  readOnly?: boolean;
  value?: TInputFieldValue;
  trimValue?: boolean;
  inputComponent?:
    | ComponentType<InputProps>
    | (typeof Input)["Password"]
    | typeof Input
    | (typeof Input)["TextArea"]
    | (typeof Input)["Search"];
}

export interface IInputState {
  value?: TInputFieldValue;
}

export interface IInputFieldProps
  extends Omit<IFieldProps<TInputFieldValue>, "component">,
    IInputComponentOwnProps {
  name: string;
}

export interface IInputFormFieldProps
  extends Omit<IFormFieldProps<TInputFieldValue>, "component">,
    IInputComponentOwnProps {}
