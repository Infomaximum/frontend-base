import { buttonStyle, unactiveButtonStyle } from "../FilterPanelButtons.styles";

export const buttonHiddenFiltersStyle = (theme: TTheme) => ({
  ...buttonStyle(theme),
  ...unactiveButtonStyle(theme),
  padding: "0px",
  minWidth: "48px",
});

export const textStyle = (theme: TTheme) => ({
  backgroundColor: "transparent",
  fontSize: `${theme.h5FontSize}px`,
  fontWeight: 500,
});
