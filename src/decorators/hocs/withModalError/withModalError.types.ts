import type { NCore } from "@im/core";
import type { IErrorModalContextContextData } from "../../contexts/ErrorModalContext";

export interface IWithModalErrorProps extends IErrorModalContextContextData {}

export interface IWithModalAdditionalProps {
  error?: NCore.TError;
}
