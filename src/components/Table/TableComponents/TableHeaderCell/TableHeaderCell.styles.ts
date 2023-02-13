import { tableBodyCellStyle } from "../TableBodyCell/TableBodyCell.styles";
import { tableCheckboxCellStyle } from "../TableCheckboxCell/TableCheckboxCell.styles";

export const commonTableHeaderCellStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontSize: `${theme.h4FontSize}px`,
    lineHeight: "22px",
    fontWeight: "normal",
    transition: "color 0.3s ease",
  } as const);

const tableHeaderSortersCellStyle = (theme: TTheme) =>
  ({
    ".ant-table-column-sorters": {
      width: "100%",
      whiteSpace: "nowrap",
      justifyContent: "flex-start",
      ".ant-table-column-title": {
        flex: "none",
        paddingRight: "8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: `calc(100% - ${theme.tableSorterSize}px)`,
      },
      ".ant-table-column-sorter": {
        lineHeight: "0px",
      },
    },
    "&.ant-table-column-sort": {
      color: theme.blue6Color,
    },
    "&.ant-table-column-has-sorters": {
      cursor: "pointer",
      ":hover": { color: theme.linkHoverColor },
    },
  } as const);

export const tableHeaderCellStyle = (theme: TTheme) =>
  ({
    position: "relative",
    borderBottom: `${theme.tableRowBorderSize}px solid ${theme.grey5Color}`,
    textAlign: "left", // fix для IE
    ...tableBodyCellStyle(theme),
    ...commonTableHeaderCellStyle(theme),
    ...tableHeaderSortersCellStyle(theme),
    // увеличение области клика чекбокса в header антовской таблицы
    ".ant-table-selection": tableCheckboxCellStyle(theme),
    padding: "8px",
  } as const);
