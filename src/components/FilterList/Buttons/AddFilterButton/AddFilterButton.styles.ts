import { buttonStyle } from "../FilterPanelButtons.styles";

export const topPanelFilterStyle = (theme: TTheme) => ({
  marginBottom: "12px",
  backgroundColor: theme.grey1Color,
  "&&&:hover, &&&:active, &&&:focus": { backgroundColor: theme.grey1Color },
  "&&& span": {
    fontSize: "14px",
  },
});

export const buttonAddFilterStyle = (theme: TTheme) => ({
  ...buttonStyle(theme),
  ...topPanelFilterStyle,
});

export const headerIconStyle = {
  fontSize: "16px",
};
