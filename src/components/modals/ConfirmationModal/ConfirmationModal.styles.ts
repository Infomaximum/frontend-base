export const iconModalStyle = (theme: TTheme) => ({
  fontSize: `${theme.h2FontSize}px`,
  color: `${theme.gold6Color}`,
  paddingRight: "16px",
});

export const bodyStyle = {
  padding: "32px",
};

export const titleModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey9Color,
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    verticalAlign: "text-bottom",
    lineHeight: `${theme.smallLineHeight}px`,
  } as const);

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey8Color,
    fontSize: `${theme.h4FontSize}px`,
    display: "block",
    lineHeight: "22px",
    marginTop: "8px",
  } as const);

export const additionalButtonStyle = {
  position: "absolute" as const,
  left: "24px",
};

export const confirmationModalStyle = {
  display: "flex",
};
