import type { InputProps } from "antd/lib/input";
import type { FieldRenderProps } from "react-final-form";
import type {
  IFieldProps,
  IWrappedFieldProps,
} from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { ISelectFormFieldProps } from "../SelectField/SelectField.types";

export type TSelectInputFieldValue = any;

export interface ISelectInputComponentFieldProps
  extends ISelectInputComponentFieldOwnProps,
    IWrappedFieldProps<TSelectInputFieldValue> {}

export interface ISelectInputComponentFieldOwnProps {
  name: string;
  readOnly?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export interface ISelectInputProps
  extends Omit<IFieldProps<TSelectInputFieldValue>, "component"> {}

export interface IInputContainerProps
  extends FieldRenderProps<TSelectInputFieldValue>,
    InputProps {
  readOnly?: boolean;
}

export interface ISelectContainerProps
  extends FieldRenderProps<TSelectInputFieldValue> {
  readOnly?: boolean;
  onChangeCallback?: ISelectFormFieldProps["onChange"];
}

export interface ISelectInputFormFieldProps
  extends Omit<IFormFieldProps<TSelectInputFieldValue>, "component">,
    ISelectInputComponentFieldOwnProps {}
