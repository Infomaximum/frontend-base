import { headerMarginStyle } from "../DataTableHeader/DataTableHeader.styles";

export const headerStyle = (isExpandedTopPanel?: boolean) => (theme: TTheme) => ({
  ...headerMarginStyle,
  background: theme.grey1Color,
  padding: 0,
  height: `${isExpandedTopPanel ? 62 : 28}px`,
  lineHeight: "20px",
});

export const rightButtonsColStyle = {
  marginLeft: "auto",
} as const;
