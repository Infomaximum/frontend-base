import type { RefAttributes } from "react";

export interface ITableContainerProps extends RefAttributes<HTMLTableElement> {
  children: React.ReactNode;
}
