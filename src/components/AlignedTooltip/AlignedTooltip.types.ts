import type { Interpolation } from "@emotion/react";
import type { TooltipPropsWithTitle } from "antd/lib/tooltip";

export interface IAlignedTooltipProps {
  title?: TooltipPropsWithTitle["title"];
  children: React.ReactNode;
  offsetY?: number;
  className?: string;
  numberOfLines?: number;
  customStyle?: Interpolation<TTheme>;
  expandByParent?: boolean;
}
