import type { ReactNode } from "react";
import type { PopoverProps } from "antd/lib/popover";

type TPopover = Pick<
  PopoverProps,
  "placement" | "trigger" | "getPopupContainer"
>;

export interface IFieldTooltipProps extends TPopover {
  caption?: ReactNode;
  promptText?: ReactNode | string;
  promptTestId?: string;
  "test-id"?: string;
  iconStyle?: any;
  arrowPointAtCenter?: boolean;
}

export interface IFieldTooltipState {
  showPopover: boolean;
}
