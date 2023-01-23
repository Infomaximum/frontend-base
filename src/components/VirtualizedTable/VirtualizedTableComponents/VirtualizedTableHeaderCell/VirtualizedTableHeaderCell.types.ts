import type { SorterResult, SortOrder } from "antd/lib/table/interface";
import type { IVirtualizedColumnConfig } from "src/components/VirtualizedTable/VirtualizedTable.types";

export interface IVirtualizedTableHeaderCellProps<T> {
  column: IVirtualizedColumnConfig<T>;
  columnsOrders: TDictionary<SortOrder[]>;
  onSorterChange(column: SorterResult<T>["column"]): void;
  isSorted: boolean;
  sortOrder: SortOrder | boolean | undefined;
}
