import type { TooltipProps } from "antd";
import type { RenderFunction, TooltipPlacement } from "antd/es/tooltip";

export interface IAutoTooltipProps {
  title?: React.ReactNode | RenderFunction;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  align?: TooltipProps["align"];
  className?: string;
}
