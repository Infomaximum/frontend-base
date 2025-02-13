export const defaultButtonStyle = (theme: TTheme) => ({
  margin: "-16px 0",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.grey7Color,
  cursor: "pointer",
  fontSize: `${theme.subtitleFontSize}px`,
  ":hover": {
    backgroundColor: theme.blue2Color,
    color: theme.blue10Color,
  },
  height: "42px",
  width: "42px",
});

export const disabledButtonStyle = (theme: TTheme) => ({
  ...defaultButtonStyle(theme),
  cursor: "default",
  color: theme.grey6Color,
  ":hover": {},
});

export const acceptButtonStyle = (theme: TTheme) => ({
  ...defaultButtonStyle(theme),
  color: theme.green6Color,
  ":hover": {
    backgroundColor: theme.green1Color,
  },
});

export const cancelButtonStyle = (theme: TTheme) => ({
  ...defaultButtonStyle(theme),
  color: theme.red6Color,
  ":hover": {
    backgroundColor: theme.red2Color,
  },
});

export const removeButtonStyle = (theme: TTheme) => ({
  ...defaultButtonStyle(theme),
  ":hover": {
    color: theme.red6Color,
    backgroundColor: theme.red2Color,
  },
});
