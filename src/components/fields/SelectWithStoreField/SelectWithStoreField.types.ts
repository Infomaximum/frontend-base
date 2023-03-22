import type { IModel } from "@im/models";
import type { FieldRenderProps } from "react-final-form";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";
import type { ISelectWithStoreProps } from "../../SelectWithStore/SelectWithStore.types";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";

export type TSelectWithStoreFieldValue = any;

export interface ISelectWithStoreComponentProps
  extends ISelectWithStoreComponentOwnProps,
    FieldRenderProps<TSelectWithStoreFieldValue> {
  onChangeCallback?: (value: IModel[]) => void;
}

export interface ISelectWithStoreComponentOwnProps extends IWithLocProps, ISelectWithStoreProps {
  readOnly?: boolean;
}

export interface ISelectWithStoreFieldProps
  extends IWithLocProps,
    Omit<IFieldProps<TSelectWithStoreFieldValue>, "component">,
    Omit<ISelectWithStoreComponentOwnProps, "value"> {
  name: string;
}

export interface ISelectWithStoreFormFieldProps
  extends Omit<IFormFieldProps<TSelectWithStoreFieldValue>, "component">,
    Omit<ISelectWithStoreComponentOwnProps, "localization" | "onChange" | "onFocus" | "onBlur"> {}
