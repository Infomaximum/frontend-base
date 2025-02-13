import type { TableProps } from "antd/lib/table";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { SortOrder } from "antd/lib/table/interface";
import type { DataIndex } from "rc-table/lib/interface";
import type { IWithSpinPropsReplacer } from "./VirtualizedTable.utils";
import type React from "react";
import type { Index, ScrollParams } from "react-virtualized";
import type { TBaseRow, TExtendColumns } from "../../managers/Tree";
import type { IBaseColumnConfig } from "../Table/Table.types";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";

export interface IColumnProps<T = any> extends IBaseColumnConfig<T> {
  /** Позволяет раскрыть строку виртуализированной таблицы при клике на конкретную ячейку */
  enableCellClick?: boolean;
  priority?: number;
}

export type TRow<T extends TBaseRow = TBaseRow> = Partial<TExtendColumns<T>>;
export interface IVirtualizedColumnConfig<T> extends IColumnProps<T> {
  minWidth?: string | number;
}

export interface IVirtualizedTableOwnProps<T>
  extends Pick<
    TableProps<T>,
    | "expandedRowKeys"
    | "expandable"
    | "onExpandedRowsChange"
    | "rowSelection"
    | "dataSource"
    | "showHeader"
    | "indentSize"
    | "onChange"
    | "onRow"
  > {
  targetAll?: boolean;
  columns: IVirtualizedColumnConfig<T | null>[] | undefined;
  enableRowClick?: boolean;
  isShowDividers: boolean;
  scrollAreaHeight: number;
  empty: React.ReactNode;
  onScroll?(params: ScrollParams): void;
  scrollTop?: number;
  rowHeight?: number | ((index: Index) => number);
  localization: IWithLocProps["localization"];
  loading?: IWithSpinPropsReplacer["loading"];
  isWithoutWrapperStyles?: boolean;
}

export interface IVirtualizedTableProps<T>
  extends IVirtualizedTableOwnProps<T>,
    IWithThemeProps<TTheme> {}

export interface IVirtualizedTableState<T> {
  surfaceNodes: T[];
  sorter: { field?: DataIndex; order: SortOrder | boolean | undefined };
  columnsOrders: TDictionary<SortOrder[]>;
  columnConfig: IVirtualizedColumnConfig<T>[] | undefined;
  scrollOffset: number;
  /** Коллекция для быстрого определения состояния выбранности строки */
  selectedRowKeysSet: Set<string> | null;
  /** Флаг инициализации таблицы */
  loading: boolean;
  isCheckableDisabled: boolean;
  /** scrollTop сначала из пропсов для восстановления позиции скролла, затем undefined, чтобы не мешать работать  */
  initialScrollTop: number | undefined;
}
