export const formFieldsHeight = { height: "100%" };

export const formContentDefaultStyle = () => ({
  padding: `32px 24px 80px 24px`,
  display: "block",
});

export const formContentWithFooterStyle = {
  padding: `24px 24px 80px 24px`,
  display: "block",
};

export const formContentWithoutFooterStyle = {
  padding: `24px 24px 1px 24px`,
  display: "block",
};

export const formFooterStyle = (theme: TTheme) => ({
  padding: "14px 24px 14px 24px",
  height: "57px",
  borderTop: `1px ${theme.grey4Color} solid`,
  background: theme.grey1Color,
  position: "fixed" as const,
  bottom: 0,
  width: "100%",
  zIndex: 2,
});

export const baseFormStyle = {
  width: "100%",
};
