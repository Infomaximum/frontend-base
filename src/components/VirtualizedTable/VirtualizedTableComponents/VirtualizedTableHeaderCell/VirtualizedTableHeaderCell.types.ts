import type { SorterResult, SortOrder } from "antd/lib/table/interface";
import type { IVirtualizedColumnConfig } from "../../../VirtualizedTable/VirtualizedTable.types";

export interface IVirtualizedTableHeaderCellProps<T> {
  column: IVirtualizedColumnConfig<T | null>;
  columnsOrders: TDictionary<SortOrder[]>;
  onSorterChange(column: SorterResult<T | null>["column"]): void;
  isSorted: boolean;
  sortOrder: SortOrder | boolean | undefined;
}
