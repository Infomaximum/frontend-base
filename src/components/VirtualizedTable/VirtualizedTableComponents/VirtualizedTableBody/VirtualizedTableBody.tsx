import { VIRTUALIZED_TABLE_BODY_ID } from "src/utils/const";
import React, { FC, useEffect } from "react";
import { AutoSizer, List as VList } from "react-virtualized";
import { ScrollBehavior } from "src/utils/ScrollBehavior/ScrollBehavior";
import { observer } from "mobx-react";
import { useTheme } from "src/decorators/hooks/useTheme";
import { virtualizedTableBodyListStyle } from "./VirtualizedTableBody.styles";
import type { IVirtualizedTableBodyProps } from "./VirtualizedTableBody.types";

const VirtualizedTableBody: FC<IVirtualizedTableBodyProps> = ({
  vListRef,
  rowRenderer,
  itemsCount,
  scrollAreaHeight,
  addScrollOffset,
  onScroll,
}) => {
  const theme = useTheme();
  useEffect(() => {
    const tableBodyScrollBehavior = new ScrollBehavior(
      VIRTUALIZED_TABLE_BODY_ID,
      {
        isRelativelyWindow: false,
      }
    );

    // Задержка нужна для того, чтобы получить ширину скролла, после того, как VList будет отрисован
    setTimeout(() => {
      const scrollOffset = tableBodyScrollBehavior.scrollWidth;
      addScrollOffset(scrollOffset || 0);
    }, 0);
  }, [itemsCount, addScrollOffset]);

  return (
    <AutoSizer disableHeight={true}>
      {({ width }) => (
        <VList
          width={width}
          height={scrollAreaHeight}
          css={virtualizedTableBodyListStyle}
          ref={vListRef}
          rowHeight={theme.commonTableRowHeight}
          rowRenderer={rowRenderer}
          rowCount={itemsCount}
          overscanRowCount={10}
          id={VIRTUALIZED_TABLE_BODY_ID}
          onScroll={onScroll}
        />
      )}
    </AutoSizer>
  );
};

export default observer(VirtualizedTableBody);
