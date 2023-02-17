import type { RenderExpandIconProps } from "rc-table/lib/interface";

export interface ITableExpandIconProps<T> extends Omit<RenderExpandIconProps<T>, "prefixCls"> {
  prefixCls?: RenderExpandIconProps<T>["prefixCls"];
}
