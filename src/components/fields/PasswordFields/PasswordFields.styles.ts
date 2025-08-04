const commonIconStyle = (theme: TTheme) => ({
  display: "flex",
  alignItems: "center",
  fontSize: `${theme.subtitleFontSize}px`,
  cursor: "pointer",
});

export const eyeIconStyle = (theme: TTheme) => ({
  ...commonIconStyle(theme),
  color: theme.grey6Color,
  ":hover": {
    color: theme.grey7Color,
  },
  "&&": {
    marginRight: 0,
  },
});

export const grayCheckIconStyle = (theme: TTheme) => ({
  color: theme.grey5Color,
  fontSize: `${theme.subtitleFontSize}px`,
  verticalAlign: "bottom",
});

export const greenCheckIconStyle = (theme: TTheme) => ({
  color: theme.green6Color,
  fontSize: `${theme.subtitleFontSize}px`,
  verticalAlign: "bottom",
});

export const redCloseIconStyle = (theme: TTheme) => ({
  color: theme.red6Color,
  fontSize: `${theme.subtitleFontSize}px`,
  verticalAlign: "bottom",
});

export const redCloseCircleIconStyle = (theme: TTheme) => ({
  ...commonIconStyle(theme),
  color: theme.red6Color,
});

export const commonNotificationFieldStyle = (theme: TTheme) => ({
  lineHeight: `${theme.verySmallLineHeight}px`,
  display: "flex",
  alignItems: "center",
});

export const notificationFieldStyleWithPaddingStyle = (theme: TTheme) => ({
  ...commonNotificationFieldStyle(theme),
  paddingBottom: "8px",
});

export const notificationTextStyle = (theme: TTheme) => ({
  lineHeight: `${theme.verySmallLineHeight}px`,
  paddingLeft: "8px",
  textAlign: "center" as const,
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

export const checkCircleGreenIconStyle = (theme: TTheme) => ({
  ...commonIconStyle(theme),
  fontSize: `${theme.subtitleFontSize}px`,
  color: theme.green6Color,
});

export const opacityStyle = { opacity: 0.25 };

export const popoverInnerStyle = {
  whiteSpace: "nowrap" as const,
};

export const inputFieldStyle = {
  ".ant-input-suffix": {
    marginLeft: 0,
  },
};

export const questionIconWrapperStyle = { height: "16px" };
