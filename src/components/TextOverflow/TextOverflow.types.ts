import React from "react";
import type { Interpolation } from "@emotion/react";

export interface ITextOverflowProps {
  children: React.ReactNode;
  customStyle?: Interpolation<TTheme>;
  isRelative?: boolean;
  isDark?: boolean;
}
