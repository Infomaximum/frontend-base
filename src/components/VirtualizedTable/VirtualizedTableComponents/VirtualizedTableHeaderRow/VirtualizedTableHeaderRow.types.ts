import type { IWithThemeProps } from "../../../../decorators/hocs/withTheme/withTheme";
import type {
  IVirtualizedTableProps,
  IVirtualizedTableState,
} from "../../../VirtualizedTable/VirtualizedTable.types";
import type { IVirtualizedTableHeaderCellProps } from "../VirtualizedTableHeaderCell/VirtualizedTableHeaderCell.types";

export interface IVirtualizedTableHeaderRowOwnProps<T>
  extends Pick<IVirtualizedTableProps<T>, "columns" | "targetAll" | "loading">,
    Pick<IVirtualizedTableState<T>, "sorter">,
    Pick<IVirtualizedTableHeaderCellProps<T>, "onSorterChange" | "columnsOrders"> {
  isTableEmpty: boolean;
  isCheckable: boolean;
  checkableColumnTitle?: React.ReactNode;
  isSelectionEmpty: boolean;
  onSelectChange(record: T | null, isChecking: boolean): void;
  /** Отступ справа, если в таблице есть скролл */
  scrollOffset?: number;
  isShowDivider: boolean;
}

export interface IVirtualizedTableHeaderRowProps<T>
  extends IVirtualizedTableHeaderRowOwnProps<T>,
    IWithThemeProps<TTheme> {}
