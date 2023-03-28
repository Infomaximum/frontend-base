export const iconStyle = (theme: TTheme) => ({
  fontSize: "20px",
  color: `${theme.red6Color}`,
  padding: "1px 12px 1px 1px",
});

export const bodyStyle = {
  padding: "20px 28px 0",
};

export const titleModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey9Color,
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    verticalAlign: "text-bottom",
    wordBreak: "break-word",
    paddingBottom: "12px",
  } as const);

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey8Color,
    fontSize: `${theme.h4FontSize}px`,
    paddingTop: "8px",
    paddingBottom: "28px",
    display: "block",
    lineHeight: "20px",
    wordBreak: "break-word",
  } as const);

export const modalContentStyle = {
  display: "flex",
};
