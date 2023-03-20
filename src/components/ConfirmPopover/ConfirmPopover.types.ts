import type { ButtonProps } from "antd/lib/button";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { PopoverProps } from "antd/lib/popover";

export interface IConfirmPopoverProps
  extends IWithLocProps,
    Pick<PopoverProps, "placement" | "trigger" | "children"> {
  onSubmit(): void;
  loading: ButtonProps["loading"];
  text: string;
  open?: boolean;
  okText?: string;
  cancelText?: string;
  onOpenChange?(value: boolean): void;
}
