import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type {
  IInputNumberOwnProps,
  TInputNumberFieldValue,
} from "../InputNumberField/InputNumberField.types";

export type TInputNumbersRangeFieldValue = [TInputNumberFieldValue, TInputNumberFieldValue];

export interface IInputNumbersRangeProps
  extends IInputNumberOwnProps,
    FieldRenderProps<TInputNumbersRangeFieldValue> {}

export interface IInputNumbersRangeFieldProps
  extends Omit<IFieldProps<TInputNumbersRangeFieldValue>, "component">,
    IInputNumberOwnProps {
  name: string;
}

export interface IInputNumbersRangeFormFieldProps
  extends Omit<IFormFieldProps<TInputNumbersRangeFieldValue>, "component">,
    IInputNumberOwnProps {}
