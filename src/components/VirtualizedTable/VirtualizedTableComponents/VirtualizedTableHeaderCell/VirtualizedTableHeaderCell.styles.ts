import { commonTableHeaderCellStyle } from "../../../Table/TableComponents/TableHeaderCell/TableHeaderCell.styles";
import { virtualizedTableCellStyle } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell.styles";

export const virtualizedTableHeaderCellStyle = (theme: TTheme) => ({
  ...virtualizedTableCellStyle(theme),
  ...commonTableHeaderCellStyle(theme),
});

export const virtualizedTableHeaderSortedCellStyle = (theme: TTheme) =>
  ({
    cursor: "pointer",
    ":hover": {
      color: theme.linkHoverColor,
    },
  } as const);

export const virtualizedTableHeaderSortedCellActiveStyle = (theme: TTheme) =>
  ({
    color: theme.blue6Color,
  } as const);

/**
 * Стили для сортера
 */
export const sorterColumnStyle = {
  marginLeft: "8px",
  height: "18px",
};

const sorterArrowStyle = (theme: TTheme) => ({
  fontSize: `${theme.tableSorterSize}px`,
  color: theme.grey6Color,
});

const sorterArrowActiveStyle = (theme: TTheme) => ({
  color: theme.blue6Color,
});

export const sorterArrowUpStyle = (theme: TTheme) =>
  ({
    ...sorterArrowStyle(theme),
    marginBottom: "-4px",
  } as const);

export const sorterArrowDownStyle = (theme: TTheme) =>
  ({
    ...sorterArrowStyle(theme),
    marginBottom: "-1px",
  } as const);

export const sorterArrowUpActiveStyle = (theme: TTheme) =>
  ({
    ...sorterArrowUpStyle(theme),
    ...sorterArrowActiveStyle(theme),
  } as const);

export const sorterArrowDownActiveStyle = (theme: TTheme) =>
  ({
    ...sorterArrowDownStyle(theme),
    ...sorterArrowActiveStyle(theme),
  } as const);
