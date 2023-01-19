import type { NCore } from "@im/core";
import type React from "react";

export interface IErrorModalProviderProps {
  children: React.ReactNode;
  isDebugMode?: boolean;
}

export interface IErrorModalProviderConfigState {
  error: NCore.TError | undefined;
  closeCb?: () => void;
}
