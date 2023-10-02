export const cardWrapperDefault = (theme: TTheme) => ({
  background: theme.grey1Color,
  borderRadius: "4px",
});

export const cardHeaderDefault = (theme: TTheme) => ({
  borderBottom: `1px solid ${theme.grey45Color}`,
  fontSize: "16px",
  fontWeight: "500",
  fontStyle: "normal",
  lineHeight: "24px",
});

export const wrapperMenuStyle = {
  float: "right",
  display: "inline",
} as const;
