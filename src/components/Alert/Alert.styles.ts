export const alertClassnames = {
  closeIcon: ".anticon-close",
  closeButton: ".ant-alert-close-icon",
  alertIcon: ".ant-alert-icon",
  alertMessage: ".ant-alert-message",
};

export const alertStyle = (theme: TTheme) =>
  ({
    alignItems: "flex-start",
    [`${alertClassnames.closeIcon}`]: {
      color: theme.grey6Color,
    },
    [`${alertClassnames.alertMessage}`]: {
      marginBottom: 0,
      fontSize: "14px",
      color: theme.grey8Color,
    },
    padding: "9px 16px 9px 15px",
    display: "flex",
    [`${alertClassnames.alertIcon}`]: {
      lineHeight: "unset",
      position: "relative",
      top: "2px",
      fontSize: "14px",
      marginRight: "9px",
    },
  } as const);

export const boldTitleStyle = {
  fontWeight: "bold",
};

export const alertDescriptionStyle = (theme: TTheme) => ({
  color: theme.grey8Color,
});

export const infoAlertStyle = (theme: TTheme) => ({
  background: theme.blue1Color,
  border: `1px solid ${theme.blue3Color}`,
  [`${alertClassnames.alertIcon}`]: {
    color: theme.blue6Color,
  },
});

export const warningAlertStyle = (theme: TTheme) => ({
  background: theme.gold1Color,
  border: `1px solid ${theme.gold3Color}`,
  [`${alertClassnames.alertIcon}`]: {
    color: theme.gold6Color,
  },
});

export const errorAlertStyle = (theme: TTheme) => ({
  background: theme.red1Color,
  border: `1px solid ${theme.red3Color}`,
  [`${alertClassnames.alertIcon}`]: {
    color: theme.red6Color,
  },
});

export const successAlertStyle = (theme: TTheme) => ({
  background: theme.green1Color,
  border: `1px solid ${theme.green3Color}`,
  [`${alertClassnames.alertIcon}`]: {
    color: theme.green6Color,
  },
});

export const alertBannerStyle = (theme: TTheme) =>
  ({
    border: "none",
    alignItems: "flex-start",
    [`${alertClassnames.alertIcon}`]: {
      display: "flex",
      fontSize: theme.h3FontSize,
      width: "20px",
      height: "20px",
      alignItems: "center",
    },
    [`${alertClassnames.closeIcon}`]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "16px",
      height: "16px",
      marginTop: "3px",
    },
  } as const);
