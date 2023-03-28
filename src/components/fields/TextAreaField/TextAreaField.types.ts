import type { TextAreaProps } from "antd/lib/input/TextArea";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TTextAreaFieldValue = string;

export interface ITextAreaProps extends TextAreaProps, FieldRenderProps<TTextAreaFieldValue> {}

export interface ITextAreaFieldProps
  extends Omit<IFieldProps<ITextAreaProps>, "component">,
    TextAreaProps {
  name: string;
}

export interface ITextAreaFormFieldProps
  extends Omit<IFormFieldProps<TTextAreaFieldValue>, "component">,
    TextAreaProps {}
