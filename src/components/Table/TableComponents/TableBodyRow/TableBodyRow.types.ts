import type { RefAttributes } from "react";
import type { TFloatingContextMenuConfig } from "@infomaximum/base/src/components/ContextMenu/ContextMenuTable/ContextMenuFloating/ContextMenuFloating.types";
import type { TRow } from "@infomaximum/base/src/components/VirtualizedTable/VirtualizedTable.types";

export interface ITableBodyRowProps extends RefAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isRowSelected?: boolean;
  floatingContextMenuConfig?: TFloatingContextMenuConfig;
  record?: TRow;
}
