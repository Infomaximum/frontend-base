import type { Interpolation } from "@emotion/react";
import type { IBaseFormProps } from "../../forms/BaseForm/BaseForm.types";
import type { IFormWrapperProps } from "../../forms/Form/FormWrapper.types";

export interface IFormComponentProps extends IBaseFormProps {
  rowProps: Omit<IEditableRowProps, "formProps" | "children">;
  children: React.ReactNode;
}

export interface IEditableRowProps {
  formName: string;
  formProps: IFormWrapperProps<IFormComponentProps>;
  className?: string;
  "data-row-key"?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  style?: React.CSSProperties;
  css?: Interpolation<TTheme>;
  children: React.ReactNode;
}
