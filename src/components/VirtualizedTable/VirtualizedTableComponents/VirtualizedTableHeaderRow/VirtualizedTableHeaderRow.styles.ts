import { virtualizedTableBodyRowStyle } from "../VirtualizedTableBodyRow/VirtualizedTableBodyRow.styles";

export const virtualizedTableHeaderRowWrapperStyle = {
  position: "relative",
} as const;

export const virtualizedTableHeaderRowStyle = (theme: TTheme) => {
  const { borderBottom, ...rest } = virtualizedTableBodyRowStyle(theme);

  return {
    ...rest,
    height: `${theme.commonTableRowHeight - theme.tableRowBorderSize}px`,
    background: theme.grey1Color,
    color: theme.grey9Color,
    borderBottom: `${theme.tableRowBorderSize}px solid ${theme.grey5Color}`,
    boxSizing: "content-box",
    position: "relative",
    zIndex: 1,
  } as const;
};
