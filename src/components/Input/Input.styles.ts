export const disabledInputStyle = (theme: TTheme) => ({
  border: "none",
  overflow: "hidden",
  WebkitTextFillColor: theme.grey7Color, // Safari fix
  backgroundColor: theme.grey3Color,
  color: theme.grey7Color,
  padding: "3px 8px",
});

export const disabledTextAreaStyle = (theme: TTheme) => ({
  borderColor: theme.grey3Color,
  ":hover": {
    borderColor: `${theme.grey3Color} !important`,
  },
  "::placeholder": {
    color: theme.grey7Color,
  },
});

export const defaultInputStyle = (theme: TTheme, bordered = true) => ({
  color: theme.grey9Color,
  height: "28px",
  padding: bordered ? "2px 7px" : "3px 8px",
  ".ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
    borderColor: theme.blue4Color,
    boxShadow: `0px 0px 4px 0px ${theme.blue4Color}`,
  },
  input: {
    "::placeholder": {
      textOverflow: "unset",
    },
  },
  ".ant-input-clear-icon": {
    color: theme.grey6Color,
    ":hover": {
      color: theme.grey7Color,
    },
  },
});

// Стиль для поля ввода с рамками по бокам
export const secondInputStyle = (theme: TTheme) => ({
  height: "28px",
  padding: "0 16px",
  border: 0,
  borderRight: `1px solid ${theme.grey45Color}`,
  borderLeft: `1px solid ${theme.grey45Color}`,
  borderRadius: 0,
  color: theme.grey9Color,
  boxShadow: "none !important",
  input: {
    "::placeholder": {
      color: theme.grey6Color,
      opacity: 1,
    },
    ":focus": {
      boxShadow: "none !important",
    },
  },
  ":hover": {
    borderColor: `${theme.grey45Color} !important`,
  },
});

export const defaultPasswordInputStyle = (theme: TTheme) => ({
  ...defaultInputStyle(theme),
  ".ant-input-suffix": {
    marginRight: "-8px",
    marginLeft: 0,
    zIndex: 10,
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

export const disabledPasswordInputStyle = (theme: TTheme) => ({
  ...disabledInputStyle,
  border: "none",
  ".ant-input-password-icon.anticon": {
    display: "none",
  },
  input: {
    "::placeholder": {
      color: theme.grey7Color,
    },
  },
});
