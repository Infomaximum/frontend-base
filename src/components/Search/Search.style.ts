export const searchSmallInputStyle = (theme: TTheme) => ({
  padding: "3px 7px",
  lineHeight: "20px",
  height: "28px",
  input: {
    fontSize: `${theme.h4FontSize}px`,
  },
  svg: {
    overflow: "visible",
  },
});

export const searchMiddleInputStyle = {
  padding: "2px 10px",
  svg: {
    overflow: "visible",
  },
};

export const iconStyle = (theme: TTheme) => ({
  color: theme.grey6Color,
  fontSize: `${theme.h4FontSize}px`,
});
