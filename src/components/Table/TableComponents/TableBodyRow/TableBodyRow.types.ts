import type { RefAttributes } from "react";

export interface ITableBodyRowProps extends RefAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}
