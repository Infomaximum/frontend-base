const notDisabledBtnSelector = ":not(:disabled):not(.ant-btn-disabled)";

export const buttonStyle = (theme: TTheme) => ({
  border: "none",
  borderRadius: "0px",
  backgroundColor: theme.headerPanel.iconsBackgroundColor,
  color: theme.headerPanel.iconsColor,
  height: "100%",
  transition: "background-color 0.3s, color 0.5s",
  [`${notDisabledBtnSelector}:focus`]: {
    color: theme.headerPanel.iconsColorHover,
    backgroundColor: theme.headerPanel.backgroundColorHover,
  },
  [`${notDisabledBtnSelector}:active`]: {
    color: theme.headerPanel.iconsColorHover,
    backgroundColor: theme.headerPanel.backgroundColorHover,
  },
  [`${notDisabledBtnSelector}:hover`]: {
    color: theme.headerPanel.iconsColorHover,
    backgroundColor: theme.headerPanel.backgroundColorHover,
  },
  minWidth: "34px",
  padding: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const unactiveButtonStyle = (theme: TTheme) => ({
  color: theme.headerPanel.iconsColor,
  background: "transparent",
  [`${notDisabledBtnSelector}:hover`]: {
    color: theme.headerPanel.iconsColorHover,
    backgroundColor: theme.headerPanel.backgroundColorHover,
  },
});
