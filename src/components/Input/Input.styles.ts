export const disabledInputStyle = {
  border: "none",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

export const disabledTextAreaStyle = (theme: TTheme) => ({
  borderColor: theme.grey3Color,
  ":hover": {
    borderColor: `${theme.grey3Color} !important`,
  },
  "::placeholder": {
    color: theme.grey7Color,
  },
});

export const defaultInputStyle = (theme: TTheme) => ({
  color: theme.grey9Color,
  textOverflow: "ellipsis",
  height: "28px",
  padding: "2px 7px",
});
