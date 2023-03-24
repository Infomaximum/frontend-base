import type { NCore } from "@infomaximum/module-expander";
import type { IErrorModalContextContextData } from "../../contexts/ErrorModalContext";

export interface IWithModalErrorProps extends IErrorModalContextContextData {}

export interface IWithModalAdditionalProps {
  error?: NCore.TError;
}
