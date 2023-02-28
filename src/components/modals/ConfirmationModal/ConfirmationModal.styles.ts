export const iconModalStyle = (theme: TTheme) => ({
  fontSize: `${theme.h2FontSize}px`,
  color: `${theme.gold6Color}`,
  paddingRight: "12px",
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
    lineHeight: `${theme.smallLineHeight}px`,
    paddingBottom: "12px",
  } as const);

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey8Color,
    fontSize: `${theme.h4FontSize}px`,
    display: "block",
    lineHeight: "22px",
    paddingTop: "8px",
    paddingBottom: "28px",
  } as const);

export const additionalButtonStyle = {
  position: "absolute" as const,
  left: "28px",
};

export const confirmationModalStyle = {
  display: "flex",
};
