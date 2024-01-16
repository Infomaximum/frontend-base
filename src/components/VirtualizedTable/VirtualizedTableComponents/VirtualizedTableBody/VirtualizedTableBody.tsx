import { VIRTUALIZED_TABLE_BODY_ID } from "../../../../utils/const";
import React, { type FC, useEffect } from "react";
import { List as VList } from "react-virtualized";
import { ScrollBehavior } from "../../../../utils/ScrollBehavior/ScrollBehavior";
import { observer } from "mobx-react";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import {
  bugsFixStyle,
  vListContainerStyle,
  virtualizedTableBodyListStyle,
} from "./VirtualizedTableBody.styles";
import type { IVirtualizedTableBodyProps } from "./VirtualizedTableBody.types";

const VirtualizedTableBodyComponent: FC<IVirtualizedTableBodyProps> = ({
  vListRef,
  rowRenderer,
  itemsCount,
  scrollAreaHeight,
  addScrollOffset,
  onScroll,
  rowHeight,
  scrollTop,
}) => {
  const theme = useTheme();
  useEffect(() => {
    const tableBodyScrollBehavior = new ScrollBehavior(VIRTUALIZED_TABLE_BODY_ID, {
      isRelativelyWindow: false,
    });

    // Задержка нужна для того, чтобы получить ширину скролла, после того, как VList будет отрисован
    setTimeout(() => {
      const scrollOffset = tableBodyScrollBehavior.scrollWidth;
      addScrollOffset(scrollOffset || 0);
    }, 0);
  }, [itemsCount, addScrollOffset]);

  return (
    <VList
      // width={1} вместе с containerStyle и style = width: 100% заменяют AutoSizer для width
      width={1}
      height={scrollAreaHeight}
      css={virtualizedTableBodyListStyle}
      style={bugsFixStyle}
      ref={vListRef}
      rowHeight={rowHeight ?? theme.commonTableRowHeight}
      rowRenderer={rowRenderer}
      rowCount={itemsCount}
      overscanRowCount={10}
      scrollTop={scrollTop}
      id={VIRTUALIZED_TABLE_BODY_ID}
      onScroll={onScroll}
      containerStyle={vListContainerStyle}
    />
  );
};

export const VirtualizedTableBody = observer(VirtualizedTableBodyComponent);
