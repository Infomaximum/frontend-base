import type { ReactElement } from "react";
import type { List, ListRowProps, ScrollParams } from "react-virtualized";
import type { IVirtualizedTableProps } from "../../../VirtualizedTable/VirtualizedTable.types";

export interface IVirtualizedTableBodyProps
  extends Pick<
    IVirtualizedTableProps<unknown>,
    "scrollAreaHeight" | "rowHeight" | "isWithoutWrapperStyles"
  > {
  vListRef: React.RefObject<List>;
  rowRenderer: ({ index, key, style }: ListRowProps) => ReactElement;
  itemsCount: number;
  addScrollOffset: (margin: number) => void;
  onScroll?(params: ScrollParams): void;
  scrollTop?: number;
}
