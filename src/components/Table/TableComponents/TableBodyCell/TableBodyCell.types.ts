import type { RefAttributes, TdHTMLAttributes } from "react";

export interface ITableBodyCellProps
  extends RefAttributes<HTMLTableCellElement>,
    Pick<TdHTMLAttributes<HTMLTableCellElement>, "style"> {
  showTooltip?: boolean;
  children: React.ReactNode;
}
