import type { RadioGroupProps } from "antd/lib/radio";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TRadioFroupFieldValue = any;

export interface IRadioGroupFieldContainerProps
  extends IRadioGroupFieldContainerOwnProps,
    FieldRenderProps<TRadioFroupFieldValue> {}

export interface IRadioGroupFieldContainerOwnProps extends Omit<RadioGroupProps, "name"> {
  readOnly?: boolean;
  rightLabel?: React.ReactNode;
}

export interface IRadioGroupFieldProps
  extends Omit<IFieldProps<TRadioFroupFieldValue>, "component">,
    IRadioGroupFieldContainerOwnProps {
  name: string;
}

export interface IRadioGroupFormFieldProps
  extends Omit<IFormFieldProps<TRadioFroupFieldValue>, "component">,
    IRadioGroupFieldContainerOwnProps {}
