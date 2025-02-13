import { LOADING_ON_SCROLL_SPINNER_ID } from "../../../../utils";
import { virtualizedTableCellStyle } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell.styles";

const smoothBackgroundTransitionStyle = {
  transition: "background 200ms",
};

export const virtualizedTableCheckboxCellStyle = (theme: TTheme) =>
  ({
    ...virtualizedTableCellStyle(theme),
    position: "relative",
    flexShrink: 0,
    padding: 0,
    justifyContent: "center",
    width: `${theme.tableCheckboxColumnWidth}px`,
  }) as const;

export const virtualizedTableBodyRowStyle = (theme: TTheme) =>
  ({
    display: "flex",
    alignItems: "center",
    height: "100%",
    overflow: "hidden",
    borderBottom: `1px solid ${theme.grey4Color}`,
    ...smoothBackgroundTransitionStyle,
  }) as const;

/**
 * Бэкграунд поверх строки при загрузке
 */
export const virtualizedTableBodyRowLoadingCoverStyle = (theme: TTheme) =>
  ({
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    background: theme.grey1Color,
    opacity: 0.7,
  }) as const;

export const usualVirtualizedTableBodyRowStyle = (theme: TTheme) =>
  ({
    ...virtualizedTableBodyRowStyle(theme),
    ":hover": {
      background: theme.grey4Color,
    },
  }) as const;

export const checkedVirtualizedTableBodyRowStyle = (theme: TTheme) =>
  ({
    ...virtualizedTableBodyRowStyle(theme),
    background: theme.blue1Color,
    ":hover": {
      background: theme.blue2Color,
    },
  }) as const;

export const clickableVirtualizedTableBodyRowStyle = {
  cursor: "pointer",
};

export const virtualizedTableWithPaddingBodyRowLoadingStyle = {
  [`&:has(div#${LOADING_ON_SCROLL_SPINNER_ID})`]: {
    borderBottom: "none",
    position: "relative" as const,
    top: "11px",
  },
};
