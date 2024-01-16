import type { ButtonProps } from "antd/lib/button";
import type { TooltipPlacement } from "antd/lib/tooltip";

export type TButtonType =
  | ButtonProps["type"]
  | "primary-dark"
  | "primary-notification"
  | "primary-outlined"
  | "ghost-dark";

export type TButtonSize = ButtonProps["size"];

type TButtonProps = Omit<ButtonProps, "type">;

export interface IButtonProps extends TButtonProps, React.RefAttributes<HTMLElement> {
  type?: TButtonType;
  tooltipPlacement?: TooltipPlacement;
}
