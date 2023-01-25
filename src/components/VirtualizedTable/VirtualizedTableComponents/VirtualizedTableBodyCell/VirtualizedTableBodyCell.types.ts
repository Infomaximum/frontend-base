import type { IVirtualizedColumnConfig } from "../../../VirtualizedTable/VirtualizedTable.types";

export interface IVirtualizedTableBodyCellProps<T> {
  index: number;
  isTree: boolean;
  column: IVirtualizedColumnConfig<T>;
  indentLeft: number;
  record: T | null;
  hasExpander: boolean;
  isExpanded: boolean;
  onExpanderChange(key: string, isOpening: boolean): void;
  enableRowClick: boolean | undefined;
}
