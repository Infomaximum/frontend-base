export const cardWrapperDefault = (theme: TTheme) => ({
  background: theme.grey1Color,
  borderRadius: "4px",
});

export const cardHeaderDefault = (theme: TTheme) => ({
  borderBottom: `1px solid ${theme.grey45Color}`,
  padding: "16px",
  fontSize: "16px",
  fontWeight: "bold",
});

export const cardBodyDefault = {
  padding: "32px 24px",
};

export const wrapperMenuStyle = {
  float: "right",
  display: "inline",
} as const;
