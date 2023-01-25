import type { TableProps } from "antd/lib/table";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { SortOrder } from "antd/lib/table/interface";
import type { DataIndex } from "rc-table/lib/interface";
import type { IWithSpinPropsReplacer } from "./VirtualizedTable.utils";
import type React from "react";
import type { ScrollParams } from "react-virtualized";
import type { TBaseRow, TExtendColumns } from "../../managers/Tree";
import type { IBaseColumnConfig } from "../Table/Table.types";

export interface IColumnProps<T = any> extends IBaseColumnConfig<T> {
  /** Позволяет раскрыть строку виртуализированной таблицы при клике на конкретную ячейку */
  enableCellClick?: boolean;
  priority?: number;
}

export type TRow = Partial<TExtendColumns<TBaseRow>>;
export interface IVirtualizedColumnConfig<T> extends IColumnProps<T> {
  minWidth?: React.ReactText;
}

export interface IVirtualizedTableProps<T>
  extends Pick<
      TableProps<T | null>,
      | "expandedRowKeys"
      | "onExpandedRowsChange"
      | "rowSelection"
      | "dataSource"
      | "showHeader"
      | "indentSize"
      | "onChange"
    >,
    IWithLocProps,
    IWithSpinPropsReplacer {
  loading: boolean;
  targetAll?: boolean;
  columns: IVirtualizedColumnConfig<T>[] | undefined;
  enableRowClick?: boolean;
  isShowDividers: boolean;
  scrollAreaHeight: number;
  empty: React.ReactNode;
  onScroll?(params: ScrollParams): void;
}

export interface IVirtualizedTableState<T> {
  surfaceNodes: T[];
  sorter: { field?: DataIndex; order: SortOrder | boolean | undefined };
  columnsOrders: TDictionary<SortOrder[]>;
  columnConfig: IVirtualizedColumnConfig<T>[] | undefined;
  scrollOffset: number;
  /** Коллекция для быстрого определения состояния выбранности строки */
  selectedRowKeysSet: Set<string> | null;
}
