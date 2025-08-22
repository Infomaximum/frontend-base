import { EUserAgents, userAgent } from "@infomaximum/utility";

const isSafari = userAgent() === EUserAgents.Safari;

export const notDisabledBtnSelector = ":not(:disabled):not(.ant-btn-disabled)";
export const notDisabledDangerBtnSelector =
  "&.ant-btn-dangerous:not(:disabled):not(.ant-btn-disabled)";

type TInactiveButtonConfig = {
  transparent?: boolean;
  isDark?: boolean;
};

const getInactiveButtonStyle = (theme: TTheme, config?: TInactiveButtonConfig) => {
  const disabledStyle = {
    borderColor: config?.transparent
      ? theme.transparentColor
      : config?.isDark
        ? theme.grey8Color
        : theme.grey5Color,
    color: config?.transparent
      ? config?.isDark
        ? theme.grey7Color
        : theme.grey6Color
      : theme.grey7Color,
    background: config?.transparent
      ? theme.transparentColor
      : config?.isDark
        ? theme.grey9Color
        : theme.grey4Color,
  };

  return {
    "&&&&&.ant-btn-loading": {
      opacity: 1,
    },
    "&:disabled, &.ant-btn-dangerous:disabled, &&&&&.ant-btn-loading": {
      ...disabledStyle,
      "&:hover, &:focus, &:active": disabledStyle,
    },
    ".ant-btn-icon": {
      display: "inline",
      span: {
        fontSize: `${theme.h5FontSize}px`,
      },
    },
  };
};

export const smallButtonStyle = (theme: TTheme) => ({
  svg: {
    fontSize: !isSafari ? `${theme.h4FontSize}px` : undefined,
    verticalAlign: !isSafari ? "-0.125em" : undefined,
  },
});

export const onlyIconStyle = { padding: 0, width: 28 };

export const smallOnlyIconStyle = () => ({
  minWidth: "28px",
  minHeight: "28px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const loadingButtonStyle = (theme: TTheme) => ({
  "&&&&&": { borderColor: theme.grey5Color, color: theme.grey7Color, background: theme.grey4Color },
});

export const buttonLocSpinStyle = { display: "flex", justifyContent: "flex-end" };

export const buttonLocSpinIndicatorStyle = (theme: TTheme) => ({
  color: theme.grey7Color,
  "&&": { fontSize: "14px" },
});

export const defaultButtonStyle = (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
  color: theme.grey10Color,
  ".ant-btn-icon": {
    display: "inline-flex",
    span: {
      verticalAlign: "-0.125em",
      fontSize: `${theme.h4FontSize}px`,
    },
  },
});

export const dashedButtonStyle = {
  borderStyle: "dashed",
};

export const uncertainButtonTypeDisabledStyle = {
  "&:disabled": {
    cursor: "not-allowed",
  },
};

/* ------------------------------ Common Button Styles [START] ---------------------------- */

export const outlinedButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    borderColor: theme.grey5Color,
    background: theme.grey1Color,
  };
  const commonDangerStyle = {
    borderColor: commonStyle.borderColor,
    color: theme.grey10Color,
  };
  const hoverStyle = {
    borderColor: theme.thrust2Color,
    color: theme.thrust2Color,
  };
  const hoverDangerStyle = {
    color: theme.red5Color,
    borderColor: theme.red5Color,
  };
  const activeStyle = {
    borderColor: theme.thrust5Color,
    color: theme.thrust5Color,
  };
  const activeDangerStyle = {
    borderColor: theme.red7Color,
    color: theme.red7Color,
  };

  return {
    ...commonStyle,
    [`${notDisabledBtnSelector}:hover`]: hoverStyle,
    [`${notDisabledBtnSelector}:focus`]: hoverStyle,
    [`${notDisabledBtnSelector}:active`]: activeStyle,
    [`${notDisabledDangerBtnSelector}`]: commonDangerStyle,
    [`${notDisabledDangerBtnSelector}:hover`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:focus`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:active`]: activeDangerStyle,
    ...getInactiveButtonStyle(theme),
  };
};

export const outlinedDarkButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    "&&": {
      borderColor: theme.grey8Color,
      color: theme.grey3Color,
      background: theme.graphite1Color,
    },
  };
  const commonDangerStyle = {
    color: theme.grey3Color,
    borderColor: theme.grey8Color,
  };
  const darkBackgroundStyle = {
    background: theme.graphite1Color,
  };

  return {
    ...commonStyle,
    [`${notDisabledDangerBtnSelector}`]: commonDangerStyle,
    [`
      ${notDisabledBtnSelector}:hover,
      ${notDisabledBtnSelector}:focus,
      ${notDisabledBtnSelector}:active,
    `]: darkBackgroundStyle,
    ...getInactiveButtonStyle(theme, { isDark: true }),
  };
};

export const ghostButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    background: theme.transparentColor,
  };

  return {
    ...commonStyle,
    [`
      ${notDisabledBtnSelector}:hover,
      ${notDisabledBtnSelector}:focus,
      ${notDisabledBtnSelector}:active,
    `]: commonStyle,
  };
};

export const outlinedPrimaryButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    borderColor: theme.thrust4Color,
    color: theme.thrust4Color,
  };

  return {
    ...commonStyle,
    [`${notDisabledDangerBtnSelector}`]: commonStyle,
  };
};

/* ------------------------------ Common Button Styles [END] ---------------------------- */

/* ------------------------------ Primary Button Styles [START] ---------------------------- */

export const primaryButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    borderColor: theme.transparentColor,
    color: theme.grey1Color,
    background: theme.thrust4Color,
  };
  const hoverStyle = {
    background: theme.thrust2Color,
  };
  const focusDangerStyle = {
    background: theme.red5Color,
  };
  const activeStyle = {
    background: theme.thrust5Color,
  };
  const activeDangerStyle = {
    background: theme.red7Color,
  };

  return {
    ...commonStyle,
    [`${notDisabledBtnSelector}:hover`]: hoverStyle,
    [`${notDisabledBtnSelector}:focus`]: hoverStyle,
    [`${notDisabledBtnSelector}:active`]: activeStyle,
    [`${notDisabledDangerBtnSelector}:focus`]: focusDangerStyle,
    [`${notDisabledDangerBtnSelector}:active`]: activeDangerStyle,
    ...getInactiveButtonStyle(theme),
  };
};

export const primaryDarkButtonStyle = (theme: TTheme) => ({
  ...getInactiveButtonStyle(theme, { isDark: true }),
});

export const primaryNotificationButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    background: theme.blue6Color,
  };
  const hoverStyle = {
    background: theme.blue5Color,
  };
  const activeStyle = {
    background: theme.blue7Color,
  };

  return {
    ...commonStyle,
    [`${notDisabledBtnSelector}:hover`]: hoverStyle,
    [`${notDisabledBtnSelector}:focus`]: hoverStyle,
    [`${notDisabledBtnSelector}:active`]: activeStyle,
  };
};

/* ------------------------------ Primary Button Styles [END] ---------------------------- */

/* ------------------------------ Text Button Styles [START] ---------------------------- */

export const textButtonStyle = (theme: TTheme) => {
  const hoverStyle = {
    color: theme.grey10Color,
    background: theme.grey3Color,
  };
  const activeStyle = {
    background: theme.grey5Color,
  };
  const hoverDangerStyle = {
    color: theme.red6Color,
  };
  const activeDangerStyle = {
    color: theme.red6Color,
    background: theme.red2Color,
  };

  return {
    [`${notDisabledBtnSelector}:hover`]: hoverStyle,
    [`${notDisabledBtnSelector}:focus`]: hoverStyle,
    [`${notDisabledBtnSelector}:active`]: activeStyle,
    [`${notDisabledDangerBtnSelector}:hover`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:focus`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:active`]: activeDangerStyle,
    ...getInactiveButtonStyle(theme, { transparent: true }),
  };
};

export const textDarkButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    color: theme.grey3Color,
  };
  const hoverStyle = {
    color: commonStyle.color,
    background: theme.grey8Color,
  };
  const hoverDangerStyle = {
    background: hoverStyle.background,
  };
  const activeStyle = {
    color: commonStyle.color,
    background: theme.grey7Color,
  };
  const activeDangerStyle = {
    background: activeStyle.background,
  };

  return {
    ...commonStyle,
    [`${notDisabledBtnSelector}:hover`]: hoverStyle,
    [`${notDisabledBtnSelector}:focus`]: hoverStyle,
    [`${notDisabledBtnSelector}:active`]: activeStyle,
    [`${notDisabledDangerBtnSelector}:hover`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:focus`]: hoverDangerStyle,
    [`${notDisabledDangerBtnSelector}:active`]: activeDangerStyle,
    ...getInactiveButtonStyle(theme, { transparent: true, isDark: true }),
  };
};

/* ------------------------------ Text Button Styles [END] ---------------------------- */

/* ------------------------------ Link Button Styles [START] ---------------------------- */

export const linkButtonStyle = (theme: TTheme) => {
  const commonStyle = {
    color: theme.thrust4Color,
  };
  const hoverStyle = {
    color: theme.thrust2Color,
  };
  const focusDangerStyle = {
    color: theme.red5Color,
  };
  const activeStyle = {
    color: theme.thrust5Color,
  };
  const activeDangerStyle = {
    color: theme.red7Color,
  };

  return {
    "&.ant-btn-color-link.ant-btn-variant-link": {
      ...commonStyle,
      [`${notDisabledBtnSelector}:hover`]: hoverStyle,
      [`${notDisabledBtnSelector}:focus`]: hoverStyle,
      [`${notDisabledBtnSelector}:active`]: activeStyle,
      [`${notDisabledDangerBtnSelector}:focus`]: focusDangerStyle,
      [`${notDisabledDangerBtnSelector}:active`]: activeDangerStyle,
      ...getInactiveButtonStyle(theme, { transparent: true }),
    },
  };
};

export const linkDarkButtonStyle = (theme: TTheme) => {
  return {
    ...getInactiveButtonStyle(theme, { transparent: true, isDark: true }),
  };
};

/* ------------------------------ Link Button Styles [END] ---------------------------- */
