export const pageHeaderStyle = (theme: TTheme) => ({
  padding: "8px 24px",
  color: theme.grey8Color,
  fontSize: `${theme.h4FontSize}px`,
  background: "#fff",
});

export const pageHeaderTitleStyle = (theme: TTheme) => ({
  fontSize: `${theme.h4FontSize}px`,
  fontWeight: "normal" as const,
  display: "inline-block",
});

export const iconBackStyle = (theme: TTheme) => ({
  fill: theme.grey8Color,
  fontSize: `${theme.subtitleFontSize}px`,
  marginRight: "8px",
  verticalAlign: "middle",
});

export const headerTitleWrapperStyle = (theme: TTheme) => ({
  cursor: "pointer",
  color: theme.grey8Color,
  ":hover": {
    color: `${theme.blue5Color} !important`,
  },
});
