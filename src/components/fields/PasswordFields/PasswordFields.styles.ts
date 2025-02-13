const commonIconStyle = {
  paddingLeft: "5px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  width: "28px",
};

export const eyeIconStyle = (theme: TTheme) => ({
  ...commonIconStyle,
  viewBox: "64 64 896 896",
  color: theme.grey6Color,
  ":hover": {
    color: theme.grey7Color,
  },
  width: "24px",
  "&&": {
    marginRight: 0,
  },
  ":last-child": {
    width: "28px",
  },
  marginInlineEnd: "0px !important",
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
  ...commonIconStyle,
  color: theme.red6Color,
  fontSize: `${theme.h4FontSize}px`,
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
  ...commonIconStyle,
  fontSize: `${theme.h4FontSize}px`,
  color: theme.blue6Color,
});

export const questionIconStyle = (theme: TTheme) => ({
  ...commonIconStyle,
  fontSize: `${theme.h4FontSize}px`,
  color: theme.grey6Color,
  ":hover": {
    color: theme.grey7Color,
  },
});

export const checkCircleGreenIconStyle = (theme: TTheme) => ({
  ...commonIconStyle,
  fontSize: `${theme.h4FontSize}px`,
  color: theme.green6Color,
});

export const opacityStyle = { opacity: 0.25 };

export const popoverInnerStyle = {
  whiteSpace: "nowrap" as const,
};

export const inputFieldStyle = {
  ".ant-input-suffix": {
    marginRight: "-8px",
    marginLeft: 0,
  },
};
