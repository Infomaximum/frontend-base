import type { RefAttributes } from "react";

export interface ITableBodyCellProps
  extends RefAttributes<HTMLTableCellElement> {
  showTooltip?: boolean;
  children: React.ReactNode;
}
