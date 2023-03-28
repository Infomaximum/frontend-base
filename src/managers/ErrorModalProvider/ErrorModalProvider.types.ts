import type { NCore } from "@infomaximum/module-expander";
import type React from "react";

export interface IErrorModalProviderProps {
  children: React.ReactNode;
  isDebugMode?: boolean;
}

export interface IErrorModalProviderConfigState {
  error: NCore.TError | undefined;
  closeCb?: () => void;
}
