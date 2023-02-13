export const iconStyle = (theme: TTheme) => ({
  fontSize: `${theme.h2FontSize}px`,
  color: `${theme.red6Color}`,
  paddingRight: "16px",
});

export const bodyStyle = {
  padding: "32px",
};

export const titleModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey9Color,
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 600,
    verticalAlign: "text-bottom",
    wordBreak: "break-word",
  } as const);

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey8Color,
    fontSize: `${theme.h4FontSize}px`,
    paddingTop: "8px",
    display: "block",
    lineHeight: "20px",
    wordBreak: "break-word",
  } as const);

export const modalContentStyle = {
  display: "flex",
};
