import type { RefAttributes } from "react";

export interface ITableHeaderWrapperProps
  extends RefAttributes<HTMLTableSectionElement> {
  className: string;
  children: React.ReactNode;
}
