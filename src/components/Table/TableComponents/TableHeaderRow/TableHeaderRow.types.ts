import type { RefAttributes } from "react";

export interface ITableHeaderRowProps
  extends RefAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}
