const commonSearchInputStyle = {
  ".ant-input-suffix": {
    marginLeft: 0,
    height: "28px",
    width: "28px",

    ".ant-input-clear-icon": {
      display: "flex",
      alignItems: "center",
      paddingLeft: "5px",
      width: "100%",
      height: "100%",
    },
  },
};

export const searchSmallInputStyle = (theme: TTheme) => ({
  padding: "3px 7px",
  lineHeight: "20px",
  input: {
    fontSize: `${theme.h4FontSize}px`,
  },
  svg: {
    overflow: "visible",
  },
  ...commonSearchInputStyle,
  "&": {
    ".ant-input-suffix": {
      marginRight: "-8px",
      marginTop: "-4px",
    },
  },
});

export const searchMiddleInputStyle = {
  padding: "2px 10px",
  svg: {
    overflow: "visible",
  },
  ...commonSearchInputStyle,
  "&": {
    ".ant-input-suffix": {
      marginRight: "-11px",
      marginTop: "-3px",
    },
  },
};

export const searchSecondInputStyle = {
  minWidth: "218px",
  svg: {
    overflow: "visible",
  },
  ...commonSearchInputStyle,
};

export const iconStyle = (theme: TTheme) => ({
  color: theme.grey7Color,
  fontSize: `${theme.h4FontSize}px`,
});
