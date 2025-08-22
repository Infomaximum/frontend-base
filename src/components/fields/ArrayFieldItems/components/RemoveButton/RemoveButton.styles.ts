import { notDisabledBtnSelector } from "@infomaximum/base/src/components/Button/Button.styles";

export const removeButtonDefaultColorsStyle = (theme: TTheme) => ({
  "&&&": {
    color: theme.grey6Color,
    padding: "0px",
    fontSize: "14px",
    [`${notDisabledBtnSelector}:hover`]: {
      color: theme.red6Color,
    },
    [`${notDisabledBtnSelector}:focus`]: {
      color: theme.grey6Color,
      [`${notDisabledBtnSelector}:hover`]: {
        color: theme.red6Color,
      },
      [`${notDisabledBtnSelector}:active`]: {
        color: theme.red7Color,
      },
    },
    [`${notDisabledBtnSelector}:active`]: {
      color: theme.red7Color,
    },
  },
});
