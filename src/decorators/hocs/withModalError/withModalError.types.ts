import type { NCore } from "../../../libs/core";
import type { IErrorModalContextContextData } from "../../contexts/ErrorModalContext";

export interface IWithModalErrorProps extends IErrorModalContextContextData {}

export interface IWithModalAdditionalProps {
  error?: NCore.TError;
}
