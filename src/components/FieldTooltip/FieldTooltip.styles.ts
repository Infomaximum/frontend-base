export const getFieldTooltipContainerStyle = (isWithoutPadding?: boolean) => {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: isWithoutPadding ? "none" : "8px",
  };
};

export const captionStyle = () => ({
  display: "flex",
  alignItems: "center",
  lineHeight: "31px",
});

const commonIconStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  display: "flex",
  alignItems: "center",
  height: "100%",
  cursor: "pointer",
});

export const questionIconShowPopoverStyle = (theme: TTheme) => ({
  ...commonIconStyle(theme),
  color: theme.blue6Color,
});

export const questionIconStyle = (theme: TTheme) => ({
  ...commonIconStyle(theme),
  color: theme.grey6Color,
  ":hover": {
    color: theme.grey7Color,
  },
});

export const popoverStyle = {
  root: { maxWidth: "409px", zIndex: 9999 },
  body: { whiteSpace: "pre-line" as const },
};
