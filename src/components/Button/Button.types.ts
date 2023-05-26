import type { ButtonProps } from "antd/lib/button";

export type TButtonType =
  | ButtonProps["type"]
  | "primary-dark"
  | "primary-notification"
  | "ghost-dark";

export type TButtonSize = ButtonProps["size"];

type TButtonProps = Omit<ButtonProps, "type">;

export interface IButtonProps extends TButtonProps, React.RefAttributes<HTMLElement> {
  type?: TButtonType;
}
