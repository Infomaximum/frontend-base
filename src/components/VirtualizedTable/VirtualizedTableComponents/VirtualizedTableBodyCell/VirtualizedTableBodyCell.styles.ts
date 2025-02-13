import { tableBodyCellStyle } from "../../../Table/TableComponents/TableBodyCell/TableBodyCell.styles";
import { EUserAgents, userAgent } from "@infomaximum/utility";

const isSafari = userAgent() === EUserAgents.Safari;

export const getVirtualizedTableCellFlexStyle = (
  width?: string | number,
  minWidth?: string | number
) => {
  return { flexBasis: width ?? 0, flexGrow: width ? 0 : 1, minWidth };
};

export const getVirtualizedTableCellIndentBlockStyle = (indent: number) => {
  return { minWidth: `${indent}px` };
};

export const virtualizedTableCellStyle = (theme: TTheme) =>
  ({
    position: "relative",
    flexGrow: 0,
    flexShrink: 1,
    display: "flex",
    alignItems: "center",
    ...tableBodyCellStyle(theme),
    lineHeight: isSafari ? `${theme.tableRowLineHeight}px` : undefined,
    height: "100%",
  }) as const;

// Увеличение зоны клика на заголовке, при hasExpander и enableRowClick
export const virtualizedTableCellExpandedTextStyle = (theme: TTheme) => ({
  cursor: "pointer",
  lineHeight: `${theme.commonTableRowHeight}px`,
  overflow: "hidden",
});
