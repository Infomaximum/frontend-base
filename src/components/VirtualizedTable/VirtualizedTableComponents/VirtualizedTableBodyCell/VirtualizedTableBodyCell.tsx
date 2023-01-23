import type { Interpolation } from "@emotion/react";
import { get, isString } from "lodash";
import EllipsisTooltip from "src/components/EllipsisTooltip/EllipsisTooltip";
import { useCallback } from "react";
import {
  virtualizedTableCellExpandedTextStyle,
  getVirtualizedTableCellFlexStyle,
  virtualizedTableCellStyle,
  getVirtualizedTableCellIndentBlockStyle,
} from "./VirtualizedTableBodyCell.styles";
import type { IVirtualizedTableBodyCellProps } from "./VirtualizedTableBodyCell.types";
import type { TRow } from "src/components/VirtualizedTable/VirtualizedTable.types";
import TableExpandIcon from "src/components/Table/TableComponents/TableExpandIcon/TableExpandIcon";
import { contextMenuColumnKey } from "src/utils/const";

const VirtualizedTableBodyCell = <T extends TRow>(
  props: IVirtualizedTableBodyCellProps<T | null>
) => {
  const {
    hasExpander,
    isExpanded,
    onExpanderChange,
    enableRowClick,
    column,
    record,
    index,
    isTree,
    indentLeft,
  } = props;
  const { key, dataIndex, width, minWidth, enableCellClick } = column;
  const isFirstColumn = index === 0;

  const content = get(record, dataIndex as string);
  const node = column.render
    ? column.render(dataIndex ? content : record, record, index)
    : content;

  const handleRowContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      !!record?.key && onExpanderChange(record.key, !isExpanded);
    },
    [isExpanded, onExpanderChange, record?.key]
  );

  const handleExpandIconClick = useCallback(
    (record: T | null) => {
      !!record?.key && onExpanderChange(record.key, !isExpanded);
    },
    [isExpanded, onExpanderChange]
  );

  const getExpanderButton = () => {
    return (
      <TableExpandIcon
        key={record?.key}
        record={record}
        onExpand={handleExpandIconClick}
        expanded={isExpanded}
        expandable={hasExpander}
      />
    );
  };

  const getIndentBlock = () => {
    return <div css={getVirtualizedTableCellIndentBlockStyle(indentLeft)} />;
  };

  const wrapInEllipsis = (node: React.ReactNode) => {
    return isString(node) ? <EllipsisTooltip>{node}</EllipsisTooltip> : node;
  };

  // Увеличиваем высоту контента первой ячейки, если включен клик по всей строке
  // и строку можно развернуть
  const cellContent =
    (hasExpander && enableRowClick && key !== contextMenuColumnKey) ||
    (hasExpander && enableCellClick) ? (
      <span
        css={virtualizedTableCellExpandedTextStyle}
        onClick={handleRowContentClick}
      >
        {wrapInEllipsis(node)}
      </span>
    ) : (
      wrapInEllipsis(node)
    );

  const cellCustomStyle = column?.onCell?.(record)?.style as
    | Interpolation<TTheme>
    | undefined;

  /* Учет isTree нужен для того, чтобы не оставлять промежутков в плоских списках*/
  return (
    <div
      key={key}
      css={[virtualizedTableCellStyle, cellCustomStyle]}
      style={getVirtualizedTableCellFlexStyle(width, minWidth)}
    >
      {isTree && isFirstColumn && getIndentBlock()}
      {isTree && isFirstColumn && getExpanderButton()}
      {cellContent}
    </div>
  );
};

export default VirtualizedTableBodyCell;
