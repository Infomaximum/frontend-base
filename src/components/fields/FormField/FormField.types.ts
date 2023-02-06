import type { FieldRenderProps } from "react-final-form";
import type { IFormOptionProps } from "../FormOption/FormOption.types";
import type { IFieldProps } from "./Field/Field.types";

export interface IFormFieldProps<
  V,
  T extends FieldRenderProps<V> = FieldRenderProps<V>
> extends Omit<IFormOptionProps, "error" | "touched" | "invalid" | "children">,
    Omit<IFieldProps<V, T>, "component"> {}
