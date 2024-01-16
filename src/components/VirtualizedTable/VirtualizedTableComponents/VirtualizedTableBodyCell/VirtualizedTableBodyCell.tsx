import type { Interpolation } from "@emotion/react";
import { get, isString } from "lodash";
import { useCallback } from "react";
import {
  virtualizedTableCellExpandedTextStyle,
  getVirtualizedTableCellFlexStyle,
  virtualizedTableCellStyle,
  getVirtualizedTableCellIndentBlockStyle,
} from "./VirtualizedTableBodyCell.styles";
import type { IVirtualizedTableBodyCellProps } from "./VirtualizedTableBodyCell.types";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import { TableExpandIcon } from "../../../Table/TableComponents/TableExpandIcon/TableExpandIcon";
import { contextMenuColumnKey } from "../../../../utils/const";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { cssStyleConversion } from "../../../../styles";
import { AutoTooltip } from "../../../AutoTooltip";

const VirtualizedTableBodyCellComponent = <T extends TRow>(
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

  const theme = useTheme();

  const { key, dataIndex, width, minWidth, enableCellClick } = column;
  const isFirstColumn = index === 0;

  const content = get(record, dataIndex as string);
  const node = column.render ? column.render(dataIndex ? content : record, record, index) : content;

  const handleRowContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (window.getSelection()?.toString()) {
        setTimeout(() => {
          !!record?.key && onExpanderChange(record.key, !isExpanded);
        }, 0);

        return;
      }

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

  const wrapInTooltip = (node: React.ReactNode) => {
    return isString(node) ? <AutoTooltip>{node}</AutoTooltip> : node;
  };

  // Увеличиваем высоту контента первой ячейки, если включен клик по всей строке
  // и строку можно развернуть
  const cellContent =
    (hasExpander && enableRowClick && key !== contextMenuColumnKey) ||
    (hasExpander && enableCellClick) ? (
      <span css={virtualizedTableCellExpandedTextStyle(theme)} onClick={handleRowContentClick}>
        {wrapInTooltip(node)}
      </span>
    ) : (
      wrapInTooltip(node)
    );

  const cellCustomStyle = column?.onCell?.(record)?.style as Interpolation<TTheme> | undefined;

  /* Учет isTree нужен для того, чтобы не оставлять промежутков в плоских списках */
  return (
    <div
      key={key}
      css={cssStyleConversion(theme, [virtualizedTableCellStyle, cellCustomStyle])}
      style={getVirtualizedTableCellFlexStyle(width, minWidth)}
    >
      {isTree && isFirstColumn && getIndentBlock()}
      {isTree && isFirstColumn && getExpanderButton()}
      {cellContent}
    </div>
  );
};

export const VirtualizedTableBodyCell = VirtualizedTableBodyCellComponent;
