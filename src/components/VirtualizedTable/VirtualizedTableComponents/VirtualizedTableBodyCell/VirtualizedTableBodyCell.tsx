import type { Interpolation } from "@emotion/react";
import { get, isString } from "lodash";
import {
  virtualizedTableCellExpandedTextStyle,
  getVirtualizedTableCellFlexStyle,
  virtualizedTableCellStyle,
  getVirtualizedTableCellIndentBlockStyle,
} from "./VirtualizedTableBodyCell.styles";
import type { IVirtualizedTableBodyCellProps } from "./VirtualizedTableBodyCell.types";
import type { TRow } from "@infomaximum/base/src/components/VirtualizedTable/VirtualizedTable.types";
import { TableExpandIcon } from "@infomaximum/base/src/components/Table/TableComponents/TableExpandIcon/TableExpandIcon";
import { contextMenuColumnKey } from "@infomaximum/base/src/utils/const";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { getCssConversionStyle } from "@infomaximum/base/src/styles";
import { AlignedTooltip } from "@infomaximum/base/src/components/AlignedTooltip";

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

  const handleRowContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (window.getSelection()?.toString()) {
      setTimeout(() => {
        !!record?.key && onExpanderChange(record.key, !isExpanded);
      }, 0);

      return;
    }

    !!record?.key && onExpanderChange(record.key, !isExpanded);
  };

  const handleExpandIconClick = (record: T | null) => {
    !!record?.key && onExpanderChange(record.key, !isExpanded);
  };

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

  // Вывод "<div />" нужен для того чтобы корректно отрабатывал rightClick на старых Safari.
  // Без наполнения чем-либо будет вызываться браузерное контекстное меню, несмотря на обработчик сверху
  const wrapInTooltip = (node: React.ReactNode) => {
    return (
      (isString(node) ? <AlignedTooltip expandByParent={false}>{node}</AlignedTooltip> : node) || (
        <div />
      )
    );
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
      {...column?.onCell?.(record)}
      css={getCssConversionStyle(theme, [virtualizedTableCellStyle, cellCustomStyle])}
      style={getVirtualizedTableCellFlexStyle(width, minWidth)}
    >
      {isTree && isFirstColumn && getIndentBlock()}
      {isTree && isFirstColumn && getExpanderButton()}
      {cellContent}
    </div>
  );
};

export const VirtualizedTableBodyCell = VirtualizedTableBodyCellComponent;
