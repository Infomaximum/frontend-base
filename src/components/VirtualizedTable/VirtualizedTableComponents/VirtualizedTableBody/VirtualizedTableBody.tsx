import { VIRTUALIZED_TABLE_BODY_ID } from "../../../../utils/const";
import React, { type FC, useEffect, useCallback, useMemo } from "react";
import { List as VList, type Index } from "react-virtualized";
import { ScrollBehavior } from "../../../../utils/ScrollBehavior/ScrollBehavior";
import { observer } from "mobx-react";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import {
  getBugsFixStyle,
  vListContainerStyle,
  getVirtualizedTableBodyListStyle,
} from "./VirtualizedTableBody.styles";
import type { IVirtualizedTableBodyProps } from "./VirtualizedTableBody.types";
import type { OverscanIndicesGetter } from "react-virtualized/dist/es/Grid";
import { isNumber, isUndefined } from "lodash";

const VirtualizedTableBodyComponent: FC<IVirtualizedTableBodyProps> = ({
  vListRef,
  rowRenderer,
  itemsCount,
  scrollAreaHeight,
  addScrollOffset,
  onScroll,
  rowHeight,
  scrollTop,
  isWithoutWrapperStyles,
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

  const overscanIndicesGetter: OverscanIndicesGetter = useCallback(
    ({ cellCount, overscanCellsCount, startIndex, stopIndex }) => {
      return {
        overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
        overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
      };
    },
    []
  );

  const contentHeight = useMemo(
    (index?: Index) => {
      if (!isUndefined(rowHeight)) {
        if (isNumber(rowHeight)) {
          return rowHeight * itemsCount;
        }

        if (!isUndefined(index)) {
          return rowHeight(index) * itemsCount;
        }
      }

      return theme.commonTableRowHeight * itemsCount;
    },
    [itemsCount, rowHeight, theme.commonTableRowHeight]
  );

  return (
    <VList
      autoHeight={contentHeight < scrollAreaHeight ? true : undefined}
      // width={1} вместе с containerStyle и style = width: 100% заменяют AutoSizer для width
      width={1}
      height={scrollAreaHeight}
      css={getVirtualizedTableBodyListStyle(isWithoutWrapperStyles)}
      style={getBugsFixStyle(isWithoutWrapperStyles)}
      ref={vListRef}
      rowHeight={rowHeight ?? theme.commonTableRowHeight}
      rowRenderer={rowRenderer}
      rowCount={itemsCount}
      scrollTop={scrollTop}
      id={VIRTUALIZED_TABLE_BODY_ID}
      onScroll={onScroll}
      containerStyle={vListContainerStyle}
      overscanRowCount={20}
      overscanIndicesGetter={overscanIndicesGetter}
    />
  );
};

export const VirtualizedTableBody = observer(VirtualizedTableBodyComponent);
