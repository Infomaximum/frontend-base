import type { Interpolation } from "@emotion/react";
import type { RenderFunction } from "antd/es/tooltip";

export interface ITextOverflowProps {
  children: React.ReactNode;
  customStyle?: Interpolation<TTheme>;
  isRelative?: boolean;
  isDark?: boolean;
  title?: React.ReactNode | RenderFunction;
  className?: string;
}
