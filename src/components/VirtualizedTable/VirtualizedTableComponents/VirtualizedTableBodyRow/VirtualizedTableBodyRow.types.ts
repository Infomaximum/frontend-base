import type { TableRowSelection } from "antd/lib/table/interface";
import type { IVirtualizedTableProps } from "@im/base/src/components/VirtualizedTable/VirtualizedTable.types";
import type { IVirtualizedTableBodyCellProps } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell.types";

export interface IVirtualizedTableBodyRowProps<T>
  extends Pick<IVirtualizedTableProps<T>, "columns"> {
  record: T;
  loading: boolean;
  isChecked: boolean;
  indentLeft: IVirtualizedTableBodyCellProps<T>["indentLeft"];
  isCheckable: boolean;
  onSelectChange(record: T | null, isChecking: boolean): void;
  selectionType?: TableRowSelection<T>["type"];
  checkboxProps?: ReturnType<NonNullable<TableRowSelection<T>["getCheckboxProps"]>>;
  isTree: boolean;
  hasExpander: boolean;
  isExpanded: boolean;
  onExpanderChange(key: string, isOpening: boolean): void;
  enableRowClick?: boolean;
  isShowDivider: boolean;
}
