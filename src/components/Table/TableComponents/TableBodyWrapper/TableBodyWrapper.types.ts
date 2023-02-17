import type { RefAttributes } from "react";

export interface ITableBodyWrapperProps extends RefAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}
