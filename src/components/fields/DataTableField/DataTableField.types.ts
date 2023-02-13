import type { IModel } from "@im/models";
import type { FieldRenderProps } from "react-final-form";
import type { IDataTableOwnProps } from "../../DataTable/DataTable.types";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TDataTableFieldValue = IModel[];

export interface IDataTableComponentProps<T>
  extends IDataTableOwnProps<T>,
    FieldRenderProps<TDataTableFieldValue> {}

export interface IDataTableFieldProps<T>
  extends Omit<
    IFieldProps<TDataTableFieldValue, IDataTableComponentProps<T>>,
    "component" | "onChange"
  > {
  name: string;
}

export interface IDataTableFormFieldProps<T>
  extends Omit<
    IFormFieldProps<TDataTableFieldValue, IDataTableComponentProps<T>>,
    "component" | "promptText" | "rightLabel" | "onChange"
  > {}
