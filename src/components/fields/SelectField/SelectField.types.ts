import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { SelectProps } from "antd/lib/select";
import type { FieldRenderProps } from "react-final-form";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";

export type TSelectFieldValue = any;

export interface ISelectComponentProps
  extends ISelectComponentOwnProps,
    FieldRenderProps<TSelectFieldValue> {}

export interface ISelectComponentOwnProps
  extends IWithLocProps,
    Omit<SelectProps<TSelectFieldValue>, "name"> {
  readOnly?: boolean;
  onChangeCallback?: SelectProps<TSelectFieldValue>["onChange"];
}

export interface ISelectFieldProps
  extends IWithLocProps,
    Omit<IFieldProps<TSelectFieldValue>, "component">,
    ISelectComponentOwnProps {
  name: string;
}

export interface ISelectFormFieldProps
  extends IWithLocProps,
    Omit<IFormFieldProps<TSelectFieldValue>, "component">,
    ISelectComponentOwnProps {}
