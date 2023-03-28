import { headerMarginStyle } from "../DataTableHeader/DataTableHeader.styles";

export const headerStyle = (theme: TTheme) => ({
  ...headerMarginStyle,
  background: theme.grey1Color,
  padding: 0,
  height: "28px",
  lineHeight: "20px",
});

export const rightButtonsColStyle = {
  marginLeft: "auto",
} as const;
