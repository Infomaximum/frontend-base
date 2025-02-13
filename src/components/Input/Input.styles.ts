export const getDisabledInputStyle = (theme: TTheme, bordered = true) => ({
  height: "28px",
  border: "1px solid transparent !important",
  overflow: "hidden",
  WebkitTextFillColor: theme.grey7Color, // Safari fix
  backgroundColor: theme.grey3Color,
  color: theme.grey7Color,
  padding: bordered ? "2px 7px" : "3px 8px",
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

export const getDefaultInputStyle = (theme: TTheme, bordered = true) => ({
  color: theme.grey10Color,
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
  borderRight: `1px solid ${theme.grey45Color} !important`,
  borderLeft: `1px solid ${theme.grey45Color} !important`,
  borderRadius: 0,
  color: theme.grey10Color,
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
  ...getDefaultInputStyle(theme),
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
  ...getDisabledInputStyle,
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
