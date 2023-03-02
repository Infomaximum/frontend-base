export const boldTitleStyle = {
  fontWeight: 500,
  lineHeight: "22px",
  display: "block",
};

export const titleStyle = (theme: TTheme) => ({
  ...boldTitleStyle,
  fontSize: theme.h4FontSize,
  userSelect: "none",
});
