import type React from "react";
import type { NCore } from "../../libs/core";

export interface IErrorModalProviderProps {
  children: React.ReactNode;
  isDebugMode?: boolean;
}

export interface IErrorModalProviderConfigState {
  error: NCore.TError | undefined;
  closeCb?: () => void;
  maskTransitionName?: string;
  footerButtons?: React.ReactNode[];
}
