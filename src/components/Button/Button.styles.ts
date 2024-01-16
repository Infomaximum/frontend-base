import { EUserAgents, userAgent } from "@infomaximum/utility";

const isSafari = userAgent() === EUserAgents.Safari;

export const defaultButtonStyle = (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
});

export const smallButtonStyle = (theme: TTheme) => ({
  padding: "3px 11px",
  svg: {
    fontSize: !isSafari ? `${theme.h4FontSize}px` : undefined,
    marginRight: "-4px",
    verticalAlign: !isSafari ? "-0.125em" : undefined,
  },
});

export const smallOnlyIconStyle = () => ({
  minWidth: "28px",
  minHeight: "28px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const primaryButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    color: theme.grey1Color,
    fill: theme.grey1Color,
    borderColor: theme.transparentColor,
  };

  const disabledStyle = {
    color: theme.grey7Color,
    background: theme.grey3Color,
    borderColor: theme.grey3Color,
  };

  return {
    ...commonStyle,
    background: theme.thrust4Color,
    ":hover": {
      ...commonStyle,
      background: theme.thrust2Color,
    },
    ":focus": {
      ...commonStyle,
      background: theme.thrust2Color,
    },
    ":active": {
      ...commonStyle,
      background: theme.thrust5Color,
    },
    "&[disabled]": {
      ...disabledStyle,
      ":hover": disabledStyle,
      ":focus": disabledStyle,
    },
  } as const;
};

export const primaryDarkButtonStyle = (theme: TTheme) => {
  const disabledStyle = {
    color: theme.grey7Color,
    background: theme.grey8Color,
    borderColor: theme.grey8Color,
  };

  return {
    ...primaryButtonStyle(theme),
    "&[disabled]": {
      ...disabledStyle,
      ":hover": disabledStyle,
      ":focus": disabledStyle,
    },
  } as const;
};

export const primaryNotificationButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    color: theme.grey1Color,
    fill: theme.grey1Color,
    borderColor: theme.transparentColor,
  };

  const disabledStyle = {
    color: theme.grey7Color,
    background: theme.grey4Color,
    borderColor: theme.grey4Color,
  };

  return {
    ...commonStyle,
    background: theme.blue6Color,
    ":hover": {
      ...commonStyle,
      background: theme.blue5Color,
    },
    ":focus": {
      ...commonStyle,
      background: theme.blue5Color,
    },
    ":active": {
      ...commonStyle,
      background: theme.blue7Color,
    },
    "&[disabled]": {
      ...disabledStyle,
      ":hover": disabledStyle,
      ":focus": disabledStyle,
    },
  } as const;
};

export const primaryOutlinedButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    borderColor: theme.thrust2Color,
    color: theme.thrust2Color,
    backgroundColor: "transparent",
  };

  const disabledStyle = {
    color: theme.grey7Color,
    background: theme.grey4Color,
    borderColor: theme.grey4Color,
  };

  return {
    ...getOutlineButtonStyle(theme.thrust4Color),
    ":hover": {
      ...commonStyle,
    },
    ":focus": {
      ...commonStyle,
    },
    ":active": {
      borderColor: theme.thrust5Color,
      color: theme.thrust5Color,
      backgroundColor: "transparent",
    },
    "&[disabled]": {
      ...disabledStyle,
      ":hover": disabledStyle,
      ":focus": disabledStyle,
    },
  };
};

const getOutlineButtonStyle = (color: string) => ({
  color,
  fill: color,
  borderColor: color,
  backgroundColor: "transparent",
});

export const ghostButtonStyle = (theme: TTheme, danger?: boolean) => {
  const disabledStyle = {
    color: theme.grey7Color,
    backgroundColor: theme.grey4Color,
    borderColor: theme.grey4Color,
  };

  return {
    ...getOutlineButtonStyle(theme.grey8Color),
    borderColor: theme.grey5Color,
    ":hover": danger ? undefined : getOutlineButtonStyle(theme.thrust2Color),
    ":focus": danger ? undefined : getOutlineButtonStyle(theme.thrust2Color),
    ":active": danger ? undefined : getOutlineButtonStyle(theme.thrust4Color),
    "&:disabled": {
      ...disabledStyle,
      ":hover": disabledStyle,
    },
  };
};

export const ghostDarkButtonStyle = (theme: TTheme) => {
  const disabledStyle = {
    color: theme.grey7Color,
    background: theme.grey8Color,
    borderColor: theme.grey8Color,
  };

  return {
    ...getOutlineButtonStyle(theme.grey3Color),
    borderColor: theme.grey8Color,
    ":hover": getOutlineButtonStyle(theme.thrust3Color),
    ":focus": getOutlineButtonStyle(theme.thrust3Color),
    ":active": getOutlineButtonStyle(theme.thrust4Color),
    "&[disabled]": {
      ...disabledStyle,
      ":hover": disabledStyle,
    },
  };
};

export const textButtonStyle = (theme: TTheme) => ({
  "&[disabled]": {
    color: theme.grey7Color,
    ":hover": {
      color: theme.grey7Color,
    },
  },
});
