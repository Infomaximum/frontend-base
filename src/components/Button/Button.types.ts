import type { ButtonProps } from "antd/lib/button";
import type { TooltipPlacement } from "antd/lib/tooltip";
import type { ITooltipProps } from "../Tooltip/Tooltip.types";

export type TButtonType =
  | ButtonProps["type"]
  | "common"
  | "common-dark"
  | "primary-dark"
  | "primary-notification"
  | "primary-outlined"
  | "text-dark"
  | "link-dark";

export type TButtonSize = ButtonProps["size"];

type TButtonProps = Omit<ButtonProps, "type">;

export interface IButtonProps extends TButtonProps, React.RefAttributes<HTMLElement> {
  type?: TButtonType;
  dashed?: boolean;
  ghost?: boolean;
  tooltipPlacement?: TooltipPlacement;
  tooltipAlign?: ITooltipProps["align"];
}
