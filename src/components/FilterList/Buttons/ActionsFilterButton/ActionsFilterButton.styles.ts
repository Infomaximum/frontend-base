import { unactiveButtonStyle, buttonStyle } from "../FilterPanelButtons.styles";

export const actionButtonStyle = (theme: TTheme) => ({
  ...buttonStyle(theme),
  padding: "7px 10px 4px",
});

export const actionButtonActiveStyle = (theme: TTheme) => ({
  ...unactiveButtonStyle(theme),
  padding: "7px 10px 4px",
});

export const iconStyle = (theme: TTheme) => ({
  color: `${theme.grey6Color}`,
  fontSize: `${theme.h5FontSize}px`,
});
