import type { NCore } from "@infomaximum/base/src/libs/core";
import type { IErrorModalContextContextData } from "@infomaximum/base/src/decorators/contexts/ErrorModalContext";

export interface IWithModalErrorProps extends IErrorModalContextContextData {}

export interface IWithModalAdditionalProps {
  error?: NCore.TError;
}
