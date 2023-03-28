import type React from "react";
import type { RadioGroupProps } from "antd/lib/radio";
import type { FieldRenderProps } from "react-final-form";
import type { ITableOwnProps } from "../../Table/Table.types";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TTableRadioGroupFieldValue = any;

export interface ITableRadioGroupFieldContainerProps<T>
  extends ITableRadioGroupFieldContainerOwnProps<T>,
    FieldRenderProps<TTableRadioGroupFieldValue> {}

export interface ITableRadioGroupFieldContainerOwnProps<T>
  extends Omit<RadioGroupProps, "name">,
    Omit<ITableOwnProps<T>, "onChange" | "targetAll" | "isVirtualized" | "headerMode"> {
  readOnly?: boolean;
  rightLabel?: React.ReactNode;
  tableProps?: Omit<ITableOwnProps<T>, "onChange" | "localization">;
}

export interface ITableRadioGroupFieldProps<
  T extends Record<string, unknown> = Record<string, unknown>
> extends Omit<
      IFieldProps<TTableRadioGroupFieldValue, ITableRadioGroupFieldContainerProps<T>>,
      "component"
    >,
    ITableRadioGroupFieldContainerOwnProps<T> {
  name: string;
}

export interface ITableRadioGroupFormFieldProps<
  T extends Record<string, unknown> = Record<string, unknown>
> extends Omit<
      IFormFieldProps<TTableRadioGroupFieldValue, ITableRadioGroupFieldContainerProps<T>>,
      "component"
    >,
    ITableRadioGroupFieldContainerOwnProps<T> {}

export interface ITableRadioGroupFieldState {}
