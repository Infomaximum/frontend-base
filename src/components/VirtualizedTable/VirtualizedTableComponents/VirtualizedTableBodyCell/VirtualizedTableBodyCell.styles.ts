import { tableBodyCellStyle } from "../../../Table/TableComponents/TableBodyCell/TableBodyCell.styles";
import type { ReactText } from "react";
import { EUserAgents, userAgent } from "@im/utils";

const isSafari = userAgent() === EUserAgents.Safari;

export const getVirtualizedTableCellFlexStyle = (
  width?: ReactText,
  minWidth?: ReactText
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
  } as const);

// Увеличение зоны клика на заголовке, при hasExpander и enableRowClick
export const virtualizedTableCellExpandedTextStyle = (theme: TTheme) => ({
  cursor: "pointer",
  lineHeight: `${theme.commonTableRowHeight}px`,
  overflow: "hidden",
});
