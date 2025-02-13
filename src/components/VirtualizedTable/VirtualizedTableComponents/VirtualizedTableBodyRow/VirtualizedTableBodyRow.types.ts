import type { TableRowSelection } from "antd/lib/table/interface";
import type { IVirtualizedTableProps } from "../../../VirtualizedTable/VirtualizedTable.types";
import type { IVirtualizedTableBodyCellProps } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell.types";

interface ICheckboxProps<T>
  extends ReturnType<NonNullable<TableRowSelection<T>["getCheckboxProps"]>> {
  key?: string;
}

export interface IVirtualizedTableBodyRowProps<T>
  extends Pick<IVirtualizedTableProps<T>, "columns" | "onRow" | "isWithoutWrapperStyles"> {
  index: number;
  record: T;
  loading: boolean;
  isChecked: boolean;
  indentLeft: IVirtualizedTableBodyCellProps<T>["indentLeft"];
  isCheckable: boolean;
  onSelectChange(record: T | null, isChecking: boolean): void;
  selectionType?: TableRowSelection<T>["type"];
  getCheckboxProps?: (record: T) => ICheckboxProps<T>;
  isTree: boolean;
  hasExpander: boolean;
  isExpanded: boolean;
  onExpanderChange(key: string, isOpening: boolean): void;
  enableRowClick?: boolean;
  isShowDivider: boolean;
}
