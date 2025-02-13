import type { ReactNode } from "react";
import type { IInputFormFieldProps } from "../InputField/InputField.types";

export interface IPasswordWithButtonFieldProps extends IInputFormFieldProps {
  hasPassword: boolean;
  buttonLabel?: ReactNode;
  buttonCaption?: ReactNode;
}
