export const buttonStyle = {
  padding: 0,
  height: "18px",
  lineHeight: 1,
};

export const ghostButtonStyle = (theme: TTheme) => ({
  ...buttonStyle,
  color: theme.grey7Color,
  ":hover": {
    color: theme.grey6Color,
  },
  ":focus": {
    color: theme.grey6Color,
  },
  ":active": {
    color: theme.grey8Color,
  },
});
