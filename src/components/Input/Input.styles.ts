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

export const defaultPasswordInputStyle = (theme: TTheme) => ({
  ...defaultInputStyle(theme),
  ".ant-input-suffix": {
    marginRight: "-8px",
    marginLeft: 0,
    ".ant-input-password-icon.anticon": {
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "5px",
      color: theme.grey6Color,
      ":hover": {
        color: theme.grey7Color,
      },
    },
  },
});

export const disabledPasswordInputStyle = {
  ...disabledInputStyle,
  ".ant-input-password-icon.anticon": {
    display: "none",
  },
};
