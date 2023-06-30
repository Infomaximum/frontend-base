import { EUserAgents, userAgent } from "@infomaximum/utility";

const isSafari = userAgent() === EUserAgents.Safari;

export const tableBodyCellStyle = (theme: TTheme) => ({
  height: `${theme.commonTableRowHeight}px`,
  maxHeight: `${theme.commonTableRowHeight}px`,
  lineHeight: `${theme.tableRowLineHeight}px`,
  padding: `
    ${theme.tableCellVerticalPadding}px
    ${theme.tableCellHorizontalPadding}px
    ${theme.tableCellVerticalPadding - theme.tableRowBorderSize}px
    !important`,
  overflow: "hidden",
  "&.ant-table-selection-column": {
    overflow: "hidden", // fix для IE
  },
  // fix для Safari (чтобы убрать браузерный тултип)
  ":after": isSafari
    ? {
        content: "''",
        display: "block",
      }
    : undefined,
});
