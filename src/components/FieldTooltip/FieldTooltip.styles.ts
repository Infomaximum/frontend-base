export const captionStyle = () => ({
  marginLeft: "8px",
  lineHeight: "31px",
});

const commonIconStyle = (theme: TTheme) => ({
  fontSize: `${theme.h4FontSize}px`,
  display: "flex",
  alignItems: "center",
  height: "100%",
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
  maxWidth: "409px",
};
