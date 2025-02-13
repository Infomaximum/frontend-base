export const headerStyle = (theme: TTheme) => ({
  marginBottom: "12px",
  background: theme.grey1Color,
  padding: 0,
  lineHeight: "20px",
  backgroundColor: "inherit",
  height: "auto",
});

export const rightButtonsColStyle = {
  marginLeft: "auto",
} as const;

export const customizeButtonStyle = { display: "flex" };

export const clearButtonStyle = (theme: TTheme) => ({
  marginLeft: "-1px",
  zIndex: 5,
  ":hover": {
    color: theme.red5Color,
    borderColor: theme.red5Color,
    zIndex: 6,
  },
});

export const selectedFiltersWrapperStyle = { height: "auto", overflow: "hidden" };
