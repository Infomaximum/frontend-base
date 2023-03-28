import type { RefAttributes } from "react";

export interface ITableHeaderCellProps extends RefAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}
