import type { RefAttributes } from "react";
import type { TFloatingContextMenuConfig } from "../../../ContextMenu/ContextMenuTable/ContextMenuFloating/ContextMenuFloating.types";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";

export interface ITableBodyRowProps extends RefAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isRowSelected?: boolean;
  floatingContextMenuConfig?: TFloatingContextMenuConfig;
  record?: TRow;
}
